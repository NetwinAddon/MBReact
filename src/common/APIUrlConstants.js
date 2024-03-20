import Constants from "./Constants";


class APIUrlConstants {

  static BASE_URL = "http://192.168.31.50:8071/SUREMOBMobAppRestAPI/AppRestAPI";  // Developer
  
  // static BASE_URL = "https://uatmobapp.netwincbs.in:16359/SUREMOBMobAppRestAPI/AppRestAPI"; //UAT

  // static BASE_URL = "https://uatautomation.netwinui.in:13456/SIDHVINSP_MobAppRestAPI/AppRestAPI";  //QA Tester


  // static BASE_URL = "https://uatautomation.netwinui.in:13456/NewSid_MobAppRestAPI/AppRestAPI";  //QA Automation Tester

 // static BASE_URL = "https://mbreact.netwinui.in/SUREMOBMobAppRestAPI/AppRestAPI";  // Developer

  // static BASE_URL = "https://uatmobapp.netwincbs.in:16359/SUREJSPMobAppRestAPI/AppRestAPI"; //UAT -Google

  
  static Google_Rest_Url = 'https://mobappuat.netwincbs.in:9275/GPLAYMobAppRestAPI/AppRestAPI';

  static Headers = (dynamicOprCD) => {
    return {
      ProdCD: Constants.ProdCD,
      BankCD: Constants.BankCode,
      OprCD: dynamicOprCD,
      Content_Type: 'application/json',
      REQ_TYPE: 'POST',
      'X-XSS-Protection': '1; mode=block[2]',
      'X-Content-Type-Options': 'nosniff',
      'Strict-Transport-Security': 'max-age=16070400; includeSubDomains',
      'Content-Security-Policy': 'default-src "self"; img-src "self" cnd.example.com',
    };
  };



  

};

export default APIUrlConstants;