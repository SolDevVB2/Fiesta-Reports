using FiestaReports.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FiestaReports.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult LogOut()
        {
            /*******************************************************************
  Author      : Gopi
  Date        : 04/07/2017
  Description : Loggs out from the application 
 *******************************************************************/
            Session.RemoveAll();
            Session.Clear();
            return RedirectToAction("Index", "Home");
        }
        [AuthorizationFilter]
        public ActionResult Menu()
        {
            int RoleId = Convert.ToInt32(Session["UserRole"]);
            ViewBag.RoleId = RoleId;
            return View();
        }
        [AuthorizationFilter]
        public ActionResult NationalContents()
        {
            return View();
        }
        [AuthorizationFilter]
        public ActionResult SecondLevelContents()
        {
            return View();
        }
        [AuthorizationFilter]
        public ActionResult AgentContents()
        {
            return View();
        }

    }
}