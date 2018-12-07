var GridData = [];
var StoreNumbers = [];
var GroupedData = [];

function SetDateRage(start, end) {
    $("#startDate").val(start);
    $("#endDate").val(end);
    GetData();
}

function GetData() {
    $.ajax({
        type: "GET",
        url: "GetEOD",
        traditional: 'true',
        data: { StartDate: $("#startDate").val(), EndDate: $("#endDate").val() },
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        dataType: 'json',
        success: function (response) {
            GridData = response.Tables[0];
            StoreNumbers = response.Tables[1];
            GroupedData = response.Tables[2];
            UpdateGrid();
            //UpdateCharts();
        },
        error: function (xhr, status, error) {
            console.error(xhr.responseText);
            Response = JSON.parse('{ "Result": { "Id": 0, "Description": "", "Success": false, "Errors" : ["' + xhr.status + ': ' + xhr.statusText + '"] } }');
        }
    });
}

function UpdateGrid() {
    $("#grid").empty();
    $("#grid").kendoGrid({
        toolbar: ["excel", "pdf"],
        pdf: {
            fileName: "EODReport.pdf",
            allPages: false,
            avoidLinks: true,
            paperSize: "letter",
            margin: { top: "2cm", left: "1cm", right: "1cm", bottom: "1cm" },
            landscape: true,
            repeatHeaders: true,
            scale: 0.8
        },
        excel: {
            fileName: "EODReport.xlsx",
            allPages: true,
            filterable: true
        },
        dataSource: {
            type: "json",
            data: GridData,
            pageSize: 200,
            schema: {
                model: {
                    fields: {
                        StoreNo: { type: "string", editable: false },
                        ReportDate: { type: "date", editable: false },
                        EndOfTheDayDeposit: { type: "number", editable: false }
                    }
                }
            },
            aggregate: [
               { field: "EndOfTheDayDeposit", aggregate: "sum" }]
        },
        theme: "black",
        scrollable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        pageable: {
            input: true,
            numeric: false
        },
        columns:
            [
                {
                    field: "StoreNo", title: "Store No", width: "100%",
                    filterable: {
                        multi: true,
                        dataSource: StoreNumbers,
                    }
                },
                { field: "ReportDate", title: "Date", width: "100%", template: "#= kendo.toString(ReportDate, 'MM/dd/yyyy') #", },
                { field: "EndOfTheDayDeposit", title: "Deposit", width: "100%", template: "#= kendo.toString(EndOfTheDayDeposit, 'n') #", attributes: { style: "text-align:right;" }, footerTemplate: "Total : #= kendo.toString(sum, 'n') #" }
            ]
    });
}

function UpdateCharts() {
    $("#bar-chart-proto").empty();
    $("#bar-chart-proto").kendoChart({
        theme: "black",
        title: { text: "EOD Bar Data" },
        legend: { position: "right" },
        dataSource: { data: GroupedData },
        seriesDefaults: {
            labels: {
                visible: true,
                background: "transparent",
                template: "#= series.name #: \n #= kendo.toString(value, 'n')#"
            }
        },
        series: [
            {
                type: "bar",
                field: "EndOfTheDayDeposit",
                name: "Deposit",

            }
        ],
        categoryAxis: {
            field: "StoreNo"
        },
    }).data("kendoChart");
}


$(document).ready(function () {
    $("#startDate").kendoDatePicker({ change: GetData });
    $("#endDate").kendoDatePicker({ change: GetData });
    GetData();
});