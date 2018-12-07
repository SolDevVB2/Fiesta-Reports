using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FiestaReports.Models
{
    public class EFTReportDataVM
    {
        public int id { get; set; }
        public string StoreNo { get; set; }
        public string dateOfReceipt { get; set; }
        public string nameOfCustomer { get; set; }
        public string policyNumber { get; set; }
        public string insuranceCompany { get; set; }
        public string premium { get; set; }
    }
}