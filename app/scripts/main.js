// Main file
'use strict';
(() => {
   // Creates the main object
   let VASSPolymer = {};
   
   // Creats the services
   VASSPolymer.Services = {
       _AjaxService: new AjaxService()
   };
   VASSPolymer.Services._AuthService = new AuthService(VASSPolymer.Services._AjaxService);
   
   // Creates the front end login 
   let FrontEndLogin = new FrontLogin(VASSPolymer.Services._AjaxService);
   
   window.VASSPolymer = VASSPolymer;
})();