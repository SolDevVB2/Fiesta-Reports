using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FiestaReports.Models
{
    public class DDReportDataVM
    {
        public int id { get; set; }
        public string StoreNo { get; set; }
        public string reportDate { get; set; }
        public string EODDeposit { get; set; }
        public string actualDeposit { get; set; }
        public string depositDate { get; set; }
        public string EODCreditCards { get; set; }
        public string actualCreditCards { get; set; }
        public string overCreditCards { get; set; }
        public string voidCredits { get; set; }
        public string payoutTo { get; set; }
        public string payoutCheck { get; set; }

        public string scanningViolationFees { get; set; }
        public string depositViolationFees { get; set; }
        public string ARViolationFees { get; set; }
        public string violationFeesTotal { get; set; }
        public string comments { get; set; }
        public string email1 { get; set; }
    }
}