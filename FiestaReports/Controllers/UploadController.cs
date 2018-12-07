using FiestaReports.Models;
using Excel = Microsoft.Office.Interop.Excel;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data.SqlClient;
using System.Data.OleDb;
using System.Data;
using System.Text.RegularExpressions;
using System.Text;

namespace FiestaReports.Controllers
{
    public class UploadController : Controller
    {

        FiestaZohoDatabaseEntities fze;
        // GET: Upload
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult UploadExcel()
        {
            return View();
        }
        [HttpPost]
        [ActionName("Upload")]
        public ActionResult UploadExcel(String nameReport)
        {
            /*******************************************************************
  Author      : Gopi
  Date        : 04/07/2017
  Description : Imports excel file data into specific reports table
 *******************************************************************/
            bool OverwriteDuplicates = false;
            bool IsDUP = true;
            MemoryStream DUPResult = null;
            try
            {
                ViewData["Message"] = "uploadFile.ContentType";
                int i = Request.Files.Count;
                HttpPostedFileBase uploadFile = Request.Files[0];
                if ((uploadFile.ContentLength > 0) && (uploadFile != null))
                {
                    //if (uploadFile.ContentType == "application/vnd.ms-excel" || uploadFile.ContentType == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                    if (true)
                    {
                        string[] currencyColumns = { };
                        string reportTable = string.Format("Reports.Fiesta_{0}TableDUP",nameReport);
                        
                        List <SqlBulkCopyColumnMapping> columns = new List<SqlBulkCopyColumnMapping>();

                        string filename = Path.GetFileName(uploadFile.FileName);
                        string tempDataReport = "[" + filename + "]";
                        string extn = filename.Split('.').ElementAt(1);
                        Guid id = Guid.NewGuid();
                        string file = id.ToString() + '.' + extn;
                        file = Server.MapPath("~/UploadedFiles/" + nameReport) + file;
                        uploadFile.SaveAs(file);
                        using (fze = new FiestaZohoDatabaseEntities())
                        {
                            fze.InsertFileUploads(filename, Convert.ToString(Session["UserEmail"]), nameReport, id);
                        }
                        
                        var OverWrite = Request["hdnOverwrite" + nameReport];
                        if (OverWrite == "true")
                            OverwriteDuplicates = true;
                        #region all  
                        #region nameReport == "RP"
                        if (nameReport == "RP")
                        {
                            columns.Add(new SqlBulkCopyColumnMapping("EmpId", "EmpId"));
                            columns.Add(new SqlBulkCopyColumnMapping("Store", "storeNo"));
                            columns.Add(new SqlBulkCopyColumnMapping("Date", "dateRP"));
                            columns.Add(new SqlBulkCopyColumnMapping("PolicyNumber", "policyNumber"));
                            columns.Add(new SqlBulkCopyColumnMapping("Narrative", "narrative"));
                            columns.Add(new SqlBulkCopyColumnMapping("Insured", "insured"));
                            columns.Add(new SqlBulkCopyColumnMapping("Amount", "payments"));
                            columns.Add(new SqlBulkCopyColumnMapping("Check Issued Date", "checkIssuedDate"));
                            /*
                            columns.Add(new SqlBulkCopyColumnMapping("Email", "email1"));
                            columns.Add(new SqlBulkCopyColumnMapping("Email 2", "email2"));
                            columns.Add(new SqlBulkCopyColumnMapping("Email 3", "email3"));
                            columns.Add(new SqlBulkCopyColumnMapping("Email 4", "email4"));
                            columns.Add(new SqlBulkCopyColumnMapping("Email 5", "email5"));
                            columns.Add(new SqlBulkCopyColumnMapping("Email 6", "email6"));
                            columns.Add(new SqlBulkCopyColumnMapping("Report Month", "reportMonth"));
                            columns.Add(new SqlBulkCopyColumnMapping("Month Number", "reportNumber"));
                            */
                            currencyColumns = new string[] { "Amount" };
                            //reportTable = "Reports.Fiesta_RPTable";
                        }
                        #endregion
                        #region nameReport == "AR"
                        else if (nameReport == "AR")
                        {
                            columns.Add(new SqlBulkCopyColumnMapping("EmpId", "EmpId"));
                            columns.Add(new SqlBulkCopyColumnMapping("Store", "StoreNo"));
                            columns.Add(new SqlBulkCopyColumnMapping("ReconType", "reconType"));
                            columns.Add(new SqlBulkCopyColumnMapping("TransactionDate", "transactionDate"));
                            columns.Add(new SqlBulkCopyColumnMapping("InternalReference", "internalReference"));
                            columns.Add(new SqlBulkCopyColumnMapping("Amount", "amount"));
                            columns.Add(new SqlBulkCopyColumnMapping("Narrative", "narrative"));
                            columns.Add(new SqlBulkCopyColumnMapping("ExternalReference", "externalReference"));
                            columns.Add(new SqlBulkCopyColumnMapping("Status", "status"));
                            /*
                            columns.Add(new SqlBulkCopyColumnMapping("Email", "email1"));
                            columns.Add(new SqlBulkCopyColumnMapping("Email 2", "email2"));
                            */
                            currencyColumns = new string[] { "Amount" };
                            
                            //reportTable = "Reports.Fiesta_ARTable";
                        }
                        #endregion
                        #region nameReport == "RECON"
                        else if (nameReport == "RECON")
                        {
                            columns.Add(new SqlBulkCopyColumnMapping("EmpId", "EmpId"));
                            columns.Add(new SqlBulkCopyColumnMapping("Store", "storeNo"));
                            columns.Add(new SqlBulkCopyColumnMapping("Date", "dateRT"));
                            columns.Add(new SqlBulkCopyColumnMapping("Gross Commissions", "grossCommisions"));
                            columns.Add(new SqlBulkCopyColumnMapping("Commissions Percentage Tier 1", "commissionsPercentTier1"));
                            columns.Add(new SqlBulkCopyColumnMapping("Commissions Tier 1", "commissionsTier1"));
                            columns.Add(new SqlBulkCopyColumnMapping("Commissions Percentage Tier 2", "commissionsPercentTier2"));
                            columns.Add(new SqlBulkCopyColumnMapping("Commissions Tier 2", "commisionsTier2"));
                            columns.Add(new SqlBulkCopyColumnMapping("Total Commissions", "totalCommisions"));
                            columns.Add(new SqlBulkCopyColumnMapping("Tax Preparation Revenue", "taxPrepRevenue"));
                            columns.Add(new SqlBulkCopyColumnMapping("Number of Tax Returns", "numberOfTaxReturns"));
                            columns.Add(new SqlBulkCopyColumnMapping("Royalty Per Return", "royaltyPerReturn"));
                            columns.Add(new SqlBulkCopyColumnMapping("Tax Royalties", "taxRoyalties"));
                            columns.Add(new SqlBulkCopyColumnMapping("Net Tax Revenue", "netTaxRevenue"));
                            columns.Add(new SqlBulkCopyColumnMapping("Total Revenue", "totalRevenue"));
                            columns.Add(new SqlBulkCopyColumnMapping("Hourly Wages", "hourlyWages"));
                            columns.Add(new SqlBulkCopyColumnMapping("Overtime", "overtime"));
                            columns.Add(new SqlBulkCopyColumnMapping("Bonus & Commissions", "bonusAndCommisions"));
                            columns.Add(new SqlBulkCopyColumnMapping("Payroll Taxes - ER", "payrollTaxes_ER"));
                            columns.Add(new SqlBulkCopyColumnMapping("Workers Comp Insurance", "workersCompInsurance"));
                            columns.Add(new SqlBulkCopyColumnMapping("Payroll Processing Fees", "payrollProcessingFee"));
                            columns.Add(new SqlBulkCopyColumnMapping("Policy Manager", "policyManager"));
                            columns.Add(new SqlBulkCopyColumnMapping("Licenses and Permits", "Licenses_and_Permits"));
                            columns.Add(new SqlBulkCopyColumnMapping("Rating Software", "ratingSoftware"));
                            columns.Add(new SqlBulkCopyColumnMapping("Motor Vehicle Reports", "motorVehicleReport"));
                            columns.Add(new SqlBulkCopyColumnMapping("Loan Due From Franchisee", "loanDueFromFranchisee"));
                            columns.Add(new SqlBulkCopyColumnMapping("Minimum Royalty Fee", "minimumRoyaltyFee"));
                            columns.Add(new SqlBulkCopyColumnMapping("Servicing Fee", "servicingFee"));
                            columns.Add(new SqlBulkCopyColumnMapping("Trade Shows", "tradeShows"));
                            columns.Add(new SqlBulkCopyColumnMapping("Trust Acctg - A/R", "trustAccountingAR"));
                            columns.Add(new SqlBulkCopyColumnMapping("Telephone", "telephone"));
                            columns.Add(new SqlBulkCopyColumnMapping("Postage", "postage"));
                            columns.Add(new SqlBulkCopyColumnMapping("Television/Radio", "televisionRadio"));
                            columns.Add(new SqlBulkCopyColumnMapping("Licenses & Permits", "Licenses_Permits"));
                            columns.Add(new SqlBulkCopyColumnMapping("Trust Acct Shortage/Overage", "trustAcctShortageOverage"));
                            columns.Add(new SqlBulkCopyColumnMapping("Internet", "internet"));
                            columns.Add(new SqlBulkCopyColumnMapping("On Hold Recording", "onHoldRecording"));
                            columns.Add(new SqlBulkCopyColumnMapping("Scanning Violation Penalty", "scanningViolationPenalty"));
                            //columns.Add(new SqlBulkCopyColumnMapping("Scanning Violation Fees", "scanningViolationPenalty"));
                            columns.Add(new SqlBulkCopyColumnMapping("Deposit Violation Penalty", "depositViolationPenalty"));
                            //columns.Add(new SqlBulkCopyColumnMapping("Deposit Violation Fees", "depositViolationPenalty"));
                            columns.Add(new SqlBulkCopyColumnMapping("Bad Debts", "badDebts"));
                            columns.Add(new SqlBulkCopyColumnMapping("Print", "printRT"));
                            columns.Add(new SqlBulkCopyColumnMapping("Reimbursed Fees - Other", "reimbursedFeeOther"));
                            columns.Add(new SqlBulkCopyColumnMapping("Gas", "gas"));
                            columns.Add(new SqlBulkCopyColumnMapping("D&S Memberships", "DAndSMembership"));
                            columns.Add(new SqlBulkCopyColumnMapping("E&O Insurance", "EAndOInsurance"));
                            columns.Add(new SqlBulkCopyColumnMapping("Rent", "rent"));
                            columns.Add(new SqlBulkCopyColumnMapping("Supplies", "supplies"));
                            columns.Add(new SqlBulkCopyColumnMapping("Building/Office", "buildingOrOffice"));
                            columns.Add(new SqlBulkCopyColumnMapping("Referral Fees", "referralFee"));
                            columns.Add(new SqlBulkCopyColumnMapping("Small Equip Purchases Under$500", "smallEquipPurchases"));
                            columns.Add(new SqlBulkCopyColumnMapping("Small FF&E Under$500", "smallFFAndE"));
                            columns.Add(new SqlBulkCopyColumnMapping("Legal Fees", "legalFee"));
                            columns.Add(new SqlBulkCopyColumnMapping("CAM Charges", "camCharges"));
                            columns.Add(new SqlBulkCopyColumnMapping("Cell Phone", "cellphone"));
                            columns.Add(new SqlBulkCopyColumnMapping("Security", "securityRT"));
                            columns.Add(new SqlBulkCopyColumnMapping("Electricity", "electricity"));
                            //columns.Add(new SqlBulkCopyColumnMapping("AR Violation Fees", "accountingViolationPenalty"));
                            columns.Add(new SqlBulkCopyColumnMapping("Accounting Violation Penalty", "accountingViolationPenalty"));
                            columns.Add(new SqlBulkCopyColumnMapping("Advertising", "advertising"));
                            columns.Add(new SqlBulkCopyColumnMapping("DOI Appointment Fees", "DOIAppointmentFee"));
                            columns.Add(new SqlBulkCopyColumnMapping("Notes", "notes"));
                            columns.Add(new SqlBulkCopyColumnMapping("DOI License Fee", "DOILicenseFee"));
                            columns.Add(new SqlBulkCopyColumnMapping("Entrepreneur Magazine", "entrepreneurMagazine"));
                            columns.Add(new SqlBulkCopyColumnMapping("Franchise Gator Leads", "franchiseGratorLeads"));
                            columns.Add(new SqlBulkCopyColumnMapping("Franchise Guide Supplies", "franchiseGuideSupplies"));
                            columns.Add(new SqlBulkCopyColumnMapping("Franchise Times Magazine", "franchiseTimeMagazine"));
                            columns.Add(new SqlBulkCopyColumnMapping("Leads", "leads"));
                            columns.Add(new SqlBulkCopyColumnMapping("SEO (Search Engine Optimization)", "SEO"));
                            columns.Add(new SqlBulkCopyColumnMapping("Renewals", "renewalFee"));
                            //columns.Add(new SqlBulkCopyColumnMapping("Incentive", "incentive"));
                            //columns.Add(new SqlBulkCopyColumnMapping("Max Shield", "maxShield"));
                            columns.Add(new SqlBulkCopyColumnMapping("Tax Software & Services", "taxSoftwareServices"));
                            columns.Add(new SqlBulkCopyColumnMapping("Other Transactions", "otherTransactions"));
                            columns.Add(new SqlBulkCopyColumnMapping("Previous Unpaid Balance", "previousUnpaidBalanace"));
                            columns.Add(new SqlBulkCopyColumnMapping("Total Deductions", "totalDeductions"));
                            columns.Add(new SqlBulkCopyColumnMapping("Balance Due To/(From) Franchise", "balanceDueToOrFromFranchise"));
                            /*
                            columns.Add(new SqlBulkCopyColumnMapping("Email", "email1"));
                            columns.Add(new SqlBulkCopyColumnMapping("Email 2", "email2"));
                            columns.Add(new SqlBulkCopyColumnMapping("Email 3", "email3"));
                            columns.Add(new SqlBulkCopyColumnMapping("Email 4", "email4"));
                            columns.Add(new SqlBulkCopyColumnMapping("Email 5", "email5"));
                            */
                            currencyColumns = new string[] {"Gross Commissions","Commissions Percentage Tier 1","Commissions Tier 1","Commissions Percentage Tier 2","Commissions Tier 2","Total Commissions","Tax Preparation Revenue","Number of Tax Returns",
                                                        "Royalty Per Return","Tax Royalties","Net Tax Revenue","Total Revenue","Hourly Wages","Overtime","Bonus & Commissions","Payroll Taxes - ER","Workers Comp Insurance","Payroll Processing Fees",
                                                        "Policy Manager","Licenses and Permits","Rating Software","Motor Vehicle Reports","Loan Due From Franchisee","Minimum Royalty Fee","Servicing Fee","Trade Shows","Trust Acctg - A/R","Telephone","Postage",
                                                        "Television/Radio","Licenses & Permits","Trust Acct Shortage/Overage","Internet","On Hold Recording","Scanning Violation Fees","Scanning Violation Penalty","Deposit Violation Fees","Deposit Violation Penalty","Bad Debts","Print","Reimbursed Fees - Other",
                                                        "Gas","D&S Memberships","E&O Insurance","Rent","Supplies","Building/Office","Referral Fees","Small Equip Purchases Under$500","Small FF&E Under$500","Legal Fees","CAM Charges","Cell Phone","Security","Electricity",
                                                        "AR Violation Fees","Accounting Violation Penalty","Advertising","DOI Appointment Fees","DOI License Fee","Entrepreneur Magazine","Franchise Gator Leads","Franchise Guide Supplies","Franchise Times Magazine","Leads",
                                                        "SEO (Search Engine Optimization)","Renewal Fee","Renewals","Incentive","Max Shield","Tax Software & Services","Other Transactions","Previous Unpaid Balance","Total Deductions","Balance Due To/(From) Franchise"};
                            



                        }
                        #endregion
                        #region nameReport == "DD"
                        else if (nameReport == "DD")
                        {
                            columns.Add(new SqlBulkCopyColumnMapping("EmpId", "EmpId"));
                            columns.Add(new SqlBulkCopyColumnMapping("Store", "storeNo"));
                            columns.Add(new SqlBulkCopyColumnMapping("Report Date", "reportDate"));
                            columns.Add(new SqlBulkCopyColumnMapping("End of Day Deposit", "EODDeposit"));
                            columns.Add(new SqlBulkCopyColumnMapping("Actual Deposit", "actualDeposit"));
                            columns.Add(new SqlBulkCopyColumnMapping("Deposit Over/(Short)", "depositOver"));
                            columns.Add(new SqlBulkCopyColumnMapping("Date Deposit Made", "depositDate"));
                            columns.Add(new SqlBulkCopyColumnMapping("End of Day Credit Cards", "EODCreditCards"));
                            columns.Add(new SqlBulkCopyColumnMapping("Actual Credit Cards", "actualCreditCards"));
                            columns.Add(new SqlBulkCopyColumnMapping("Over/(Short) Credit Cards", "overCreditCards"));
                            columns.Add(new SqlBulkCopyColumnMapping("VOID Credits", "voidCredits"));
                            columns.Add(new SqlBulkCopyColumnMapping("Payout To/(From)", "payoutTo"));
                            columns.Add(new SqlBulkCopyColumnMapping("Payout Check", "payoutCheck"));
                            columns.Add(new SqlBulkCopyColumnMapping("Scanning Violation Fees", "scanningViolationFees"));
                            columns.Add(new SqlBulkCopyColumnMapping("Deposit Violation Fees", "depositViolationFees"));
                            columns.Add(new SqlBulkCopyColumnMapping("A/R Violation Fees", "ARViolationFees"));
                            columns.Add(new SqlBulkCopyColumnMapping("Violation Fees Total", "violationFeesTotal"));
                            columns.Add(new SqlBulkCopyColumnMapping("Comments", "comments"));
                            /*
                            columns.Add(new SqlBulkCopyColumnMapping("Report Month", "reportMonth"));
                            columns.Add(new SqlBulkCopyColumnMapping("Email", "email1"));
                            columns.Add(new SqlBulkCopyColumnMapping("Email 2", "email2"));
                            columns.Add(new SqlBulkCopyColumnMapping("Email 3", "email3"));
                            columns.Add(new SqlBulkCopyColumnMapping("Email 4", "email4"));
                            columns.Add(new SqlBulkCopyColumnMapping("Email 5", "email5"));
                            columns.Add(new SqlBulkCopyColumnMapping("Email 6", "email6"));
                            columns.Add(new SqlBulkCopyColumnMapping("Email_Store", "emailStore"));
                            columns.Add(new SqlBulkCopyColumnMapping("Month Number", "monthNumber"));
                            */
                            currencyColumns = new string[] { "End of Day Deposit", "Actual Deposit", "End of Day Credit Cards", "Actual Credit Cards", "VOID Credits", "Payout Check", "Scanning Violation Fees", "Deposit Violation Fees", "A/R Violation Fees", "Violation Fees Total", "Month Number" };
                            
                        }
                        #endregion
                        #region nameReport == "EOD"
                        else if (nameReport == "EOD")
                        {
                            columns.Add(new SqlBulkCopyColumnMapping("EmpId", "EmpId"));
                            columns.Add(new SqlBulkCopyColumnMapping("Store", "storeNo"));
                            currencyColumns = new string[] { "payments", "reportNumber" };
                            
                        }
                        #endregion
                        #region nameReport == "COMMISSION"
                        else if (nameReport == "COMMISSION")
                        {
                            IsDUP = false;
                            if (IsDUP) columns.Add(new SqlBulkCopyColumnMapping("EmpId", "EmpId"));
                            else reportTable = string.Format("Reports.Fiesta_{0}Table", nameReport);
                            columns.Add(new SqlBulkCopyColumnMapping("date", "date_CT"));
                            columns.Add(new SqlBulkCopyColumnMapping("Type", "typeCT"));
                            columns.Add(new SqlBulkCopyColumnMapping("Name", "name"));
                            columns.Add(new SqlBulkCopyColumnMapping("Credit", "credit"));
                            columns.Add(new SqlBulkCopyColumnMapping("Debit", "debit"));
                            //columns.Add(new SqlBulkCopyColumnMapping("Balance", "balance"));
                            columns.Add(new SqlBulkCopyColumnMapping("Store", "StoreNo"));
                            currencyColumns = new string[] { "Credit", "Debit" };
                        }
                        #endregion
                        #region nameReport == "EFT"
                        else if (nameReport == "EFT")
                        {
                            columns.Add(new SqlBulkCopyColumnMapping("EmpId", "EmpId"));
                            columns.Add(new SqlBulkCopyColumnMapping("Store Number", "StoreNo"));
                            columns.Add(new SqlBulkCopyColumnMapping("Date of Receipt", "dateOfReceipt"));
                            columns.Add(new SqlBulkCopyColumnMapping("Name of Customer", "nameOfCustomer"));
                            columns.Add(new SqlBulkCopyColumnMapping("Policy Number", "policyNumber"));
                            columns.Add(new SqlBulkCopyColumnMapping("Insurance Company", "insuranceCompany"));
                            columns.Add(new SqlBulkCopyColumnMapping("Premium", "premium"));
                            /*
                            columns.Add(new SqlBulkCopyColumnMapping("Email", "email1"));
                            columns.Add(new SqlBulkCopyColumnMapping("Email 2", "email2"));
                            columns.Add(new SqlBulkCopyColumnMapping("Email 3", "email3"));
                            columns.Add(new SqlBulkCopyColumnMapping("Email 4", "email4"));
                            columns.Add(new SqlBulkCopyColumnMapping("Email 5", "email5"));
                            */
                            currencyColumns = new string[] { "Premium" };
                        }
                        #endregion


                        if (extn.Contains("csv"))
                        {
                            if (IsDUP)
                            {
                                TempData["isDup"] = true;
                                TempData["ReportTable"] = reportTable;
                                TempData["OverwriteDuplicates"] = OverwriteDuplicates;
                            }
                            uploadThisFileCSV(file, reportTable, nameReport, currencyColumns, columns, IsDUP, OverwriteDuplicates);
                            //SP que regresa una tabla con registros dups
                            //Crear el CSV
                            TempData[nameReport + "_Message"] = tempDataReport + " file has been uploaded";
                        }
                        else
                        {
                            uploadThisFile(file, reportTable, currencyColumns, columns);
                            TempData[nameReport + "_Message"] = tempDataReport + " file has been uploaded";
                        }

                        #endregion
                    }
                    else
                    {
                        TempData["ExcelMissing_Message"] = "";
                        TempData["ExcelMissing_Message"] = "must select an CSV file to upload";
                    }

                }
                else
                {
                    TempData["ExcelMissing_Message"] = "";
                    TempData["ExcelMissing_Message"] = "must select an CSV file to upload";
                }
            }
            catch (Exception ex)
            {
                TempData["MessageException"] = "The following error occured: " + ex.Message;

            }
            return View("UploadExcel");
        }

