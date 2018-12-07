Page = {
    Initialize: function () {
        Page.Filters.InitialBind();
        Page.ReportGrid.Update();
    },
    Filters: {
        InitialBind: function () {
            $("#startDate").kendoDatePicker({ change: Page.ReportGrid.Update });
            $("#endDate").kendoDatePicker({ change: Page.ReportGrid.Update });
        },
        SetDateRage: function (start, end) {
            $("#startDate").val(start);
            $("#endDate").val(end);
            Page.ReportGrid.Update();
        },
    },
    ReportGrid: {
        IsManaging: false,
        DataSources: {
            MainData: [],
            StoreNumbers: [],
            Types: [],
            GroupedData: [],
        },
        Update: function () {
            if (!Page.ReportGrid.IsManaging)
                Page.ReportGrid.GetData(Page.ReportGrid.Render.Normal);
            else
                Page.ReportGrid.GetData(Page.ReportGrid.Render.Manageable);
        },
        GetData: function (_callback) {
            $.ajax({
                type: "GET",
                url: "GetCommissions",
                traditional: 'true',
                data: { StartDate: $("#startDate").val(), EndDate: $("#endDate").val() },
                contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                dataType: 'json',
                success: function (response) {
                    Page.ReportGrid.DataSources.MainData = response.Tables[0];
                    Page.ReportGrid.DataSources.StoreNumbers = response.Tables[1];
                    Page.ReportGrid.DataSources.Types = response.Tables[2];
                    if (_callback != null && _callback != undefined)
                        _callback();
                },
                error: function (xhr, status, error) {
                    console.error(xhr.responseText);
                }
            });
        },
        Render: {
            Normal: function () {
                $("#grid").empty();
                $("#grid").kendoGrid({
                    toolbar: ["excel"],
                    pdf: {
                        fileName: "CommisionsReport.pdf",
                        allPages: true,
                        filterable: true,
                        avoidLinks: true,
                        paperSize: "letter",
                        margin: { top: "2cm", left: "1cm", right: "1cm", bottom: "1cm" },
                        landscape: true,
                        repeatHeaders: true,
                        scale: 0.8
                    },
                    excel: {
                        fileName: "CommisionsReport.xlsx",
                        allPages: true,
                        filterable: true
                    },
                    dataSource: {
                        type: "json",
                        data: Page.ReportGrid.DataSources.MainData,
                        pageSize: 200,
                        schema: {
                            model: {
                                fields: {
                                    StoreNo: { type: "string", editable: false },
                                    typeCT: { type: "string", editable: false },
                                    date_CT: { type: "date", editable: false },
                                    name: { type: "string", editable: false },
                                    debit: { type: "number", editable: false },
                                    credit: { type: "number", editable: false },
                                    balance: { type: "number", editable: false }
                                }
                            }
                        },
                        group: {
                            field: "StoreNo", aggregates: [
                            { field: "StoreNo", aggregate: "count" },
                            { field: "debit", aggregate: "sum" },
                            { field: "credit", aggregate: "sum" },
                            { field: "balance", aggregate: "sum" }]
                        },
                        aggregate: [
                            { field: "debit", aggregate: "sum" },
                            { field: "credit", aggregate: "sum" },
                            { field: "balance", aggregate: "sum" }]
                    },
                    theme: "black",
                    scrollable: true,
                    sortable: true,
                    resizable: true,
                    filterable: true,
                    height: "600px",
                    pageable: {
                        input: true,
                        numeric: false
                    },
                    columns: [
                                    {
                                        field: "StoreNo", title: "Store No", width: "150px",
                                        filterable: {
                                            multi: true,
                                            dataSource: Page.ReportGrid.DataSources.StoreNumbers,
                                        },
                                        groupHeaderTemplate: "#= value # (#= count#)",
                                        locked: true,
                                        lockable: false,
                                    },
                                    {
                                        field: "typeCT", title: "Type", width: "200px",
                                        filterable: {
                                            multi: true,
                                            dataSource: Page.ReportGrid.DataSources.Types,
                                        }
                                    },
                                    { field: "date_CT", title: "Date", width: "150px", template: "#= kendo.toString(date_CT, 'MM/dd/yyyy') #", },
                                    { field: "name", title: "Name", width: "400px" },
                                    { field: "debit", title: "Debit", width: "150px", template: "#= kendo.toString(debit, 'c') #", attributes: { style: "text-align:right;" }, footerTemplate: " Total : #= kendo.toString(sum, 'c') # ", groupFooterTemplate: " #= kendo.toString(sum, 'c') # " },
                                    { field: "credit", title: "Credit", width: "150px", template: "#= kendo.toString(credit, 'c') #", attributes: { style: "text-align:right;" }, footerTemplate: " Total : #= kendo.toString(sum, 'c') # ", groupFooterTemplate: " #= kendo.toString(sum, 'c') # " },
                                    { field: "balance", title: "Balance", width: "150px", template: "#= kendo.toString(balance, 'c') #", attributes: { style: "text-align:right;" }, footerTemplate: " Total : #= kendo.toString(sum, 'c') # ", groupFooterTemplate: " #= kendo.toString(sum, 'c') # " },
                    ]
                });
            },
            Manageable: function () {
                $("#grid").empty();
                $("#grid").kendoGrid({
                    dataSource: {
                        type: "json",
                        data: Page.ReportGrid.DataSources.MainData,
                        pageSize: 200,
                        schema: {
                            model: {
                                fields: {
                                    StoreNo: { type: "string", editable: false },
                                    typeCT: { type: "string", editable: false },
                                    date_CT: { type: "date", editable: false },
                                    name: { type: "string", editable: false },
                                    debit: { type: "number", editable: false },
                                    credit: { type: "number", editable: false },
                                    balance: { type: "number", editable: false }
                                }
                            }
                        },
                        aggregate: [
                            { field: "debit", aggregate: "sum" },
                            { field: "credit", aggregate: "sum" },
                            { field: "balance", aggregate: "sum" }]
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
                    change: Page.StagingGrid.Update,
                    columns:
                        [
                            { selectable: true, width: "50px" },
                            {
                                field: "StoreNo", title: "Store No", width: "100%",
                                filterable: {
                                    multi: true,
                                    dataSource: Page.ReportGrid.DataSources.StoreNumbers,
                                }
                            },
                                    {
                                        field: "typeCT", title: "Type", width: "100%",
                                        filterable: {
                                            multi: true,
                                            dataSource: Page.ReportGrid.DataSources.Types,
                                        }
                                    },
                                    { field: "date_CT", title: "Date", width: "100%", template: "#= kendo.toString(date_CT, 'MM/dd/yyyy') #", },
                                    { field: "name", title: "Name", width: "400%" },
                                    { field: "debit", title: "Debit", width: "100%", template: "#= kendo.toString(debit, 'n') #", attributes: { style: "text-align:right;" }, footerTemplate: "Total : #= kendo.toString(sum, 'n') #" },
                                    { field: "credit", title: "Credit", width: "100%", template: "#= kendo.toString(credit, 'n') #", attributes: { style: "text-align:right;" }, footerTemplate: "Total : #= kendo.toString(sum, 'n') #" },
                                    { field: "balance", title: "Balance", width: "100%", template: "#= kendo.toString(balance, 'n') #", attributes: { style: "text-align:right;" }, footerTemplate: "Total : #= kendo.toString(sum, 'n') #" },
                        ]
                });
            }
        },
        Manage: function () {
            if (!Page.ReportGrid.IsManaging) {
                Page.ReportGrid.IsManaging = true;
                $("#ManageDataControls").show();
                Page.ReportGrid.Render.Manageable();
                Page.StagingGrid.Render();
            }
        },
    },
    StagingGrid: {
        IsManaging: false,
        DataSources: {
            MainData: []
        },
        Update: function (e) {
            var selectedRows = this.select();
            Page.StagingGrid.DataSources.MainData = [];
            for (var i = 0; i < selectedRows.length; i++) {
                var dataItem = this.dataItem(selectedRows[i]);
                Page.StagingGrid.DataSources.MainData.push(dataItem);
            }
            Page.StagingGrid.Render();
        },
        Render: function () {
            $("#stagingGrid").empty();
            $("#stagingGrid").kendoGrid({
                dataSource: {
                    //type: "json",
                    data: Page.StagingGrid.DataSources.MainData,
                    schema: {
                        model: {
                            id: "id",
                            fields: {
                                StoreNo: { type: "string" },
                                typeCT: { type: "string" },
                                date_CT: { type: "date" },
                                name: { type: "string" },
                                debit: { type: "number" },
                                credit: { type: "number" },
                                balance: { type: "number" }
                            }
                        }
                    },
                },
                theme: "black",
                editable: true,
                save: function (e) {
                    var model = e.model;
                    var values = e.values;
                },
                columns:
                    [
                        {
                            field: "StoreNo", title: "Store No", width: "100%",
                            template: '<center> <input id="txtStoreNo_#= id#" value="#= StoreNo #" type="text" class="form-control" style="color:black;height:15px;width: 80%;" /> </center>'
                        },
                        {
                            field: "typeCT", title: "Type", width: "100%",
                            template: '<center> <input id="txtType_#= id#" value="#= typeCT #" type="text" class="form-control" style="color:black;height:15px;width: 80%;" /> </center>'
                        },
                        {
                            field: "date_CT", title: "Date", width: "140px",
                            template: ' <input id="dtCT_#= id#" class="dtpicker" value="#= kendo.toString(date_CT, "MM/dd/yyyy") #" /> ',
                        },
                        {
                            field: "name", title: "Name", width: "100%",
                            template: '<center> <input id="txtName_#= id#" value="#= name #" type="text" class="form-control" style="color:black;height:15px;width: 80%;" /> </center>'
                        },
                        {
                            field: "debit", title: "Debit", width: "100%",
                            template: '<center> <input id="txtDebit_#= id#" value="#=  kendo.toString(debit, "n") #" type="number" class="form-control" style="color:black;height:15px;width: 80%;text-align:right;" /> </center> ',
                        },
                        {
                            field: "credit", title: "Credit", width: "100%",
                            template: '<center> <input id="txtCredit_#= id#" value="#=  kendo.toString(credit, "n") #" type="number" class="form-control" style="color:black;height:15px;width: 80%;text-align:right;" /> </center> ',
                        },
                    ]
            });
            $(".dtpicker").kendoDatePicker();
        },
        SaveAll: function () {
            if (confirm("WARNING \n\r Are you sure you want to EDIT the Selected Rows?")) {
                var ItemList = [];
                var Item;
                var NewItem;
                for (var i = 0; i < Page.StagingGrid.DataSources.MainData.length; i++) {
                    Item = Page.StagingGrid.DataSources.MainData[i];
                    NewItem = {};
                    NewItem.id = Item.id;
                    NewItem.StoreNo = $("#txtStoreNo_" + Item.id).val();
                    NewItem.typeCT = $("#txtType_" + Item.id).val();
                    NewItem.date_CT = $("#dtCT_" + Item.id).val();
                    NewItem.name = $("#txtName_" + Item.id).val();
                    NewItem.debit = $("#txtDebit_" + Item.id).val();
                    NewItem.credit = $("#txtCredit_" + Item.id).val();

                    ItemList.push(NewItem);
                }
                $.ajax({
                    type: "POST",
                    url: "UpdateCommisionRecords",
                    traditional: 'true',
                    data: JSON.stringify({ "ItemList": ItemList }),
                    contentType: 'application/json; charset=utf-8',
                    success: function (response) {
                        alert("Success \n\r The Selected Rows has been Updated.");
                        location.reload();
                    },
                    error: function (xhr, status, error) {
                        console.error(xhr.responseText);
                        alert("Error \n\r Something went wrong.")
                    }
                });
            }
        },
        DeleteAll: function () {
            if (confirm("WARNING \n\r This action cannot be Undone \n\r Are you sure you want to DELETE the Selected Rows?")) {
                var Items = [];
                for (var i = 0; i < Page.StagingGrid.DataSources.MainData.length; i++) {
                    Items.push(Page.StagingGrid.DataSources.MainData[i].id);
                }
                $.ajax({
                    type: "POST",
                    url: "DeleteRecords",
                    traditional: 'true',
                    data: { Items: Items, Report: "COMMISSION" },
                    contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                    dataType: 'json',
                    success: function (response) {
                        alert("Success \n\r The Selected Rows has been deleted.");
                        location.reload();
                    },
                    error: function (xhr, status, error) {
                        console.error(xhr.responseText);
                        alert("Error \n\r Something went wrong.")
                        //Response = JSON.parse('{ "Result": { "Id": 0, "Description": "", "Success": false, "Errors" : ["' + xhr.status + ': ' + xhr.statusText + '"] } }');
                    }
                });
            }
        },
    }
}

$(document).ready(function () {
    Page.Initialize();
});

//function GetChartCatalogs() {

//    $.ajax({
//        type: "GET",
//        url: "GetCommissionsChartCatalogs",
//        traditional: 'true',
//        data: {},
//        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
//        dataType: 'json',
//        success: function (response) {
//            ChartStoreNumbers = response.Tables[0];
//            ChartTypes = response.Tables[1];
//            UpdateChartsCatalogs();
//            GetChartData();
//        },
//        error: function (xhr, status, error) {
//            console.error(xhr.responseText);
//            Response = JSON.parse('{ "Result": { "Id": 0, "Description": "", "Success": false, "Errors" : ["' + xhr.status + ': ' + xhr.statusText + '"] } }');
//        }
//    });
//}
//function GetChartData() {
//    var StartDate = $("#ChartStartDate").val();
//    var EndDate = $("#ChartEndDate").val();
//    var StoreNosMultiselect = $("#cmbStoreNo").data("kendoMultiSelect");
//    var StoreNos = [];
//    var StoreNosItems = StoreNosMultiselect.value();
//    for (var i = 0; i < StoreNosItems.length; i++) {
//        StoreNos.push(StoreNosItems[i]);
//    }
//    var TypesMultiselect = $("#cmbType").data("kendoMultiSelect");
//    var Types = [];
//    var TypesItems = TypesMultiselect.value();
//    for (var i = 0; i < TypesItems.length; i++) {
//        Types.push(TypesItems[i]);
//    }
//    $.ajax({
//        type: "GET",
//        url: "GetCommissionsChartData",
//        traditional: 'true',
//        data: { StartDate: StartDate, EndDate: EndDate, StoreNos: StoreNos, Types: Types },
//        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
//        dataType: 'json',
//        success: function (response) {
//            GroupedData = response.Tables[0];
//            BalancePercentages = response.Tables[1];
//            //UpdateCharts();
//        },
//        error: function (xhr, status, error) {
//            console.error(xhr.responseText);
//            Response = JSON.parse('{ "Result": { "Id": 0, "Description": "", "Success": false, "Errors" : ["' + xhr.status + ': ' + xhr.statusText + '"] } }');
//        }
//    });
//}
//function UpdateCharts() {

//    $("#pie-chart-proto").empty();
//    $("#pie-chart-proto").kendoChart({
//        theme: "black",
//        title: { text: "Comission Percentage" },
//        legend: { position: "right" },
//        plotArea: {
//            margin: -5
//        },
//        dataSource: { data: BalancePercentages },
//        series: [{ type: "pie", field: "balance", name: "Balance", categoryField: "StoreNo", startAngle: 160, padding: 0 }],
//        seriesDefaults: {
//            labels: {
//                visible: true,
//                background: "transparent",
//                template: "#= category #: \n #= kendo.toString(value, 'n')#%"
//            }
//        },
//    }).data("kendoChart");

//    $("#bar-chart-proto").empty();
//    $("#bar-chart-proto").kendoChart({
//        theme: "black",
//        title: { text: "Comission Bar Data" },
//        legend: { position: "right" },
//        dataSource: { data: GroupedData },
//        seriesDefaults: {
//            labels: {
//                visible: true,
//                background: "transparent",
//                template: "#= series.name #: \n #= kendo.toString(value, 'n')#"
//            }
//        },
//        series: [
//            {
//                type: "bar",
//                field: "debit",
//                name: "Debit",

//            },
//            {
//                type: "bar",
//                field: "credit",
//                name: "Credit"
//            },
//            {
//                type: "bar",
//                field: "balance",
//                name: "Balance"
//            }
//        ],
//        categoryAxis: {
//            field: "StoreNo"
//        },
//        //series: [{ type: "bar", field: "debit", categoryField: "StoreNo", startAngle: 160, padding: 0 }]
//    }).data("kendoChart");

//    $("#area-chart-proto").empty();
//    $("#area-chart-proto").kendoChart({
//        theme: "black",
//        title: { text: "" },
//        legend: { position: "right" },
//        dataSource: { data: GroupedData },
//        //seriesDefaults: {
//        //    labels: {
//        //        visible: true,
//        //        background: "transparent",
//        //        template: "#= series.name #: \n #= kendo.toString(value, 'n')#"
//        //    }
//        //},
//        series: [
//            {
//                type: "area",
//                field: "debit",
//                name: "Debit"
//            },
//            {
//                type: "area",
//                field: "credit",
//                name: "Credit"
//            },
//            {
//                type: "area",
//                field: "balance",
//                name: "Balance"
//            }
//        ],
//        categoryAxis: {
//            field: "StoreNo"
//        },
//        tooltip: {
//            visible: true,
//            template: "#= series.name #: #= kendo.toString(value, 'n') #"
//        }
//        //series: [{ type: "area", field: "debit", categoryField: "StoreNo", startAngle: 160, padding: 0 }]
//    }).data("kendoChart");

//    $("#line-chart-proto").empty();
//    $("#line-chart-proto").kendoChart({
//        theme: "black",
//        title: { text: "" },
//        legend: { position: "right" },
//        dataSource: { data: GroupedData },
//        //seriesDefaults: {
//        //    labels: {
//        //        visible: true,
//        //        background: "transparent",
//        //        template: "#= series.name #: \n #= kendo.toString(value, 'n')#"
//        //    }
//        //},
//        series: [
//            {
//                type: "line",
//                field: "debit",
//                name: "Debit"
//            },
//            {
//                type: "line",
//                field: "credit",
//                name: "Credit"
//            },
//            {
//                type: "line",
//                field: "balance",
//                name: "Balance"
//            }
//        ],
//        categoryAxis: {
//            field: "StoreNo"
//        },
//        tooltip: {
//            visible: true,
//            template: "#= series.name #: #= kendo.toString(value, 'n') #"
//        }
//        //series: [{ type: "line", field: "debit", categoryField: "StoreNo", startAngle: 160, padding: 0 }]
//    }).data("kendoChart");

//    $("#mixed-chart-proto").empty();
//    $("#mixed-chart-proto").kendoChart({
//        theme: "black",
//        title: { text: "" },
//        legend: { position: "right" },
//        dataSource: { data: GroupedData },
//        //seriesDefaults: {
//        //    labels: {
//        //        visible: true,
//        //        background: "transparent",
//        //        template: "#= series.name #: \n #= kendo.toString(value, 'n')#"
//        //    }
//        //},
//        series: [
//            {
//                type: "bar",
//                field: "debit",
//                name: "Debit"
//            },
//            {
//                type: "area",
//                field: "credit",
//                name: "Credit"
//            },
//            {
//                type: "line",
//                field: "balance",
//                name: "Balance"
//            }
//        ],
//        categoryAxis: {
//            field: "StoreNo"
//        },
//        tooltip: {
//            visible: true,
//            template: "#= series.name #: #= kendo.toString(value, 'n') #"
//        }
//        //series: [{ type: "line", field: "debit", categoryField: "StoreNo", startAngle: 160, padding: 0 }]
//    }).data("kendoChart");

//}
//function UpdateChartsCatalogs() {
//    var cmbStoreNo = $("#cmbStoreNo").data("kendoMultiSelect");
//    if (cmbStoreNo != undefined)
//        cmbStoreNo.destroy();
//    cmbStoreNo = $("#cmbStoreNo").kendoMultiSelect({
//        dataSource: ChartStoreNumbers,
//        dataTextField: "StoreNo",
//        dataValueField: "StoreNo",
//        autoClose: false,
//        change: GetChartData,
//    }).data("kendoMultiSelect");
//    cmbStoreNo.wrapper.find(".k-multiselect-wrap").removeClass("floatWrap").addClass("k-floatwrap");
//    cmbStoreNo.value(ChartStoreNumbers);


//    var cmbType = $("#cmbType").data("kendoMultiSelect");
//    if (cmbType != undefined)
//        cmbType.destroy();
//    cmbType = $("#cmbType").kendoMultiSelect({
//        dataSource: ChartTypes,
//        dataTextField: "typeCT",
//        dataValueField: "typeCT",
//        autoClose: false,
//        change: GetChartData,
//    }).data("kendoMultiSelect");
//    cmbType.wrapper.find(".k-multiselect-wrap").removeClass("floatWrap").addClass("k-floatwrap");
//    cmbType.value(ChartTypes);
//};