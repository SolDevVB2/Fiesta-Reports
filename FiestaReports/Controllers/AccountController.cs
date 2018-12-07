using FiestaReports.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using System.Data.Entity;
using System.Text;
using FiestaReports.FiestaDTO;
using System.Data.Entity.Validation;
using FiestaReports.Utils;

namespace FiestaReports.Controllers
{
    public class AccountController : Controller
    {

        // GET: Login

        public ActionResult Index()
        {
            return View();
        }



        public ActionResult LoginView()
        {
            /*******************************************************************
              Author      : Gopi
              Date        : 04/07/2017
              Description : Initial page after Login and navigates users to specific page based on role
             *******************************************************************/
            if (Session["UserName"] != null)
            {
                return RedirectToAction("Menu", "Home");
            }
            else
                return View();
        }
        [AuthorizationFilter]
        public ActionResult RegisterEmployee()
        {
            /*******************************************************************
            Author      : Gopi
            Date        : 04/07/2017
            Description : Returns Loggedin user Name
           *******************************************************************/

            Employee obj = new Employee();
            obj.LoginUser = Convert.ToString(Session["UserName"]);
            return View(obj);
        }
        public ActionResult GetStores(StoresReq objReq)
        {
            /*******************************************************************
          Author      : Gopi
          Date        : 04/07/2017
          Description : Returns stores by state
         *******************************************************************/
            var objStores = new List<GetStoresByState_Result>();

            using (fze = new FiestaZohoDatabaseEntities())
            {
                objStores = fze.GetStoresByState(objReq.States, Convert.ToInt32(Session["UserRole"]), objReq.EmpId, Convert.ToInt32(Session["UserID"])).ToList();
            }
            return Json(objStores, JsonRequestBehavior.AllowGet);
        }
        public ActionResult GetStates()
        {
            /*******************************************************************
          Author      : Gopi
          Date        : 04/07/2017
          Description : Returns all the states by role
         *******************************************************************/
            var objStates = new List<GetAllStates_Result1>();
            using (fze = new FiestaZohoDatabaseEntities())
            {
                objStates = fze.GetAllStates(Convert.ToInt32(Session["UserRole"]), Convert.ToInt32(Session["UserID"])).ToList();
            }
            return Json(objStates, JsonRequestBehavior.AllowGet);
        }
        public ActionResult GetRoles()
        {
            /*******************************************************************
          Author      : Gopi
          Date        : 04/07/2017
          Description :Returns all the role types by loggedin user role
         *******************************************************************/
            var objRoles = new List<GetRolesByEmp_Result>();
            var AllRoles = new List<Fiesta_Role>();
            using (fze = new FiestaZohoDatabaseEntities())
            {
                objRoles = fze.GetRolesByEmp(Convert.ToInt32(Session["UserRole"])).ToList();
                AllRoles = fze.Fiesta_Role.ToList();
            }
            return Json(new { SelectableRoles = objRoles, AllRoles = AllRoles }, JsonRequestBehavior.AllowGet);
        }
        public ActionResult GetReports()
        {
            /*******************************************************************
          Author      : Gopi
          Date        : 04/07/2017
          Description : Returns all the report types based on loggedin user role
         *******************************************************************/
            var objReports = new List<GetAllReports_Result>();
            using (fze = new FiestaZohoDatabaseEntities())
            {
                objReports = fze.GetAllReports(Convert.ToInt32(Session["UserID"]), Convert.ToInt32(Session["UserRole"])).ToList();
            }
            return Json(objReports, JsonRequestBehavior.AllowGet);
        }
        public ActionResult GetEmployeeStores(int EmpId)
        {
            /*******************************************************************
          Author      : Gopi
          Date        : 04/07/2017
          Description : Returns stores by employee
         *******************************************************************/
            var objStores = new List<GetStoresByState_Result>();
            using (fze = new FiestaZohoDatabaseEntities())
            {
                objStores = fze.GetStoresByState(string.Empty, Convert.ToInt32(Session["UserRole"]), EmpId, Convert.ToInt32(Session["UserID"])).ToList();
            }
            return Json(objStores, JsonRequestBehavior.AllowGet);
        }