        private void uploadThisFile(string file, string sqlTable, string[] currencyColumns, List<SqlBulkCopyColumnMapping> columnMappings)
        {
            Excel.Application xlApp = new Excel.Application();
            Excel.Workbook xlWorkbook = xlApp.Workbooks.Open(file);
            Excel._Worksheet xlWorksheet = xlWorkbook.Sheets[1];
            Excel.Range xlRange = xlWorksheet.UsedRange;
            System.Data.OleDb.OleDbConnection MyConnection;
            System.Data.DataTable DtSet;
            System.Data.OleDb.OleDbDataAdapter MyCommand;
            MyConnection = new System.Data.OleDb.OleDbConnection(string.Format(System.Configuration.ConfigurationManager.AppSettings["excelConnString"], file));
            MyCommand = new System.Data.OleDb.OleDbDataAdapter(string.Format("select * from [{0}$]", xlWorksheet.Name), MyConnection);
            MyCommand.TableMappings.Add("Table", "TestTable");
            DtSet = new System.Data.DataTable();
            MyCommand.Fill(DtSet);

            foreach (DataRow row in DtSet.Rows)
            {
                foreach (DataColumn column in DtSet.Columns)
                {
                    string value = row[column].ToString();
                    //
                    if (currencyColumns.Contains(column.ColumnName))
                    {
                        if (string.IsNullOrEmpty(value) || string.IsNullOrWhiteSpace(value))
                        {
                            row[column] = 0.0;
                        }
                        else
                        {
                            decimal dValue = 0;
                            value = value.Replace("$", "");
                            value = value.Replace("€", "");
                            if (decimal.TryParse(value, out dValue))
                            {
                                row[column] = dValue;
                            }
                            else
                            {
                                row[column] = 0.0;
                            }
                        }
                    }
                    else
                    {
                        if (string.IsNullOrEmpty(value) || string.IsNullOrWhiteSpace(value))
                        {
                            row[column] = "";
                        }
                    }
                }
            }
            SqlBulkCopy bulkcopy = new SqlBulkCopy(System.Configuration.ConfigurationManager.AppSettings["SPConnString"]);
            bulkcopy.DestinationTableName = sqlTable;
            foreach (SqlBulkCopyColumnMapping col in columnMappings)
                bulkcopy.ColumnMappings.Add(col);
            bulkcopy.WriteToServer(DtSet);
            MyConnection.Close();
            xlWorkbook.Close();
            xlApp.Quit();

        }

