using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Web;

namespace FiestaReports.Models
{
  
    public class Employee
    {
        [Required]
        [Display(Name = "First Name")]
        public string firstName { get; set; }
        [Required]
        [Display(Name = "Last Name")]
        public string lastName { get; set; }
        [Required]
        //[EmailAddress]
        [Display(Name = "Email")]
        public string emailEmployee { get; set; }
        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string password { get; set; }
        [Required]
        [DataType(DataType.Password)]
        [NotMapped]
        [Display(Name = "Confirm Password")]
        //[Compare("password", ErrorMessage = "Passwords doesn't match, Type again !")]
        public string confirmpassword { get; set; }
        public string LoginUser { get; set; }





    }
    public class Employee_Search
    {
        public GetEmployeeDetailsByEmail_Result EmpDetails { get; set; }
        public List<GetAllStatesByEmployee1_Result> lstStates { get; set; }
        public List<GetStoresByState_Result> lstStores { get; set; }
    }
    public class Employee_Assign
    {
        public int EmployeeId { get; set; }
        public int RoleId { get; set; }
        public string States { get; set; }
        public string Stores { get; set; }
    }
    public class Employee_AssignReports
    {
        public int EmployeeId { get; set; }
        public List<string> lstStores { get; set; }
        public List<int> lstReports { get; set; }
    }
    public class StoresReq
    {
        public int EmpId { get; set; }
        public string States { get; set; }
    }
   
    public class Employee_Login
    {
        
        [Required]
        //[EmailAddress]        
        public string emailEmployee { get; set; }
        [Required]
        [DataType(DataType.Password)]
        //[Display(Name = "password")]
        public string password { get; set; }


    }
    public static class Crypto
    {
        public static string Hash(string value)
        {
            return Convert.ToBase64String(
                System.Security.Cryptography.SHA256.Create()
                .ComputeHash(Encoding.UTF8.GetBytes(value)));
        }
    }

    public  class Store
    {
        public int StateId { get; set; }
        public string StoreNumber { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string ZipCode { get; set; }
    }
}