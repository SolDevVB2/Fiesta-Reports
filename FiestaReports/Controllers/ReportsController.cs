using FiestaReports.Models;
using FiestaReports.Utils;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;
namespace FiestaReports.Controllers
{
    public class ReportsController : Controller
    {
        // GET: Report
        #region VIEWS

        public ActionResult Index()
        {
            return View();
        }

        [AuthorizationFilter]
        public ActionResult CommissionsReport()
        {
            GetDateFilters();
            GetUserData();
            return View();
        }

        [AuthorizationFilter]
        public ActionResult RPReport()
        {
            GetDateFilters();
            GetUserData();
            return View();
        }

        [AuthorizationFilter]
        public ActionResult EFTReport()
        {
            GetDateFilters();
            GetUserData();
            return View();
        }

        [AuthorizationFilter]
        public ActionResult ARReport()
        {
            GetDateFilters();
            GetUserData();

            return View();
        }

        [AuthorizationFilter]
        public ActionResult EODReport()
        {
            GetDateFilters();
            return View();
        }

        [AuthorizationFilter]
        public ActionResult DDReport()
        {
            GetDateFilters();
            GetUserData();
            return View();
        }

        [AuthorizationFilter]
        public ActionResult ReconReport()
        {
            GetDateFilters();
            GetUserData();
            return View();
        }

        [AuthorizationFilter]
        public ActionResult ProfitAndLoss()
        {
            GetDateFilters();
            GetUserData();
            return View();
        }

        #endregion

        #region HTTP REQUESTS

        #region HTTP GET

