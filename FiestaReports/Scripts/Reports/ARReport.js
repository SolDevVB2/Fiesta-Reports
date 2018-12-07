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
            Statuses: [],
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
                url: "GetAR",
                traditional: 'true',
                data: { StartDate: $("#startDate").val(), EndDate: $("#endDate").val() },
                contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                dataType: 'json',
                success: function (response) {
                    Page.ReportGrid.DataSources.MainData = response.Tables[0];
                    Page.ReportGrid.DataSources.StoreNumbers = response.Tables[1];
                    Page.ReportGrid.DataSources.Types = response.Tables[2];
                    Page.ReportGrid.DataSources.Statuses = response.Tables[3];
                    Page.ReportGrid.DataSources.GroupedData = response.Tables[4];
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
                        fileName: "ARReport.pdf",
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
                        fileName: "ARReport.xlsx",
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
                                    transactionDate: { type: "date", editable: false },
                                    internalReference: { type: "string", editable: false },
                                    reconType: { type: "string", editable: false },
                                    narrative: { type: "string", editable: false },
                                    externalReference: { type: "string", editable: false },
                                    amount: { type: "number", editable: false },
                                    status: { type: "string", editable: false },
                                }
                            }
                        },
                        group: {
                            field: "StoreNo", aggregates: [
                            { field: "StoreNo", aggregate: "count" },
                            { field: "amount", aggregate: "sum" }]
                        },
                        aggregate: [
                           { field: "amount", aggregate: "sum" }]
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
                    columns:
                        [
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
                            { field: "transactionDate", title: "Date", width: "150px", template: "#= kendo.toString(transactionDate, 'MM/dd/yyyy') #", },
                            {
                                field: "status", title: "Status", width: "100px",
                                filterable: {
                                    multi: true,
                                    dataSource: Page.ReportGrid.DataSources.Statuses,
                                }
                            },
                            {
                                field: "reconType", title: "Type", width: "250px",
                                filterable: {
                                    multi: true,
                                    dataSource: Page.ReportGrid.DataSources.Types,
                                }
                            },
                            { field: "narrative", title: "Narrative", width: "250px", attributes: { title: "#= narrative #" } },
                            { field: "internalReference", title: "Internal Reference", width: "350px", attributes: { title: "#= internalReference #" } },
                            { field: "externalReference", title: "External Reference", width: "350px", attributes: { title: "#= externalReference #" } },
                            { field: "amount", title: "Amount", width: "150px", template: "#= kendo.toString(amount, 'n') #", attributes: { style: "text-align:right;" }, footerTemplate: " Total : #= kendo.toString(sum, 'c') # ", groupFooterTemplate: " #= kendo.toString(sum, 'c') # " }
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
                                    transactionDate: { type: "date", editable: false },
                                    internalReference: { type: "string", editable: false },
                                    reconType: { type: "string", editable: false },
                                    narrative: { type: "string", editable: false },
                                    externalReference: { type: "string", editable: false },
                                    amount: { type: "number", editable: false },
                                    status: { type: "string", editable: false },
                                }
                            }
                        },
                        aggregate: [
                           { field: "amount", aggregate: "sum" }]
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
                            { field: "transactionDate", title: "Date", width: "100%", template: "#= kendo.toString(transactionDate, 'MM/dd/yyyy') #", },
                            {
                                field: "status", title: "Status", width: "100%",
                                filterable: {
                                    multi: true,
                                    dataSource: Page.ReportGrid.DataSources.Statuses,
                                }
                            },
                            {
                                field: "reconType", title: "Type", width: "150%",
                                filterable: {
                                    multi: true,
                                    dataSource: Page.ReportGrid.DataSources.Types,
                                }
                            },
                            { field: "narrative", title: "Narrative", width: "200%", attributes: { title: "#= narrative #" } },
                            { field: "internalReference", title: "Internal Reference", width: "200%", attributes: { title: "#= internalReference #" } },
                            { field: "externalReference", title: "External Reference", width: "200%", attributes: { title: "#= externalReference #" } },
                            { field: "amount", title: "Amount", width: "100%", template: "#= kendo.toString(amount, 'n') #", attributes: { style: "text-align:right;" }, footerTemplate: "Total : #= kendo.toString(sum, 'n') #" }
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
                                transactionDate: { type: "date" },
                                internalReference: { type: "string" },
                                reconType: { type: "string" },
                                narrative: { type: "string" },
                                externalReference: { type: "string" },
                                amount: { type: "number" },
                                status: { type: "string" },
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
                            field: "transactionDate", title: "Date", width: "140px",
                            template: ' <input id="dtTransaction_#= id#" class="dtpicker" value="#= kendo.toString(transactionDate, "MM/dd/yyyy") #" /> ',
                        },
                        {
                            field: "status", title: "Status", width: "100%",
                            template: '<center> <input id="txtStatus_#= id#" value="#= status #" type="text" class="form-control" style="color:black;height:15px;width: 80%;" /> </center>'
                        },
                        {
                            field: "reconType", title: "Type", width: "150%",
                            template: '<center> <input id="txtReconType_#= id#" value="#= reconType #" type="text" class="form-control" style="color:black;height:15px;width: 80%;" /> </center>'
                        },
                        {
                            field: "narrative", title: "Narrative", width: "250%",
                            template: '<center> <input id="txtNarrative_#= id#" value="#= narrative #" type="text" class="form-control" style="color:black;height:15px;width: 80%;" /> </center> '
                        },
                        {
                            field: "internalReference", title: "Internal Reference", width: "250%",
                            template: '<center> <input id="txtInternalReference_#= id#" value="#= internalReference #" type="text" class="form-control" style="color:black;height:15px;width: 80%;" /> </center> '
                        },
                        {
                            field: "externalReference", title: "Internal Reference", width: "250%",
                            template: '<center> <input id="txtExternalReference_#= id#" value="#= externalReference #" type="text" class="form-control" style="color:black;height:15px;width: 80%;" /> </center> '
                        },
                        {
                            field: "amount", title: "Amount", width: "100%",
                            template: '<center> <input id="txtAmount_#= id#" value="#=  kendo.toString(amount, "n") #" type="number" class="form-control" style="color:black;height:15px;width: 80%;text-align:right;" /> </center> ',
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
                    NewItem.transactionDate = $("#dtTransaction_" + Item.id).val();
                    NewItem.status = $("#txtStatus_" + Item.id).val();
                    NewItem.reconType = $("#txtReconType_" + Item.id).val();
                    NewItem.narrative = $("#txtNarrative_" + Item.id).val();
                    NewItem.internalReference = $("#txtInternalReference_" + Item.id).val();
                    NewItem.externalReference = $("#txtExternalReference_" + Item.id).val();
                    NewItem.amount = $("#txtAmount_" + Item.id).val();
                    
                    ItemList.push(NewItem);
                }
                $.ajax({
                    type: "POST",
                    url: "UpdateARRecords",
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
                    data: { Items: Items, Report: "AR" },
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


//function UpdateCharts() {
//    $("#bar-chart-proto").empty();
//    $("#bar-chart-proto").kendoChart({
//        theme: "black",
//        title: { text: "AR Bar Data" },
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
//                field: "totalAmount",
//                name: "Total Amount",

//            }
//        ],
//        categoryAxis: {
//            field: "StoreNo"
//        },
//    }).data("kendoChart");
//}