//var GridData = [];
//var StoreNumbers = [];
//var GroupedData = [];
//var DataToManage = [];
//var IsManaging = false;

//function SetDateRage(start, end) {
//    $("#startDate").val(start);
//    $("#endDate").val(end);
//    GetData();
//}

//function GetData() {

//    $.ajax({
//        type: "GET",
//        url: "GetRP",
//        traditional: 'true',
//        data: { StartDate: $("#startDate").val(), EndDate: $("#endDate").val() },
//        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
//        dataType: 'json',
//        success: function (response) {
//            GridData = response.Tables[0];
//            StoreNumbers = response.Tables[1];
//            GroupedData = response.Tables[2];
//            if (!IsManaging)
//                UpdateGrid();
//            else
//                UpdateManageableGrid();
//        },
//        error: function (xhr, status, error) {
//            console.error(xhr.responseText);
//            Response = JSON.parse('{ "Result": { "Id": 0, "Description": "", "Success": false, "Errors" : ["' + xhr.status + ': ' + xhr.statusText + '"] } }');
//        }
//    });
//}

//function UpdateGrid() {
//    $("#grid").empty();
//    $("#grid").kendoGrid({
//        toolbar: ["excel", "pdf"],
//        pdf: {
//            fileName: "RPReport.pdf",
//            allPages: false,
//            avoidLinks: true,
//            paperSize: "letter",
//            margin: { top: "2cm", left: "1cm", right: "1cm", bottom: "1cm" },
//            landscape: true,
//            repeatHeaders: true,
//            scale: 0.8
//        },
//        excel: {
//            fileName: "RPReport.xlsx",
//            allPages: true,
//            filterable: true
//        },
//        dataSource: {
//            type: "json",
//            data: GridData,
//            pageSize: 200,
//            schema: {
//                model: {
//                    fields: {
//                        StoreNo: { type: "string", editable: false },
//                        dateRP: { type: "date", editable: false },
//                        policyNumber: { type: "string", editable: false },
//                        narrative: { type: "string", editable: false },
//                        insured: { type: "string", editable: false },
//                        payments: { type: "number", editable: false },
//                        checkIssuedDate: { type: "date", editable: false },
//                    }
//                }
//            },
//            aggregate: [
//               { field: "payments", aggregate: "sum" }]
//        },
//        theme: "black",
//        scrollable: true,
//        sortable: true,
//        resizable: true,
//        filterable: true,
//        pageable: {
//            input: true,
//            numeric: false
//        },
//        columns:
//            [
//                {
//                    field: "StoreNo", title: "Store No", width: "100%",
//                    filterable: {
//                        multi: true,
//                        dataSource: StoreNumbers,
//                    }
//                },
//                { field: "policyNumber", title: "Policy Number", width: "150%" },
//                { field: "narrative", title: "Narrative", width: "250%" },
//                { field: "insured", title: "Insured", width: "200%" },
//                { field: "payments", title: "Payments", width: "100%", template: "#= kendo.toString(payments, 'n') #", attributes: { style: "text-align:right;" }, footerTemplate: "Total : #= kendo.toString(sum, 'n') #" },
//            ]
//    });
//}

//function UpdateManageableGrid() {
//    $("#grid").empty();
//    $("#grid").kendoGrid({
//        dataSource: {
//            type: "json",
//            data: GridData,
//            pageSize: 200,
//            schema: {
//                model: {
//                    fields: {
//                        StoreNo: { type: "string", editable: false },
//                        dateRP: { type: "date", editable: false },
//                        policyNumber: { type: "string", editable: false },
//                        narrative: { type: "string", editable: false },
//                        insured: { type: "string", editable: false },
//                        payments: { type: "number", editable: false },
//                        checkIssuedDate: { type: "date", editable: false },
//                        isSelected: { type: "boolean", editable: false }
//                    }
//                }
//            },
//            aggregate: [
//               { field: "payments", aggregate: "sum" }]
//        },
//        theme: "black",
//        scrollable: true,
//        sortable: true,
//        resizable: true,
//        filterable: true,
//        pageable: {
//            input: true,
//            numeric: false
//        },
//        change: function (e) {
//            var selectedRows = this.select();
//            DataToManage = [];
//            for (var i = 0; i < selectedRows.length; i++) {
//                var dataItem = this.dataItem(selectedRows[i]);
//                DataToManage.push(dataItem);
//            }
//            UpdateGridToManage();
//        },
//        columns:
//            [
//                { selectable: true, width: "50px" },
//                {
//                    field: "StoreNo", title: "Store No", width: "100%",
//                    filterable: {
//                        multi: true,
//                        dataSource: StoreNumbers,
//                    }
//                },
//                { field: "policyNumber", title: "Policy Number", width: "150%" },
//                { field: "narrative", title: "Narrative", width: "250%" },
//                { field: "insured", title: "Insured", width: "200%" },
//                { field: "payments", title: "Payments", width: "100%", template: "#= kendo.toString(payments, 'n') #", attributes: { style: "text-align:right;" }, footerTemplate: "Total : #= kendo.toString(sum, 'n') #" },
//            ]
//    });
//}

