import { Platform } from "react-native";

const AppName = 'Mobile Banking';
const CompanyName = 'Netwin Demo For Co-operative Bank';

export default {
  appName: 'Mobile Banking',
  splashText: 'Mobile Banking',
  homeScreenText: 'Home Screen',
  /*---------   ok dialog  ----------------*/

  okdialogHeader: 'Mobile Banking',
  okdialogOkText: 'Ok',
  internetReq : 'Plsease check your internet connection',
  /************************************** */

  /*-----   login s screen   -------*/
  email: 'Email',
  password: 'Password',
  keepLoggedIn: 'Keep logged in',
  logeIn: 'Login In',
  forgotPassword: 'Forgot Password?',
  register: 'Registrati ora',
  allFeildsRequired: 'Please enter your email and password',
  allFeildsUserIDAndPasswordRequired: 'Please enter your UserID and Password',
  emailRequired: "Please enter your email address",
  userIdRequired: "Please enter your UserID",
  passwordRequired: 'Please enter your password',
  invalidEmail: 'Please enter a valid email address',
  timeOut:
    'Current Operation Taking Longer Than Expected Please wait or try again',
  /*-----   ************   -------*/
  /*------   Signup   ------- */
  signupScreenName: 'Registrati',
  confirmPassword: 'Conferma Password',
  register: 'REGISTRATI',
  passwordMatchError: 'Password e Conferma password non coincidono',

  /************************************** */
  /*-------------       forget password         ------------- */

  forgetPasswordScreenName: 'Password dimenticata',
  resetPasswordButton: 'INVIA',
  forgetPassword: 'Forget Password',

  /*-----------------   Homescreen  -----------------------*/
  logOut: 'Disconnettersi',
  loggedOutSuccess: 'Disconnesso con successo',

  //   FCM Token
  KEY_TOKEN: 'Token',


  /*-----------------   Fonts  -----------------------*/

fontRegular : Platform.OS == 'android' ? 'SF-UI-Display-Regular' : 'SFUIDisplay-Regular' ,
fontBold : Platform.OS == 'android' ? 'SF-UI-Display-Bold' : 'SFUIDisplay-Bold',
fontMedium : Platform.OS == 'android' ? 'SF-UI-Display-Medium' : 'SFUIDisplay-Medium',


  /*-----------------   StartScreen  -----------------------*/
  bankingWithoutBoundried: `Banking \n without boundaries`,
  getStarted: 'Get Started',


/*-----------------   LoginType  -----------------------*/
  existingUser: 'Existing User',
  newUsers : 'New Users',
  // companyName : 'Agrolaxmi urban \n multipurpose nidhi limited',
  // companyName : 'Netwin Co-operative \n Bank Ltd.',
  companyName : 'Netwin Demo For Co-operative \n Bank',

/*-----------------   User  -----------------------*/
  signIn : 'Sign in',
  logIn : 'Login',
  forgotPass : 'Forgot password',
  submit : 'Submit',


/*-----------------   ExistLoginOtp  -----------------------*/

  notRecivedResendOtp : 'Not received ?  Resend OTP',
  entrOtpToconfirm : 'Enter OTP to confirm',

/*-----------------   ExiastLoginSuccess  -----------------------*/
congratulations : 'Congratulations!',
redirectionText : ` Your account is ready to use. You will be redirected \n to the home page in a few seconds.`,
createMpin : 'Create your MPIN',

/*-----------------   Dashboard  -----------------------*/

showBal : 'Show Balance',
eServices : 'eServices',
onlineServices:'Online Services',
upi : 'UPI',
upif : 'Unified Payment Interface',

/*-----------------   register mode screen -----------------------*/
strSelectRegisterMode : "Select Register Mode",
strOnline : 'Online',
strDirectRegistration : "Direct Registration",
strOffline : 'Offline',
strBranchVisitRegistration : "Branch visit registration",




//side profile view
strUserName : 'Jhon D.',
strAccountHolderName : 'Account Holder Name',
strEditProfileInfo : 'Edit profile information',
strNotification : 'Notifications',
strNotificationON : 'ON',
strNotificationOFF : 'OFF',
strLanguage : 'Language',
strEnglish : 'English',
strSecurity : 'Security',
strTheme : 'Theme',
strThemeMode : 'Light mode',

ThemeOne : 'EasyAura',
ThemeTwo : 'SimpleSky',
ThemeThree : 'SoftGlow',


strSetChangePassword : 'Set or Change Password',
strLogout: 'Logout',

//login type select screen
strHi: 'Hi, ',
strLoginTypeUsername: 'Sufiyan Mirza',
strMPIN: 'MPIN',
strUserId: 'User ID',
strSubmit: 'Submit',
strForgetMPIN: 'Forget MPIN',
strForgetPassword: 'Forget Password',
strAddFingerPrint: 'Add Fingerprint',

//quick pay screen
strQuickPay: 'Quick Pay',
strSelectModeOfTranser: 'Select mode of Transfer',
strQucikTranser: 'IMPS \nTransfer',
strNEFTRTGS: 'NEFT/RTGS',
strNEFT: 'NEFT',
strFundTransferToWonAc: 'Fund transfer\nto Own A/C',
strWithinBank: 'Within bank\nother A/C',
strScanAndPay: 'Scan & Pay',

//own account transfer screen
strOwnAccountTranser: 'Own A/C Transfer',
strFromAcc: 'From A/C',
strBeneficiaryAcc: 'Beneficiary A/C',
strDebitAcc: 'Debited A/C No.',
strAmount: 'Amount',
strRemark: 'Remark',


// form header (offline/ online)
fillForm : 'Fill Form',
formVerify : 'Verify',
formDone : 'Done', 

// fixed Header text offline and online
offlineForm : 'Offline Registration',
onlineForm : 'Online Registration',


// MainLogin
checkBal : 'Click to view Balance',


//mainLoginViewBal
mainBal : ' Balance',
mainAvailBal : 'Available Balance',
mainRsSymbol : '₹',
mainViewTrans : 'View Transactions',


//mainLoginMpinConf
viewBalMpinConf : 'Enter MPIN for view Balance',
forgotMpin : 'Forgot MPIN ?',

// My Account 
myAcc  : 'My Accounts',
myAccCheckBal : 'Check your latest update and balance details',
myAccno : 'A/c No.: ',
myAccSaving : 'Saving Accounts',
myAccShareAcc : 'Shares Accounts',
myAccCurrentAccount : 'Current Accounts',
myAccDeposit : 'Deposit Accounts',
mySmallSavingAccount : 'Small Saving Accounts',
myLoanAccount : 'Loan Accounts',

// Loans
vehicleLoan: 'Vehicle Loan',
goldLoan: 'Gold Loan',
subStrLoan :'Emergency Loan Application',



// Prominent Desclosure 

CameraAccess : CompanyName+" "+AppName+' uses camera functionality for Scan & Pay transactions, allowing users to easily conduct transactions by scanning QR codes whenever required.',

locationAccess : CompanyName+" "+AppName+' app uses the Location function to get Coordinated while login, fraud prevenction process to enhance the security of the user.',

storageAccess :  CompanyName+" "+AppName+" accesses the Internal Storage of the user to store Documents such as mini statement & QR code for the ease the user experience.",

contactAccess : CompanyName+" "+AppName+" app collects, transmits, syncs, and stores Mobile Number for Used for Registration and OTP purpose whenever required while using the application",

audioAccess : CompanyName+" "+AppName+" uses Voice Command for Speech Recognition & statement download process whenever required.",

deviceInfoAccess : CompanyName+" "+AppName+" Acess to the phone calls functionality might be necessary for security feature such as two factor authentication (2FA) via SMS or phone calls provide details about how this permission will be used to enhance security.",

bluetoothAccess :  CompanyName+" "+AppName+' app uses the Bluetooth permission to connect to a printer and print collection receipts.\n\nThis is a necessary function for your convenience. We take your privacy seriously, and we will not access your Bluetooth for any other purpose',



// CameraAccess : 'In order to use the Scan and Pay feature, we require access to your device\'s camera.\n\nThis permission allows us to scan QR codes and barcodes to quickly and easily process payments. We understand the importance of your privacy and assure you that we will not access your camera for any other purpose than the intended function.',

// locationAccess : 'For easy loan recovery, we request access to your home location latitude and longitude. \n\nThis permission allows us to locate you in case of any unforeseen circumstances where loan recovery is necessary. We take your privacy seriously and assure you that we will not access your location data for any other purpose than the intended function.',

// storageAccess : 'To provide you with an efficient and seamless banking experience, we request permission to access your device\'s storage.\n\nThis permission allows us to download your bank statements , invoices & related reports , enabling you to keep track of your transactions and manage your finances with ease. We respect your privacy and assure you that we will not access any other files on your device.',

// contactAccess : 'To facilitate recharge and bill payment services, we request access to your contact list.\n\n This permission allows us to quickly and easily identify your contacts for transactions. We value your privacy and assure you that we will not access your contact data for any other purpose than the intended function.',

// audioAccess : 'To provide you with a voice command assistant, we require access to your device\'s microphone.\n\nThis permission allows us to process your voice commands accurately and efficiently for searching & executing commands related to the app. We understand the importance of your privacy and assure you that we will not access your microphone for any other purpose than the intended function.',

// bluetoothAccess : 'Our app uses the Bluetooth permission to connect to a printer and print collection receipts.\n\nThis is a necessary function for your convenience. We take your privacy seriously, and we will not access your Bluetooth for any other purpose',

// deviceInfoAccess : 'Our app requests the Phone state permission to ensure the secure operation of the app on your device.\n\nThis permission helps us maintain the app\'s functionality within a single device and enhance its security features. We prioritize your privacy and will not use this permission to access or share any personal information.',



// enable fingureprint
enableFingureprint : 'Steps for Enabling\nFingerprint Login',

termsAndConditions : 'By using our services you are agreeing to our\nTerms and Privacy Policy',


// quickPay Otp 
quickPayOtp : 'Enter MPIN for Quick pay',

// otp For funnd transfer

enterOTP : 'Enter OTP',
enterTransID : 'Enter Transaction ID',


// mpin screen :
entrMpin : 'Enter your MPIN',
confMpin : 'Confirm your MPIN',


// download Statement:
downloadStatemant : 'Download Statement',
downloadSubStr : 'Check your latest update and balance details',


// m passbook
mPassbook : 'M- Passbook',
mpassSubStr : 'Check your latest minimized statement',
fullName : 'Full Name',
AccNumber: 'Account Number',
AvailBal : 'Available Balance',
accType : 'Account Type',


// mini statement:
miniStatement : 'Mini Statement',
fromDate : 'From Date',
ToDate : 'To Date',
miniSubStr : 'Check your latest update and balance details',

// Deposit Add nominee

addNominee :'Add Nominee',
nomineeSubStr  :'Check your latest minimized statement',
nomineeStr : 'Add details to create new account ',

// deposit open ACC
depositOpenAcc : 'New Deposits A/c Opening',
modeOfOperation : 'Select mode of operation',
creditAmount : 'Credit The Amount Back To',
nomineeRequired : 'Nominee Required',
selectOrAddNominee : 'Select Nominee Or Add Nominee',
note : 'Note:',
noteDetails : 'Either you can add new nominee or you can select from list, you can’t do both (add and select) process at a time',
next : 'Next',
accNo : 'Account No',
resendOTP : 'Resend OTP',

//review FD 

reviewFD : 'Review Your FD',
typeOfAcc : 'Type of Account',
Scheme : 'Scheme',
nameOfAccHolder : 'Name of Account Holder',
depsitAmount : 'Deposit Amount',
mode : 'Mode',
interestRate : 'Interest Rate %',
maturityAmount : 'Maturity Amount',
depositPeriod : 'Deposit Period',
maturityDate : 'Maturity Date',
maturityInstruction : 'Maturity Instruction',
interestPayout : 'Interest Payout',
joinHolder : 'Join Holder',
nominee : 'Nominee',
iAgree : 'I Agree',
termsAndCondition : 'Terms and Condition',

// new Deposit account
newDepositAcc : 'New Deposits A/c Opening',
newDepositSubStr : 'Open new deposit account ',
addDetailstoNewAcc : 'Add details to create new account ',


//Renew Deposit Account 
RenewDepositAcc :'Renew Deposit Account ',
RenewDepositAccSubStr : 'Select Account for Renewal',

//Prematured Enquiry
PrematuredEnquiry : 'Prematured Enquiry',
PrematuredEnquirySubStr : 'Prematured Deposit Details ',

//Close Deposit
CloseDeposit : 'Close Deposit',
CloseDepositSubStr : 'Select Account for Closing',

//
SavingAccount  : ' Saving Account',


// yes no dialoge
yes : 'Yes',
no : 'No',

// 

selectPeriod : 'Select Period',


custom : 'Custom', 

rupee : '₹ ',

// same bank other account
samebankotheracc : 'Within Bank Other A/c',
otheraccfundtrans : 'Other A/c Fund Transfer',
fundTransfer : 'Fund Transfer',
addBeneficiary : 'Add Beneficiary',
verifyBeneficiary : 'Verify Beneficiary',
editBeneficiary : 'Edit Beneficiary',
modifyBeneficiary : 'Modify Beneficiary',
closeBeneficiary : 'Close Beneficiary',
deleteBeneficiary : 'Delete Beneficiary',
impsText : 'IMPS',

 //Standing Instructions
 addStandingInstructionTitle: 'Add Standing Instruction',
 addStandingInstructionSubtitle: 'Add New Standing Instruction',

 //Standing Instructions
 interestRateCircular: 'Interest Rate Circular',
 interestRateCircularDescription: 'Select Interest Rate Type',
 depositeInterestRate: 'Deposit Interest Rate',
 loanInterestRate: 'Loan Interest Rate',
 loanInterestRateCircular: 'Loan Interest Rate Circular',
 loanInterestRateCircularDes: 'Select Your Account Type',


};
