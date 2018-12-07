using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FiestaReports.Models
{
    public class ARReportDataVM
    {
        public int id { get; set; }
        public string StoreNo { get; set; }
        public string reconType { get; set; }
        public string transactionDate { get; set; }
        public string internalReference { get; set; }
        public string narrative { get; set; }
        public string externalReference { get; set; }
        public string amount { get; set; }
        public string status { get; set; }

    }
}