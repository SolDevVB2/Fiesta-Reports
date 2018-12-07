using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FiestaReports.Models
{
    public class AuthorizationFilter :ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            HttpContext ctx = HttpContext.Current;
            // check if session is supported
           
            if (ctx.Session["UserName"] == null)
            {
                // check if a new session id was generated
                filterContext.Result = new RedirectResult("~/Account/LoginView");
                return;
            }

            base.OnActionExecuting(filterContext);
        }
    }
}