        private void uploadThisFileCSV(string file, string sqlTable, string reportName, string[] currencyColumns, List<SqlBulkCopyColumnMapping> columnMappings, bool isDUP, bool overwriteDuplicates)
        {
            int UserId = int.Parse(Session["UserID"].ToString());
            var lines = System.IO.File.ReadAllLines(file);
            if (lines.Count() == 0) return;
            var columns = lines[0].Split(',');
            var table = new DataTable();
            foreach (var c in columns)
                table.Columns.Add(c);
            if (isDUP)
            {
                table.Columns.Add("EmpId");
            }

            int length = lines.Count() - 1;
            Regex rexCsvSplitter = new Regex(@",(?=(?:[^""]*""[^""]*"")*(?![^""]*""))");
            Regex rexNegativeNumbers = new Regex(@"(?<=\()\d+(?:\.\d+)?(?=\))");
            for (int i = 1; i <= length; i++)
            {
                string sLine = lines[i];
                string[] values = rexCsvSplitter.Split(sLine);
                table.Rows.Add(values);
            }

            foreach (DataRow row in table.Rows)
            {
                if (isDUP)
                {
                    row["EmpId"] = UserId;
                }
                foreach (DataColumn column in table.Columns)
                {
                    string value = row[column].ToString();
                    if (currencyColumns.Contains(column.ColumnName))
                    {
                        if (string.IsNullOrEmpty(value) || string.IsNullOrWhiteSpace(value))
                        {
                            row[column] = 0.0;
                        }
                        else
                        {
                            decimal dValue = 0;
                            value = value.Replace("$", "");
                            value = value.Replace("€", "");
                            value = value.Replace(",", "");
                            value = value.Replace("\"", "");
                            value = value.Replace("%", "");
                            if (rexNegativeNumbers.IsMatch(value))
                            {
                                value = value.Replace("(", "");
                                value = value.Replace(")", "");
                                value = "-" + value;
                            }
                            if (decimal.TryParse(value, out dValue))
                            {
                                row[column] = dValue;
                                if (dValue == 0)
                                    row[column] = 0.0;
                            }
                            else
                            {
                                row[column] = 0.0;
                            }
                        }
                    }
                    else
                    {
                        if (column.ColumnName.ToLower().Contains("date"))
                        {
                            DateTime dValue;
                            if (DateTime.TryParse(value, out dValue))
                            {
                                row[column] = dValue.ToShortDateString();
                            }
                            else
                            {
                                row[column] = null;
                            }
                        }
                        else
                        {
                            if (string.IsNullOrEmpty(value) || string.IsNullOrWhiteSpace(value))
                            {
                                row[column] = "";
                            }
                        }
                    }
                }
            }

            var connectionString = System.Configuration.ConfigurationManager.AppSettings["SPConnString"];
            if (isDUP)
            {
                string spName = string.Format( "Clear{0}DUP", reportName);
                
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    SqlCommand StoredProcedureCommand = new SqlCommand(spName, connection);
                    StoredProcedureCommand.CommandType = CommandType.StoredProcedure;
                    SqlParameter DTParam = StoredProcedureCommand.Parameters.AddWithValue("@LoginId", UserId);
                    StoredProcedureCommand.ExecuteNonQuery();
                    connection.Close();
                }
            }
            var sqlBulk = new SqlBulkCopy(connectionString);
            sqlBulk.DestinationTableName = sqlTable;
            foreach (SqlBulkCopyColumnMapping col in columnMappings)
                sqlBulk.ColumnMappings.Add(col);
            sqlBulk.WriteToServer(table);
        }

