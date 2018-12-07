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
                url: "GetEFT",
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
                        fileName: "EFTReport.pdf",
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
                        fileName: "EFTReport.xlsx",
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
                                    dateOfReceipt: { type: "date", editable: false },
                                    policyNumber: { type: "string", editable: false },
                                    nameOfCustomer: { type: "string", editable: false },
                                    insuranceCompany: { type: "string", editable: false },
                                    premium: { type: "number", editable: false },
                                }
                            }
                        },
                        group: {
                            field: "StoreNo", aggregates: [
                            { field: "StoreNo", aggregate: "count" },
                            { field: "premium", aggregate: "sum" }]
                        },
                        aggregate: [
                           { field: "premium", aggregate: "sum" }]
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
                            { field: "dateOfReceipt", title: "Date of Receipt", width: "200px", template: "#= kendo.toString(dateOfReceipt, 'MM/dd/yyyy') #", },
                            { field: "policyNumber", title: "Policy Number", width: "250px" },
                            { field: "nameOfCustomer", title: "Customer", width: "500px" },
                            { field: "insuranceCompany", title: "Company", width: "300px" },
                            { field: "premium", title: "Premium", width: "150px", template: "#= kendo.toString(premium, 'c') #", attributes: { style: "text-align:right;" }, footerTemplate: " Total : #= kendo.toString(sum, 'c') # ", groupFooterTemplate: " #= kendo.toString(sum, 'c') # " },

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
                                    dateOfReceipt: { type: "date", editable: false },
                                    policyNumber: { type: "string", editable: false },
                                    nameOfCustomer: { type: "string", editable: false },
                                    insuranceCompany: { type: "string", editable: false },
                                    premium: { type: "number", editable: false },
                                }
                            }
                        },
                        aggregate: [
                           { field: "premium", aggregate: "sum" }]
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
                            { field: "dateOfReceipt", title: "Date of Receipt", width: "100%", template: "#= kendo.toString(dateOfReceipt, 'MM/dd/yyyy') #", },
                            { field: "policyNumber", title: "Policy Number", width: "150%" },
                            { field: "nameOfCustomer", title: "Customer", width: "300%" },
                            { field: "insuranceCompany", title: "Company", width: "250%" },
                            { field: "premium", title: "Premium", width: "100%", template: "#= kendo.toString(premium, 'n') #", attributes: { style: "text-align:right;" }, footerTemplate: "Total : #= kendo.toString(sum, 'n') #" },

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
                                dateOfReceipt: { type: "date" },
                                policyNumber: { type: "string" },
                                nameOfCustomer: { type: "string" },
                                insuranceCompany: { type: "string" },
                                premium: { type: "number" },
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
                            field: "dateOfReceipt", title: "Date", width: "140px",
                            template: ' <input id="dtReceipt_#= id#" class="dtpicker" value="#= kendo.toString(dateOfReceipt, "MM/dd/yyyy") #" /> ',
                        },
                        {
                            field: "policyNumber", title: "Policy Number", width: "100%",
                            template: '<center> <input id="txtPolicyNumber_#= id#" value="#= policyNumber #" type="text" class="form-control" style="color:black;height:15px;width: 80%;" /> </center>'
                        },
                        {
                            field: "nameOfCustomer", title: "Customer", width: "150%",
                            template: '<center> <input id="txtCustomer_#= id#" value="#= nameOfCustomer #" type="text" class="form-control" style="color:black;height:15px;width: 80%;" /> </center>'
                        },
                        {
                            field: "insuranceCompany", title: "Company", width: "250%",
                            template: '<center> <input id="txtCompany_#= id#" value="#= insuranceCompany #" type="text" class="form-control" style="color:black;height:15px;width: 80%;" /> </center> '
                        },
                        {
                            field: "premium", title: "Premium", width: "100%",
                            template: '<center> <input id="txtPremium_#= id#" value="#=  kendo.toString(premium, "n") #" type="number" class="form-control" style="color:black;height:15px;width: 80%;text-align:right;" /> </center> ',
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
                    NewItem.dateOfReceipt = $("#dtReceipt_" + Item.id).val();
                    NewItem.policyNumber = $("#txtPolicyNumber_" + Item.id).val();
                    NewItem.nameOfCustomer = $("#txtCustomer_" + Item.id).val();
                    NewItem.insuranceCompany = $("#txtCompany_" + Item.id).val();
                    NewItem.premium = $("#txtPremium_" + Item.id).val();

                    ItemList.push(NewItem);
                }
                $.ajax({
                    type: "POST",
                    url: "UpdateEFTRecords",
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
                    data: { Items: Items, Report: "EFT" },
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
