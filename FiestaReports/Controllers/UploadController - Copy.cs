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
                        string[] currencyColumns= { };
                        string reportTable="";
                        List<SqlBulkCopyColumnMapping> columns = new List<SqlBulkCopyColumnMapping>();

                        string filename = Path.GetFileName(uploadFile.FileName);                            
                        string tempDataReport = "[" + filename + "]";
                        string extn = filename.Split('.').ElementAt(1);
                        Guid id = Guid.NewGuid();
                        string file = id.ToString() + '.' + extn;
                        file = Server.MapPath("~/UploadedFiles/"+nameReport) + file;
                        uploadFile.SaveAs(file);
                            using (fze = new FiestaZohoDatabaseEntities())
                            {
                                fze.InsertFileUploads(filename, Convert.ToString(Session["UserEmail"]),nameReport, id);
                            }

                        #region all  
                        #region nameReport == "EOD"
                        if (nameReport == "EOD")
                        {
                            columns.Add(new SqlBulkCopyColumnMapping("Store", "storeNo"));
                            currencyColumns = new string[] { "payments", "reportNumber" };
                            reportTable = "Reports.Fiesta_EODTable";
                        }
                        #endregion
                        #region nameReport == "RECON"
                        else if (nameReport == "RECON")
                            {
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
                            columns.Add(new SqlBulkCopyColumnMapping("Licenses & Permits", "licensesAndPermit"));
                            columns.Add(new SqlBulkCopyColumnMapping("Trust Acct Shortage/Overage", "trustAcctShortageOverage"));
                            columns.Add(new SqlBulkCopyColumnMapping("Internet", "internet"));
                            columns.Add(new SqlBulkCopyColumnMapping("On Hold Recording", "onHoldRecording"));
                            columns.Add(new SqlBulkCopyColumnMapping("Scanning Violation Penalty", "scanningViolationPenalty"));
                            columns.Add(new SqlBulkCopyColumnMapping("Deposit Violation Penalty", "depositViolationPenalty"));
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
                            columns.Add(new SqlBulkCopyColumnMapping("Renewal Fee", "renewalFee"));
                            columns.Add(new SqlBulkCopyColumnMapping("Incentive", "incentive"));
                            columns.Add(new SqlBulkCopyColumnMapping("Max Shield", "maxShield"));
                            columns.Add(new SqlBulkCopyColumnMapping("Previous Unpaid Balance", "previousUnpaidBalanace"));
                            columns.Add(new SqlBulkCopyColumnMapping("Total Deductions", "totalDeductions"));
                            columns.Add(new SqlBulkCopyColumnMapping("Balance Due To/(From) Franchise", "balanceDueToOrFromFranchise"));
                            columns.Add(new SqlBulkCopyColumnMapping("Email", "email1"));
                            columns.Add(new SqlBulkCopyColumnMapping("Email 2", "email2"));
                            columns.Add(new SqlBulkCopyColumnMapping("Email 3", "email3"));
                            columns.Add(new SqlBulkCopyColumnMapping("Email 4", "email4"));
                            columns.Add(new SqlBulkCopyColumnMapping("Email 5", "email5"));
                            currencyColumns = new string[] {"Gross Commissions","Commissions Percentage Tier 1","Commissions Tier 1","Commissions Percentage Tier 2","Commissions Tier 2","Total Commissions","Tax Preparation Revenue","Number of Tax Returns",
                                                        "Royalty Per Return","Tax Royalties","Net Tax Revenue","Total Revenue","Hourly Wages","Overtime","Bonus & Commissions","Payroll Taxes - ER","Workers Comp Insurance","Payroll Processing Fees",
                                                        "Policy Manager","Licenses and Permits","Rating Software","Motor Vehicle Reports","Loan Due From Franchisee","Minimum Royalty Fee","Servicing Fee","Trade Shows","Trust Acctg - A/R","Telephone","Postage",
                                                        "Television/Radio","Licenses & Permits","Trust Acct Shortage/Overage","Internet","On Hold Recording","Scanning Violation Penalty","Deposit Violation Penalty","Bad Debts","Print","Reimbursed Fees - Other",
                                                        "Gas","D&S Memberships","E&O Insurance","Rent","Supplies","Building/Office","Referral Fees","Small Equip Purchases Under$500","Small FF&E Under$500","Legal Fees","CAM Charges","Cell Phone","Security","Electricity",
                                                        "Accounting Violation Penalty","Advertising","DOI Appointment Fees","DOI License Fee","Entrepreneur Magazine","Franchise Gator Leads","Franchise Guide Supplies","Franchise Times Magazine","Leads",
                                                        "SEO (Search Engine Optimization)","Renewal Fee","Incentive","Max Shield","Previous Unpaid Balance","Total Deductions","Balance Due To/(From) Franchise"};                                                            
                            reportTable = "Reports.Fiesta_ReconTable";
                        }
                        #endregion
                        #region nameReport == "EFT"
                        else if (nameReport == "EFT")
                        {
                            columns.Add(new SqlBulkCopyColumnMapping("Store Number", "StoreNo"));
                            columns.Add(new SqlBulkCopyColumnMapping("Date of Receipt", "dateOfReceipt"));
                            columns.Add(new SqlBulkCopyColumnMapping("Name of Customer", "nameOfCustomer"));
                            columns.Add(new SqlBulkCopyColumnMapping("Policy Number", "policyNumber"));
                            columns.Add(new SqlBulkCopyColumnMapping("Insurance Company", "insuranceCompany"));
                            columns.Add(new SqlBulkCopyColumnMapping("Premium", "premium"));
                            columns.Add(new SqlBulkCopyColumnMapping("Email", "email1"));
                            columns.Add(new SqlBulkCopyColumnMapping("Email 2", "email2"));
                            columns.Add(new SqlBulkCopyColumnMapping("Email 3", "email3"));
                            columns.Add(new SqlBulkCopyColumnMapping("Email 4", "email4"));
                            columns.Add(new SqlBulkCopyColumnMapping("Email 5", "email5"));
                            columns.Add(new SqlBulkCopyColumnMapping("Email 6", "email6"));
                            currencyColumns = new string[] { "Premium"};
                            reportTable = "Reports.Fiesta_EFTTable";
                        }
                        #endregion
                        #region nameReport == "AR"
                        else if (nameReport == "AR")
                        {
                            columns.Add(new SqlBulkCopyColumnMapping("Store", "StoreNo"));
                            columns.Add(new SqlBulkCopyColumnMapping("ReconType", "transactionDate"));
                            columns.Add(new SqlBulkCopyColumnMapping("TransactionDate", "internalReference"));
                            columns.Add(new SqlBulkCopyColumnMapping("InternalReference", "reconType"));
                            columns.Add(new SqlBulkCopyColumnMapping("Amount", "narrative"));
                            columns.Add(new SqlBulkCopyColumnMapping("Narrative", "externalReference"));
                            columns.Add(new SqlBulkCopyColumnMapping("ExternalReference", "amount"));
                            columns.Add(new SqlBulkCopyColumnMapping("Status", "status"));
                            columns.Add(new SqlBulkCopyColumnMapping("Report Month", "reportMonth"));
                            columns.Add(new SqlBulkCopyColumnMapping("Email", "email1"));
                            columns.Add(new SqlBulkCopyColumnMapping("Email 2", "email2"));
                            currencyColumns = new string[] { "payments", "reportNumber" };
                            reportTable = "Reports.Fiesta_ARTable";
                        }
                        #endregion
                        #region nameReport == "RP"
                        else if (nameReport == "RP")
                        {
                            columns.Add(new SqlBulkCopyColumnMapping("Store", "storeNo"));
                            columns.Add(new SqlBulkCopyColumnMapping("Date", "dateRP"));
                            columns.Add(new SqlBulkCopyColumnMapping("PolicyNumber", "policyNumber"));
                            columns.Add(new SqlBulkCopyColumnMapping("Narrative", "narrative"));
                            columns.Add(new SqlBulkCopyColumnMapping("Insured", "insured"));
                            columns.Add(new SqlBulkCopyColumnMapping("Amount", "payments"));
                            columns.Add(new SqlBulkCopyColumnMapping("Check Issued Date", "checkIssuedDate"));
                            columns.Add(new SqlBulkCopyColumnMapping("Email", "email1"));
                            columns.Add(new SqlBulkCopyColumnMapping("Email 2", "email2"));
                            columns.Add(new SqlBulkCopyColumnMapping("Email 3", "email3"));
                            columns.Add(new SqlBulkCopyColumnMapping("Email 4", "email4"));
                            columns.Add(new SqlBulkCopyColumnMapping("Email 5", "email5"));
                            columns.Add(new SqlBulkCopyColumnMapping("Email 6", "email6"));
                            columns.Add(new SqlBulkCopyColumnMapping("Report Month", "reportMonth"));
                            columns.Add(new SqlBulkCopyColumnMapping("Month Number", "reportNumber"));

                            currencyColumns = new string[] { "payments", "reportNumber" };
                            reportTable = "Reports.Fiesta_RPTable";
                        }
                        #endregion
                        #region nameReport == "COMMISSION"
                        else if (nameReport == "COMMISSION")
                        {
                            columns.Add(new SqlBulkCopyColumnMapping("date", "date_CT"));
                            columns.Add(new SqlBulkCopyColumnMapping("Type", "typeCT"));
                            columns.Add(new SqlBulkCopyColumnMapping("Name", "name"));
                            columns.Add(new SqlBulkCopyColumnMapping("Credit", "credit"));
                            columns.Add(new SqlBulkCopyColumnMapping("Debit", "debit"));
                            columns.Add(new SqlBulkCopyColumnMapping("Balances", "balance"));
                            columns.Add(new SqlBulkCopyColumnMapping("Store", "StoreNo"));

                            currencyColumns = new string[]{ "Credit", "Debit", "Currency", "Balances" };
                            reportTable = "Reports.Fiesta_CommissionsTable";
                            }
                        #endregion

                        if (extn.Contains("csv"))
                        {
                            uploadThisFileCSV(file, reportTable, currencyColumns, columns);
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
            MyConnection = new System.Data.OleDb.OleDbConnection(string.Format(System.Configuration.ConfigurationManager.AppSettings["excelConnString"],file));
            MyCommand = new System.Data.OleDb.OleDbDataAdapter(string.Format("select * from [{0}$]", xlWorksheet.Name), MyConnection);
            MyCommand.TableMappings.Add("Table", "TestTable");
            DtSet = new System.Data.DataTable();
            MyCommand.Fill(DtSet);
            
            foreach (DataRow row in DtSet.Rows)
            {
                foreach (DataColumn column in DtSet.Columns)
                {
                    string value = row[column].ToString();
                    if (currencyColumns.Contains(column.ColumnName) &&
                         (string.IsNullOrEmpty(value) || string.IsNullOrWhiteSpace(value)))
                    {
                        row[column] = 0.0;
                    }
                }
            }
            SqlBulkCopy bulkcopy = new SqlBulkCopy(System.Configuration.ConfigurationManager.AppSettings["SPConnString"]);
            bulkcopy.DestinationTableName = sqlTable;
            foreach( SqlBulkCopyColumnMapping col in columnMappings)
                bulkcopy.ColumnMappings.Add(col);
            bulkcopy.WriteToServer(DtSet);
            MyConnection.Close();
            xlWorkbook.Close();
            xlApp.Quit();

        }
        private void uploadThisFileCSV(string file, string sqlTable, string[] currencyColumns, List<SqlBulkCopyColumnMapping> columnMappings)
        {
            var lines = System.IO.File.ReadAllLines(file);
            if (lines.Count() == 0) return;
            var columns = lines[0].Split(',');
            var table = new DataTable();
            foreach (var c in columns)
                table.Columns.Add(c);
            int length = lines.Count() - 1;
            for (int i = 1; i <= length; i++) 
                table.Rows.Add(lines[i].Split(','));
            foreach (DataRow row in table.Rows)
            {
                foreach (DataColumn column in table.Columns)
                {
                    string value = row[column].ToString();

                    if (string.IsNullOrEmpty(value))
                        value = "";

                    if (currencyColumns.Contains(column.ColumnName) &&
                         (string.IsNullOrEmpty(value) || string.IsNullOrWhiteSpace(value)))
                    {
                        row[column] = 0.0;
                    }
                }
            }
            var connection = System.Configuration.ConfigurationManager.AppSettings["SPConnString"];
            var sqlBulk = new SqlBulkCopy(connection);
            sqlBulk.DestinationTableName = sqlTable;
            foreach (SqlBulkCopyColumnMapping col in columnMappings)
                sqlBulk.ColumnMappings.Add(col);
            sqlBulk.WriteToServer(table);
        }
    }
}