        public ActionResult AssignEmployee(Employee_Assign obj)
        {
            /*******************************************************************
          Author      : Gopi
          Date        : 04/07/2017
          Description : Assigning states, stores and role for the employee
         *******************************************************************/
            var msg = "";
            try
            {


                using (fze = new FiestaZohoDatabaseEntities())
                {
                    fze.UpdateEmployeeRole(obj.EmployeeId, obj.RoleId);

                    if (obj.RoleId > 1)
                    {
                        fze.InsertEmployeeDetails(obj.EmployeeId, obj.States, obj.Stores);
                        //foreach (string store in obj.lstStores)
                        //{
                        //    fze.InsertEmployeeStores(obj.EmployeeId, store);
                        //}
                    }
                }
                msg = "Successfully Assigned.";

            }
            catch (Exception ex)
            {

                msg = "Something went wrong.";
            }
            return Json(msg, JsonRequestBehavior.AllowGet);
        }
        public ActionResult AssignReports(Employee_AssignReports obj)
        {
            /*******************************************************************
          Author      : Gopi
          Date        : 04/07/2017
          Description : Assigning reports for the employee
         *******************************************************************/

            using (fze = new FiestaZohoDatabaseEntities())
            {
                foreach (string store in obj.lstStores)
                {
                    fze.DeleteReportsByStore(obj.EmployeeId, store);
                    if (obj.lstReports != null)
                    {
                        foreach (int report in obj.lstReports)
                        {
                            fze.InsertEmployeeReports(obj.EmployeeId, store, report);
                        }
                    }
                }
            }
            return Json("Success", JsonRequestBehavior.AllowGet);
        }
        public ActionResult GetEmployeeByEmail(string Email)
        {
            /*******************************************************************
      Author      : Gopi
      Date        : 04/07/2017
      Description : Returns Employee details by Email address
     *******************************************************************/
            var objSearch = new Employee_Search();
            using (fze = new FiestaZohoDatabaseEntities())
            {
                var lst = fze.GetEmployeeDetailsByEmail(Email).ToList();

                if (lst.Count > 0)
                {
                    objSearch.EmpDetails = lst[0];
                    objSearch.lstStates = fze.GetAllStatesByEmployee1(objSearch.EmpDetails.EmpId).ToList();
                    objSearch.lstStores = fze.GetStoresByState(string.Empty, objSearch.EmpDetails.RoleId, objSearch.EmpDetails.EmpId, Convert.ToInt32(Session["UserID"])).ToList();
                }
            }
            return Json(objSearch, JsonRequestBehavior.AllowGet);
        }
        public ActionResult ForgotPassword()
        {
            return View();
        }
        FiestaZohoDatabaseEntities fze;
        //login
        [HttpPost]
        public ActionResult Login(Employee_Login objUser)
        {
            /*******************************************************************
        Author      : Gopi
        Date        : 04/07/2017
        Description : Validating User login
       *******************************************************************/
            var res = string.Empty;
            using (fze = new FiestaZohoDatabaseEntities())
            {

                objUser.password = Convert.ToBase64String(
          System.Security.Cryptography.SHA256.Create()
          .ComputeHash(Encoding.UTF8.GetBytes(objUser.password)));
                var usr = fze.ValidateLogin(objUser.emailEmployee, objUser.password).ToList();

                if (usr != null && usr.Count() > 0)
                {
                    Session["UserID"] = usr[0].EmpId.ToString();
                    Session["UserName"] = usr[0].EmployeeName.ToString();
                    Session["UserEmail"] = usr[0].EmailAddress.ToString();
                    Session["UserRole"] = usr[0].RoleId;

                }
                else
                {
                    res = "Email or Password is wrong.";
                }

            }
            //  }
            return Json(res, JsonRequestBehavior.AllowGet);
        }

        //register
        [HttpPost]
        public ActionResult RegisterEmployee(Employee emp)
        {
            /*******************************************************************
       Author      : Gopi
       Date        : 04/07/2017
       Description : saves new registerd employee details 
      *******************************************************************/
            EmployeeRegistration_Result objRes = new EmployeeRegistration_Result();
            using (fze = new FiestaZohoDatabaseEntities())
            {
                string encrpassword = Convert.ToBase64String(
          System.Security.Cryptography.SHA256.Create()
          .ComputeHash(Encoding.UTF8.GetBytes(emp.password)));
                objRes = fze.EmployeeRegistration(emp.firstName, emp.lastName, emp.emailEmployee, encrpassword).FirstOrDefault();
                ModelState.Clear();
                if (objRes.Status.Equals("Success"))
                {
                    objRes.Status = emp.firstName + " " + emp.lastName + " ( " + emp.emailEmployee + " ) " + " is successfully registered.";
                }

            }
            return Json(objRes, JsonRequestBehavior.AllowGet);

            // }
        }


    }
}