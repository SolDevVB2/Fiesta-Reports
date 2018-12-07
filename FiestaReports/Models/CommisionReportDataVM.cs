using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FiestaReports.Models
{
    public class CommisionReportDataVM
    {
        public int id { get; set; }
        public string StoreNo { get; set; }
        public string typeCT { get; set; }
        public string date_CT { get; set; }
        public string name { get; set; }
        public string debit { get; set; }
        public string credit { get; set; }
        public string balance { get; set; }
    }
}