Page = {
    Initialize: function () {
        Page.Filters.GetData(Page.Filters.Render);
        Page.Filters.InitialBind();
        Page.Report.Update();

        SelectedStores = $("#cmbStores").kendoMultiSelect({
            autoClose: false
        }).data("kendoMultiSelect");

    },
    Filters: {
        SelectedStores: null,
        DataSources: {
            StoreNumbers: [],
        },
        GetData: function (_callback) {
            $.ajax({
                type: "GET",
                url: "GetStores",
                traditional: 'true',
                data: { rptName: "RECON" },
                contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                dataType: 'json',
                success: function (response) {
                    Page.Filters.DataSources.StoreNumbers = response.Tables[0];
                    if (_callback != null && _callback != undefined)
                        _callback();
                },
                error: function (xhr, status, error) {
                    console.error(xhr.responseText);
                }
            });
        },
        Render: function () {
            for (var i = 0; i < Page.Filters.DataSources.StoreNumbers.length; i++) {
                var item = Page.Filters.DataSources.StoreNumbers[i];
                $('#cmbStores').append($('<option>').text(item.StoreNo).attr('value', item.StoreNo));
            }
            $("#cmbStores").val(Page.Filters.DataSources.StoreNumbers[0].StoreNo);
            SelectedStores = $("#cmbStores").kendoMultiSelect({
                autoClose: false
            }).data("kendoMultiSelect");
            $("#cmbStores").change();

            //$.each(Page.Filters.DataSources.StoreNumbers, function (i, value) {
            //    $('#cmbStores').append($('<option>').text(value.StoreNo).attr('value', value.StoreNo));
            //});
            //$("#cmbStores").val(Page.Filters.DataSources.StoreNumbers[0].StoreNo);
        },
        InitialBind: function () {
            var CurrentDate = new Date();
            var Month = CurrentDate.getMonth();
            var Year = CurrentDate.getFullYear();
            $("#cmbMonths").val(Month + 1);
            $("#cmbYears").val(Year);
        },
    },
    Report: {
        ManagementIndexList: [],
        IsManaging: false,
        DataSources: {
            MainData: [],
            Dates: [],
        },
        Update: function () {
            if (!Page.Report.IsManaging)
                Page.Report.GetData(Page.Report.Render.NormalAll);
            //else
            //Page.Report.GetData(Page.Report.Render.Manageable);
        },
        GetData: function (_callback) {
            var storeNos = $("#cmbStores").val();
            if (storeNos == null || storeNos == undefined || storeNos == "") {
                storeNos = Page.Filters.DataSources.StoreNumbers[0].StoreNo;
            }

            $.ajax({
                type: "GET",
                url: "GetRecon",
                traditional: 'true',
                data: { StoreNos: storeNos, Month: $("#cmbMonths").val(), Year: $("#cmbYears").val() },
                contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                dataType: 'json',
                success: function (response) {
                    Page.Report.DataSources.MainData = response.Tables[0];
                    Page.Report.DataSources.Dates = response.Tables[1];
                    if (_callback != null && _callback != undefined)
                        _callback();
                },
                error: function (xhr, status, error) {
                    console.error(xhr.responseText);
                }
            });
        },
        Render: {
            NormalAll: function () {
                //$("#btnExport").show();
                $("#grid").html('');
                var Dates = Page.Report.DataSources.Dates[0];
                var localHtml = '';

                //GLOBAL WRAPPER DIV
                localHtml += '<div class="row" id="GlobalDiv">';

                for (var i = 0; i < Page.Report.DataSources.MainData.length; i++) {
                    var item = Page.Report.DataSources.MainData[i];

                    localHtml += '<hr/>';
                    localHtml += '<hr/>';

                    localHtml += '<div class="row">';

                    localHtml += '  <div class="col-md-4">';
                    localHtml += '  </div>';

                    localHtml += '  <div class="col-md-2 ExportDataControls_' + i + '">';
                    if (CanManage) {
                        localHtml += '<button class="btn btn-block btn-warning" onclick="javascript: Page.Report.Manage(' + i + ');">';
                        localHtml += '<i class="glyphicon glyphicon-pencil"></i>  Manage Data';
                        localHtml += '</button>';
                    }
                    localHtml += '  </div>';

                    localHtml += '  <div class="col-md-2 ExportDataControls_' + i + '">';
                    localHtml += '    <button class="btn btn-block btn-success" onclick="javascript: Page.Report.Export.Download(Page.Report.Export.Types.PDF,' + i + ');">';
                    localHtml += '    <i class="glyphicon glyphicon-export"></i>  Export to <b>PDF</b>';
                    localHtml += '    </button>';
                    localHtml += '  </div>';

                    localHtml += '  <div class="col-md-2 ManageDataControls_' + i + '"  style="display:none">';
                    if (CanManage) {
                        localHtml += '<button class="btn btn-block btn-warning" onclick="javascript: Page.Report.Manage(' + i + ');">';
                        localHtml += '<i class="glyphicon glyphicon-remove"></i>  Discard Changes';
                        localHtml += '</button>';
                    }
                    localHtml += '  </div>';

                    localHtml += '  <div class="col-md-2 ManageDataControls_' + i + '"  style="display:none">';
                    if (CanManage) {
                        localHtml += '<button class="btn btn-block btn-success" onclick="javascript: Page.Report.Save(' + i + ');">';
                        localHtml += '<i class="glyphicon glyphicon-floppy-save"></i>  Save Edited Data';
                        localHtml += '</button>';
                    }
                    localHtml += '  </div>';



                    localHtml += '  <div class="col-md-2 ManageDataControls_' + i + '"  style="display:none">';
                    if (CanDelete) {
                        localHtml += '<button class="btn btn-block btn-danger" onclick="javascript: Page.Report.Delete(' + i + ');">';
                        localHtml += '<i class="glyphicon glyphicon-trash"></i>  Delete Data';
                        localHtml += '</button>';
                    }
                    localHtml += '  </div>';
                    localHtml += '</div>';

                    //ITEM WRAPPER DIV
                    localHtml += '<div class="exportable-content" id="StoreMainDiv_' + i + '">';

                    //ROW HEADERf
                    localHtml += '<div class="row">';
                    localHtml += '<h3>Fiesta Insurance Franchise Corp.</h3>';
                    localHtml += '<h3>Franchise Monthly Reconciliation.</h3>';
                    localHtml += '<h3>From ' + Dates.startDate + ' to ' + Dates.endDate + '</h3>';
                    localHtml += '</div>';

                    //ROW STORE
                    localHtml += '<div class="row">';
                    localHtml += '<h4>Store ' + item.storeNo + '</h4>';
                    localHtml += '</div>';

                    //BEGIN: MAIN ROW
                    localHtml += '<div class="row">';



                    //BEGIN: SECTION REVENUE
                    localHtml += '  <div class="col-md-5">';

                    //GROSS COMMISSIONS
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Gross Commissions </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.grossCommisions, "n") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';

                    //TOTAL COMMMISIONS TIER 1
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Total Commmisions ' + kendo.toString(item.commissionsPercentTier1, "n") + ' </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.commissionsTier1, "n") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';

                    if (item.commisionsTier2 != 0) {
                        //TOTAL COMMMISIONS TIER 2
                        localHtml += '      <div class="row">';
                        localHtml += '          <div class="col-md-8">';
                        localHtml += '              <label> Total Commmisions ' + kendo.toString(item.commissionsPercentTier2, "n") + ' </label>';
                        localHtml += '          </div>';
                        localHtml += '          <div class="label-value col-md-3">';
                        localHtml += '              <b><label>' + kendo.toString(item.commisionsTier2, "n") + '</label></b>';
                        localHtml += '          </div>';
                        localHtml += '      </div>';
                    }

                    //TAX PREPARATION REVENUE
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Tax Preparation Revenue </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.taxPrepRevenue, "n") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';

                    //LESS: TAX ROYALTIES
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Less: Tax Royalties (' + item.numberOfTaxReturns + ' x ' + item.royaltyPerReturn + ')</label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.taxRoyalties, "n") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';


                    //TAX PREPARATION REVENUE
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <b><label> Total Revenue </label></b>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.totalRevenue, "c") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';

                    //END: SECTION REVENUE
                    localHtml += '  </div>';

                    localHtml += '  <div class="col-md-5">';

                    //BEGIN: SECTION EXPENSES
                    localHtml += '<h4>Expenses </h4>';

                    //HOURLY WAGES
                    if (item.hourlyWages != 0) {
                        localHtml += '      <div class="row">';
                        localHtml += '          <div class="col-md-8">';
                        localHtml += '              <label> Hourly Wages </label>';
                        localHtml += '          </div>';
                        localHtml += '          <div class="label-value col-md-3">';
                        localHtml += '              <b><label>' + kendo.toString(item.hourlyWages, "n") + '</label></b>';
                        localHtml += '          </div>';
                        localHtml += '      </div>';
                    }

                    //OVERTIME
                    if (item.overtime != 0) {
                        localHtml += '      <div class="row">';
                        localHtml += '          <div class="col-md-8">';
                        localHtml += '              <label> Overtime </label>';
                        localHtml += '          </div>';
                        localHtml += '          <div class="label-value col-md-3">';
                        localHtml += '              <b><label>' + kendo.toString(item.overtime, "n") + '</label></b>';
                        localHtml += '          </div>';
                        localHtml += '      </div>';
                    }

                    //BONUS & COMMISSIONS
                    if (item.bonusAndCommisions != 0) {
                        localHtml += '      <div class="row">';
                        localHtml += '          <div class="col-md-8">';
                        localHtml += '              <label> Bonus & Commissions </label>';
                        localHtml += '          </div>';
                        localHtml += '          <div class="label-value col-md-3">';
                        localHtml += '              <b><label>' + kendo.toString(item.bonusAndCommisions, "n") + '</label></b>';
                        localHtml += '          </div>';
                        localHtml += '      </div>';
                    }

                    //PAYROLL TAXES - ER
                    if (item.payrollTaxes_ER != 0) {
                        localHtml += '      <div class="row">';
                        localHtml += '          <div class="col-md-8">';
                        localHtml += '              <label> Payroll Taxes - ER </label>';
                        localHtml += '          </div>';
                        localHtml += '          <div class="label-value col-md-3">';
                        localHtml += '              <b><label>' + kendo.toString(item.payrollTaxes_ER, "n") + '</label></b>';
                        localHtml += '          </div>';
                        localHtml += '      </div>';
                    }

                    //WORKERS COMP INSURANCE
                    if (item.workersCompInsurance != 0) {
                        localHtml += '      <div class="row">';
                        localHtml += '          <div class="col-md-8">';
                        localHtml += '              <label> Workers Comp Insurance </label>';
                        localHtml += '          </div>';
                        localHtml += '          <div class="label-value col-md-3">';
                        localHtml += '              <b><label>' + kendo.toString(item.workersCompInsurance, "n") + '</label></b>';
                        localHtml += '          </div>';
                        localHtml += '      </div>';
                    }

                    //PAYROLL PROCESSING FEES
                    if (item.payrollProcessingFee != 0) {
                        localHtml += '      <div class="row">';
                        localHtml += '          <div class="col-md-8">';
                        localHtml += '              <label> Payroll Processing Fees </label>';
                        localHtml += '          </div>';
                        localHtml += '          <div class="label-value col-md-3">';
                        localHtml += '              <b><label>' + kendo.toString(item.payrollProcessingFee, "n") + '</label></b>';
                        localHtml += '          </div>';
                        localHtml += '      </div>';
                    }

                    //POLICY MANAGER
                    if (item.policyManager != 0) {
                        localHtml += '      <div class="row">';
                        localHtml += '          <div class="col-md-8">';
                        localHtml += '              <label> Policy Manager </label>';
                        localHtml += '          </div>';
                        localHtml += '          <div class="label-value col-md-3">';
                        localHtml += '              <b><label>' + kendo.toString(item.policyManager, "n") + '</label></b>';
                        localHtml += '          </div>';
                        localHtml += '      </div>';
                    }

                    //LICENSES AND PERMITS
                    if ((item.Licenses_Permits) != 0) {
                        localHtml += '      <div class="row">';
                        localHtml += '          <div class="col-md-8">';
                        localHtml += '              <label> Licenses and Permits </label>';
                        localHtml += '          </div>';
                        localHtml += '          <div class="label-value col-md-3">';
                        localHtml += '              <b><label>' + kendo.toString((item.Licenses_and_Permits + item.Licenses_Permits), "n") + '</label></b>';
                        localHtml += '          </div>';
                        localHtml += '      </div>';
                    }

                    //RATING SOFTWARE
                    if (item.ratingSoftware != 0) {
                        localHtml += '      <div class="row">';
                        localHtml += '          <div class="col-md-8">';
                        localHtml += '              <label> Rating Software </label>';
                        localHtml += '          </div>';
                        localHtml += '          <div class="label-value col-md-3">';
                        localHtml += '              <b><label>' + kendo.toString(item.ratingSoftware, "n") + '</label></b>';
                        localHtml += '          </div>';
                        localHtml += '      </div>';
                    }

                    //MOTOR VEHICLE REPORTS
                    if (item.motorVehicleReport != 0) {
                        localHtml += '      <div class="row">';
                        localHtml += '          <div class="col-md-8">';
                        localHtml += '              <label> Motor Vehicle Reports </label>';
                        localHtml += '          </div>';
                        localHtml += '          <div class="label-value col-md-3">';
                        localHtml += '              <b><label>' + kendo.toString(item.motorVehicleReport, "n") + '</label></b>';
                        localHtml += '          </div>';
                        localHtml += '      </div>';
                    }

                    //LOANS DUE FROM FRANCHISEE
                    if (item.loanDueFromFranchisee != 0) {
                        localHtml += '      <div class="row">';
                        localHtml += '          <div class="col-md-8">';
                        localHtml += '              <label> Loans due from Franchisee </label>';
                        localHtml += '          </div>';
                        localHtml += '          <div class="label-value col-md-3">';
                        localHtml += '              <b><label>' + kendo.toString(item.loanDueFromFranchisee, "n") + '</label></b>';
                        localHtml += '          </div>';
                        localHtml += '      </div>';
                    }

                    //MINIMUM ROYALTY FEE
                    if (item.minimumRoyaltyFee != 0) {
                        localHtml += '      <div class="row">';
                        localHtml += '          <div class="col-md-8">';
                        localHtml += '              <label> Minimum Royalty Fee </label>';
                        localHtml += '          </div>';
                        localHtml += '          <div class="label-value col-md-3">';
                        localHtml += '              <b><label>' + kendo.toString(item.minimumRoyaltyFee, "n") + '</label></b>';
                        localHtml += '          </div>';
                        localHtml += '      </div>';
                    }

                    //SERVICING FEE
                    if (item.servicingFee != 0) {
                        localHtml += '      <div class="row">';
                        localHtml += '          <div class="col-md-8">';
                        localHtml += '              <label> Servicing Fee </label>';
                        localHtml += '          </div>';
                        localHtml += '          <div class="label-value col-md-3">';
                        localHtml += '              <b><label>' + kendo.toString(item.servicingFee, "n") + '</label></b>';
                        localHtml += '          </div>';
                        localHtml += '      </div>';
                    }

                    //TRADE SHOWS
                    if (item.tradeShows != 0) {
                        localHtml += '      <div class="row">';
                        localHtml += '          <div class="col-md-8">';
                        localHtml += '              <label> Trade Shows </label>';
                        localHtml += '          </div>';
                        localHtml += '          <div class="label-value col-md-3">';
                        localHtml += '              <b><label>' + kendo.toString(item.tradeShows, "n") + '</label></b>';
                        localHtml += '          </div>';
                        localHtml += '      </div>';
                    }

                    //TRUST ACCTG - A/R
                    if (item.trustAccountingAR != 0) {
                        localHtml += '      <div class="row">';
                        localHtml += '          <div class="col-md-8">';
                        localHtml += '              <label> Trust Acctg - A/R </label>';
                        localHtml += '          </div>';
                        localHtml += '          <div class="label-value col-md-3">';
                        localHtml += '              <b><label>' + kendo.toString(item.trustAccountingAR, "n") + '</label></b>';
                        localHtml += '          </div>';
                        localHtml += '      </div>';
                    }

                    //TELEPHONE
                    if (item.telephone != 0) {
                        localHtml += '      <div class="row">';
                        localHtml += '          <div class="col-md-8">';
                        localHtml += '              <label> Telephone </label>';
                        localHtml += '          </div>';
                        localHtml += '          <div class="label-value col-md-3">';
                        localHtml += '              <b><label>' + kendo.toString(item.telephone, "n") + '</label></b>';
                        localHtml += '          </div>';
                        localHtml += '      </div>';
                    }

                    //POSTAGE
                    if (item.postage != 0) {
                        localHtml += '      <div class="row">';
                        localHtml += '          <div class="col-md-8">';
                        localHtml += '              <label> Postage </label>';
                        localHtml += '          </div>';
                        localHtml += '          <div class="label-value col-md-3">';
                        localHtml += '              <b><label>' + kendo.toString(item.postage, "n") + '</label></b>';
                        localHtml += '          </div>';
                        localHtml += '      </div>';
                    }

                    //TELEVISION/RADIO
                    if (item.televisionRadio != 0) {
                        localHtml += '      <div class="row">';
                        localHtml += '          <div class="col-md-8">';
                        localHtml += '              <label> Television/Radio </label>';
                        localHtml += '          </div>';
                        localHtml += '          <div class="label-value col-md-3">';
                        localHtml += '              <b><label>' + kendo.toString(item.televisionRadio, "n") + '</label></b>';
                        localHtml += '          </div>';
                        localHtml += '      </div>';
                    }

                    //TRUST ACCT SHORTAGE/OVERAGE
                    if (item.trustAcctShortageOverage != 0) {
                        localHtml += '      <div class="row">';
                        localHtml += '          <div class="col-md-8">';
                        localHtml += '              <label> Trust Acct Shortage/Overage </label>';
                        localHtml += '          </div>';
                        localHtml += '          <div class="label-value col-md-3">';
                        localHtml += '              <b><label>' + kendo.toString(item.trustAcctShortageOverage, "n") + '</label></b>';
                        localHtml += '          </div>';
                        localHtml += '      </div>';
                    }

                    //INTERNET
                    if (item.internet != 0) {
                        localHtml += '      <div class="row">';
                        localHtml += '          <div class="col-md-8">';
                        localHtml += '              <label> Internet </label>';
                        localHtml += '          </div>';
                        localHtml += '          <div class="label-value col-md-3">';
                        localHtml += '              <b><label>' + kendo.toString(item.internet, "n") + '</label></b>';
                        localHtml += '          </div>';
                        localHtml += '      </div>';
                    }

                    //ON HOLD RECORDING
                    if (item.onHoldRecording != 0) {
                        localHtml += '      <div class="row">';
                        localHtml += '          <div class="col-md-8">';
                        localHtml += '              <label> On Hold Recording </label>';
                        localHtml += '          </div>';
                        localHtml += '          <div class="label-value col-md-3">';
                        localHtml += '              <b><label>' + kendo.toString(item.onHoldRecording, "n") + '</label></b>';
                        localHtml += '          </div>';
                        localHtml += '      </div>';
                    }

                    //ACCTG - SCANNING VIOLATION PENALTIES
                    if (item.scanningViolationPenalty != 0) {
                        localHtml += '      <div class="row">';
                        localHtml += '          <div class="col-md-8">';
                        localHtml += '              <label> Acctg - Scanning Violation Penalties </label>';
                        localHtml += '          </div>';
                        localHtml += '          <div class="label-value col-md-3">';
                        localHtml += '              <b><label>' + kendo.toString(item.scanningViolationPenalty, "n") + '</label></b>';
                        localHtml += '          </div>';
                        localHtml += '      </div>';
                    }

                    //ACCTG - DEPOSIT VIOLATION PENALTIES
                    if (item.depositViolationPenalty != 0) {
                        localHtml += '      <div class="row">';
                        localHtml += '          <div class="col-md-8">';
                        localHtml += '              <label> Acctg - Deposit Violation Penalties </label>';
                        localHtml += '          </div>';
                        localHtml += '          <div class="label-value col-md-3">';
                        localHtml += '              <b><label>' + kendo.toString(item.depositViolationPenalty, "n") + '</label></b>';
                        localHtml += '          </div>';
                        localHtml += '      </div>';
                    }

                    //BAD DEBTS
                    if (item.badDebts != 0) {
                        localHtml += '      <div class="row">';
                        localHtml += '          <div class="col-md-8">';
                        localHtml += '              <label> Bad Debts </label>';
                        localHtml += '          </div>';
                        localHtml += '          <div class="label-value col-md-3">';
                        localHtml += '              <b><label>' + kendo.toString(item.badDebts, "n") + '</label></b>';
                        localHtml += '          </div>';
                        localHtml += '      </div>';
                    }

                    //PRINT
                    if (item.printRT != 0) {
                        localHtml += '      <div class="row">';
                        localHtml += '          <div class="col-md-8">';
                        localHtml += '              <label> Print </label>';
                        localHtml += '          </div>';
                        localHtml += '          <div class="label-value col-md-3">';
                        localHtml += '              <b><label>' + kendo.toString(item.printRT, "n") + '</label></b>';
                        localHtml += '          </div>';
                        localHtml += '      </div>';
                    }

                    //REIMBURSED FEES - OTHER
                    if (item.reimbursedFeeOther != 0) {
                        localHtml += '      <div class="row">';
                        localHtml += '          <div class="col-md-8">';
                        localHtml += '              <label> Reimbursed Fees - Other </label>';
                        localHtml += '          </div>';
                        localHtml += '          <div class="label-value col-md-3">';
                        localHtml += '              <b><label>' + kendo.toString(item.reimbursedFeeOther, "n") + '</label></b>';
                        localHtml += '          </div>';
                        localHtml += '      </div>';
                    }

                    //GAS
                    if (item.gas != 0) {
                        localHtml += '      <div class="row">';
                        localHtml += '          <div class="col-md-8">';
                        localHtml += '              <label> Gas </label>';
                        localHtml += '          </div>';
                        localHtml += '          <div class="label-value col-md-3">';
                        localHtml += '              <b><label>' + kendo.toString(item.gas, "n") + '</label></b>';
                        localHtml += '          </div>';
                        localHtml += '      </div>';
                    }

                    //D&S MEMBERSHIPS
                    if (item.DAndSMembership != 0) {
                        localHtml += '      <div class="row">';
                        localHtml += '          <div class="col-md-8">';
                        localHtml += '              <label> D&S Memberships </label>';
                        localHtml += '          </div>';
                        localHtml += '          <div class="label-value col-md-3">';
                        localHtml += '              <b><label>' + kendo.toString(item.DAndSMembership, "n") + '</label></b>';
                        localHtml += '          </div>';
                        localHtml += '      </div>';
                    }

                    //E&O INSURANCE
                    if (item.EAndOInsurance != 0) {
                        localHtml += '      <div class="row">';
                        localHtml += '          <div class="col-md-8">';
                        localHtml += '              <label> E&O Insurance </label>';
                        localHtml += '          </div>';
                        localHtml += '          <div class="label-value col-md-3">';
                        localHtml += '              <b><label>' + kendo.toString(item.EAndOInsurance, "n") + '</label></b>';
                        localHtml += '          </div>';
                        localHtml += '      </div>';
                    }

                    //BASIC RENT
                    if (item.rent != 0) {
                        localHtml += '      <div class="row">';
                        localHtml += '          <div class="col-md-8">';
                        localHtml += '              <label> Basic Rent </label>';
                        localHtml += '          </div>';
                        localHtml += '          <div class="label-value col-md-3">';
                        localHtml += '              <b><label>' + kendo.toString(item.rent, "n") + '</label></b>';
                        localHtml += '          </div>';
                        localHtml += '      </div>';
                    }

                    //BASIC SUPPLIES
                    if (item.supplies != 0) {
                        localHtml += '      <div class="row">';
                        localHtml += '          <div class="col-md-8">';
                        localHtml += '              <label> Basic Supplies </label>';
                        localHtml += '          </div>';
                        localHtml += '          <div class="label-value col-md-3">';
                        localHtml += '              <b><label>' + kendo.toString(item.supplies, "n") + '</label></b>';
                        localHtml += '          </div>';
                        localHtml += '      </div>';
                    }

                    //BUILDING/OFFICE
                    if (item.buildingOrOffice != 0) {
                        localHtml += '      <div class="row">';
                        localHtml += '          <div class="col-md-8">';
                        localHtml += '              <label> Building/Office </label>';
                        localHtml += '          </div>';
                        localHtml += '          <div class="label-value col-md-3">';
                        localHtml += '              <b><label>' + kendo.toString(item.buildingOrOffice, "n") + '</label></b>';
                        localHtml += '          </div>';
                        localHtml += '      </div>';
                    }

                    //REFERRAL FEES
                    if (item.referralFee != 0) {
                        localHtml += '      <div class="row">';
                        localHtml += '          <div class="col-md-8">';
                        localHtml += '              <label> Referral Fees </label>';
                        localHtml += '          </div>';
                        localHtml += '          <div class="label-value col-md-3">';
                        localHtml += '              <b><label>' + kendo.toString(item.referralFee, "n") + '</label></b>';
                        localHtml += '          </div>';
                        localHtml += '      </div>';
                    }

                    //SMALL EQUIP PURCHASES UNDER $500
                    if (item.smallEquipPurchases != 0) {
                        localHtml += '      <div class="row">';
                        localHtml += '          <div class="col-md-8">';
                        localHtml += '              <label> Small Equip Purchases Under $500 </label>';
                        localHtml += '          </div>';
                        localHtml += '          <div class="label-value col-md-3">';
                        localHtml += '              <b><label>' + kendo.toString(item.smallEquipPurchases, "n") + '</label></b>';
                        localHtml += '          </div>';
                        localHtml += '      </div>';
                    }

                    //SMALL FF&E UNDER $500
                    if (item.smallFFAndE != 0) {
                        localHtml += '      <div class="row">';
                        localHtml += '          <div class="col-md-8">';
                        localHtml += '              <label> Small FF&E Under $500 </label>';
                        localHtml += '          </div>';
                        localHtml += '          <div class="label-value col-md-3">';
                        localHtml += '              <b><label>' + kendo.toString(item.smallFFAndE, "n") + '</label></b>';
                        localHtml += '          </div>';
                        localHtml += '      </div>';
                    }

                    //LEGAL FEES
                    if (item.legalFee != 0) {
                        localHtml += '      <div class="row">';
                        localHtml += '          <div class="col-md-8">';
                        localHtml += '              <label> Legal Fees </label>';
                        localHtml += '          </div>';
                        localHtml += '          <div class="label-value col-md-3">';
                        localHtml += '              <b><label>' + kendo.toString(item.legalFee, "n") + '</label></b>';
                        localHtml += '          </div>';
                        localHtml += '      </div>';
                    }

                    //CAM CHARGES
                    if (item.camCharges != 0) {
                        localHtml += '      <div class="row">';
                        localHtml += '          <div class="col-md-8">';
                        localHtml += '              <label> CAM Charges </label>';
                        localHtml += '          </div>';
                        localHtml += '          <div class="label-value col-md-3">';
                        localHtml += '              <b><label>' + kendo.toString(item.camCharges, "n") + '</label></b>';
                        localHtml += '          </div>';
                        localHtml += '      </div>';
                    }

                    //CELL PHONE
                    if (item.cellphone != 0) {
                        localHtml += '      <div class="row">';
                        localHtml += '          <div class="col-md-8">';
                        localHtml += '              <label> Cell Phone </label>';
                        localHtml += '          </div>';
                        localHtml += '          <div class="label-value col-md-3">';
                        localHtml += '              <b><label>' + kendo.toString(item.cellphone, "n") + '</label></b>';
                        localHtml += '          </div>';
                        localHtml += '      </div>';
                    }

                    //SECURITY
                    if (item.securityRT != 0) {
                        localHtml += '      <div class="row">';
                        localHtml += '          <div class="col-md-8">';
                        localHtml += '              <label> Security </label>';
                        localHtml += '          </div>';
                        localHtml += '          <div class="label-value col-md-3">';
                        localHtml += '              <b><label>' + kendo.toString(item.securityRT, "n") + '</label></b>';
                        localHtml += '          </div>';
                        localHtml += '      </div>';
                    }

                    //ELECTRICITY
                    if (item.electricity != 0) {
                        localHtml += '      <div class="row">';
                        localHtml += '          <div class="col-md-8">';
                        localHtml += '              <label> Electricity </label>';
                        localHtml += '          </div>';
                        localHtml += '          <div class="label-value col-md-3">';
                        localHtml += '              <b><label>' + kendo.toString(item.electricity, "n") + '</label></b>';
                        localHtml += '          </div>';
                        localHtml += '      </div>';
                    }

                    //ACCTG - ACCOUNTING VIOLATION PENALTIES
                    if (item.accountingViolationPenalty != 0) {
                        localHtml += '      <div class="row">';
                        localHtml += '          <div class="col-md-8">';
                        localHtml += '              <label> Acctg - Accounting Violation Penalties </label>';
                        localHtml += '          </div>';
                        localHtml += '          <div class="label-value col-md-3">';
                        localHtml += '              <b><label>' + kendo.toString(item.accountingViolationPenalty, "n") + '</label></b>';
                        localHtml += '          </div>';
                        localHtml += '      </div>';
                    }

                    //ADVERTISING
                    if (item.advertising != 0) {
                        localHtml += '      <div class="row">';
                        localHtml += '          <div class="col-md-8">';
                        localHtml += '              <label> Advertising </label>';
                        localHtml += '          </div>';
                        localHtml += '          <div class="label-value col-md-3">';
                        localHtml += '              <b><label>' + kendo.toString(item.advertising, "n") + '</label></b>';
                        localHtml += '          </div>';
                        localHtml += '      </div>';
                    }

                    //APPOINTMENT FEES
                    if (item.DOIAppointmentFee != 0) {
                        localHtml += '      <div class="row">';
                        localHtml += '          <div class="col-md-8">';
                        localHtml += '              <label> Appointment Fees </label>';
                        localHtml += '          </div>';
                        localHtml += '          <div class="label-value col-md-3">';
                        localHtml += '              <b><label>' + kendo.toString(item.DOIAppointmentFee, "n") + '</label></b>';
                        localHtml += '          </div>';
                        localHtml += '      </div>';
                    }

                    //ARROW PROTECTION
                    if (item.notes != 0) {
                        localHtml += '      <div class="row">';
                        localHtml += '          <div class="col-md-8">';
                        localHtml += '              <label> Arrow Protection </label>';
                        localHtml += '          </div>';
                        localHtml += '          <div class="label-value col-md-3">';
                        localHtml += '              <b><label>' + kendo.toString(item.notes, "n") + '</label></b>';
                        localHtml += '          </div>';
                        localHtml += '      </div>';
                    }

                    //DOI LICENSE FEE
                    if (item.DOILicenseFee != 0) {
                        localHtml += '      <div class="row">';
                        localHtml += '          <div class="col-md-8">';
                        localHtml += '              <label> DOI License Fee </label>';
                        localHtml += '          </div>';
                        localHtml += '          <div class="label-value col-md-3">';
                        localHtml += '              <b><label>' + kendo.toString(item.DOILicenseFee, "n") + '</label></b>';
                        localHtml += '          </div>';
                        localHtml += '      </div>';
                    }

                    //ENTREPRENEUR MAGAZINE
                    if (item.entrepreneurMagazine != 0) {
                        localHtml += '      <div class="row">';
                        localHtml += '          <div class="col-md-8">';
                        localHtml += '              <label> Entrepreneur Magazine </label>';
                        localHtml += '          </div>';
                        localHtml += '          <div class="label-value col-md-3">';
                        localHtml += '              <b><label>' + kendo.toString(item.entrepreneurMagazine, "n") + '</label></b>';
                        localHtml += '          </div>';
                        localHtml += '      </div>';
                    }

                    //FRANCHISE GATOR LEADS
                    if (item.franchiseGratorLeads != 0) {
                        localHtml += '      <div class="row">';
                        localHtml += '          <div class="col-md-8">';
                        localHtml += '              <label> Franchise Gator Leads </label>';
                        localHtml += '          </div>';
                        localHtml += '          <div class="label-value col-md-3">';
                        localHtml += '              <b><label>' + kendo.toString(item.franchiseGratorLeads, "n") + '</label></b>';
                        localHtml += '          </div>';
                        localHtml += '      </div>';
                    }

                    //FRANCHISE GUIDE SUPPLIES
                    if (item.franchiseGuideSupplies != 0) {
                        localHtml += '      <div class="row">';
                        localHtml += '          <div class="col-md-8">';
                        localHtml += '              <label> Franchise Guide Supplies </label>';
                        localHtml += '          </div>';
                        localHtml += '          <div class="label-value col-md-3">';
                        localHtml += '              <b><label>' + kendo.toString(item.franchiseGuideSupplies, "n") + '</label></b>';
                        localHtml += '          </div>';
                        localHtml += '      </div>';
                    }

                    //FRANCHISE TIMES MAGAZINE
                    if (item.franchiseTimeMagazine != 0) {
                        localHtml += '      <div class="row">';
                        localHtml += '          <div class="col-md-8">';
                        localHtml += '              <label> Franchise Times Magazine </label>';
                        localHtml += '          </div>';
                        localHtml += '          <div class="label-value col-md-3">';
                        localHtml += '              <b><label>' + kendo.toString(item.franchiseTimeMagazine, "n") + '</label></b>';
                        localHtml += '          </div>';
                        localHtml += '      </div>';
                    }

                    //LEADS
                    if (item.leads != 0) {
                        localHtml += '      <div class="row">';
                        localHtml += '          <div class="col-md-8">';
                        localHtml += '              <label> Leads </label>';
                        localHtml += '          </div>';
                        localHtml += '          <div class="label-value col-md-3">';
                        localHtml += '              <b><label>' + kendo.toString(item.leads, "n") + '</label></b>';
                        localHtml += '          </div>';
                        localHtml += '      </div>';
                    }

                    //SEO (SEARCH ENGINE OPTIMIZATION)
                    if (item.SEO != 0) {
                        localHtml += '      <div class="row">';
                        localHtml += '          <div class="col-md-8">';
                        localHtml += '              <label> SEO (Search Engine Optimization) </label>';
                        localHtml += '          </div>';
                        localHtml += '          <div class="label-value col-md-3">';
                        localHtml += '              <b><label>' + kendo.toString(item.SEO, "n") + '</label></b>';
                        localHtml += '          </div>';
                        localHtml += '      </div>';
                    }

                    //RENEWAL FEE
                    if (item.renewalFee != 0) {
                        localHtml += '      <div class="row">';
                        localHtml += '          <div class="col-md-8">';
                        localHtml += '              <label> Renewal Fee </label>';
                        localHtml += '          </div>';
                        localHtml += '          <div class="label-value col-md-3">';
                        localHtml += '              <b><label>' + kendo.toString(item.renewalFee, "n") + '</label></b>';
                        localHtml += '          </div>';
                        localHtml += '      </div>';
                    }

                    //INCENTIVE
                    if (item.incentive != 0) {
                        localHtml += '      <div class="row">';
                        localHtml += '          <div class="col-md-8">';
                        localHtml += '              <label> Incentive </label>';
                        localHtml += '          </div>';
                        localHtml += '          <div class="label-value col-md-3">';
                        localHtml += '              <b><label>' + kendo.toString(item.incentive, "n") + '</label></b>';
                        localHtml += '          </div>';
                        localHtml += '      </div>';
                    }

                    //MAX SHIELD
                    if (item.maxShield != 0) {
                        localHtml += '      <div class="row">';
                        localHtml += '          <div class="col-md-8">';
                        localHtml += '              <label> Max Shield </label>';
                        localHtml += '          </div>';
                        localHtml += '          <div class="label-value col-md-3">';
                        localHtml += '              <b><label>' + kendo.toString(item.maxShield, "n") + '</label></b>';
                        localHtml += '          </div>';
                        localHtml += '      </div>';
                    }

                    //END: SECTION EXPENSES

                    //BEGIN: SECTION TOTALS
                    localHtml += '</br> </br>';

                    //TOTAL DEDUCTIONS
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Total Deductions </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.totalDeductions, "c") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';

                    //PREVIOUS UNPAID BALANCE
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Previous Unpaid Balance </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.previousUnpaidBalanace, "c") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';

                    //BALANCE DUE TO/(FROM) FRANCHISE
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Balance Due To/(From) Franchise </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.balanceDueToOrFromFranchise, "c") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';

                    localHtml += '  </div>';
                    //END: SECTION TOTALS

                    //END: MAIN ROW
                    localHtml += '</div>';

                    //END: ITEM WRAPPER DIV
                    localHtml += '</div>';

                }

                $("#grid").append(localHtml);
                localHtml += '</div>';

            },
            Normal: function (index) {
                $("#StoreMainDiv_" + index).html('');
                var localHtml = '';
                var item = Page.Report.DataSources.MainData[index];
                var Dates = Page.Report.DataSources.Dates[0];
                //ROW HEADERf
                localHtml += '<div class="row">';
                localHtml += '<h3>Fiesta Insurance Franchise Corp.</h3>';
                localHtml += '<h3>Franchise Monthly Reconciliation.</h3>';
                localHtml += '<h3>From ' + Dates.startDate + ' to ' + Dates.endDate + '</h3>';
                localHtml += '</div>';

                //ROW STORE
                localHtml += '<div class="row">';
                localHtml += '<h4>Store ' + item.storeNo + '</h4>';
                localHtml += '</div>';

                //BEGIN: MAIN ROW
                localHtml += '<div class="row">';



                //BEGIN: SECTION REVENUE
                localHtml += '  <div class="col-md-5">';

                //GROSS COMMISSIONS
                localHtml += '      <div class="row">';
                localHtml += '          <div class="col-md-8">';
                localHtml += '              <label> Gross Commissions </label>';
                localHtml += '          </div>';
                localHtml += '          <div class="label-value col-md-3">';
                localHtml += '              <b><label>' + kendo.toString(item.grossCommisions, "n") + '</label></b>';
                localHtml += '          </div>';
                localHtml += '      </div>';

                //TOTAL COMMMISIONS TIER 1
                localHtml += '      <div class="row">';
                localHtml += '          <div class="col-md-8">';
                localHtml += '              <label> Total Commmisions ' + kendo.toString(item.commissionsPercentTier1, "n") + ' </label>';
                localHtml += '          </div>';
                localHtml += '          <div class="label-value col-md-3">';
                localHtml += '              <b><label>' + kendo.toString(item.commissionsTier1, "n") + '</label></b>';
                localHtml += '          </div>';
                localHtml += '      </div>';

                if (item.commisionsTier2 != 0) {
                    //TOTAL COMMMISIONS TIER 2
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Total Commmisions ' + kendo.toString(item.commissionsPercentTier2, "n") + ' </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.commisionsTier2, "n") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';
                }

                //TAX PREPARATION REVENUE
                localHtml += '      <div class="row">';
                localHtml += '          <div class="col-md-8">';
                localHtml += '              <label> Tax Preparation Revenue </label>';
                localHtml += '          </div>';
                localHtml += '          <div class="label-value col-md-3">';
                localHtml += '              <b><label>' + kendo.toString(item.taxPrepRevenue, "n") + '</label></b>';
                localHtml += '          </div>';
                localHtml += '      </div>';

                //LESS: TAX ROYALTIES
                localHtml += '      <div class="row">';
                localHtml += '          <div class="col-md-8">';
                localHtml += '              <label> Less: Tax Royalties (' + item.numberOfTaxReturns + ' x ' + item.royaltyPerReturn + ')</label>';
                localHtml += '          </div>';
                localHtml += '          <div class="label-value col-md-3">';
                localHtml += '              <b><label>' + kendo.toString(item.taxRoyalties, "n") + '</label></b>';
                localHtml += '          </div>';
                localHtml += '      </div>';


                //TAX PREPARATION REVENUE
                localHtml += '      <div class="row">';
                localHtml += '          <div class="col-md-8">';
                localHtml += '              <b><label> Total Revenue </label></b>';
                localHtml += '          </div>';
                localHtml += '          <div class="label-value col-md-3">';
                localHtml += '              <b><label>' + kendo.toString(item.totalRevenue, "c") + '</label></b>';
                localHtml += '          </div>';
                localHtml += '      </div>';

                //END: SECTION REVENUE
                localHtml += '  </div>';

                localHtml += '  <div class="col-md-5">';

                //BEGIN: SECTION EXPENSES
                localHtml += '<h4>Expenses </h4>';

                //HOURLY WAGES
                if (item.hourlyWages != 0 ) {
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Hourly Wages </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.hourlyWages, "n") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';
                }

                //OVERTIME
                if (item.overtime != 0 ) {
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Overtime </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.overtime, "n") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';
                }

                //BONUS & COMMISSIONS
                if (item.bonusAndCommisions != 0 ) {
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Bonus & Commissions </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.bonusAndCommisions, "n") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';
                }

                //PAYROLL TAXES - ER
                if (item.payrollTaxes_ER != 0 ) {
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Payroll Taxes - ER </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.payrollTaxes_ER, "n") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';
                }

                //WORKERS COMP INSURANCE
                if (item.workersCompInsurance != 0 ) {
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Workers Comp Insurance </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.workersCompInsurance, "n") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';
                }

                //PAYROLL PROCESSING FEES
                if (item.payrollProcessingFee != 0 ) {
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Payroll Processing Fees </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.payrollProcessingFee, "n") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';
                }

                //POLICY MANAGER
                if (item.policyManager != 0 ) {
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Policy Manager </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.policyManager, "n") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';
                }

                //LICENSES AND PERMITS
                if ((item.Licenses_and_Permits + item.Licenses_Permits) != 0 ) {
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Licenses and Permits </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString((item.Licenses_and_Permits + item.Licenses_Permits), "n") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';
                }

                //RATING SOFTWARE
                if (item.ratingSoftware != 0 ) {
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Rating Software </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.ratingSoftware, "n") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';
                }

                //MOTOR VEHICLE REPORTS
                if (item.motorVehicleReport != 0 ) {
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Motor Vehicle Reports </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.motorVehicleReport, "n") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';
                }

                //LOANS DUE FROM FRANCHISEE
                if (item.loanDueFromFranchisee != 0 ) {
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Loans due from Franchisee </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.loanDueFromFranchisee, "n") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';
                }

                //MINIMUM ROYALTY FEE
                if (item.minimumRoyaltyFee != 0 ) {
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Minimum Royalty Fee </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.minimumRoyaltyFee, "n") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';
                }

                //SERVICING FEE
                if (item.servicingFee != 0 ) {
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Servicing Fee </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.servicingFee, "n") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';
                }

                //TRADE SHOWS
                if (item.tradeShows != 0 ) {
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Trade Shows </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.tradeShows, "n") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';
                }

                //TRUST ACCTG - A/R
                if (item.trustAccountingAR != 0 ) {
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Trust Acctg - A/R </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.trustAccountingAR, "n") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';
                }

                //TELEPHONE
                if (item.telephone != 0 ) {
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Telephone </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.telephone, "n") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';
                }

                //POSTAGE
                if (item.postage != 0 ) {
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Postage </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.postage, "n") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';
                }

                //TELEVISION/RADIO
                if (item.televisionRadio != 0 ) {
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Television/Radio </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.televisionRadio, "n") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';
                }

                //TRUST ACCT SHORTAGE/OVERAGE
                if (item.trustAcctShortageOverage != 0 ) {
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Trust Acct Shortage/Overage </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.trustAcctShortageOverage, "n") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';
                }

                //INTERNET
                if (item.internet != 0 ) {
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Internet </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.internet, "n") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';
                }

                //ON HOLD RECORDING
                if (item.onHoldRecording != 0 ) {
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> On Hold Recording </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.onHoldRecording, "n") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';
                }

                //ACCTG - SCANNING VIOLATION PENALTIES
                if (item.scanningViolationPenalty != 0 ) {
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Acctg - Scanning Violation Penalties </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.scanningViolationPenalty, "n") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';
                }

                //ACCTG - DEPOSIT VIOLATION PENALTIES
                if (item.depositViolationPenalty != 0 ) {
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Acctg - Deposit Violation Penalties </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.depositViolationPenalty, "n") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';
                }

                //BAD DEBTS
                if (item.badDebts != 0 ) {
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Bad Debts </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.badDebts, "n") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';
                }

                //PRINT
                if (item.printRT != 0 ) {
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Print </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.printRT, "n") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';
                }

                //REIMBURSED FEES - OTHER
                if (item.reimbursedFeeOther != 0 ) {
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Reimbursed Fees - Other </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.reimbursedFeeOther, "n") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';
                }

                //GAS
                if (item.gas != 0 ) {
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Gas </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.gas, "n") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';
                }

                //D&S MEMBERSHIPS
                if (item.DAndSMembership != 0 ) {
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> D&S Memberships </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.DAndSMembership, "n") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';
                }

                //E&O INSURANCE
                if (item.EAndOInsurance != 0 ) {
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> E&O Insurance </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.EAndOInsurance, "n") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';
                }

                //BASIC RENT
                if (item.rent != 0 ) {
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Basic Rent </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.rent, "n") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';
                }

                //BASIC SUPPLIES
                if (item.supplies != 0 ) {
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Basic Supplies </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.supplies, "n") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';
                }

                //BUILDING/OFFICE
                if (item.buildingOrOffice != 0 ) {
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Building/Office </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.buildingOrOffice, "n") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';
                }

                //REFERRAL FEES
                if (item.referralFee != 0 ) {
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Referral Fees </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.referralFee, "n") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';
                }

                //SMALL EQUIP PURCHASES UNDER $500
                if (item.smallEquipPurchases != 0 ) {
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Small Equip Purchases Under $500 </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.smallEquipPurchases, "n") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';
                }

                //SMALL FF&E UNDER $500
                if (item.smallFFAndE != 0 ) {
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Small FF&E Under $500 </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.smallFFAndE, "n") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';
                }

                //LEGAL FEES
                if (item.legalFee != 0 ) {
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Legal Fees </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.legalFee, "n") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';
                }

                //CAM CHARGES
                if (item.camCharges != 0 ) {
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> CAM Charges </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.camCharges, "n") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';
                }

                //CELL PHONE
                if (item.cellphone != 0 ) {
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Cell Phone </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.cellphone, "n") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';
                }

                //SECURITY
                if (item.securityRT != 0 ) {
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Security </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.securityRT, "n") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';
                }

                //ELECTRICITY
                if (item.electricity != 0 ) {
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Electricity </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.electricity, "n") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';
                }

                //ACCTG - ACCOUNTING VIOLATION PENALTIES
                if (item.accountingViolationPenalty != 0 ) {
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Acctg - Accounting Violation Penalties </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.accountingViolationPenalty, "n") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';
                }

                //ADVERTISING
                if (item.advertising != 0 ) {
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Advertising </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.advertising, "n") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';
                }

                //APPOINTMENT FEES
                if (item.DOIAppointmentFee != 0 ) {
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Appointment Fees </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.DOIAppointmentFee, "n") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';
                }

                //ARROW PROTECTION
                if (item.notes != 0 ) {
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Arrow Protection </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.notes, "n") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';
                }

                //DOI LICENSE FEE
                if (item.DOILicenseFee != 0 ) {
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> DOI License Fee </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.DOILicenseFee, "n") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';
                }

                //ENTREPRENEUR MAGAZINE
                if (item.entrepreneurMagazine != 0 ) {
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Entrepreneur Magazine </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.entrepreneurMagazine, "n") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';
                }

                //FRANCHISE GATOR LEADS
                if (item.franchiseGratorLeads != 0 ) {
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Franchise Gator Leads </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.franchiseGratorLeads, "n") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';
                }

                //FRANCHISE GUIDE SUPPLIES
                if (item.franchiseGuideSupplies != 0 ) {
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Franchise Guide Supplies </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.franchiseGuideSupplies, "n") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';
                }

                //FRANCHISE TIMES MAGAZINE
                if (item.franchiseTimeMagazine != 0 ) {
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Franchise Times Magazine </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.franchiseTimeMagazine, "n") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';
                }

                //LEADS
                if (item.leads != 0 ) {
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Leads </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.leads, "n") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';
                }

                //SEO (SEARCH ENGINE OPTIMIZATION)
                if (item.SEO != 0 ) {
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> SEO (Search Engine Optimization) </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.SEO, "n") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';
                }

                //RENEWAL FEE
                if (item.renewalFee != 0 ) {
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Renewal Fee </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.renewalFee, "n") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';
                }

                //INCENTIVE
                if (item.incentive != 0 ) {
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Incentive </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.incentive, "n") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';
                }

                //MAX SHIELD
                if (item.maxShield != 0 ) {
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Max Shield </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="label-value col-md-3">';
                    localHtml += '              <b><label>' + kendo.toString(item.maxShield, "n") + '</label></b>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';
                }

                //END: SECTION EXPENSES

                //BEGIN: SECTION TOTALS
                localHtml += '</br> </br>';

                //TOTAL DEDUCTIONS
                localHtml += '      <div class="row">';
                localHtml += '          <div class="col-md-8">';
                localHtml += '              <label> Total Deductions </label>';
                localHtml += '          </div>';
                localHtml += '          <div class="label-value col-md-3">';
                localHtml += '              <b><label>' + kendo.toString(item.totalDeductions, "c") + '</label></b>';
                localHtml += '          </div>';
                localHtml += '      </div>';

                //PREVIOUS UNPAID BALANCE
                localHtml += '      <div class="row">';
                localHtml += '          <div class="col-md-8">';
                localHtml += '              <label> Previous Unpaid Balance </label>';
                localHtml += '          </div>';
                localHtml += '          <div class="label-value col-md-3">';
                localHtml += '              <b><label>' + kendo.toString(item.previousUnpaidBalanace, "c") + '</label></b>';
                localHtml += '          </div>';
                localHtml += '      </div>';

                //BALANCE DUE TO/(FROM) FRANCHISE
                localHtml += '      <div class="row">';
                localHtml += '          <div class="col-md-8">';
                localHtml += '              <label> Balance Due To/(From) Franchise </label>';
                localHtml += '          </div>';
                localHtml += '          <div class="label-value col-md-3">';
                localHtml += '              <b><label>' + kendo.toString(item.balanceDueToOrFromFranchise, "c") + '</label></b>';
                localHtml += '          </div>';
                localHtml += '      </div>';

                localHtml += '  </div>';
                //END: SECTION TOTALS

                //END: MAIN ROW
                localHtml += '</div>';

                //END: ITEM WRAPPER DIV
                localHtml += '</div>';


                $("#StoreMainDiv_" + index).append(localHtml);
            },
            Manageable: function (index) {

                $("#StoreMainDiv_" + index).html('');
                var Dates = Page.Report.DataSources.Dates[0];
                //for (var i = 0; i < Page.Report.DataSources.MainData.length; i++) {
                var item = Page.Report.DataSources.MainData[index];
                var localHtml = '';

                //BEGIN: MAIN ROW
                localHtml += '<div class="row">';

                    //BEGIN: SECTION REVENUE
                    localHtml += '  <div class="col-md-6">';

                    //STORE NUMBER
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Store </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="col-md-4">';
                    localHtml += '              <input id="txtStoreNo_' + item.id + '" value="' + item.storeNo + '" type="text" class="form-control txtField"/>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';

                    //DATE
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Date </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="col-md-4">';
                    localHtml += '              <input id="dtRT_' + item.id + '" class="dtpicker" value="' + kendo.toString(item.dateRT, "MM/dd/yyyy") + '" />';
                    localHtml += '          </div>';
                    localHtml += '      </div>';

                    //GROSS COMMISSIONS
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Gross Commissions </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="col-md-4">';
                    localHtml += '              <input id="txtgrossCommisions_' + item.id + '" value="' + item.grossCommisions + '" type="number" class="form-control numField"/>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';

                    //COMMISION PERCENT TIER 1    
                    localHtml += Page.Report.Render.Tools.GetFieldHtml("Commision Percent Tier 1", "commissionsPercentTier1", item.commissionsPercentTier1,
                                                                item.id, true, false, Page.Report.Render.Tools.Types.Number);

                    //TOTAL COMMMISIONS TIER 1
                    localHtml += Page.Report.Render.Tools.GetFieldHtml("Total Commmisions (Tier 1)", "commissionsTier1", item.commissionsTier1,
                                                                                        item.id, true, false, Page.Report.Render.Tools.Types.Number);

                    //COMMISION PERCENT TIER 2    
                    localHtml += Page.Report.Render.Tools.GetFieldHtml("Commision Percent Tier 2", "commissionsPercentTier2", item.commissionsPercentTier2,
                                                            item.id, true, false, Page.Report.Render.Tools.Types.Number);

                    //TOTAL COMMMISIONS TIER 2
                    localHtml += Page.Report.Render.Tools.GetFieldHtml("Total Commmisions (Tier 2)", "commisionsTier2", item.commisionsTier2,
                                                                                            item.id, true, false, Page.Report.Render.Tools.Types.Number);

                    //TAX PREPARATION REVENUE
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Tax Preparation Revenue </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="col-md-4">';
                    localHtml += '              <input id="txtTaxPrepRevenue_' + item.id + '" value="' + item.taxPrepRevenue + '" type="number" class="form-control numField"/>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';

                    //NUMBER OF TAX RETURNS
                    localHtml += Page.Report.Render.Tools.GetFieldHtml("Number of Tax Returns", "numberOfTaxReturns", item.numberOfTaxReturns,
                                                                                                        item.id, true, false, Page.Report.Render.Tools.Types.Number);
                    //ROYALTY PER RETURN
                    localHtml += Page.Report.Render.Tools.GetFieldHtml("Royalty Per Return", "royaltyPerReturn", item.royaltyPerReturn,
                                                                                                            item.id, true, false, Page.Report.Render.Tools.Types.Number);
                    //LESS: TAX ROYALTIES
                    localHtml += Page.Report.Render.Tools.GetFieldHtml("Less: Tax Royalties", "taxRoyalties", item.taxRoyalties,
                                                                                                                item.id, true, false, Page.Report.Render.Tools.Types.Number);


                    //TOTAL REVENUE
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <b><label> Total Revenue </label></b>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="col-md-4">';
                    localHtml += '              <input id="txtTotalRevenue_' + item.id + '" value="' + item.totalRevenue + '" type="number" class="form-control numField"/>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';

                    //END: SECTION REVENUE
                    localHtml += '  </div>';

                    localHtml += '  <div class="col-md-6">';

                    //BEGIN: SECTION EXPENSES
                    localHtml += '<h4>Expenses </h4>';

                    //HOURLY WAGES
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Hourly Wages </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="col-md-4">';
                    localHtml += '              <input id="txtHourlyWages_' + item.id + '" value="' + item.hourlyWages + '" type="number" class="form-control numField"/>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';

                    //OVERTIME
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Overtime </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="col-md-4">';
                    localHtml += '              <input id="txtOvertime_' + item.id + '" value="' + item.overtime + '" type="number" class="form-control numField"/>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';

                    //BONUS & COMMISSIONS
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Bonus & Commissions </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="col-md-4">';
                    localHtml += '              <input id="txtBonusAndCommisions_' + item.id + '" value="' + item.bonusAndCommisions + '" type="number" class="form-control numField"/>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';

                    //PAYROLL TAXES - ER
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Payroll Taxes - ER </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="col-md-4">';
                    localHtml += '              <input id="txtPayrollTaxes_ER_' + item.id + '" value="' + item.payrollTaxes_ER + '" type="number" class="form-control numField"/>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';

                    //WORKERS COMP INSURANCE
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Workers Comp Insurance </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="col-md-4">';
                    localHtml += '              <input id="txtWorkersCompInsurance_' + item.id + '" value="' + item.workersCompInsurance + '" type="number" class="form-control numField"/>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';

                    //PAYROLL PROCESSING FEES
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Payroll Processing Fees </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="col-md-4">';
                    localHtml += '              <input id="txtPayrollProcessingFee_' + item.id + '" value="' + item.payrollProcessingFee + '" type="number" class="form-control numField"/>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';

                    //POLICY MANAGER
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Policy Manager </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="col-md-4">';
                    localHtml += '              <input id="txtPolicyManager_' + item.id + '" value="' + item.policyManager + '" type="number" class="form-control numField"/>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';

                    //LICENSES AND PERMITS
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Licenses and Permits </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="col-md-4">';
                    localHtml += '              <input id="txtLicenses_and_Permits_' + item.id + '" value="' + (item.Licenses_and_Permits + item.Licenses_Permits) + '" type="number" class="form-control numField"/>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';

                    //RATING SOFTWARE
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Rating Software </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="col-md-4">';
                    localHtml += '              <input id="txtRatingSoftware_' + item.id + '" value="' + item.ratingSoftware + '" type="number" class="form-control numField"/>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';

                    //MOTOR VEHICLE REPORTS
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Motor Vehicle Reports </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="col-md-4">';
                    localHtml += '              <input id="txtMotorVehicleReport_' + item.id + '" value="' + item.motorVehicleReport + '" type="number" class="form-control numField"/>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';

                    //LOANS DUE FROM FRANCHISEE
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Loans due from Franchisee </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="col-md-4">';
                    localHtml += '              <input id="txtLoanDueFromFranchisee_' + item.id + '" value="' + item.loanDueFromFranchisee + '" type="number" class="form-control numField"/>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';

                    //MINIMUM ROYALTY FEE
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Minimum Royalty Fee </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="col-md-4">';
                    localHtml += '              <input id="txtMinimumRoyaltyFee_' + item.id + '" value="' + item.minimumRoyaltyFee + '" type="number" class="form-control numField"/>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';

                    //SERVICING FEE
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Servicing Fee </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="col-md-4">';
                    localHtml += '              <input id="txtServicingFee_' + item.id + '" value="' + item.servicingFee + '" type="number" class="form-control numField"/>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';

                    //TRADE SHOWS
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Trade Shows </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="col-md-4">';
                    localHtml += '              <input id="txtTradeShows_' + item.id + '" value="' + item.tradeShows + '" type="number" class="form-control numField"/>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';

                    //TRUST ACCTG - A/R
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Trust Acctg - A/R </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="col-md-4">';
                    localHtml += '              <input id="txtTrustAccountingAR_' + item.id + '" value="' + item.trustAccountingAR + '" type="number" class="form-control numField"/>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';

                    //TELEPHONE
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Telephone </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="col-md-4">';
                    localHtml += '              <input id="txtTelephone_' + item.id + '" value="' + item.telephone + '" type="number" class="form-control numField"/>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';

                    //POSTAGE
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Postage </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="col-md-4">';
                    localHtml += '              <input id="txtPostage_' + item.id + '" value="' + item.postage + '" type="number" class="form-control numField"/>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';

                    //TELEVISION/RADIO
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Television/Radio </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="col-md-4">';
                    localHtml += '              <input id="txtTelevisionRadio_' + item.id + '" value="' + item.televisionRadio + '" type="number" class="form-control numField"/>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';

                    //TRUST ACCT SHORTAGE/OVERAGE
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Trust Acct Shortage/Overage </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="col-md-4">';
                    localHtml += '              <input id="txtTrustAcctShortageOverage_' + item.id + '" value="' + item.trustAcctShortageOverage + '" type="number" class="form-control numField"/>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';

                    //INTERNET
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Internet </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="col-md-4">';
                    localHtml += '              <input id="txtInternet_' + item.id + '" value="' + item.internet + '" type="number" class="form-control numField"/>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';

                    //ON HOLD RECORDING
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> On Hold Recording </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="col-md-4">';
                    localHtml += '              <input id="txtOnHoldRecording_' + item.id + '" value="' + item.onHoldRecording + '" type="number" class="form-control numField"/>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';

                    //ACCTG - SCANNING VIOLATION PENALTIES
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Acctg - Scanning Violation Penalties </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="col-md-4">';
                    localHtml += '              <input id="txtScanningViolationPenalty_' + item.id + '" value="' + item.scanningViolationPenalty + '" type="number" class="form-control numField"/>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';

                    //ACCTG - DEPOSIT VIOLATION PENALTIES
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Acctg - Deposit Violation Penalties </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="col-md-4">';
                    localHtml += '              <input id="txtDepositViolationPenalty_' + item.id + '" value="' + item.depositViolationPenalty + '" type="number" class="form-control numField"/>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';

                    //BAD DEBTS
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Bad Debts </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="col-md-4">';
                    localHtml += '              <input id="txtBadDebts_' + item.id + '" value="' + item.badDebts + '" type="number" class="form-control numField"/>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';

                    //PRINT
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Print </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="col-md-4">';
                    localHtml += '              <input id="txtPrintRT_' + item.id + '" value="' + item.printRT + '" type="number" class="form-control numField"/>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';

                    //REIMBURSED FEES - OTHER
                    localHtml += '      <div class="row">';
                    localHtml += '          <div class="col-md-8">';
                    localHtml += '              <label> Reimbursed Fees - Other </label>';
                    localHtml += '          </div>';
                    localHtml += '          <div class="col-md-4">';
                    localHtml += '              <input id="txtReimbursedFeeOther_' + item.id + '" value="' + item.reimbursedFeeOther + '" type="number" class="form-control numField"/>';
                    localHtml += '          </div>';
                    localHtml += '      </div>';

                    //GAS
                    localHtml += Page.Report.Render.Tools.GetFieldHtml("Gas", "gas", item.gas,
                                                                        item.id, true, false, Page.Report.Render.Tools.Types.Number);

                    //D&S MEMBERSHIPS
                    localHtml += Page.Report.Render.Tools.GetFieldHtml("D&S Memberships", "DAndSMembership", item.DAndSMembership,
                                                                        item.id, true, false, Page.Report.Render.Tools.Types.Number);

                    //E&O INSURANCE
                    localHtml += Page.Report.Render.Tools.GetFieldHtml("E&O Insurance", "EAndOInsurance", item.EAndOInsurance,
                                                        item.id, true, false, Page.Report.Render.Tools.Types.Number);


                    //BASIC RENT
                    localHtml += Page.Report.Render.Tools.GetFieldHtml("Basic Rent", "rent", item.rent,
                                                    item.id, true, false, Page.Report.Render.Tools.Types.Number);

                    //BASIC SUPPLIES
                    localHtml += Page.Report.Render.Tools.GetFieldHtml("Basic Supplies", "supplies", item.supplies,
                                                    item.id, true, false, Page.Report.Render.Tools.Types.Number);

                    //BUILDING/OFFICE
                    localHtml += Page.Report.Render.Tools.GetFieldHtml("Building/Office", "buildingOrOffice", item.buildingOrOffice,
                                                    item.id, true, false, Page.Report.Render.Tools.Types.Number);

                    //REFERRAL FEES
                    localHtml += Page.Report.Render.Tools.GetFieldHtml("Referral Fees", "referralFee", item.referralFee,
                                                    item.id, true, false, Page.Report.Render.Tools.Types.Number);

                    //SMALL EQUIP PURCHASES UNDER $500
                    localHtml += Page.Report.Render.Tools.GetFieldHtml("Small Equip Purchases Under $500", "smallEquipPurchases", item.smallEquipPurchases,
                                                        item.id, true, false, Page.Report.Render.Tools.Types.Number);

                    //SMALL FF&E UNDER $500
                    localHtml += Page.Report.Render.Tools.GetFieldHtml("Small FF&E Under $500", "smallFFAndE", item.smallFFAndE,
                                                    item.id, true, false, Page.Report.Render.Tools.Types.Number);

                    //LEGAL FEES
                    localHtml += Page.Report.Render.Tools.GetFieldHtml("Legal Fees", "legalFee", item.legalFee,
                                                    item.id, true, false, Page.Report.Render.Tools.Types.Number);

                    //CAM CHARGES
                    localHtml += Page.Report.Render.Tools.GetFieldHtml("CAM Charges", "camCharges", item.camCharges,
                                                    item.id, true, false, Page.Report.Render.Tools.Types.Number);

                    //CELL PHONE
                    localHtml += Page.Report.Render.Tools.GetFieldHtml("Cell Phone", "cellphone", item.cellphone,
                                                    item.id, true, false, Page.Report.Render.Tools.Types.Number);

                    //SECURITY
                    localHtml += Page.Report.Render.Tools.GetFieldHtml("Security", "securityRT", item.securityRT,
                                                    item.id, true, false, Page.Report.Render.Tools.Types.Number);

                    //ELECTRICITY
                    localHtml += Page.Report.Render.Tools.GetFieldHtml("Electricity", "electricity", item.electricity,
                                                    item.id, true, false, Page.Report.Render.Tools.Types.Number);

                    //ACCTG - ACCOUNTING VIOLATION PENALTIES
                    localHtml += Page.Report.Render.Tools.GetFieldHtml("Acctg - Accounting Violation Penalties", "accountingViolationPenalty", item.accountingViolationPenalty,
                                                item.id, true, false, Page.Report.Render.Tools.Types.Number);

                    //ADVERTISING
                    localHtml += Page.Report.Render.Tools.GetFieldHtml("Advertising", "advertising", item.advertising,
                                                    item.id, true, false, Page.Report.Render.Tools.Types.Number);

                    //APPOINTMENT FEES
                    localHtml += Page.Report.Render.Tools.GetFieldHtml("Appointment Fees", "DOIAppointmentFee", item.DOIAppointmentFee,
                                                    item.id, true, false, Page.Report.Render.Tools.Types.Number);

                    //ARROW PROTECTION
                    localHtml += Page.Report.Render.Tools.GetFieldHtml("Arrow Protection", "notes", item.notes,
                                                    item.id, true, false, Page.Report.Render.Tools.Types.Text);

                    //DOI LICENSE FEE
                    localHtml += Page.Report.Render.Tools.GetFieldHtml("DOI License Fee", "DOILicenseFee", item.DOILicenseFee,
                                                    item.id, true, false, Page.Report.Render.Tools.Types.Number);

                    //ENTREPRENEUR MAGAZINE
                    localHtml += Page.Report.Render.Tools.GetFieldHtml("Entrepreneur Magazine", "entrepreneurMagazine", item.entrepreneurMagazine,
                                            item.id, true, false, Page.Report.Render.Tools.Types.Number);

                    //FRANCHISE GATOR LEADS
                    localHtml += Page.Report.Render.Tools.GetFieldHtml("Franchise Gator Leads", "franchiseGratorLeads", item.franchiseGratorLeads,
                                                    item.id, true, false, Page.Report.Render.Tools.Types.Number);

                    //FRANCHISE GUIDE SUPPLIES
                    localHtml += Page.Report.Render.Tools.GetFieldHtml("Franchise Guide Supplies", "franchiseGuideSupplies", item.franchiseGuideSupplies,
                                                    item.id, true, false, Page.Report.Render.Tools.Types.Number);

                    //FRANCHISE TIMES MAGAZINE
                    localHtml += Page.Report.Render.Tools.GetFieldHtml("Franchise Times Magazine", "franchiseTimeMagazine", item.franchiseTimeMagazine,
                                                    item.id, true, false, Page.Report.Render.Tools.Types.Number);

                    //LEADS
                    localHtml += Page.Report.Render.Tools.GetFieldHtml("Leads", "leads", item.leads,
                                                    item.id, true, false, Page.Report.Render.Tools.Types.Number);

                    //SEO (SEARCH ENGINE OPTIMIZATION)
                    localHtml += Page.Report.Render.Tools.GetFieldHtml("SEO (Search Engine Optimization)", "SEO", item.SEO,
                                                    item.id, true, false, Page.Report.Render.Tools.Types.Number);

                    //RENEWAL FEE
                    localHtml += Page.Report.Render.Tools.GetFieldHtml("Renewal Fee", "renewalFee", item.renewalFee,
                                                    item.id, true, false, Page.Report.Render.Tools.Types.Number);

                    //INCENTIVE
                    localHtml += Page.Report.Render.Tools.GetFieldHtml("Incentive", "incentive", item.incentive,
                                                    item.id, true, false, Page.Report.Render.Tools.Types.Number);

                    //MAX SHIELD
                    localHtml += Page.Report.Render.Tools.GetFieldHtml("Max Shield", "maxShield", item.maxShield,
                                                    item.id, true, false, Page.Report.Render.Tools.Types.Number);

                    //END: SECTION EXPENSES

                    //BEGIN: SECTION TOTALS
                    localHtml += '</br> </br>';

                    //TOTAL DEDUCTIONS
                    localHtml += Page.Report.Render.Tools.GetFieldHtml("Total Deductions", "totalDeductions", item.totalDeductions,
                                                        item.id, true, true, Page.Report.Render.Tools.Types.Number);

                    //PREVIOUS UNPAID BALANCE
                    localHtml += Page.Report.Render.Tools.GetFieldHtml("Previous Unpaid Balance", "previousUnpaidBalanace", item.previousUnpaidBalanace,
                                                item.id, true, true, Page.Report.Render.Tools.Types.Number);

                    //BALANCE DUE TO/(FROM) FRANCHISE
                    localHtml += Page.Report.Render.Tools.GetFieldHtml("Balance Due To/(From) Franchise", "balanceDueToOrFromFranchise", item.balanceDueToOrFromFranchise,
                                                item.id, true, true, Page.Report.Render.Tools.Types.Number);

                    localHtml += '  </div>';
                    //END: SECTION TOTALS

                    //END: MAIN ROW
                    localHtml += '</div>';

                $("#StoreMainDiv_" + index).append(localHtml);
                //}
                $(".dtpicker").kendoDatePicker();
            },
            Tools: {
                Types: {
                    Text: "text",
                    Number: "number",
                    Date: "date",
                    Currency: "currency",
                },
                GetFieldHtml: function (title, fieldName, value, id, isEditable, isBold, type) {
                    var FieldHtml = "";
                    if (isEditable) {
                        FieldHtml += '<div class="row">';
                        FieldHtml += '  <div class="col-md-8">';
                        if (isBold)
                            FieldHtml += '  <b><label>' + title + '</label></b>';
                        else
                            FieldHtml += '  <label>' + title + '</label>';
                        FieldHtml += '  </div>';
                        FieldHtml += '  <div class="col-md-4">';
                        switch (type) {
                            case Page.Report.Render.Tools.Types.Number:
                                FieldHtml += '  <input id="txt' + fieldName + '_' + id + '" value="' + value + '" type="number" class="form-control numField"/>';
                                break;
                            case Page.Report.Render.Tools.Types.Text:
                                FieldHtml += '  <input id="txt' + fieldName + '_' + id + '" value="' + value + '" type="text" class="form-control txtField"/>';
                                break;
                            case Page.Report.Render.Tools.Types.Date:
                                FieldHtml += '  <input id="txt' + fieldName + '_' + id + '" value="' + value + '" type="text" class="form-control txtField"/>';
                                break;
                            case Page.Report.Render.Tools.Types.Currency:
                                FieldHtml += '  <input id="txt' + fieldName + '_' + id + '" value="' + value + '" type="number" class="form-control numField"/>';
                                break;
                        }
                        FieldHtml += '  </div>';
                        FieldHtml += '</div>';
                    }
                    else {
                        FieldHtml += '<tr>';
                        //TITLE
                        FieldHtml += '  <td width="66%">';
                        if (isBold)
                            FieldHtml += '  <b><label>' + title + '</label></b>';
                        else
                            FieldHtml += '  <label>' + title + '</label>';
                        FieldHtml += '  </td>';
                        //VALUE
                        FieldHtml += '  <td width="33%">';
                        switch (type) {
                            case Page.Report.Render.Tools.Types.Number:
                                FieldHtml += '      <b><label>' + kendo.toString(value, "n") + '</label></b>';
                                break;
                            case Page.Report.Render.Tools.Types.Text:
                                FieldHtml += '      <b><label>' + value + '</label></b>';
                                break;
                            case Page.Report.Render.Tools.Types.Date:
                                FieldHtml += '      <b><label>' + kendo.toString(value, "MM/dd/yyyy") + '</label></b>';
                                break;
                            case Page.Report.Render.Tools.Types.Currency:
                                FieldHtml += '      <b><label>' + kendo.toString(value, "c") + '</label></b>';
                                break;
                        }
                        FieldHtml += '  </td>';
                        FieldHtml += '</tr>';
                    }
                    return FieldHtml;
                }
            }
        },
        Export: {
            Types: {
                PDF: "pdf",
                CSV: "csv"
            },
            Download: function (type, index) {
                switch (type) {
                    case Page.Report.Export.Types.PDF:
                        //var source = window.document.getElementById("grid");


                            //'elementHandlers': specialElementHandlers

                        html2canvas($('#StoreMainDiv_' + index), {
                            onrendered: function (canvas) {

                                var img = canvas.toDataURL("image/png");
                                var doc = new jsPDF({
                                    orientation: 'landscape',
                                    pagesplit: true,
                                });
                                doc.addImage(img, 'JPEG', 10, 10);
                                var item = Page.Report.DataSources.MainData[index];
                                var storeNo = item.storeNo;
                                var month = $("#cmbMonths option:selected").text();
                                var year = $("#cmbYears").val();
                                doc.save('Recons_' + storeNo + "_" + month + "_" + year + '.pdf')
                            }

                        });
                        break;
                        //pdf.addHTML($('#grid')[0], 0, 0, options, function () {
                        //    console.log("done");
                        //    pdf.save('test.pdf')
                        //});
                        //pdf.addHTML($('#grid'), function () {
                        //    pdf.save('web.pdf');
                        //});
                    case Page.Report.Export.Types.CSV:
                        var storeNos = $("#cmbStores").val();
                        storeNos.join('|');
                        //doc.save('Recons_' + storeNo + "_" + month + "_" + year + '.pdf')
                        var url = "ExportReconCSV?StoreNos=" + storeNos.join('|') + "&Month=" + $("#cmbMonths").val() + "&Year=" + $("#cmbYears").val();
                        window.open(url, '_blank');
                        break;
                }
            },
        },
        Manage: function (index) {
            var IndexOfIndex = Page.Report.ManagementIndexList.indexOf(index);
            if (IndexOfIndex < 0) {
                Page.Report.ManagementIndexList.push(index);
                $(".ManageDataControls_" + index).show();
                $(".ExportDataControls_" + index).hide();
                Page.Report.Render.Manageable(index);
            }
            else {
                Page.Report.ManagementIndexList.splice(IndexOfIndex, 1);
                $(".ManageDataControls_" + index).hide();
                $(".ExportDataControls_" + index).show();
                Page.Report.Render.Normal(index);
            }
        },
        DeleteAll: function () {
            if (confirm("WARNING \n\r This action cannot be Undone \n\r Are you sure you want to DELETE the Selected Rows?")) {
                var Items = [];
                for (var i = 0; i < Page.Report.DataSources.MainData.length; i++) {
                    Items.push(Page.Report.DataSources.MainData[i].id);
                }
                $.ajax({
                    type: "POST",
                    url: "DeleteRecords",
                    traditional: 'true',
                    data: {
                        Items: Items, Report: "RECON"
                    },
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
        Delete: function (index) {
            if (confirm("WARNING \n\r This action cannot be Undone \n\r Are you sure you want to DELETE the Selected Rows?")) {
                var Items = [];
                Items.push(Page.Report.DataSources.MainData[index].id);
                $.ajax({
                    type: "POST",
                    url: "DeleteRecords",
                    traditional: 'true',
                    data: {
                        Items: Items, Report: "RECON"
                    },
                    contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                    dataType: 'json',
                    success: function (response) {
                        alert("Success \n\r The Selected Rows has been deleted.");
                        location.reload();
                    },
                    error: function (xhr, status, error) {
                        console.error(xhr.responseText);
                        alert("Error \n\r Something went wrong.")
                    }
                });
            }
        },
        SaveAll: function () {
            if (confirm("WARNING \n\r Are you sure you want to EDIT the Selected Rows?")) {
                var ItemList = [];
                var Item;
                var NewItem;
                for (var i = 0; i < Page.Report.DataSources.MainData.length; i++) {
                    Item = Page.Report.DataSources.MainData[i];
                    NewItem = {
                    };
                    NewItem.id = Item.id;
                    NewItem.storeNo = $("#txtStoreNo_" + Item.id).val();
                    NewItem.dateRT = $("#dtRT_" + Item.id).val();
                    NewItem.grossCommisions = $("#txtgrossCommisions_" + Item.id).val();

                    NewItem.commissionsPercentTier1 = $("#txtcommissionsPercentTier1_" + Item.id).val();
                    NewItem.commissionsTier1 = $("#txtcommissionsTier1_" + Item.id).val();
                    NewItem.commissionsPercentTier2 = $("#txtcommissionsPercentTier2_" + Item.id).val();
                    NewItem.commisionsTier2 = $("#txtcommisionsTier2_" + Item.id).val();
                    NewItem.taxPrepRevenue = $("#txtTaxPrepRevenue_" + Item.id).val();

                    NewItem.numberOfTaxReturns = $("#txtnumberOfTaxReturns_" + Item.id).val();
                    NewItem.royaltyPerReturn = $("#txtroyaltyPerReturn_" + Item.id).val();
                    NewItem.taxRoyalties = $("#txttaxRoyalties_" + Item.id).val();

                    NewItem.totalRevenue = $("#txtTotalRevenue_" + Item.id).val();
                    NewItem.hourlyWages = $("#txtHourlyWages_" + Item.id).val();
                    NewItem.overtime = $("#txtOvertime_" + Item.id).val();
                    NewItem.bonusAndCommisions = $("#txtBonusAndCommisions_" + Item.id).val();
                    NewItem.payrollTaxes_ER = $("#txtPayrollTaxes_ER_" + Item.id).val();
                    NewItem.workersCompInsurance = $("#txtWorkersCompInsurance_" + Item.id).val();
                    NewItem.payrollProcessingFee = $("#txtPayrollProcessingFee_" + Item.id).val();
                    NewItem.policyManager = $("#txtPolicyManager_" + Item.id).val();
                    NewItem.Licenses_and_Permits = $("#txtLicenses_and_Permits_" + Item.id).val();
                    NewItem.ratingSoftware = $("#txtRatingSoftware_" + Item.id).val();
                    NewItem.motorVehicleReport = $("#txtMotorVehicleReport_" + Item.id).val();
                    NewItem.loanDueFromFranchisee = $("#txtLoanDueFromFranchisee_" + Item.id).val();
                    NewItem.minimumRoyaltyFee = $("#txtMinimumRoyaltyFee_" + Item.id).val();
                    NewItem.servicingFee = $("#txtServicingFee_" + Item.id).val();
                    NewItem.tradeShows = $("#txtTradeShows_" + Item.id).val();
                    NewItem.trustAccountingAR = $("#txtTrustAccountingAR_" + Item.id).val();
                    NewItem.telephone = $("#txtTelephone_" + Item.id).val();
                    NewItem.postage = $("#txtPostage_" + Item.id).val();
                    NewItem.televisionRadio = $("#txtTelevisionRadio_" + Item.id).val();
                    NewItem.trustAcctShortageOverage = $("#txtTrustAcctShortageOverage_" + Item.id).val();
                    NewItem.internet = $("#txtInternet_" + Item.id).val();
                    NewItem.onHoldRecording = $("#txtOnHoldRecording_" + Item.id).val();
                    NewItem.scanningViolationPenalty = $("#txtScanningViolationPenalty_" + Item.id).val();
                    NewItem.depositViolationPenalty = $("#txtDepositViolationPenalty_" + Item.id).val();
                    NewItem.badDebts = $("#txtBadDebts_" + Item.id).val();
                    NewItem.printRT = $("#txtPrintRT_" + Item.id).val();
                    NewItem.reimbursedFeeOther = $("#txtReimbursedFeeOther_" + Item.id).val();



                    NewItem.gas = $("#txtgas_" + Item.id).val();
                    NewItem.DAndSMembership = $("#txtDAndSMembership_" + Item.id).val();
                    NewItem.EAndOInsurance = $("#txtEAndOInsurance_" + Item.id).val();
                    NewItem.rent = $("#txtrent_" + Item.id).val();
                    NewItem.supplies = $("#txtsupplies_" + Item.id).val();
                    NewItem.buildingOrOffice = $("#txtbuildingOrOffice_" + Item.id).val();
                    NewItem.referralFee = $("#txtreferralFee_" + Item.id).val();
                    NewItem.smallEquipPurchases = $("#txtsmallEquipPurchases_" + Item.id).val();
                    NewItem.smallFFAndE = $("#txtsmallFFAndE_" + Item.id).val();
                    NewItem.legalFee = $("#txtlegalFee_" + Item.id).val();
                    NewItem.camCharges = $("#txtcamCharges_" + Item.id).val();
                    NewItem.cellphone = $("#txtcellphone_" + Item.id).val();
                    NewItem.securityRT = $("#txtsecurityRT_" + Item.id).val();
                    NewItem.electricity = $("#txtelectricity_" + Item.id).val();
                    NewItem.accountingViolationPenalty = $("#txtaccountingViolationPenalty_" + Item.id).val();
                    NewItem.advertising = $("#txtadvertising_" + Item.id).val();
                    NewItem.DOIAppointmentFee = $("#txtDOIAppointmentFee_" + Item.id).val();
                    NewItem.notes = $("#txtnotes_" + Item.id).val();
                    NewItem.DOILicenseFee = $("#txtDOILicenseFee_" + Item.id).val();
                    NewItem.entrepreneurMagazine = $("#txtentrepreneurMagazine_" + Item.id).val();
                    NewItem.franchiseGratorLeads = $("#txtfranchiseGratorLeads_" + Item.id).val();
                    NewItem.franchiseGuideSupplies = $("#txtfranchiseGuideSupplies_" + Item.id).val();
                    NewItem.franchiseTimeMagazine = $("#txtfranchiseTimeMagazine_" + Item.id).val();
                    NewItem.leads = $("#txtleads_" + Item.id).val();
                    NewItem.SEO = $("#txtSEO_" + Item.id).val();
                    NewItem.renewalFee = $("#txtrenewalFee_" + Item.id).val();
                    NewItem.incentive = $("#txtincentive_" + Item.id).val();
                    NewItem.maxShield = $("#txtmaxShield_" + Item.id).val();
                    NewItem.totalDeductions = $("#txttotalDeductions_" + Item.id).val();
                    NewItem.previousUnpaidBalanace = $("#txtpreviousUnpaidBalanace_" + Item.id).val();
                    NewItem.balanceDueToOrFromFranchise = $("#txtbalanceDueToOrFromFranchise_" + Item.id).val();

                    ItemList.push(NewItem);
                }
                $.ajax({
                    type: "POST",
                    url: "UpdateRECONRecords",
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
        Save: function (index) {
            if (confirm("WARNING \n\r Are you sure you want to EDIT the Selelcted Data?")) {
                var ItemList = [];
                var Item;
                var NewItem;
                Item = Page.Report.DataSources.MainData[index];
                NewItem = {
                };
                NewItem.id = Item.id;
                NewItem.storeNo = $("#txtStoreNo_" + Item.id).val();
                NewItem.dateRT = $("#dtRT_" + Item.id).val();
                NewItem.grossCommisions = $("#txtgrossCommisions_" + Item.id).val();
                NewItem.commissionsPercentTier1 = $("#txtcommissionsPercentTier1_" + Item.id).val();
                NewItem.commissionsTier1 = $("#txtcommissionsTier1_" + Item.id).val();
                NewItem.commissionsPercentTier2 = $("#txtcommissionsPercentTier2_" + Item.id).val();
                NewItem.commisionsTier2 = $("#txtcommisionsTier2_" + Item.id).val();
                NewItem.taxPrepRevenue = $("#txtTaxPrepRevenue_" + Item.id).val();
                NewItem.numberOfTaxReturns = $("#txtnumberOfTaxReturns_" + Item.id).val();
                NewItem.royaltyPerReturn = $("#txtroyaltyPerReturn_" + Item.id).val();
                NewItem.taxRoyalties = $("#txttaxRoyalties_" + Item.id).val();
                NewItem.totalRevenue = $("#txtTotalRevenue_" + Item.id).val();
                NewItem.hourlyWages = $("#txtHourlyWages_" + Item.id).val();
                NewItem.overtime = $("#txtOvertime_" + Item.id).val();
                NewItem.bonusAndCommisions = $("#txtBonusAndCommisions_" + Item.id).val();
                NewItem.payrollTaxes_ER = $("#txtPayrollTaxes_ER_" + Item.id).val();
                NewItem.workersCompInsurance = $("#txtWorkersCompInsurance_" + Item.id).val();
                NewItem.payrollProcessingFee = $("#txtPayrollProcessingFee_" + Item.id).val();
                NewItem.policyManager = $("#txtPolicyManager_" + Item.id).val();
                NewItem.Licenses_and_Permits = $("#txtLicenses_and_Permits_" + Item.id).val();
                NewItem.ratingSoftware = $("#txtRatingSoftware_" + Item.id).val();
                NewItem.motorVehicleReport = $("#txtMotorVehicleReport_" + Item.id).val();
                NewItem.loanDueFromFranchisee = $("#txtLoanDueFromFranchisee_" + Item.id).val();
                NewItem.minimumRoyaltyFee = $("#txtMinimumRoyaltyFee_" + Item.id).val();
                NewItem.servicingFee = $("#txtServicingFee_" + Item.id).val();
                NewItem.tradeShows = $("#txtTradeShows_" + Item.id).val();
                NewItem.trustAccountingAR = $("#txtTrustAccountingAR_" + Item.id).val();
                NewItem.telephone = $("#txtTelephone_" + Item.id).val();
                NewItem.postage = $("#txtPostage_" + Item.id).val();
                NewItem.televisionRadio = $("#txtTelevisionRadio_" + Item.id).val();
                NewItem.trustAcctShortageOverage = $("#txtTrustAcctShortageOverage_" + Item.id).val();
                NewItem.internet = $("#txtInternet_" + Item.id).val();
                NewItem.onHoldRecording = $("#txtOnHoldRecording_" + Item.id).val();
                NewItem.scanningViolationPenalty = $("#txtScanningViolationPenalty_" + Item.id).val();
                NewItem.depositViolationPenalty = $("#txtDepositViolationPenalty_" + Item.id).val();
                NewItem.badDebts = $("#txtBadDebts_" + Item.id).val();
                NewItem.printRT = $("#txtPrintRT_" + Item.id).val();
                NewItem.reimbursedFeeOther = $("#txtReimbursedFeeOther_" + Item.id).val();
                NewItem.gas = $("#txtgas_" + Item.id).val();
                NewItem.DAndSMembership = $("#txtDAndSMembership_" + Item.id).val();
                NewItem.EAndOInsurance = $("#txtEAndOInsurance_" + Item.id).val();
                NewItem.rent = $("#txtrent_" + Item.id).val();
                NewItem.supplies = $("#txtsupplies_" + Item.id).val();
                NewItem.buildingOrOffice = $("#txtbuildingOrOffice_" + Item.id).val();
                NewItem.referralFee = $("#txtreferralFee_" + Item.id).val();
                NewItem.smallEquipPurchases = $("#txtsmallEquipPurchases_" + Item.id).val();
                NewItem.smallFFAndE = $("#txtsmallFFAndE_" + Item.id).val();
                NewItem.legalFee = $("#txtlegalFee_" + Item.id).val();
                NewItem.camCharges = $("#txtcamCharges_" + Item.id).val();
                NewItem.cellphone = $("#txtcellphone_" + Item.id).val();
                NewItem.securityRT = $("#txtsecurityRT_" + Item.id).val();
                NewItem.electricity = $("#txtelectricity_" + Item.id).val();
                NewItem.accountingViolationPenalty = $("#txtaccountingViolationPenalty_" + Item.id).val();
                NewItem.advertising = $("#txtadvertising_" + Item.id).val();
                NewItem.DOIAppointmentFee = $("#txtDOIAppointmentFee_" + Item.id).val();
                NewItem.notes = $("#txtnotes_" + Item.id).val();
                NewItem.DOILicenseFee = $("#txtDOILicenseFee_" + Item.id).val();
                NewItem.entrepreneurMagazine = $("#txtentrepreneurMagazine_" + Item.id).val();
                NewItem.franchiseGratorLeads = $("#txtfranchiseGratorLeads_" + Item.id).val();
                NewItem.franchiseGuideSupplies = $("#txtfranchiseGuideSupplies_" + Item.id).val();
                NewItem.franchiseTimeMagazine = $("#txtfranchiseTimeMagazine_" + Item.id).val();
                NewItem.leads = $("#txtleads_" + Item.id).val();
                NewItem.SEO = $("#txtSEO_" + Item.id).val();
                NewItem.renewalFee = $("#txtrenewalFee_" + Item.id).val();
                NewItem.incentive = $("#txtincentive_" + Item.id).val();
                NewItem.maxShield = $("#txtmaxShield_" + Item.id).val();
                NewItem.totalDeductions = $("#txttotalDeductions_" + Item.id).val();
                NewItem.previousUnpaidBalanace = $("#txtpreviousUnpaidBalanace_" + Item.id).val();
                NewItem.balanceDueToOrFromFranchise = $("#txtbalanceDueToOrFromFranchise_" + Item.id).val();
                ItemList.push(NewItem);
                $.ajax({
                    type: "POST",
                    url: "UpdateRECONRecords",
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
        }
    }
}


$(document).ready(function () {
    Page.Initialize();
});



























//("Store", "storeNo"));
//( ("Date", "dateRT"));
//( ("Gross Commissions", "grossCommisions"));
//( ("Commissions Percentage Tier 1", "commissionsPercentTier1"));
//( ("Commissions Tier 1", "commissionsTier1"));
//( ("Commissions Percentage Tier 2", "commissionsPercentTier2"));
//( ("Commissions Tier 2", "commisionsTier2"));
//( ("Total Commissions", "totalCommisions"));
//( ("Tax Preparation Revenue", "taxPrepRevenue"));
//( ("Number of Tax Returns", "numberOfTaxReturns"));
//( ("Royalty Per Return", "royaltyPerReturn"));
//( ("Tax Royalties", "taxRoyalties"));
//( ("Net Tax Revenue", "netTaxRevenue"));
//( ("Total Revenue", "totalRevenue"));
//( ("Hourly Wages", "hourlyWages"));
//( ("Overtime", "overtime"));
//( ("Bonus & Commissions", "bonusAndCommisions"));
//( ("Payroll Taxes - ER", "payrollTaxes_ER"));
//( ("Workers Comp Insurance", "workersCompInsurance"));
//( ("Payroll Processing Fees", "payrollProcessingFee"));
//( ("Policy Manager", "policyManager"));
//( ("Licenses and Permits", "Licenses_and_Permits"));
//( ("Rating Software", "ratingSoftware"));
//( ("Motor Vehicle Reports", "motorVehicleReport"));
//( ("Loan Due From Franchisee", "loanDueFromFranchisee"));
//( ("Minimum Royalty Fee", "minimumRoyaltyFee"));
//( ("Servicing Fee", "servicingFee"));
//( ("Trade Shows", "tradeShows"));
//( ("Trust Acctg - A/R", "trustAccountingAR"));
//( ("Telephone", "telephone"));
//( ("Postage", "postage"));
//( ("Television/Radio", "televisionRadio"));
//( ("Licenses & Permits", "Licenses_Permits"));
//( ("Trust Acct Shortage/Overage", "trustAcctShortageOverage"));
//( ("Internet", "internet"));
//( ("On Hold Recording", "onHoldRecording"));
//( ("Scanning Violation Penalty", "scanningViolationPenalty"));
//( ("Deposit Violation Penalty", "depositViolationPenalty"));
//( ("Bad Debts", "badDebts"));
//( ("Print", "printRT"));
//( ("Reimbursed Fees - Other", "reimbursedFeeOther"));
//( ("Gas", "gas"));
//( ("D&S Memberships", "DAndSMembership"));
//( ("E&O Insurance", "EAndOInsurance"));
//( ("Rent", "rent"));
//( ("Supplies", "supplies"));
//( ("Building/Office", "buildingOrOffice"));
//( ("Referral Fees", "referralFee"));
//( ("Small Equip Purchases Under$500", "smallEquipPurchases"));
//( ("Small FF&E Under$500", "smallFFAndE"));
//( ("Legal Fees", "legalFee"));
//( ("CAM Charges", "camCharges"));
//( ("Cell Phone", "cellphone"));
//( ("Security", "securityRT"));
//( ("Electricity", "electricity"));
//( ("Accounting Violation Penalty", "accountingViolationPenalty"));
//( ("Advertising", "advertising"));
//( ("DOI Appointment Fees", "DOIAppointmentFee"));
//( ("Notes", "notes"));
//( ("DOI License Fee", "DOILicenseFee"));
//( ("Entrepreneur Magazine", "entrepreneurMagazine"));
//( ("Franchise Gator Leads", "franchiseGratorLeads"));
//( ("Franchise Guide Supplies", "franchiseGuideSupplies"));
//( ("Franchise Times Magazine", "franchiseTimeMagazine"));
//( ("Leads", "leads"));
//( ("SEO (Search Engine Optimization)", "SEO"));
//( ("Reals", "realFee"));
//( ("Tax Software & Services", "taxSoftwareServices"));
//( ("Other Transactions", "otherTransactions"));
//( ("Previous Unpaid Balance", "previousUnpaidBalanace"));
//( ("Total Deductions", "totalDeductions"));
//( ("Balance Due To/(From) Franchise", "balanceDueToOrFromFranchise"));
//( ("Email", "email1"));
//( ("Email 2", "email2"));
//( ("Email 3", "email3"));
//( ("Email 4", "email4"));
//( ("Email 5", "email5"));





