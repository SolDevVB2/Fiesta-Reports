//var GridData = [];
//var StoreNumbers = [];
//var GroupedData = [];

//function SetDateRage(start, end) {
//    $("#startDate").val(start);
//    $("#endDate").val(end);
//    GetData();
//}

//function GetData() {

//    $.ajax({
//        type: "GET",
//        url: "GetDD",
//        traditional: 'true',
//        data: { StartDate: $("#startDate").val(), EndDate: $("#endDate").val() },
//        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
//        dataType: 'json',
//        success: function (response) {
//            GridData = response.Tables[0];
//            StoreNumbers = response.Tables[1];
//            GroupedData = response.Tables[2];
//            UpdateGrid();
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
//            fileName: "DDReport.pdf",
//            allPages: false,
//            avoidLinks: true,
//            paperSize: "letter",
//            margin: { top: "2cm", left: "1cm", right: "1cm", bottom: "1cm" },
//            landscape: true,
//            repeatHeaders: true,
//            scale: 0.8
//        },
//        excel: {
//            fileName: "DDReport.xlsx",
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
//                        reportDate: { type: "date", editable: false },
//                        EODDeposit: { type: "number", editable: false },
//                        actualDeposit: { type: "number", editable: false },
//                        depositOver: { type: "string", editable: false },
//                        depositDate: { type: "date", editable: false },
//                        EODCreditCards: { type: "number", editable: false },
//                        actualCreditCards: { type: "number", editable: false },
//                        overCreditCards: { type: "string", editable: false },
//                        voidCredits: { type: "number", editable: false },
//                        payoutTo: { type: "string", editable: false },
//                        payoutCheck: { type: "number", editable: false },
//                        scanningViolationFees: { type: "number", editable: false },
//                        depositViolationFees: { type: "number", editable: false },
//                        ARViolationFees: { type: "number", editable: false },
//                        violationFeesTotal: { type: "number", editable: false },
//                        comments: { type: "string", editable: false },
//                        email1: { type: "string", editable: false },
//                    }
//                }
//            },
//            aggregate: [
//                { field: "EODDeposit", aggregate: "sum" },
//                { field: "actualDeposit", aggregate: "sum" },
//                { field: "EODCreditCards", aggregate: "sum" },
//                { field: "actualCreditCards", aggregate: "sum" },
//                { field: "voidCredits", aggregate: "sum" },
//                { field: "payoutCheck", aggregate: "sum" },
//                { field: "scanningViolationFees", aggregate: "sum" },
//                { field: "depositViolationFees", aggregate: "sum" },
//                { field: "ARViolationFees", aggregate: "sum" },
//                { field: "violationFeesTotal", aggregate: "sum" }]
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
//                    field: "StoreNo", title: "Store No", width: "100px",
//                    filterable: {
//                        multi: true,
//                        dataSource: StoreNumbers,
//                    }
//                },
//                { field: "actualDeposit", title: "Actual Deposit", width: "200px", template: "#= kendo.toString(actualDeposit, 'n') #", attributes: { style: "text-align:right;" }, footerTemplate: "Total : #= kendo.toString(sum, 'n') #" },
//                { field: "depositOver", title: "Deposit Over/(Short)", width: "200px" },
//                { field: "EODCreditCards", title: "EOD Credit Cards", width: "200px", template: "#= kendo.toString(EODCreditCards, 'n') #", attributes: { style: "text-align:right;" }, footerTemplate: "Total : #= kendo.toString(sum, 'n') #" },
//                { field: "actualCreditCards", title: "Actual Credit Cards", width: "200px", template: "#= kendo.toString(actualCreditCards, 'n') #", attributes: { style: "text-align:right;" }, footerTemplate: "Total : #= kendo.toString(sum, 'n') #" },
//                { field: "overCreditCards", title: "Over/(Short) Credit Cards", width: "200px" },
//                { field: "voidCredits", title: "VOID Credits", width: "200px", template: "#= kendo.toString(voidCredits, 'n') #", attributes: { style: "text-align:right;" }, footerTemplate: "Total : #= kendo.toString(sum, 'n') #" },
//                { field: "payoutTo", title: "Payout To/(From)", width: "200px" },
//                { field: "payoutCheck", title: "Payout Check", width: "200px", template: "#= kendo.toString(voidCredits, 'n') #", attributes: { style: "text-align:right;" }, footerTemplate: "Total : #= kendo.toString(sum, 'n') #" },
//                { field: "scanningViolationFees", title: "Scanning Violation Fees", width: "200px", template: "#= kendo.toString(voidCredits, 'n') #", attributes: { style: "text-align:right;" }, footerTemplate: "Total : #= kendo.toString(sum, 'n') #" },
//                { field: "depositViolationFees", title: "Deposit Violation Fees", width: "200px", template: "#= kendo.toString(voidCredits, 'n') #", attributes: { style: "text-align:right;" }, footerTemplate: "Total : #= kendo.toString(sum, 'n') #" },
//                { field: "ARViolationFees", title: "A/R Violation Fees", width: "200px", template: "#= kendo.toString(voidCredits, 'n') #", attributes: { style: "text-align:right;" }, footerTemplate: "Total : #= kendo.toString(sum, 'n') #" },
//                { field: "violationFeesTotal", title: "Violation Fees Total", width: "200px", template: "#= kendo.toString(voidCredits, 'n') #", attributes: { style: "text-align:right;" }, footerTemplate: "Total : #= kendo.toString(sum, 'n') #" },
//                { field: "comments", title: "Comments", width: "200px" },
//                { field: "email1", title: "Email", width: "200px" },
//            ]
//    });
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
            //GroupedData: [],
        },
        Update: function () {
            if (!Page.ReportGrid.IsManaging)
                Page.ReportGrid.GetData(Page.ReportGrid.Render.Normal);
            else
                Page.ReportGrid.GetData(Page.ReportGrid.Render.Manageable);
        },
        GetCatalogData: function (_callback) {
            $.ajax({
                type: "GET",
                url: "GetDDCatalogsData",
                traditional: 'true',
                data: { StartDate: $("#startDate").val(), EndDate: $("#endDate").val() },
                contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                dataType: 'json',
                success: function (response) {
                    Page.ReportGrid.DataSources.StoreNumbers = response.Tables[0];
                    if (_callback != null && _callback != undefined)
                        _callback();
                },
                error: function (xhr, status, error) {
                    console.error(xhr.responseText);
                }
            });
        },
        GetData: function (_callback) {
            $.ajax({
                type: "GET",
                url: "GetDD",
                traditional: 'true',
                data: { StartDate: $("#startDate").val(), EndDate: $("#endDate").val() },
                contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                dataType: 'json',
                success: function (response) {
                    Page.ReportGrid.DataSources.MainData = response.Tables[0];
                    Page.ReportGrid.GetCatalogData(_callback);
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
                    toolbar: ["excel", "pdf"],
                    pdf: {
                        fileName: "DDReport.pdf",
                        allPages: true,
                        avoidLinks: true,
                        paperSize: "letter",
                        margin: { top: "2cm", left: "1cm", right: "1cm", bottom: "1cm" },
                        landscape: true,
                        repeatHeaders: true,
                        scale: 0.8
                    },
                    excel: {
                        fileName: "DDReport.xlsx",
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
                                    reportDate: { type: "date", editable: false },
                                    EODDeposit: { type: "number", editable: false },
                                    actualDeposit: { type: "number", editable: false },
                                    depositOver: { type: "string", editable: false },
                                    depositDate: { type: "date", editable: false },
                                    EODCreditCards: { type: "number", editable: false },
                                    actualCreditCards: { type: "number", editable: false },
                                    overCreditCards: { type: "string", editable: false },
                                    voidCredits: { type: "number", editable: false },
                                    payoutTo: { type: "string", editable: false },
                                    payoutCheck: { type: "number", editable: false },
                                    scanningViolationFees: { type: "number", editable: false },
                                    depositViolationFees: { type: "number", editable: false },
                                    ARViolationFees: { type: "number", editable: false },
                                    violationFeesTotal: { type: "number", editable: false },
                                    comments: { type: "string", editable: false },
                                    email1: { type: "string", editable: false },
                                }
                            }
                        },
                        group: {
                            field: "StoreNo", aggregates: [
                            { field: "StoreNo", aggregate: "count" },
                            { field: "EODDeposit", aggregate: "sum" },
                            { field: "actualDeposit", aggregate: "sum" },
                            { field: "EODCreditCards", aggregate: "sum" },
                            { field: "actualCreditCards", aggregate: "sum" },
                            { field: "voidCredits", aggregate: "sum" },
                            { field: "payoutCheck", aggregate: "sum" },
                            { field: "scanningViolationFees", aggregate: "sum" },
                            { field: "depositViolationFees", aggregate: "sum" },
                            { field: "ARViolationFees", aggregate: "sum" },
                            { field: "violationFeesTotal", aggregate: "sum" }]
                        },
                        aggregate: [
                            { field: "EODDeposit", aggregate: "sum" },
                            { field: "actualDeposit", aggregate: "sum" },
                            { field: "EODCreditCards", aggregate: "sum" },
                            { field: "actualCreditCards", aggregate: "sum" },
                            { field: "voidCredits", aggregate: "sum" },
                            { field: "payoutCheck", aggregate: "sum" },
                            { field: "scanningViolationFees", aggregate: "sum" },
                            { field: "depositViolationFees", aggregate: "sum" },
                            { field: "ARViolationFees", aggregate: "sum" },
                            { field: "violationFeesTotal", aggregate: "sum" }]
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
                    { field: "reportDate", title: "Report Date", width: "200px", template: "#= kendo.toString(reportDate, 'MM/dd/yyyy') #", },
                    { field: "EODDeposit", title: "EOD Deposit", width: "200px", template: "#= kendo.toString(EODDeposit, 'c') #", attributes: { style: "text-align:right;" }, footerTemplate: " Total : #= kendo.toString(sum, 'c') # ", groupFooterTemplate: " #= kendo.toString(sum, 'c') # " },
                    {
                        field: "actualDeposit", title: "Actual Deposit", width: "200px", template: "#= kendo.toString(actualDeposit, 'c') #", attributes: {
                            style: "text-align:right;"
                        }, footerTemplate: " Total : #= kendo.toString(sum, 'c') # ", groupFooterTemplate: " #= kendo.toString(sum, 'c') # "
                    },
                            {
                                field: "depositOver", title: "Deposit Over/(Short)", width: "200px"
                            },
                                {
                                    field: "depositDate", title: "Date Deposit Made", width: "200px", template: "#= (depositDate == null) ? '' : kendo.toString(depositDate, 'MM/dd/yyyy') #",
                                },
                                {
                        field: "EODCreditCards", title: "EOD Credit Cards", width: "200px", template: "#= kendo.toString(EODCreditCards, 'c') #", attributes: { style: "text-align:right;" }, footerTemplate: " Total : #= kendo.toString(sum, 'c') # ", groupFooterTemplate: " #= kendo.toString(sum, 'c') # "
                                },
                                                    {
                                                        field: "actualCreditCards", title: "Actual Credit Cards", width: "200px", template: "#= kendo.toString(actualCreditCards, 'c') #", attributes: {
                                                            style: "text-align:right;"
                        }, footerTemplate: " Total : #= kendo.toString(sum, 'c') # ", groupFooterTemplate: " #= kendo.toString(sum, 'c') # "
                                                    },
                                                { field: "overCreditCards", title: "Over/(Short) Credit Cards", width: "200px" },
                                                {
                        field: "voidCredits", title: "VOID Credits", width: "200px", template: "#= kendo.toString(voidCredits, 'c') #", attributes: { style: "text-align:right;" }, footerTemplate: " Total : #= kendo.toString(sum, 'c') # ", groupFooterTemplate: " #= kendo.toString(sum, 'c') # "
                                                },
                                    { field: "payoutTo", title: "Payout To/(From)", width: "200px" },
                                        {
                                            field: "payoutCheck", title: "Payout Check", width: "200px", template: "#= kendo.toString(payoutCheck, 'c') #", attributes: {
                                                style: "text-align:right;"
                        }, footerTemplate: " Total : #= kendo.toString(sum, 'c') # ", groupFooterTemplate: " #= kendo.toString(sum, 'c') # "
                                        },
                                        {
                                            field: "scanningViolationFees", title: "Scanning Violation Fees", width: "200px", template: "#= kendo.toString(scanningViolationFees, 'c') #", attributes: {
                                                style: "text-align:right;"
                        }, footerTemplate: " Total : #= kendo.toString(sum, 'c') # ", groupFooterTemplate: " #= kendo.toString(sum, 'c') # "
                                        },
                                            {
                                                field: "depositViolationFees", title: "Deposit Violation Fees", width: "200px", template: "#= kendo.toString(depositViolationFees, 'c') #", attributes: {
                                                    style: "text-align:right;"
                        }, footerTemplate: " Total : #= kendo.toString(sum, 'c') # ", groupFooterTemplate: " #= kendo.toString(sum, 'c') # "
                                            },
                                                    {
                                                        field: "ARViolationFees", title: "A/R Violation Fees", width: "200px", template: "#= kendo.toString(ARViolationFees, 'c') #", attributes: {
                                                            style: "text-align:right;"
                        }, footerTemplate: " Total : #= kendo.toString(sum, 'c') # ", groupFooterTemplate: " #= kendo.toString(sum, 'c') # "
                                                    },
                                                    {
                                                        field: "violationFeesTotal", title: "Violation Fees Total", width: "200px", template: "#= kendo.toString(violationFeesTotal, 'c') #", attributes: {
                                                            style: "text-align:right;"
                        }, footerTemplate: " Total : #= kendo.toString(sum, 'c') # ", groupFooterTemplate: " #= kendo.toString(sum, 'c') # "
                                                    },
                                                    {
                                                        field: "comments", title: "Comments", width: "200px"
                                                    },
                                                    {
                                                        field: "email1", title: "Email", width: "200px"
                                                    },
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
                                    StoreNo: {
                                        type: "string", editable: false
                                    },
                                    reportDate: {
                                        type: "date", editable: false
                                    },
                                    EODDeposit: { type: "number", editable: false },
                                    actualDeposit: {
                                        type: "number", editable: false
                                    },
                                    depositOver: {
                                        type: "string", editable: false
                                    },
                                    depositDate: {
                                        type: "date", editable: false
                                    },
                                    EODCreditCards: {
                                        type: "number", editable: false
                                    },
                                    actualCreditCards: {
                                        type: "number", editable: false
                                    },
                                    overCreditCards: { type: "string", editable: false },
                                    voidCredits: {
                                        type: "number", editable: false
                                    },
                                    payoutTo: {
                                        type: "string", editable: false
                                    },
                                    payoutCheck: {
                                        type: "number", editable: false
                                    },
                                    scanningViolationFees: { type: "number", editable: false },
                                    depositViolationFees: { type: "number", editable: false },
                                    ARViolationFees: {
                                        type: "number", editable: false
                                    },
                                    violationFeesTotal: {
                                        type: "number", editable: false
                                    },
                                    comments: {
                                        type: "string", editable: false
                                    },
                                    email1: {
                                        type: "string", editable: false
                                    },
                                }
                            }
                        },
                        aggregate: [
                        {
                            field: "EODDeposit", aggregate: "sum"
                        },
                        {
                            field: "actualDeposit", aggregate: "sum"
                        },
            {
                field: "EODCreditCards", aggregate: "sum"
            },
            {
                field: "actualCreditCards", aggregate: "sum"
            },
            {
                field: "voidCredits", aggregate: "sum"
            },
            {
                field: "payoutCheck", aggregate: "sum"
            },
                {
                    field: "scanningViolationFees", aggregate: "sum"
                },
                { field: "depositViolationFees", aggregate: "sum" },
                {
                    field: "ARViolationFees", aggregate: "sum"
                },
                {
                    field: "violationFeesTotal", aggregate: "sum"
                }]
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
                {
                    selectable: true, width: "50px"
                },
                            {
                                field: "StoreNo", title: "Store No", width: "100px",
                                filterable: {
                                    multi: true,
                                    dataSource: Page.ReportGrid.DataSources.StoreNumbers,
                                }
                            },
                            { field: "reportDate", title: "Report Date", width: "200px", template: "#= kendo.toString(reportDate, 'MM/dd/yyyy') #", },
                {
                    field: "EODDeposit", title: "EOD Deposit", width: "200px", template: "#= kendo.toString(EODDeposit, 'n') #", attributes: { style: "text-align:right;" }, footerTemplate: "Total : #= kendo.toString(sum, 'n') #"
                },
                {
                    field: "actualDeposit", title: "Actual Deposit", width: "200px", template: "#= kendo.toString(actualDeposit, 'n') #", attributes: {
                        style: "text-align:right;"
                    }, footerTemplate: "Total : #= kendo.toString(sum, 'n') #"
                },
        {
            field: "depositOver", title: "Deposit Over/(Short)", width: "200px"
        },
                            { field: "depositDate", title: "Date Deposit Made", width: "200px", template: "#= (depositDate == null) ? '' : kendo.toString(depositDate, 'MM/dd/yyyy') #", },
                {
                    field: "EODCreditCards", title: "EOD Credit Cards", width: "200px", template: "#= kendo.toString(EODCreditCards, 'n') #", attributes: {
                        style: "text-align:right;"
                    }, footerTemplate: "Total : #= kendo.toString(sum, 'n') #"
                },
                    {
                        field: "actualCreditCards", title: "Actual Credit Cards", width: "200px", template: "#= kendo.toString(actualCreditCards, 'n') #", attributes: { style: "text-align:right;" }, footerTemplate: "Total : #= kendo.toString(sum, 'n') #"
                    },
                {
                    field: "overCreditCards", title: "Over/(Short) Credit Cards", width: "200px"
                },
                {
                    field: "voidCredits", title: "VOID Credits", width: "200px", template: "#= kendo.toString(voidCredits, 'n') #", attributes: {
                        style: "text-align:right;"
                    }, footerTemplate: "Total : #= kendo.toString(sum, 'n') #"
                },
                            { field: "payoutTo", title: "Payout To/(From)", width: "200px" },
        {
            field: "payoutCheck", title: "Payout Check", width: "200px", template: "#= kendo.toString(payoutCheck, 'n') #", attributes: {
                style: "text-align:right;"
            }, footerTemplate: "Total : #= kendo.toString(sum, 'n') #"
        },
                {
                    field: "scanningViolationFees", title: "Scanning Violation Fees", width: "200px", template: "#= kendo.toString(scanningViolationFees, 'n') #", attributes: { style: "text-align:right;" }, footerTemplate: "Total : #= kendo.toString(sum, 'n') #"
                },
                {
                    field: "depositViolationFees", title: "Deposit Violation Fees", width: "200px", template: "#= kendo.toString(depositViolationFees, 'n') #", attributes: { style: "text-align:right;" }, footerTemplate: "Total : #= kendo.toString(sum, 'n') #"
                },
                {
                    field: "ARViolationFees", title: "A/R Violation Fees", width: "200px", template: "#= kendo.toString(ARViolationFees, 'n') #", attributes: { style: "text-align:right;" }, footerTemplate: "Total : #= kendo.toString(sum, 'n') #"
                },
                    {
                        field: "violationFeesTotal", title: "Violation Fees Total", width: "200px", template: "#= kendo.toString(violationFeesTotal, 'n') #", attributes: { style: "text-align:right;" }, footerTemplate: "Total : #= kendo.toString(sum, 'n') #"
                    },
                {
                    field: "comments", title: "Comments", width: "200px"
                },
                            { field: "email1", title: "Email", width: "200px" },
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
                                StoreNo: {
                                    type: "string"
                                },
                                reportDate: { type: "date" },
                                EODDeposit: {
                                    type: "number"
                                },
                                actualDeposit: {
                                    type: "number"
                                },
                                depositOver: {
                                    type: "string"
                                },
                                depositDate: { type: "date" },
                                EODCreditCards: {
                                    type: "number"
                                },
                                actualCreditCards: {
                                    type: "number"
                                },
                                overCreditCards: {
                                    type: "string"
                                },
                                voidCredits: {
                                    type: "number"
                                },
                                payoutTo: { type: "string" },
                                payoutCheck: {
                                    type: "number"
                                },
                                scanningViolationFees: {
                                    type: "number"
                                },
                                depositViolationFees: {
                                    type: "number"
                                },
                                ARViolationFees: {
                                    type: "number"
                                },
                                violationFeesTotal: {
                                    type: "number"
                                },
                                comments: {
                                    type: "string"
                                },
                                email1: {
                                    type: "string"
                                },
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
                            field: "StoreNo", title: "Store No", width: "140px",
                            template: '<center> <input id="txtStoreNo_#= id#" value="#= StoreNo #" type="text" class="form-control" style="color:black;height:15px;width: 80%;" /> </center>'
                        },
                        {
                            field: "reportDate", title: "Report Date", width: "140px",
                            template: ' <input id="dtReport_#= id#" class="dtpicker" value="#= kendo.toString(reportDate, "MM/dd/yyyy") #" /> ',
                        },
                        {
                            field: "EODDeposit", title: "EOD Deposit", width: "200px",
                            template: '<center> <input id="txtEODDeposit_#= id#" value="#=  kendo.toString(EODDeposit, "n") #" type="number" class="form-control" style="color:black;height:15px;width: 80%;text-align:right;" /> </center> ',
                        },
                        {
                            field: "actualDeposit", title: "Actual Deposit", width: "200px",
                            template: '<center> <input id="txtActualDeposit_#= id#" value="#=  kendo.toString(actualDeposit, "n") #" type="number" class="form-control" style="color:black;height:15px;width: 80%;text-align:right;" /> </center> ',
                        },
                        {
                            field: "depositDate", title: "Date Deposit Made", width: "140px",
                            template: ' <input id="dtDeposit_#= id#" class="dtpicker" value="#= (depositDate == null) ? "" : kendo.toString(depositDate, "MM/dd/yyyy") #" /> ',
                        },
                        {
                            field: "EODCreditCards", title: "Actual Deposit", width: "200px",
                            template: '<center> <input id="txtEODCreditCards_#= id#" value="#=  kendo.toString(EODCreditCards, "n") #" type="number" class="form-control" style="color:black;height:15px;width: 80%;text-align:right;" /> </center> ',
                        },
                        {
                            field: "actualCreditCards", title: "Actual Deposit", width: "200px",
                            template: '<center> <input id="txtActualCreditCards_#= id#" value="#=  kendo.toString(actualCreditCards, "n") #" type="number" class="form-control" style="color:black;height:15px;width: 80%;text-align:right;" /> </center> ',
                        },
                        {
                            field: "overCreditCards", title: "Over/(Short) Credit Cards", width: "200px",
                            template: '<center> <input id="txtOverCreditCards_#= id#" value="#= overCreditCards #" type="text" class="form-control" style="color:black;height:15px;width: 80%;" /> </center>'
                        },
                        {
                            field: "voidCredits", title: "VOID Credits", width: "200px",
                            template: '<center> <input id="txtVoidCredits_#= id#" value="#=  kendo.toString(voidCredits, "n") #" type="number" class="form-control" style="color:black;height:15px;width: 80%;text-align:right;" /> </center> ',
                        },
                        {
                            field: "payoutTo", title: "Payout To/(From)", width: "200px",
                            template: '<center> <input id="txtPayoutTo_#= id#" value="#= payoutTo #" type="text" class="form-control" style="color:black;height:15px;width: 80%;" /> </center>'
                        },
                        {
                            field: "payoutCheck", title: "Payout Check", width: "200px",
                            template: '<center> <input id="txtPayoutCheck_#= id#" value="#=  kendo.toString(payoutCheck, "n") #" type="number" class="form-control" style="color:black;height:15px;width: 80%;text-align:right;" /> </center> ',
                        },
                        {
                            field: "scanningViolationFees", title: "Scanning Violation Fees", width: "200px",
                            template: '<center> <input id="txtScanningViolationFees_#= id#" value="#=  kendo.toString(scanningViolationFees, "n") #" type="number" class="form-control" style="color:black;height:15px;width: 80%;text-align:right;" /> </center> ',
                        },
                        {
                            field: "depositViolationFees", title: "Deposit Violation Fees", width: "200px",
                            template: '<center> <input id="txtDepositViolationFees_#= id#" value="#=  kendo.toString(depositViolationFees, "n") #" type="number" class="form-control" style="color:black;height:15px;width: 80%;text-align:right;" /> </center> ',
                        },
                        {
                            field: "ARViolationFees", title: "A/R Violation Fees", width: "200px",
                            template: '<center> <input id="txtARViolationFees_#= id#" value="#=  kendo.toString(ARViolationFees, "n") #" type="number" class="form-control" style="color:black;height:15px;width: 80%;text-align:right;" /> </center> ',
                        },
                        {
                            field: "violationFeesTotal", title: "Violation Fees Total", width: "200px",
                            template: '<center> <input id="txtViolationFeesTotal_#= id#" value="#=  kendo.toString(violationFeesTotal, "n") #" type="number" class="form-control" style="color:black;height:15px;width: 80%;text-align:right;" /> </center> ',
                        },
                        {
                            field: "comments", title: "Comments", width: "200px",
                            template: '<center> <input id="txtComments_#= id#" value="#= comments #" type="text" class="form-control" style="color:black;height:15px;width: 80%;" /> </center>'
                        },
                        {
                            field: "email1", title: "Email", width: "200px",
                            template: '<center> <input id="txtEmail_#= id#" value="#= email1 #" type="text" class="form-control" style="color:black;height:15px;width: 80%;" /> </center>'
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
                    NewItem.reportDate = $("#dtReport_" + Item.id).val();
                    NewItem.EODDeposit = $("#txtEODDeposit_" + Item.id).val();
                    NewItem.actualDeposit = $("#txtActualDeposit_" + Item.id).val();
                    NewItem.depositDate = $("#dtDeposit_" + Item.id).val();
                    NewItem.EODCreditCards = $("#txtEODCreditCards_" + Item.id).val();
                    NewItem.actualCreditCards = $("#txtActualCreditCards_" + Item.id).val();
                    NewItem.overCreditCards = $("#txtOverCreditCards_" + Item.id).val();
                    NewItem.voidCredits = $("#txtVoidCredits_" + Item.id).val();
                    NewItem.payoutTo = $("#txtPayoutTo_" + Item.id).val();
                    NewItem.payoutCheck = $("#txtPayoutCheck_" + Item.id).val();
                    NewItem.scanningViolationFees = $("#txtScanningViolationFees_" + Item.id).val();
                    NewItem.depositViolationFees = $("#txtDepositViolationFees_" + Item.id).val();
                    NewItem.ARViolationFees = $("#txtARViolationFees_" + Item.id).val();
                    NewItem.violationFeesTotal = $("#txtViolationFeesTotal_" + Item.id).val();
                    NewItem.comments = $("#txtComments_" + Item.id).val();
                    NewItem.email1 = $("#txtEmail_" + Item.id).val();

                    ItemList.push(NewItem);
                }
                $.ajax({
                    type: "POST",
                    url: "UpdateDDRecords",
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
                    data: { Items: Items, Report: "DD" },
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