////Staging grid for selected items
//function UpdateGridToManage() {
//    $("#stagingGrid").empty();
//    $("#stagingGrid").kendoGrid({
//        dataSource: {
//            //type: "json",
//            data: DataToManage,
//            schema: {
//                model: {
//                    id: "ID",
//                    fields: {
//                        StoreNo: { type: "string" },
//                        dateRP: { type: "date" },
//                        policyNumber: { type: "string" },
//                        narrative: { type: "string", },
//                        insured: { type: "string" },
//                        payments: { type: "number" },
//                        checkIssuedDate: { type: "date" },
//                    }
//                }
//            },
//        },
//        theme: "black",
//        editable: true,
//        save: function (e) {
//            var model = e.model;
//            var values = e.values;
//            //var CompraM = e.values.CompraM != null ? e.values.CompraM : e.model.CompraM;
//            //var CompraP = e.values.CompraP != null ? e.values.CompraP : e.model.CompraP;
//            //var CompraD = e.values.CompraD != null ? e.values.CompraD : e.model.CompraD;

//            ////e.model.InventarioFinalM = e.model.InventarioInicialM + CompraM;

//            //    Funciones.CalcularCampos(e.model.iDetalleProgramacionCombustible, CompraM, CompraP, CompraD);
//            //    // e.sender.refresh();
//            //}

//        },
//        columns:
//            [
//                //{ command: "edit", width: "200px" },
//                {
//                    field: "StoreNo", title: "Store No", width: "100%",
//                    template: '<center> <input id="txtStoreNo_#= ID#" value="#= StoreNo #" type="text" class="form-control" style="color:black;height:15px;width: 80%;" /> </center>'
//                },
//                {
//                    field: "dateRP", title: "Date", width: "200px",
//                },
//                {
//                    field: "policyNumber", title: "Policy Number", width: "150%",
//                    template: '<center> <input id="txtPolicyNumber_#= ID#" value="#= policyNumber #" type="text" class="form-control" style="color:black;height:15px;width: 80%;" /> </center>'
//                },
//                {
//                    field: "narrative", title: "Narrative", width: "250%",
//                    template: '<center> <input id="txtNarrative_#= ID#" value="#= narrative #" type="text" class="form-control" style="color:black;height:15px;width: 80%;" /> </center> '
//                },
//                {
//                    field: "insured", title: "Insured", width: "200%",
//                    template: '<center> <input id="txtInsured_#= ID#" value="#= insured #" type="text" class="form-control" style="color:black;height:15px;width: 80%;" /> </center> '
//                },
//                {
//                    field: "payments", title: "Payments", width: "100%",
//                    template: '<center> <input id="txtPayments_#= ID#" value="#=  kendo.toString(payments, "n") #" type="number" class="form-control" style="color:black;height:15px;width: 80%;text-align:right;" /> </center> ',
//                },
//                {
//                    field: "checkIssuedDate", title: "Check Issued ", width: "200px",
//                }
//            ]
//    });
//    $(".dtpicker").kendoDatePicker();
//}

//function UpdateCharts() {
//    $("#bar-chart-proto").empty();
//    $("#bar-chart-proto").kendoChart({
//        theme: "black",
//        title: { text: "RP Bar Data" },
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
//                field: "payment",
//                name: "Payment",

//            }
//        ],
//        categoryAxis: {
//            field: "StoreNo"
//        },
//    }).data("kendoChart");
//}

//function ManageData() {
//    if (!IsManaging) {
//        UpdateManageableGrid();
//        UpdateGridToManage();
//        IsManaging = true;
//        $("#ManageDataControls").show();
//    }
//}

