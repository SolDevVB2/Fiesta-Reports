using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FiestaReports.Models
{
    public class ProfitAndLoss
    {
        #region '   Income   '
        public decimal GrossCommission { get; set; }
        public decimal TaxPrepRevenue { get; set; }
        public decimal NbFee { get; set; }
        public decimal EnFee { get; set; }
        public decimal NsdFee { get; set; }
        public decimal PyFee { get; set; }
        public decimal MiscFee { get; set; }
        public decimal DmvFee { get; set; }
        public decimal TaxFeeInhouse { get; set; }
        public decimal TotalIncome { get; set; }
        #endregion

        #region '    Franchise Expenses   '
        public decimal SetupFees { get; set; }
        public decimal CreditCardFees { get; set; }
        public decimal CommissionRoyalty { get; set; }
        public decimal TaxRoyalty { get; set; }
        public decimal PolicyManager { get; set; }
        public decimal franMvr { get; set; }
        public decimal TrustAcctArs { get; set; }
        public decimal ScanningViolationPenalties { get; set; }
        public decimal AccountingViolationPenalties { get; set; }
        public decimal TotalFranchiseExpense { get; set; }
        #endregion

        #region '   Location Expenses   '
        public decimal Rent { get; set; }
        public decimal Utilities { get; set; }
        public decimal Rater { get; set; }
        public decimal LocMvr { get; set; }
        public decimal StaffSalaries { get; set; }
        public decimal MaxSalary { get; set; }
        public decimal Advertising { get; set; }
        public decimal Supplies { get; set; }
        public decimal Misc { get; set; }
        public decimal TotalLocationExpense { get; set; }
        #endregion


    }
}