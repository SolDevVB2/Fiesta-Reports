using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FiestaReports.Models
{
    public class RPReportDataVM
    {
        public int ID { get; set; }
        public string StoreNo { get; set; }
        public string dateRP { get; set; }
        public string policyNumber { get; set; }
        public string narrative { get; set; }
        public string insured { get; set; }
        public string payments { get; set; }
        public string checkIssuedDate { get; set; }
    }
}