//function DeleteData() {
//    if (confirm("WARNING \n\r This action cannot be Undone \n\r Are you sure you want to DELETE the Selected Rows?")) {
//        var Items = [];
//        for (var i = 0; i < DataToManage.length; i++) {
//            Items.push(DataToManage[i].ID);
//        }
//        $.ajax({
//            type: "POST",
//            url: "DeleteRecords",
//            traditional: 'true',
//            data: { Items: Items, Report: "RP" },
//            contentType: 'application/x-www-form-urlencoded; charset=utf-8',
//            dataType: 'json',
//            success: function (response) {
//                alert("Success \n\r The Selected Rows has been deleted.");
//                location.reload();
//            },
//            error: function (xhr, status, error) {
//                console.error(xhr.responseText);
//                alert("Error \n\r Something went wrong.")
//                //Response = JSON.parse('{ "Result": { "Id": 0, "Description": "", "Success": false, "Errors" : ["' + xhr.status + ': ' + xhr.statusText + '"] } }');
//            }
//        });
//    }
//}

//function SaveData() {
//    if (confirm("WARNING \n\r Are you sure you want to EDIT the Selected Rows?")) {
//        var ItemList = [];
//        var Item;
//        var NewItem;
//        for (var i = 0; i < DataToManage.length; i++) {
//            Item = DataToManage[i];
//            NewItem = {};
//            NewItem.ID = Item.ID;
//            NewItem.StoreNo = $("#txtStoreNo_" + Item.ID).val();
//            NewItem.dateRP = $("#dtRP_" + Item.ID).val();
//            NewItem.policyNumber = $("#txtPolicyNumber_" + Item.ID).val();
//            NewItem.narrative = $("#txtNarrative_" + Item.ID).val();
//            NewItem.insured = $("#txtInsured_" + Item.ID).val();
//            NewItem.payments = $("#txtPayments_" + Item.ID).val();
//            NewItem.checkIssuedDate = $("#dtIssuedDate_" + Item.ID).val();

//            ItemList.push(NewItem);
//        }
//        $.ajax({
//            type: "POST",
//            url: "UpdateRPRecords",
//            traditional: 'true',
//            data: JSON.stringify({ "ItemList": ItemList }),
//            contentType: 'application/json; charset=utf-8',
//            //dataType: 'json',
//            success: function (response) {
//                alert("Success \n\r The Selected Rows has been Updated.");
//                location.reload();
//            },
//            error: function (xhr, status, error) {
//                console.error(xhr.responseText);
//                alert("Error \n\r Something went wrong.")
//            }
//        });
//    }
//}


//function AddItemToManage(Item) {
//    DataToManage.push(Item);
//}

//function RemoveItemToManage(ID) {
//    for (var i = 0; i < DataToManage.length; i++) {
//        if (DataToManage[i].ID == ID) {
//            DataToManage.splice(i, 1);
//            return;
//        }
//    }
//}