        [HttpGet]
        public ActionResult GetCommissions(string StartDate, string EndDate)
        {
            List<List<Dictionary<string, object>>> Tables = GetStoredProcedureReport(StartDate, EndDate, "Get_Commission");
            var Result = new { Tables = Tables };
            return Json(Result, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult GetCommissionsChartCatalogs()
        {
            Dictionary<string, object> Parameters = new Dictionary<string, object>();
            Parameters.Add("userId", int.Parse(Session["UserID"].ToString()));
            List<List<Dictionary<string, object>>> Tables = GetStoredProcedureReportDynamicParameters(Parameters, "Get_Comission_Chart_Catalogs");
            var Result = new { Tables = Tables };
            return Json(Result, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult GetCommissionsChartData(string StartDate, string EndDate, string[] StoreNos, string[] Types)
        {
            DateTime dateStartDate = DateTime.Parse(StartDate);
            DateTime dateEndDate = DateTime.Parse(EndDate);
            int UserId = int.Parse(Session["UserID"].ToString());
            DataTable StoreNosDT = new DataTable(); StoreNosDT.Columns.Add("Id"); DataRow StoreNosDR;
            if (StoreNos != null)
            {
                for (int i = 0; i < StoreNos.Length; i++)
                {
                    StoreNosDR = StoreNosDT.NewRow();
                    StoreNosDR["Id"] = StoreNos[i];
                    StoreNosDT.Rows.Add(StoreNosDR);
                }
            }
            DataTable TypesDT = new DataTable(); TypesDT.Columns.Add("Id"); DataRow TypesDR;
            if (Types != null)
            {
                for (int i = 0; i < Types.Length; i++)
                {
                    TypesDR = TypesDT.NewRow();
                    TypesDR["Id"] = Types[i];
                    TypesDT.Rows.Add(TypesDR);
                }
            }


            string connectionString = System.Configuration.ConfigurationManager.AppSettings["SPConnString"];
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                DataTable ResultsDT = new DataTable();
                DataSet ResultsDS = new DataSet();
                SqlCommand StoredProcedureCommand = new SqlCommand("Get_Comission_Chart_Data", connection);
                StoredProcedureCommand.CommandType = CommandType.StoredProcedure;
                SqlParameter dtp;
                SqlParameter pStartDate = StoredProcedureCommand.Parameters.AddWithValue("@start", dateStartDate);
                SqlParameter pEndDate = StoredProcedureCommand.Parameters.AddWithValue("@end", dateEndDate);
                SqlParameter pUserId = StoredProcedureCommand.Parameters.AddWithValue("@userId", UserId);
                SqlParameter pStoreNos = StoredProcedureCommand.Parameters.AddWithValue("@storeNos", StoreNosDT);
                pStoreNos.SqlDbType = SqlDbType.Structured;
                SqlParameter pTypes = StoredProcedureCommand.Parameters.AddWithValue("@types", TypesDT);
                pTypes.SqlDbType = SqlDbType.Structured;


                SqlDataAdapter da = new SqlDataAdapter();
                da.SelectCommand = StoredProcedureCommand;
                da.Fill(ResultsDS);
                List<List<Dictionary<string, object>>> Tables = new List<List<Dictionary<string, object>>>();
                foreach (DataTable dt in ResultsDS.Tables)
                    Tables.Add(GetFormattedDT(dt));

                //List<List<Dictionary<string, object>>> Tables = GetStoredProcedureReportDynamicParameters(Parameters, "Get_Comission_Chart_Data");
                var Result = new { Tables = Tables };
                return Json(Result, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public ActionResult GetRP(string StartDate, string EndDate)
        {
            List<List<Dictionary<string, object>>> Tables = GetStoredProcedureReport(StartDate, EndDate, "Get_RPTable");
            var Result = new { Tables = Tables };
            return Json(Result, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult GetEFT(string StartDate, string EndDate)
        {
            List<List<Dictionary<string, object>>> Tables = GetStoredProcedureReport(StartDate, EndDate, "Get_EFTTable");
            var Result = new { Tables = Tables };
            return Json(Result, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult GetAR(string StartDate, string EndDate)
        {
            List<List<Dictionary<string, object>>> Tables = GetStoredProcedureReport(StartDate, EndDate, "Get_ARTable");
            var Result = new { Tables = Tables };
            return Json(Result, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult GetEOD(string StartDate, string EndDate)
        {
            List<List<Dictionary<string, object>>> Tables = GetStoredProcedureReport(StartDate, EndDate, "Get_EODTable");
            var Result = new { Tables = Tables };
            return Json(Result, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult GetDD(string StartDate, string EndDate)
        {
            List<List<Dictionary<string, object>>> Tables = GetStoredProcedureReport(StartDate, EndDate, "Get_DDTable");
            var Result = new { Tables = Tables };
            JsonResult json = Json(Result, JsonRequestBehavior.AllowGet);
            json.MaxJsonLength = 500000000;
            return json;
        }
        [HttpGet]
        public ActionResult GetDDCatalogsData(string StartDate, string EndDate)
        {
            List<List<Dictionary<string, object>>> Tables = GetStoredProcedureReport(StartDate, EndDate, "Get_DDTable_CatalogsData");
            var Result = new { Tables = Tables };
            return Json(Result, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult GetRecon(string[] StoreNos, int Month, int Year)
        {
            DataTable storeNoDatatable = new DataTable();
            storeNoDatatable.Columns.Add("StoreNo");
            if (StoreNos != null)
            {
                DataRow row;
                for (int i = 0; i < StoreNos.Length; i++)
                {
                    row = storeNoDatatable.NewRow();
                    row["StoreNo"] = StoreNos[i];
                    storeNoDatatable.Rows.Add(row);
                }
            }
            DateTime startDate = new DateTime(Year, Month, 1);
            DateTime endDate = new DateTime(Year, Month, DateTime.DaysInMonth(Year, Month));
            Dictionary<string, object> Parameters = new Dictionary<string, object>();
            Parameters.Add("start", startDate);
            Parameters.Add("end", endDate);
            Parameters.Add("storeNos", storeNoDatatable);
            List<List<Dictionary<string, object>>> Tables = GetStoredProcedureReportDynamicParameters(Parameters, "Get_NewReconTable");
            Dictionary<string, object> Dates = new Dictionary<string, object>();
            Dates.Add("startDate", startDate.ToString("MM/dd/yyyy"));
            Dates.Add("endDate", endDate.ToString("MM/dd/yyyy"));
            Tables.Add(new List<Dictionary<string, object>>() { Dates });
            var Result = new { Tables = Tables };
            return Json(Result, JsonRequestBehavior.AllowGet);
        }

        public ActionResult ExportReconCSV(string StoreNos, int Month, int Year)
        {
            int UserId = int.Parse(Session["UserID"].ToString());
            string connectionString = System.Configuration.ConfigurationManager.AppSettings["SPConnString"];
            string spName = "Get_ReconForExport";

            DataTable storeNoDatatable = new DataTable();
            storeNoDatatable.Columns.Add("StoreNo");
            if (StoreNos != null)
            {
                DataRow row;
                string[] storeNosArray = StoreNos.Split('|');
                for (int i = 0; i < storeNosArray.Length; i++)
                {
                    row = storeNoDatatable.NewRow();
                    row["StoreNo"] = storeNosArray[i];
                    storeNoDatatable.Rows.Add(row);
                }
            }
            DateTime startDate = new DateTime(Year, Month, 1);
            DateTime endDate = new DateTime(Year, Month, DateTime.DaysInMonth(Year, Month));
            string fileName = "Recons_" + startDate.ToString("MMMM_yyyy");
            Dictionary<string, object> Parameters = new Dictionary<string, object>();
            Parameters.Add("start", startDate);
            Parameters.Add("end", endDate);
            Parameters.Add("storeNos", storeNoDatatable);

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                DataTable ResultsDT = new DataTable();
                DataSet ResultsDS = new DataSet();
                SqlCommand ReportSP = new SqlCommand(spName, connection);
                ReportSP.Parameters.AddWithValue("start", startDate);
                ReportSP.Parameters.AddWithValue("end", endDate);
                ReportSP.Parameters.AddWithValue("storeNos", storeNoDatatable);

                ReportSP.CommandType = CommandType.StoredProcedure;
                SqlDataAdapter da = new SqlDataAdapter();
                da.SelectCommand = ReportSP;
                da.Fill(ResultsDS);
                DataTable dt = ResultsDS.Tables[0];

                #region DeleteEmptyValues

                foreach (var column in dt.Columns.Cast<DataColumn>().ToArray())
                {
                    if (dt.AsEnumerable().All(dr => dr.IsNull(column) || evalEmpty(dr[column.ColumnName])))
                        dt.Columns.Remove(column);
                }

                #endregion


                var bytes = Encoding.GetEncoding("iso-8859-1").GetBytes(ToCSV(dt));
                MemoryStream stream = new MemoryStream(bytes);
                return new FileStreamResult(stream, "application/CSV") { FileDownloadName = fileName + ".csv", };
            }
        }


        [HttpGet]
        public ActionResult GetStores(string rptName)
        {
            Dictionary<string, object> Parameters = new Dictionary<string, object>();
            Parameters.Add("userId", int.Parse(Session["UserID"].ToString()));
            Parameters.Add("reportName", rptName);

            List<List<Dictionary<string, object>>> Tables = GetStoredProcedureReportDynamicParameters(Parameters, "GetReportStoresByEmp");
            var Result = new { Tables = Tables };
            return Json(Result, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #region HTTP POST

        [HttpPost]
        public ActionResult DeleteRecords(int[] Items, string Report)
        {

            Dictionary<string, object> Parameters = new Dictionary<string, object>();
            Parameters.Add("Items", Items != null ? String.Join(",", Items) : "");
            Parameters.Add("ReportName", Report);
            List<List<Dictionary<string, object>>> Tables = GetStoredProcedureReportDynamicParameters(Parameters, "DeleteReportItems");
            return Json(new { Ok = true }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult UpdateRPRecords(IEnumerable<RPReportDataVM> ItemList)
        {
            Dictionary<string, object> Parameters;
            foreach (RPReportDataVM Item in ItemList)
            {
                Parameters = new Dictionary<string, object>();
                Parameters.Add("ID", Item.ID);
                Parameters.Add("storeNo", Item.StoreNo);
                Parameters.Add("dateRP", DateTime.Parse(Item.dateRP));
                Parameters.Add("policyNumber", Item.policyNumber);
                Parameters.Add("narrative", Item.narrative);
                Parameters.Add("insured", Item.insured);
                Parameters.Add("payments", Decimal.Parse(Item.payments));
                Parameters.Add("checkIssuedDate", DateTime.Parse(Item.checkIssuedDate));
                List<List<Dictionary<string, object>>> Tables = GetStoredProcedureReportDynamicParameters(Parameters, "UpdateRPRecords");
            }
            return Json(new { Ok = true }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult UpdateARRecords(IEnumerable<ARReportDataVM> ItemList)
        {
            Dictionary<string, object> Parameters;
            foreach (ARReportDataVM Item in ItemList)
            {
                Parameters = new Dictionary<string, object>();
                Parameters.Add("ID", Item.id);
                Parameters.Add("StoreNo", Item.StoreNo);
                Parameters.Add("reconType", Item.reconType);
                Parameters.Add("transactionDate", DateTime.Parse(Item.transactionDate));
                Parameters.Add("internalReference", Item.internalReference);
                Parameters.Add("narrative", Item.narrative);
                Parameters.Add("externalReference", Item.externalReference);
                Parameters.Add("amount", Decimal.Parse(Item.amount));
                Parameters.Add("status", Item.status);

                List<List<Dictionary<string, object>>> Tables = GetStoredProcedureReportDynamicParameters(Parameters, "UpdateARRecords");
            }
            return Json(new { Ok = true }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult UpdateEFTRecords(IEnumerable<EFTReportDataVM> ItemList)
        {
            Dictionary<string, object> Parameters;
            foreach (EFTReportDataVM Item in ItemList)
            {
                Parameters = new Dictionary<string, object>();
                Parameters.Add("ID", Item.id);
                Parameters.Add("StoreNo", Item.StoreNo);
                Parameters.Add("dateOfReceipt", DateTime.Parse(Item.dateOfReceipt));
                Parameters.Add("nameOfCustomer", Item.nameOfCustomer);
                Parameters.Add("insuranceCompany", Item.insuranceCompany);
                Parameters.Add("policyNumber", Item.policyNumber);
                Parameters.Add("premium", Decimal.Parse(Item.premium));

                List<List<Dictionary<string, object>>> Tables = GetStoredProcedureReportDynamicParameters(Parameters, "UpdateEFTRecords");
            }
            return Json(new { Ok = true }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult UpdateDDRecords(IEnumerable<DDReportDataVM> ItemList)
        {
            Dictionary<string, object> Parameters;
            foreach (DDReportDataVM Item in ItemList)
            {
                Parameters = new Dictionary<string, object>();
                Parameters.Add("ID", Item.id);
                Parameters.Add("storeNo", Item.StoreNo ?? "");
                Parameters.Add("reportDate", DateTime.Parse(Item.reportDate ?? ""));
                Parameters.Add("EODDeposit", Decimal.Parse(Item.EODDeposit ?? "0"));
                Parameters.Add("actualDeposit", Decimal.Parse(Item.actualDeposit ?? "0"));
                //if (Item.depositDate != null)
                Parameters.Add("depositDate", Item.depositDate ?? "" );
                Parameters.Add("EODCreditCards", Decimal.Parse(Item.EODCreditCards ?? "0"));
                Parameters.Add("actualCreditCards", Decimal.Parse(Item.actualCreditCards ?? "0"));
                Parameters.Add("overCreditCards", Item.overCreditCards ?? "");
                Parameters.Add("voidCredits", Decimal.Parse(Item.voidCredits ?? "0"));
                Parameters.Add("payoutTo", Item.payoutTo ?? "");
                Parameters.Add("payoutCheck", Decimal.Parse(Item.payoutCheck ?? "0"));
                Parameters.Add("scanningViolationFees", Decimal.Parse(Item.scanningViolationFees ?? "0"));
                Parameters.Add("depositViolationFees", Decimal.Parse(Item.depositViolationFees ?? "0"));
                Parameters.Add("ARViolationFees", Decimal.Parse(Item.ARViolationFees ?? "0"));
                Parameters.Add("violationFeesTotal", Decimal.Parse(Item.violationFeesTotal ?? "0"));
                Parameters.Add("comments", Item.comments ?? "");
                Parameters.Add("email1", Item.email1 ?? "");

                List<List<Dictionary<string, object>>> Tables = GetStoredProcedureReportDynamicParameters(Parameters, "UpdateDDRecords");
            }
            return Json(new { Ok = true }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult UpdateCommisionRecords(IEnumerable<CommisionReportDataVM> ItemList)
        {
            Dictionary<string, object> Parameters;
            foreach (CommisionReportDataVM Item in ItemList)
            {
                Parameters = new Dictionary<string, object>();
                Parameters.Add("ID", Item.id);
                Parameters.Add("StoreNo", Item.StoreNo ?? "");
                Parameters.Add("typeCT", Item.typeCT ?? "");
                Parameters.Add("date_CT", DateTime.Parse(Item.date_CT));
                Parameters.Add("name", Item.name ?? "");
                Parameters.Add("debit", Decimal.Parse(Item.debit ?? ""));
                Parameters.Add("credit", Decimal.Parse(Item.credit ?? ""));

                List<List<Dictionary<string, object>>> Tables = GetStoredProcedureReportDynamicParameters(Parameters, "UpdateCommissionRecords");
            }
            return Json(new { Ok = true }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult UpdateRECONRecords(IEnumerable<RECONReportDataVM> ItemList)
        {
            Dictionary<string, object> Parameters;
            foreach (RECONReportDataVM Item in ItemList)
            {
                Parameters = new Dictionary<string, object>();
                Parameters.Add("ID", Item.id);
                Parameters.Add("StoreNo", Item.StoreNo ?? "");
                Parameters.Add("dateRT", Item.dateRT ?? "");
                Parameters.Add("grossCommisions", Decimal.Parse(Item.grossCommisions ?? "0"));
                Parameters.Add("commissionsPercentTier1", Decimal.Parse(Item.commissionsPercentTier1 ?? "0"));
                Parameters.Add("commissionsTier1", Decimal.Parse(Item.commissionsTier1 ?? "0"));
                Parameters.Add("commissionsPercentTier2", Decimal.Parse(Item.commissionsPercentTier2 ?? "0"));
                Parameters.Add("commisionsTier2", Decimal.Parse(Item.commisionsTier2 ?? "0"));
                Parameters.Add("taxPrepRevenue", Decimal.Parse(Item.taxPrepRevenue ?? "0"));
                Parameters.Add("numberOfTaxReturns", Decimal.Parse(Item.numberOfTaxReturns ?? "0"));
                Parameters.Add("royaltyPerReturn", Decimal.Parse(Item.royaltyPerReturn ?? "0"));
                Parameters.Add("taxRoyalties", Decimal.Parse(Item.taxRoyalties ?? "0"));
                Parameters.Add("totalRevenue", Decimal.Parse(Item.totalRevenue ?? "0"));
                Parameters.Add("hourlyWages", Decimal.Parse(Item.hourlyWages ?? "0"));
                Parameters.Add("overtime", Decimal.Parse(Item.overtime ?? "0"));
                Parameters.Add("bonusAndCommisions", Decimal.Parse(Item.bonusAndCommisions ?? "0"));
                Parameters.Add("@payrollTaxes_ER", Decimal.Parse(Item.@payrollTaxes_ER ?? "0"));
                Parameters.Add("workersCompInsurance", Decimal.Parse(Item.workersCompInsurance ?? "0"));
                Parameters.Add("payrollProcessingFee", Decimal.Parse(Item.payrollProcessingFee ?? "0"));
                Parameters.Add("policyManager", Decimal.Parse(Item.policyManager ?? "0"));
                Parameters.Add("ratingSoftware", Decimal.Parse(Item.ratingSoftware ?? "0"));
                Parameters.Add("motorVehicleReport", Decimal.Parse(Item.motorVehicleReport ?? "0"));
                Parameters.Add("loanDueFromFranchisee", Decimal.Parse(Item.loanDueFromFranchisee ?? "0"));
                Parameters.Add("minimumRoyaltyFee", Decimal.Parse(Item.minimumRoyaltyFee ?? "0"));
                Parameters.Add("servicingFee", Decimal.Parse(Item.servicingFee ?? "0"));
                Parameters.Add("tradeShows", Decimal.Parse(Item.tradeShows ?? "0"));
                Parameters.Add("trustAccountingAR", Decimal.Parse(Item.trustAccountingAR ?? "0"));
                Parameters.Add("telephone", Decimal.Parse(Item.telephone ?? "0"));
                Parameters.Add("postage", Decimal.Parse(Item.postage ?? "0"));
                Parameters.Add("televisionRadio", Decimal.Parse(Item.televisionRadio ?? "0"));
                Parameters.Add("trustAcctShortageOverage", Decimal.Parse(Item.trustAcctShortageOverage ?? "0"));
                Parameters.Add("internet", Decimal.Parse(Item.internet ?? "0"));
                Parameters.Add("onHoldRecording", Decimal.Parse(Item.onHoldRecording ?? "0"));
                Parameters.Add("scanningViolationPenalty", Decimal.Parse(Item.scanningViolationPenalty ?? "0"));
                Parameters.Add("depositViolationPenalty", Decimal.Parse(Item.depositViolationPenalty ?? "0"));
                Parameters.Add("badDebts", Decimal.Parse(Item.badDebts ?? "0"));
                Parameters.Add("printRT", Decimal.Parse(Item.printRT ?? "0"));
                Parameters.Add("reimbursedFeeOther", Decimal.Parse(Item.reimbursedFeeOther ?? "0"));
                Parameters.Add("gas", Decimal.Parse(Item.gas ?? "0"));
                Parameters.Add("DAndSMembership", Decimal.Parse(Item.DAndSMembership ?? "0"));
                Parameters.Add("EAndOInsurance", Decimal.Parse(Item.EAndOInsurance ?? "0"));
                Parameters.Add("rent", Decimal.Parse(Item.rent ?? "0"));
                Parameters.Add("supplies", Decimal.Parse(Item.supplies ?? "0"));
                Parameters.Add("buildingOrOffice", Decimal.Parse(Item.buildingOrOffice ?? "0"));
                Parameters.Add("referralFee", Decimal.Parse(Item.referralFee ?? "0"));
                Parameters.Add("smallEquipPurchases", Decimal.Parse(Item.smallEquipPurchases ?? "0"));
                Parameters.Add("smallFFAndE", Decimal.Parse(Item.smallFFAndE ?? "0"));
                Parameters.Add("legalFee", Decimal.Parse(Item.legalFee ?? "0"));
                Parameters.Add("camCharges", Decimal.Parse(Item.camCharges ?? "0"));
                Parameters.Add("cellphone", Decimal.Parse(Item.cellphone ?? "0"));
                Parameters.Add("securityRT", Decimal.Parse(Item.securityRT ?? "0"));
                Parameters.Add("electricity", Decimal.Parse(Item.electricity ?? "0"));
                Parameters.Add("accountingViolationPenalty", Decimal.Parse(Item.accountingViolationPenalty ?? "0"));
                Parameters.Add("advertising", Decimal.Parse(Item.advertising ?? "0"));
                Parameters.Add("DOIAppointmentFee", Decimal.Parse(Item.DOIAppointmentFee ?? "0"));
                Parameters.Add("notes", Item.notes ?? "");
                Parameters.Add("DOILicenseFee", Decimal.Parse(Item.DOILicenseFee ?? "0"));
                Parameters.Add("entrepreneurMagazine", Decimal.Parse(Item.entrepreneurMagazine ?? "0"));
                Parameters.Add("franchiseGratorLeads", Decimal.Parse(Item.franchiseGratorLeads ?? "0"));
                Parameters.Add("franchiseGuideSupplies", Decimal.Parse(Item.franchiseGuideSupplies ?? "0"));
                Parameters.Add("franchiseTimeMagazine", Decimal.Parse(Item.franchiseTimeMagazine ?? "0"));
                Parameters.Add("leads", Decimal.Parse(Item.leads ?? "0"));
                Parameters.Add("SEO", Decimal.Parse(Item.SEO ?? "0"));
                Parameters.Add("previousUnpaidBalanace", Decimal.Parse(Item.previousUnpaidBalanace ?? "0"));
                Parameters.Add("totalDeductions", Decimal.Parse(Item.totalDeductions ?? "0"));
                Parameters.Add("balanceDueToOrFromFranchise", Decimal.Parse(Item.balanceDueToOrFromFranchise ?? "0"));
                Parameters.Add("renewalFee", Decimal.Parse(Item.renewalFee ?? "0"));
                Parameters.Add("incentive", Decimal.Parse(Item.incentive ?? "0"));
                Parameters.Add("maxShield", Decimal.Parse(Item.maxShield ?? "0"));
                Parameters.Add("Licenses_and_Permits", Decimal.Parse(Item.Licenses_and_Permits ?? "0"));


                List<List<Dictionary<string, object>>> Tables = GetStoredProcedureReportDynamicParameters(Parameters, "UpdateReconRecords");
            }
            return Json(new { Ok = true }, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #endregion

        #region VIEWBAG & TEMP DATA 

        public void GetDateFilters()
        {
            var today = DateTime.Today;
            
            var LastDaysInMonth = DateTime.DaysInMonth(today.Year, today.Month);

            var dtMonthStart = new DateTime(today.Year, today.Month, 1);
            var dtMonthEnd = new DateTime(today.Year, today.Month, LastDaysInMonth);

            var LastDaysInLastMonth = DateTime.DaysInMonth(today.Year, today.Month-1);

            var dtLastMonthStart = new DateTime(today.Year, today.Month-1, 1);
            var dtLastMonthEnd = new DateTime(today.Year, today.Month-1, LastDaysInLastMonth);
            

            var dtWeekStart = today.AddDays(-(today.DayOfWeek - DayOfWeek.Sunday));
            var dtWeekEnd = dtWeekStart.AddDays(6);

            //ViewBag.Today = today.ToString("MM/dd/yyyy");
            ViewBag.SLM = dtLastMonthStart.ToString("MM/dd/yyyy");
            ViewBag.ELM = dtLastMonthEnd.ToString("MM/dd/yyyy");
            ViewBag.SOM = dtMonthStart.ToString("MM/dd/yyyy");
            ViewBag.EOM = dtMonthEnd.ToString("MM/dd/yyyy");
            ViewBag.SOW = dtWeekStart.ToString("MM/dd/yyyy");
            ViewBag.EOW = dtWeekEnd.ToString("MM/dd/yyyy");
        }
        public void GetUserData()
        {
            int UserRole = Convert.ToInt32(Session["UserRole"]);
            ViewBag.UserRole = UserRole;
        }

        #endregion

        #region FUNCTIONS

        public List<Dictionary<string, object>> GetFormattedDT(DataTable DT)
        {
            List<Dictionary<string, object>> rows = new List<Dictionary<string, object>>();
            Dictionary<string, object> row = new Dictionary<string, object>();
            foreach (DataRow dr in DT.Rows)
            {
                row = new Dictionary<string, object>();
                foreach (DataColumn col in DT.Columns)
                {
                    row.Add(col.ColumnName, dr[col]);
                }
                rows.Add(row);
            }
            return rows;
        }

        public List<List<Dictionary<string, object>>> GetStoredProcedureReport(string StartDate, string EndDate, string SPName)
        {
            DateTime dateStartDate = DateTime.Parse(StartDate);
            DateTime dateEndDate = DateTime.Parse(EndDate);
            int UserId = int.Parse(Session["UserID"].ToString());
            string connectionString = System.Configuration.ConfigurationManager.AppSettings["SPConnString"];
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                DataTable ResultsDT = new DataTable();
                DataSet ResultsDS = new DataSet();
                SqlCommand CommissionsSP = new SqlCommand(SPName, connection);
                CommissionsSP.Parameters.AddWithValue("@start", dateStartDate);
                CommissionsSP.Parameters.AddWithValue("@end", dateEndDate);
                CommissionsSP.Parameters.AddWithValue("@userId", UserId);
                CommissionsSP.CommandType = CommandType.StoredProcedure;
                SqlDataAdapter da = new SqlDataAdapter();
                da.SelectCommand = CommissionsSP;
                da.Fill(ResultsDS);
                List<List<Dictionary<string, object>>> Tables = new List<List<Dictionary<string, object>>>();
                foreach (DataTable dt in ResultsDS.Tables)
                    Tables.Add(GetFormattedDT(dt));
                return Tables;
            }
        }

        public List<List<Dictionary<string, object>>> GetStoredProcedureReportDynamicParameters(Dictionary<string, object> Parameters, string SPName)
        {
            string connectionString = System.Configuration.ConfigurationManager.AppSettings["SPConnString"];
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                DataTable ResultsDT = new DataTable();
                DataSet ResultsDS = new DataSet();
                SqlCommand StoredProcedureCommand = new SqlCommand(SPName, connection);
                StoredProcedureCommand.CommandType = CommandType.StoredProcedure;
                SqlParameter DTParam;
                foreach (var Parameter in Parameters)
                {
                    DTParam = StoredProcedureCommand.Parameters.AddWithValue(Parameter.Key, Parameter.Value);
                }
                SqlDataAdapter da = new SqlDataAdapter();
                da.SelectCommand = StoredProcedureCommand;
                da.Fill(ResultsDS);
                List<List<Dictionary<string, object>>> Tables = new List<List<Dictionary<string, object>>>();
                foreach (DataTable dt in ResultsDS.Tables)
                    Tables.Add(GetFormattedDT(dt));
                return Tables;
            }
        }

        public List<List<Dictionary<string, object>>> GetStoredProcedureReportCommissionsChart(Dictionary<string, object> Parameters, string SPName)
        {
            string connectionString = System.Configuration.ConfigurationManager.AppSettings["SPConnString"];
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                DataTable ResultsDT = new DataTable();
                DataSet ResultsDS = new DataSet();
                SqlCommand StoredProcedureCommand = new SqlCommand(SPName, connection);
                StoredProcedureCommand.CommandType = CommandType.StoredProcedure;
                SqlParameter DTParam;
                foreach (var Parameter in Parameters)
                {
                    DTParam = StoredProcedureCommand.Parameters.AddWithValue(Parameter.Key, Parameter.Value);
                    if (Parameter.Value is DataTable)
                    {
                        DTParam.SqlDbType = SqlDbType.Structured;
                    }
                }
                SqlDataAdapter da = new SqlDataAdapter();
                da.SelectCommand = StoredProcedureCommand;
                da.Fill(ResultsDS);
                List<List<Dictionary<string, object>>> Tables = new List<List<Dictionary<string, object>>>();
                foreach (DataTable dt in ResultsDS.Tables)
                    Tables.Add(GetFormattedDT(dt));
                return Tables;
            }
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

        private bool evalEmpty(object value)
        {
            string strValue;
            double dblValue;
            bool response = true;
            if(value != null)
            {
                strValue = value.ToString();
                if(double.TryParse(strValue , out dblValue))
                {
                    if(dblValue != 0)
                    {
                        response = false;
                    }
                }else
                {
                    response = false;
                }
            }
            return response;
        }

        #endregion
    }
}