        private string ToCSV(DataTable table)
        {
            var result = new StringBuilder();
            for (int i = 0; i < table.Columns.Count; i++)
            {
                result.Append(table.Columns[i].ColumnName);
                result.Append(i == table.Columns.Count - 1 ? "\n" : ",");
            }
            foreach (DataRow row in table.Rows)
            {
                for (int i = 0; i < table.Columns.Count; i++)
                {
                    result.Append(row[i].ToString());
                    result.Append(i == table.Columns.Count - 1 ? "\n" : ",");
                }
            }
            return result.ToString();
        }
        public ActionResult GetDuplicates(string rptName, bool overwriteDuplicates)
        {
            int UserId = int.Parse(Session["UserID"].ToString());
            string connectionString = System.Configuration.ConfigurationManager.AppSettings["SPConnString"];
            string spName = "";
            string fileName = "";

            if (rptName.Contains("EFT")) fileName = "EFT";
            else if (rptName.Contains("COMMISSION")) fileName = "COMMISSION";
            else if (rptName.Contains("RP")) fileName = "RP";
            else if (rptName.Contains("AR")) fileName = "AR";
            else if (rptName.Contains("RECON")) fileName = "RECON";
            else if (rptName.Contains("DD")) fileName = "DD";
            else if (rptName.Contains("EOD")) fileName = "EOD";

            spName = string.Format("Get_{0}Duplicates", fileName);

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                DataTable ResultsDT = new DataTable();
                DataSet ResultsDS = new DataSet();
                SqlCommand DuplicatesSP = new SqlCommand(spName, connection);
                DuplicatesSP.Parameters.AddWithValue("@LoginId", UserId);
                DuplicatesSP.Parameters.AddWithValue("@OverWriteDuplicates", overwriteDuplicates);
                DuplicatesSP.CommandType = CommandType.StoredProcedure;
                SqlDataAdapter da = new SqlDataAdapter();
                da.SelectCommand = DuplicatesSP;
                da.Fill(ResultsDS);
                DataTable dt = ResultsDS.Tables[0];
                var bytes = Encoding.GetEncoding("iso-8859-1").GetBytes(ToCSV(dt));
                MemoryStream stream = new MemoryStream(bytes);
                return new FileStreamResult(stream, "application/CSV") { FileDownloadName = fileName + "Duplicates.csv", };
            }
        }
    }
}