//$(document).ready(function () {
//    $("#startDate").kendoDatePicker({ change: GetData });
//    $("#endDate").kendoDatePicker({ change: GetData });
//    GetData();
//});




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
                url: "GetRP",
                traditional: 'true',
                data: { StartDate: $("#startDate").val(), EndDate: $("#endDate").val() },
                contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                dataType: 'json',
                success: function (response) {
                    Page.ReportGrid.DataSources.MainData = response.Tables[0];
                    Page.ReportGrid.DataSources.StoreNumbers = response.Tables[1];
                    Page.ReportGrid.DataSources.GroupedData = response.Tables[2];
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
                        fileName: "RPReport.pdf",
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
                        fileName: "RPReport.xlsx",
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
                                    dateRP: { type: "date", editable: false },
                                    policyNumber: { type: "string", editable: false },
                                    narrative: { type: "string", editable: false },
                                    insured: { type: "string", editable: false },
                                    payments: { type: "number", editable: false },
                                    checkIssuedDate: { type: "date", editable: false },
                                }
                            }
                        },
                        group: {
                            field: "StoreNo", aggregates: [
                            { field: "StoreNo", aggregate: "count" },
                            { field: "payments", aggregate: "sum" }]
                        },
                        aggregate: [
                           { field: "payments", aggregate: "sum" }]
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
                            { field: "dateRP", title: "Date", width: "150px", template: "#= kendo.toString(dateRP, 'MM/dd/yyyy') #", },
                            { field: "policyNumber", title: "Policy Number", width: "200px" },
                            { field: "narrative", title: "Narrative", width: "250px" },
                            { field: "insured", title: "Insured", width: "250px" },
                            { field: "payments", title: "Payments", width: "250px", template: "#= kendo.toString(payments, 'c') #", attributes: { style: "text-align:right;" }, footerTemplate: " Total : #= kendo.toString(sum, 'c') # ", groupFooterTemplate: " #= kendo.toString(sum, 'c') # " },
                            { field: "checkIssuedDate", title: "Check Issued ", width: "150px", template: "#= kendo.toString(checkIssuedDate, 'MM/dd/yyyy') #", }
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
                                    dateRP: { type: "date", editable: false },
                                    policyNumber: { type: "string", editable: false },
                                    narrative: { type: "string", editable: false },
                                    insured: { type: "string", editable: false },
                                    payments: { type: "number", editable: false },
                                    checkIssuedDate: { type: "date", editable: false },
                                }
                            }
                        },
                        aggregate: [
                           { field: "payments", aggregate: "sum" }]
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
                            { field: "dateRP", title: "Date", width: "100%", template: "#= kendo.toString(dateRP, 'MM/dd/yyyy') #", },
                            { field: "policyNumber", title: "Policy Number", width: "150%" },
                            { field: "narrative", title: "Narrative", width: "250%" },
                            { field: "insured", title: "Insured", width: "200%" },
                            { field: "payments", title: "Payments", width: "100%", template: "#= kendo.toString(payments, 'n') #", attributes: { style: "text-align:right;" }, footerTemplate: "Total : #= kendo.toString(sum, 'n') #" },
                            { field: "checkIssuedDate", title: "Check Issued ", width: "100%", template: "#= kendo.toString(checkIssuedDate, 'MM/dd/yyyy') #", }
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
                            id: "ID",
                            fields: {
                                StoreNo: { type: "string" },
                                dateRP: { type: "date" },
                                policyNumber: { type: "string" },
                                narrative: { type: "string", },
                                insured: { type: "string" },
                                payments: { type: "number" },
                                checkIssuedDate: { type: "date" },
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
                                template: '<center> <input id="txtStoreNo_#= ID#" value="#= StoreNo #" type="text" class="form-control" style="color:black;height:15px;width: 80%;" /> </center>'
                            },
                            {
                                field: "dateRP", title: "Date", width: "200px",
                                template: ' <input id="dtRP_#= ID#" class="dtpicker" value="#= kendo.toString(dateRP, "MM/dd/yyyy") #" /> ',
                            },
                            {
                                field: "policyNumber", title: "Policy Number", width: "150%",
                                template: '<center> <input id="txtPolicyNumber_#= ID#" value="#= policyNumber #" type="text" class="form-control" style="color:black;height:15px;width: 80%;" /> </center>'
                            },
                            {
                                field: "narrative", title: "Narrative", width: "250%",
                                template: '<center> <input id="txtNarrative_#= ID#" value="#= narrative #" type="text" class="form-control" style="color:black;height:15px;width: 80%;" /> </center> '
                            },
                            {
                                field: "insured", title: "Insured", width: "200%",
                                template: '<center> <input id="txtInsured_#= ID#" value="#= insured #" type="text" class="form-control" style="color:black;height:15px;width: 80%;" /> </center> '
                            },
                            {
                                field: "payments", title: "Payments", width: "100%",
                                template: '<center> <input id="txtPayments_#= ID#" value="#=  kendo.toString(payments, "n") #" type="number" class="form-control" style="color:black;height:15px;width: 80%;text-align:right;" /> </center> ',
                            },
                            {
                                field: "checkIssuedDate", title: "Check Issued ", width: "200px",
                                template: ' <input id="dtIssuedDate_#= ID#" class="dtpicker" value="#= kendo.toString(checkIssuedDate, "MM/dd/yyyy") #" /> ',
                            }]
            });
            //$("#stagingGrid").kendoGrid({
            //    dataSource: {
            //        //type: "json",
            //        data: DataToManage,
            //        schema: {
            //            model: {
            //                id: "ID",
            //                fields: {
            //                    StoreNo: { type: "string" },
            //                    dateRP: { type: "date" },
            //                    policyNumber: { type: "string" },
            //                    narrative: { type: "string", },
            //                    insured: { type: "string" },
            //                    payments: { type: "number" },
            //                    checkIssuedDate: { type: "date" },
            //                }
            //            }
            //        },
            //    },
            //    theme: "black",
            //    editable: true,
            //    save: function (e) {
            //        var model = e.model;
            //        var values = e.values;
            //        //var CompraM = e.values.CompraM != null ? e.values.CompraM : e.model.CompraM;
            //        //var CompraP = e.values.CompraP != null ? e.values.CompraP : e.model.CompraP;
            //        //var CompraD = e.values.CompraD != null ? e.values.CompraD : e.model.CompraD;

            //        ////e.model.InventarioFinalM = e.model.InventarioInicialM + CompraM;

            //        //if (e.values.CompraD != null) {
            //        //    Funciones.CalcularCampos(e.model.iDetalleProgramacionCombustible, CompraM, CompraP, CompraD);
            //        //    // e.sender.refresh();
            //        //}

            //    },
            //    columns:
            //        [
            //            //{ command: "edit", width: "200px" },
            //            {
            //                field: "StoreNo", title: "Store No", width: "100%",
            //                template: '<center> <input id="txtStoreNo_#= ID#" value="#= StoreNo #" type="text" class="form-control" style="color:black;height:15px;width: 80%;" /> </center>'
            //            },
            //            {
            //                field: "dateRP", title: "Date", width: "200px",
            //                template: ' <input id="dtRP_#= ID#" class="dtpicker" value="#= kendo.toString(dateRP, "MM/dd/yyyy") #" /> ',
            //            },
            //            {
            //                field: "policyNumber", title: "Policy Number", width: "150%",
            //                template: '<center> <input id="txtPolicyNumber_#= ID#" value="#= policyNumber #" type="text" class="form-control" style="color:black;height:15px;width: 80%;" /> </center>'
            //            },
            //            {
            //                field: "narrative", title: "Narrative", width: "250%",
            //                template: '<center> <input id="txtNarrative_#= ID#" value="#= narrative #" type="text" class="form-control" style="color:black;height:15px;width: 80%;" /> </center> '
            //            },
            //            {
            //                field: "insured", title: "Insured", width: "200%",
            //                template: '<center> <input id="txtInsured_#= ID#" value="#= insured #" type="text" class="form-control" style="color:black;height:15px;width: 80%;" /> </center> '
            //            },
            //            {
            //                field: "payments", title: "Payments", width: "100%",
            //                template: '<center> <input id="txtPayments_#= ID#" value="#=  kendo.toString(payments, "n") #" type="number" class="form-control" style="color:black;height:15px;width: 80%;text-align:right;" /> </center> ',
            //            },
            //            {
            //                field: "checkIssuedDate", title: "Check Issued ", width: "200px",
            //                template: ' <input id="dtIssuedDate_#= ID#" class="dtpicker" value="#= kendo.toString(checkIssuedDate, "MM/dd/yyyy") #" /> ',
            //            }
            //        ]
            //});
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
                    NewItem.ID = Item.ID;
                    NewItem.StoreNo = $("#txtStoreNo_" + Item.ID).val();
                    NewItem.dateRP = $("#dtRP_" + Item.ID).val();
                    NewItem.policyNumber = $("#txtPolicyNumber_" + Item.ID).val();
                    NewItem.narrative = $("#txtNarrative_" + Item.ID).val();
                    NewItem.insured = $("#txtInsured_" + Item.ID).val();
                    NewItem.payments = $("#txtPayments_" + Item.ID).val();
                    NewItem.checkIssuedDate = $("#dtIssuedDate_" + Item.ID).val();

                    ItemList.push(NewItem);
                }
                $.ajax({
                    type: "POST",
                    url: "UpdateRPRecords",
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
                    Items.push(Page.StagingGrid.DataSources.MainData[i].ID);
                }
                $.ajax({
                    type: "POST",
                    url: "DeleteRecords",
                    traditional: 'true',
                    data: { Items: Items, Report: "RP" },
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
//        title: { text: "RP Bar Data" },
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
//                field: "payment",
//                name: "Payment",

//            }
//        ],
//        categoryAxis: {
//            field: "StoreNo"
//        },
//    }).data("kendoChart");
//}

