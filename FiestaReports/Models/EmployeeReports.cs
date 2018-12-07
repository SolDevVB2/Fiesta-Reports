using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FiestaReports.Models
{
    public class EmployeeReports
    {
        public EmployeeReports()
        {
            Stores = new List<Fiesta_Store>();
            Reports = new List<Fiesta_Report>();
            EmpStoreReports = new List<Fiesta_EmpStoreReport>();
            Employee = new Fiesta_Employee();
        }

        public List<Fiesta_Store> Stores { get; set; }
        public List<Fiesta_Report> Reports { get; set; }
        public List<Fiesta_EmpStoreReport> EmpStoreReports { get; set; }
        public Fiesta_Employee Employee { get; set; }
    }
}