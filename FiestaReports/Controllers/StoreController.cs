using FiestaReports.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FiestaReports.Controllers
{
    public class StoreController : Controller
    {
        private FiestaZohoDatabaseEntities db = new FiestaZohoDatabaseEntities();

        FiestaZohoDatabaseEntities fze;
        // GET: Store
        public ActionResult Index()
        {
            return View();
        }

        [AuthorizationFilter]
        public ActionResult ManageStores()
        {
            return View();
        }

        /*******************************************************************
          Author      : Gopi
          Date        : 04/07/2017
          Description : Saves new Store details 
         *******************************************************************/
        [AuthorizationFilter]
        public ActionResult AddStore(Store objStore)
        {
            
            var res = string.Empty;
            //      using (fze = new FiestaZohoDatabaseEntities())
            //{
            //     res = fze.AddStore(objStore.StateId,objStore.StoreNumber, objStore.Address, objStore.City, objStore.ZipCode).FirstOrDefault();
            //}
            if(!Exists(objStore))
            {
                var newStore = SetValues(objStore);
                db.Fiesta_Store.Add(newStore);
                db.SaveChanges();
            }
            else
            {
                res = "Store Already Exists.";
            }
            return Json(res, JsonRequestBehavior.AllowGet);
        }
        
        [AuthorizationFilter]
        [HttpGet]
        public ActionResult GetAllStores()
        {
            var objStores = (from s in db.Fiesta_Store
                             join st in db.Fiesta_State on s.StateId equals st.StateId
                             select new {
                                 StoreNo = s.StoreNo,
                                 Street = s.Street,
                                 State = st.StateName,
                                 City = s.City,
                                 ZipCode = s.Zipcode
                             }).OrderBy(x=> x.State).ThenBy(x=> x.StoreNo).ToList();

            return Json(objStores, JsonRequestBehavior.AllowGet);
        }

        private bool Exists(Store store)
        {
            var state = db.Fiesta_State.FirstOrDefault(x => x.StateId == store.StateId);
            var storeNum = string.Format("{0}{1}", state.StateCode, store.StoreNumber);
            var existing = db.Fiesta_Store.FirstOrDefault(x => x.StoreNo == storeNum);
            return existing != null;
        }

        private Fiesta_Store SetValues(Store store)
        {
            var state = db.Fiesta_State.FirstOrDefault(x => x.StateId == store.StateId);
            var storeNum = string.Format("{0}{1}", state.StateCode, store.StoreNumber);
            var fStore = new Fiesta_Store {
                StateId = state.StateId,
                StoreNo = storeNum,
                Street = store.Address,
                City = store.City,
                Zipcode = store.ZipCode,
                CreatedDate = DateTime.Now,
                IsActive = true
            };
            return fStore;
        }
    }
}