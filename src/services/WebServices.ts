import { Alert, ToastAndroid } from 'react-native';
import { alertResponse, services } from './../config/config';
import APICallingService from './APICallingService';
import { RealmController } from './../database/RealmController';
import LoginSchema from './../database/LoginSchema';
let realm = RealmController.getRealmInstance();
let loginData = RealmController.getLoginData(realm, LoginSchema.name);
loginData = loginData['0'] ? loginData['0'] : {};
let loginInfo: any = (loginData && loginData.loginResponse && (loginData.loginResponse != '')) ? JSON.parse(loginData.loginResponse) : {}

const callToPostService = (payload: any, url: string, auth: string) => {

    return APICallingService.sendPostRequestJson(url, payload, (res: any) => {
    });
}

const callToGetContactList = (url: string, payload: string) => { //

    return APICallingService.sendNewPostRequest(url, payload, (res: any) => {

    });

}
const calltoClouser = (url: string, payload: string) => {
    return APICallingService.sendSoapPostRequest(url, payload, (res: any) => {

    });
}

const callToPostJSonService = (payload: any, url: string, auth: string) => {

    return APICallingService.sendPostRequestJson(url, payload, (res: any) => {
    });
}

const callToSignature = (url: string, payload: any) => {
    
    return APICallingService.sendPostRequestJson(url, payload, (res: any) => {

    });

}
async function fetchLovDataService(payload: any, auth: string) {
    try {
        let url = services.url.lovURL;
        const response = await callToPostService(payload, url, auth);
        if (response) {
            debugger;
            return response
        }
        else {
            return response
        }
    }
    catch (e) {
        // ToastAndroid.show('Failed to Get Lov Data ,Please Try again', 1000);
    }
}

const callTosubmitCondemnationService = (payload: any, url: string) => {

    return APICallingService.sendPostRequestJson(url, payload, (res: any) => {
    });
}

async function submitCondemnationService(payload: any) {
    try {
        let url = services.url.submitCondemnation;
        const response = await callTosubmitCondemnationService(payload, url);
        if (response) {
            debugger;
            return response
        }
        else {
            return response
        }
    }
    catch (e) {
        // ToastAndroid.show('Failed to Get Lov Data ,Please Try again', 1000);
    }
}

const callToLoginService = (url: string, auth: string) => {
    // alert((url))

    return APICallingService.sendRequestForGet(url, (res: any) => {
    });
}

const callToGetTaskAPI = (url: string) => {

    return APICallingService.sendGetRequest(url, (res: any) => {
    });
}

const callToGetChecklistAPI = (url: string, payload: any) => {

    return APICallingService.sendPostRequestJson(url, payload, (res: any) => {
    });
}

const callToGetNocChecklistAPI = (url: string, payload: string) => {

    return APICallingService.sendPostRequestJson(url, payload, (res: any) => {
    });
}

async function fetchNocChecklist(payload: any) {

    try {
        debugger;
        let url = services.url.getChecklistUrl;

        debugger;
        const response = await callToGetNocChecklistAPI(url, payload);
        if (response) {
            debugger;
            return response
        }
        else {
            ToastAndroid.show('No Checklist available', 1000);
        }
    }
    catch (e) {
        // ToastAndroid.show('Failed to Get Lov Data ,Please Try again', 1000);
    }
}

const callToGetBA = (url: string, payload: string) => {

    return APICallingService.sendPostRequestJson(url, payload, (res: any) => {
    });
}

const callToGetVehicleData = (url: string, payload: string) => {

    return APICallingService.sendPostRequest(url, payload, (res: any) => {
    });
}

const callToCreateAdhocTask = (url: string, payload: string) => {

    return APICallingService.sendPostRequest(url, payload, (res: any) => {
    });
}

const callToScheduleTaskDetails = (url: string, payload: string) => {

    return APICallingService.sendPostRequest(url, payload, (res: any) => {
    });
}

const callToAcknowldgeAPI = (url: string, payload: string) => {
    debugger;
    return APICallingService.sendPostRequestJson(url, payload, (res: any) => {
    });
}

const callToGetEfstData = (url: string, payload: any) => {

    return APICallingService.sendRequestForPostWithXML(url, payload, (res: any) => {

    });
}

const callToUpdateEfstCount = (url: string, payload: any) => {

    return APICallingService.sendPostRequestJson(url, payload, (res: any) => {

    });
}

const callToFetchOnHoldResult = (url: string, payload: string) => {

    return APICallingService.sendRequestForPostWithXML(url, payload, (res: any) => {

    });
}

const callToClosureInspection = (url: string, payload: string) => {

    return APICallingService.sendPostRequest(url, payload, (res: any) => {
    });
}

async function LoginService(url1: string, auth: string) {
    try {
        let url = services.url.loginUrl + url1;
        const response = await callToLoginService(url, auth);
        // alert(JSON.stringify(response))

        if (response) {
            debugger;
            return response
        }
        else {
            return response
        }
    }
    catch (e) {
        // ToastAndroid.show('Failed to Get Lov Data ,Please Try again', 1000);
    }
}

const callToInspectionSubmitService = (payload: any, url: string) => {

    return APICallingService.sendPostRequestJson(url, payload, (res: any) => {
    });
}

async function InspectionSubmitService(payload: any) {
    try {
        let url = services.url.submitInspection;
        const response = await callToInspectionSubmitService(payload, url);
        if (response) {
            debugger;
            return response
        }
        else {
            return response
        }
    }
    catch (e) {
        // ToastAndroid.show('Failed to Get Lov Data ,Please Try again', 1000);
    }
}

const callToAccountSyncService = (url: string, auth: string) => {
    return APICallingService.sendRequestForGet(url, (res: any) => {
    });
}

async function getAccountSyncService(subUrl: string, auth: string) {
    try {
        let url = services.url.accountSyncURL + subUrl;
        debugger;
        const response = await callToAccountSyncService(url, auth);
        if (response) {
            debugger;
            return response
        }
        else {
            return response
        }
    }
    catch (e) {
        // ToastAndroid.show('Failed to Get Lov Data ,Please Try again', 1000);
    }
}

async function fetchGetSignature(obj: any) {                         //action call url

    try {
        debugger;
        let url = services.url.postSignatureURL;
        let payload = {
            "InterfaceID": "ADFCA_CRM_SBL_039",
            "LanguageType": "ENU",
            "InspectorId": loginData.username,
            "InspectorName": loginInfo.InspectorName ? loginInfo.InspectorName : "",
            "Checklistattachment": {
                "Inspection": {
                    "TaskId": obj.taskId,
                    "ListOfActionAttachment": {
                        "QuestAttachment": {
                            "FileExt": "jpg",
                            "FileName": "signature.png",
                            "FileSize": "",
                            "FileSrcPath": "",
                            "FileSrcType": "",
                            "Comment": "",
                            "FileBuffer": obj.fileBuffer
                        }
                    }
                }
            }
        };
        const response = await callToSignature(url, payload);
        // if (response) {
        // ToastAndroid.show('response' + JSON.stringify(response), 1000);
        debugger;
        // console.log("response.data", response.data);
        return response
        // console.log("response in web services", response);
        // }
        // else {
        //     return response
        // }
    }
    catch (e) {
        // ToastAndroid.show('Failed to Get Lov Data ,Please Try again', 1000);
    }
}
async function fetchGetTaskApi(loginData: any) {
    try {
        debugger;
        let loginInfo: any = loginData.loginResponse != '' ? JSON.parse(loginData.loginResponse) : {}
        //  let url = 'http://10.110.45.80:7004/GBL_ADFCA_GetScheduleTaskDetails/GetTaskService/GetTasks?UserName=SALEH.BALKHAIR&InspectorId=1-6RTH9E&Attribute5=1.5.4&timetemp=2503';
        let url = services.url.getTaskUrl + `UserName=${loginData.username}&InspectorId=${loginInfo.UserId}&Attribute5=1.5.4&timetemp=2503`;
        const response = await callToGetTaskAPI(url);
        if (response) {
            debugger;
            return response
        }
        else {
            return response
        }
    }
    catch (e) {
        // ToastAndroid.show('Failed to Get Lov Data ,Please Try again', 1000);
    }
}

async function fetchGetChecklistApi(dataObj: any) {
    try {
        debugger;
        let url = services.url.getChecklistUrl;
        let payload = {}

        payload = {

            "config": {

            },
            "global-instance": {
                "attribute": [
                    {
                        "@id": "inspection_language",
                        "@type": "text",
                        "text-val": "ENU"
                    },
                    {
                        "@id": "main_business_activity",
                        "@type": "text",
                        "text-val": dataObj.Description
                    }
                ],
                "entity": {
                    "@id": "business_activity",
                    "instance": {
                        "@id": dataObj.Description,
                        "attribute": {
                            "@id": "business_activity",
                            "@type": "text",
                            "text-val": dataObj.Description,
                            "#text": ""

                        }
                    }
                }
            }
        }

        const response = await callToGetChecklistAPI(url, payload);
        // if (response) {
        //ToastAndroid.show('response' + response, 1000);
        debugger;
        return response
        // }
        // else {
        //     return response
        // }
    }
    catch (e) {
        // ToastAndroid.show('Failed to Get Lov Data ,Please Try again', 1000);
    }
}

async function fetchGetBusinessActivity(item: any) {

    let url = services.url.getBA;

    // let payload = `<?xml version="1.0" encoding="UTF-8"?>
    // <soap:Envelope
    //     xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    //     <soap:Header>
    //         <wsse:Security
    //             xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" soap:mustUnderstand="1">
    //             <wsse:UsernameToken
    //                 xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"
    //                 xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" wsu:Id="UsernameToken-nOKIJFClgN565XNeck5oQA22">
    //                 <wsse:Username>soauser</wsse:Username>
    //                 <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">soauser123</wsse:Password>
    //             </wsse:UsernameToken>
    //         </wsse:Security>
    //     </soap:Header>
    //     <soap:Body>
    //         <gbl:ActivityList_Input
    //             xmlns:gbl="http://xmlns.oracle.com/MOB_DEV_ADFCA/GBL_ADFCA_SERV_GetBusinessActivities/GBL_ADFCA_SERV_GetBusinessActivitiesBPEL">
    //             <gbl:InterfaceID>ADFCA_CRM_SBL_069</gbl:InterfaceID>
    //             <gbl:TradeLicense>`+ item.LicenseCode + `</gbl:TradeLicense> 
    //             <gbl:LanguageType>ENU</gbl:LanguageType>
    //             <gbl:InspectorName/>
    //             <gbl:MainActivity>`+ item.Description + `</gbl:MainActivity>
    //             <gbl:InspectorId/>
    //             <gbl:EnglishName></gbl:EnglishName>
    //             <gbl:ArabicName></gbl:ArabicName>
    //         </gbl:ActivityList_Input>
    //     </soap:Body>
    // </soap:Envelope>`;

    let payload: any = {
        "TradeLicense": item.LicenseCode,
        "LanguageType": "ENU",
        "InspectorName": "",
        "MainActivity": item.Description,
        "InspectorId": "",
        "EnglishName": "",
        "ArabicName": ""
    }
    // <gbl:TradeLicense>CN-20534532</gbl:TradeLicense> - trade licensenumber 
    // <gbl:MainActivity>Grocery</gbl:MainActivity> - business activity
    debugger;
    console.log('Ba payload : ', payload)
    const response = await callToGetBA(url, payload);
    // if (response) {
    // console.log('response' + JSON.stringify(response), 1000);
    debugger;
    return response
}

async function callToSearchByEst(url: string, payload: any) {

    const response = await callToPostJSonService(payload, url, '');
    return response
}

const callToGetSrAPI = (url: string) => {

    return APICallingService.sendGetRequest(url, (res: any) => {
    });
}

async function fetchHistoryVehicleData(item: any) {

    let url = services.url.getSearchByVehicle;

    let payload = `<soap:Envelope
	xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
	<soap:Header>
		<wsse:Security
			xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" soap:mustUnderstand="1">
			<wsse:UsernameToken
				xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"
				xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" wsu:Id="UsernameToken-s9LhJx1IoeAq7HNLsrIyjw22">
				<wsse:Username>soauser</wsse:Username>
				<wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">soauser123</wsse:Password>
			</wsse:UsernameToken>
		</wsse:Security>
	</soap:Header>
	<soap:Body>
		<gbl:VehicleDetails_Input
			xmlns:gbl="http://xmlns.oracle.com/GBL_ADFCA_SERV_Dev/GBL_ADFCA_SERV_RetrieveVehicleDetails/GBL_ADFCA_SERV_RetrieveVehicleDetailsBPEL">
			<gbl:InterfaceID>ADFCA_CRM_SBL_009</gbl:InterfaceID>
			<gbl:ChasisNumber>`+ item.chassisNumber + `</gbl:ChasisNumber>
			<gbl:PlateNumber>`+ item.plateNumber + `</gbl:PlateNumber>
			<gbl:VehicleMake>`+ item.vehicleMake + `</gbl:VehicleMake>
			<gbl:LanguageType>ENU</gbl:LanguageType>
			<gbl:TradeLicenseNumber>`+ item.tradeLicenseNumber + `</gbl:TradeLicenseNumber>
			<gbl:InspectorName/>
			<gbl:PlaceofIssue>`+ item.placeOfIssue + `</gbl:PlaceofIssue>
			<gbl:InspectorId/>
			<gbl:PlateCode>`+ item.plateCode + `</gbl:PlateCode>
		</gbl:VehicleDetails_Input>
	</soap:Body>
</soap:Envelope>`;

    debugger;
    const response = await callToGetVehicleData(url, payload);
    // if (response) {
    // console.log('fetchHistoryVehicleData response' + JSON.stringify(response), 1000);
    debugger;
    return response
}

async function fetchSrDetails() {
    try {
        debugger;
        // let url = services.url.srDetails;
        let url = services.url.srDetails + 'LoginId=1-6RTH9E&LoginName=' + loginData.username + '&RequestType=SR&Attribute5=1.5.4&timetemp=2504';
        const response = await callToGetSrAPI(url);
        if (response) {
            debugger;
            return response
        }
        else {
            return response
        }
    }
    catch (e) {
        // ToastAndroid.show('Failed to Get Lov Data ,Please Try again', 1000);
    }
}

async function createAdhocTask(item: any) {

    let url = services.url.createAdhocInspection;

    let payload = `<soap:Envelope
	xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
	<soap:Header>
		<wsse:Security
			xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" soap:mustUnderstand="1">
			<wsse:UsernameToken
				xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"
				xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" wsu:Id="UsernameToken-s9LhJx1IoeAq7HNLsrIyjw22">
				<wsse:Username>soauser</wsse:Username>
				<wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">soauser123</wsse:Password>
			</wsse:UsernameToken>
		</wsse:Security>
	</soap:Header>
	<soap:Body>
		<gbl:NewInspection_Input
			xmlns:gbl="http://xmlns.oracle.com/GBL_ADFCA_SERV_Dev/GBL_ADFCA_SERV_AdhocInspection/GBL_ADFCA_SERV_AdhocInspectionBPEL">
			<gbl:InterfaceID>ADFCA_CRM_SBL_034</gbl:InterfaceID>
			<gbl:Longitude></gbl:Longitude>
			<gbl:PostalCode></gbl:PostalCode>
			<gbl:Address2>`+ item.Address2 + `</gbl:Address2>
			<gbl:InspectionType>`+ item.InspectionType + `</gbl:InspectionType>
			<gbl:AccountArabicName>`+ item.AccountArabicName + `</gbl:AccountArabicName>
			<gbl:PhoneNumber>`+ item.PhoneNumber + `</gbl:PhoneNumber>
			<gbl:LanguageType/>
			<gbl:City>`+ item.City + `</gbl:City>
			<gbl:TradeLicenseNumber>`+ item.TradeLicenseNumber + `</gbl:TradeLicenseNumber>
			<gbl:Latitude></gbl:Latitude>
			<gbl:InspectorName>${loginData.username}</gbl:InspectorName>
			<gbl:AccountName>StOrgRegis</gbl:AccountName>
			<gbl:Score></gbl:Score>
			<gbl:MailAddress>`+ item.MailAddress + `</gbl:MailAddress>
			<gbl:Address1>`+ item.Address1 + `</gbl:Address1>
			<gbl:AccountType>`+ item.AccountType + `</gbl:AccountType>
			<gbl:Action>`+ item.Action + `</gbl:Action>
			<gbl:LicenseExpDate>`+ item.Address2 + `</gbl:LicenseExpDate>
			<gbl:InspectorId/>
			<gbl:LicenseRegDate>`+ item.Address2 + `</gbl:LicenseRegDate>
			<gbl:Grade/>
		</gbl:NewInspection_Input>
	</soap:Body>
</soap:Envelope>`;

    debugger;
    const response = await callToCreateAdhocTask(url, payload);
    // if (response) {
    // console.log('callToCreateAdhocTask response' + JSON.stringify(response), 1000);
    debugger;
    return response
}

async function scheduleTaskDetails(item: any) {

    let url = services.url.ScheduleTaskDetails;

    let payload = `<soap:Envelope
	xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
	<soap:Header>
		<wsse:Security
			xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" soap:mustUnderstand="1">
			<wsse:UsernameToken
				xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"
				xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" wsu:Id="UsernameToken-s9LhJx1IoeAq7HNLsrIyjw22">
				<wsse:Username>soauser</wsse:Username>
				<wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">soauser123</wsse:Password>
			</wsse:UsernameToken>
		</wsse:Security>
	</soap:Header>
	<soap:Body>
		<ns1:ScheduleTask_Input
			xmlns:ns1="http://xmlns.oracle.com/GBL_ADFCA_SERV_Dev/GBL_ADFCA_SERV_ScheduleTaskDetails/GBL_ADFCA_SERV_ScheduleTaskDetailsBPEL">
			<ns1:InterfaceID>ADFCA_CRM_SBL_040</ns1:InterfaceID>
			<ns1:LanguageType>ENU</ns1:LanguageType>
			<ns1:InspectorName/>
			<ns1:InspectorId/>
			<ns1:InspectionNumber>${item.TaskId}</ns1:InspectionNumber>
		</ns1:ScheduleTask_Input>
	</soap:Body>
</soap:Envelope>`;

    debugger;
    const response = await callToScheduleTaskDetails(url, payload);
    // if (response) {
    // console.log('callToScheduleTaskDetails response' + JSON.stringify(response), 1000);
    debugger;
    return response
}

async function fetchAcknowldgeApi(payload: any) {
    try {
        debugger;
        // let url = services.url.srDetails;
        let url = services.url.acknowledge;
        const response = await callToAcknowldgeAPI(url, payload);
        if (response) {
            debugger;
            return response
        }
        else {
            return response
        }
    }
    catch (e) {
        // ToastAndroid.show('Failed to Get Lov Data ,Please Try again', 1000);
    }
}

async function fetchGetEfstDataService(licenseCode: any) {


    let url = services.url.getEfstUrl;

    let payload = {
        "InterfaceID" : "ADFCA_CRM_EFST_063",
        "LanguageType" : "ENU",
        "TradeLicense" : licenseCode
      };

    //// console.log(JSON.stringify(payload))
    //Alert.alert("licenseNumber",JSON.stringify(licenseNumber))

    // debugger;
    const response = await callToGetEfstData(url, payload);
    // if (response) {
    //ToastAndroid.show('response' + JSON.stringify(response), 1000);
    //debugger;
    //// console.log(JSON.stringify(response));
    return response
}

async function UpdateFoodHandlerCountService(trainedCount: any, certifiedCount: any, foodHandlerCount: any, licensesCode: any) {
    try {
        // console.log("item in webservices", trainedCount, certifiedCount, foodHandlerCount, licensesCode);
        let url = services.url.UpdateEfstCountUrl;
        const payload = {
            "InterfaceID": "ADFCA_CRM_SBL_031",
            "LanguageType": "ENU",
            "FISTotalNumberofFoodHandlersCount": foodHandlerCount,
            "InspectorName": "",
            "InspectorId": "",
            "TrainedFoodHandlers": trainedCount,
            "CertifiedFoodHandlers": certifiedCount,
            "TradelicenseNumber": licensesCode
        }

        const efstCountResponse = await callToUpdateEfstCount(url, payload);
        //ToastAndroid.show('UpdatedCountFoddHandlerresponse:' + efstCountResponse, 1000);
        //  debugger;
        return efstCountResponse;
        // }
        // else {
        //     return response
        // }
    }
    catch (e) {
        ToastAndroid.show('Failed to get updated FoodHandler Count ,Please Try again', 1000);
    }
}


async function fetchGetOnHoldRequestService(taskId: any, reason: any, comments: any) {
    try {
        // console.log("onHoldRequestData in WebServices", taskId, reason, comments)

        let url = services.url.onHoldRequestUrl;
        const payload = `<soap:Envelope
        xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Header>
            <wsse:Security
                xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" soap:mustUnderstand="1">
                <wsse:UsernameToken
                    xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"
                    xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" wsu:Id="UsernameToken-vLDx1T48NXKSC681McWBJQ22">
                    <wsse:Username>soauser</wsse:Username>
                    <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">soauser123</wsse:Password>
                </wsse:UsernameToken>
            </wsse:Security>
        </soap:Header>
        <soap:Body>
            <gbl:MobViolation_Input
                xmlns:gbl="http://xmlns.oracle.com/GBL_ADFCA_SERV_Dev/GBL_ADFCA_SERV_TaskViolation/GBL_ADFCA_SERV_TaskVoilationBPEL">
                <gbl:InterfaceID>ADFCA_CRM_SBL_010</gbl:InterfaceID>
                <gbl:LanguageType/>
                <gbl:InspectorName>Closed for several visits</gbl:InspectorName>
                <gbl:InspectionViolation>
                    <gbl:Inspection>
                        <gbl:TaskId>`+ taskId + `</gbl:TaskId>
                        <gbl:Latitude></gbl:Latitude>
                        <gbl:Comments>`+ comments + `</gbl:Comments>
                        <gbl:Action>Violation</gbl:Action>
                        <gbl:Longitude/>
                        <gbl:ListOfAdfcaOpportunity>
                            <gbl:TaskViolation>
                                <gbl:ViolationDescription>aaaaaaaaaa</gbl:ViolationDescription>
                                <gbl:ViolationName>aaaaaaaaaa</gbl:ViolationName>
                                <gbl:InspectionParameter>aaaaaaaaaa</gbl:InspectionParameter>
                                <gbl:ViolationType>On Hold Request</gbl:ViolationType>
                            </gbl:TaskViolation>
                        </gbl:ListOfAdfcaOpportunity>
                    </gbl:Inspection>
                </gbl:InspectionViolation>
                <gbl:InspectorId>${loginData.username}</gbl:InspectorId>
            </gbl:MobViolation_Input>
        </soap:Body>
    </soap:Envelope>`

        // console.log("payload", payload);

        const efstCountResponse = await callToFetchOnHoldResult(url, payload);
        // console.log(efstCountResponse);
        //ToastAndroid.show('UpdatedCountFoddHandlerresponse:' + efstCountResponse, 1000);
        //debugger;
        return efstCountResponse;
        // }
        // else {
        //     return response
        // }
    }
    catch (e) {
        ToastAndroid.show('Failed to get onHold Request response ,Please Try again', 1000);
    }
}

async function callToPostRequestForClouser(obj: any) {
    try {
        debugger;
        let url = services.url.postRequestForClosure;
        let payload = `<soap:Envelope
	xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Header>
        <wsse:Security
			xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" soap:mustUnderstand="1">
            <wsse:UsernameToken
				xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"
				xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" wsu:Id="UsernameToken-vLDx1T48NXKSC681McWBJQ22">
                <wsse:Username>soauser</wsse:Username>
                <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">soauser123</wsse:Password>
            </wsse:UsernameToken>
        </wsse:Security>
    </soap:Header>
    <soap:Body>
        <gbl:MobViolation_Input
			xmlns:gbl="http://xmlns.oracle.com/GBL_ADFCA_SERV_Dev/GBL_ADFCA_SERV_TaskViolation/GBL_ADFCA_SERV_TaskVoilationBPEL">
            <gbl:InterfaceID>ADFCA_CRM_SBL_010</gbl:InterfaceID>
            <gbl:LanguageType/>
            <gbl:InspectorName></gbl:InspectorName>
            <gbl:InspectionViolation>
                <gbl:Inspection>
                    <gbl:TaskId>`+ obj.inspectionId + `</gbl:TaskId>
                    <gbl:Latitude></gbl:Latitude>
                    <gbl:Comments>`+ obj.comments + `</gbl:Comments>
                    <gbl:Action>Violation</gbl:Action>
                    <gbl:Longitude/>
                    <gbl:ListOfAdfcaOpportunity>
                        <gbl:TaskViolation>
                            <gbl:ViolationDescription>`+ obj.comments + `</gbl:ViolationDescription>
                            <gbl:ViolationName>`+ obj.comments + `</gbl:ViolationName>
                            <gbl:InspectionParameter>`+ obj.comments + `</gbl:InspectionParameter>
                            <gbl:ViolationType>Request for Closure</gbl:ViolationType>
                        </gbl:TaskViolation>
                    </gbl:ListOfAdfcaOpportunity>
                </gbl:Inspection>
            </gbl:InspectionViolation>
            <gbl:InspectorId>`+ obj.inspectorId + `</gbl:InspectorId>
        </gbl:MobViolation_Input>
    </soap:Body>
</soap:Envelope>`;

        const response = await calltoClouser(url, payload);
        if (response) {
            debugger;
            return response
        }
        else {
            return response
        }
    }
    catch (e) {
        // ToastAndroid.show('Failed to Get Lov Data ,Please Try again', 1000);
    }

}

async function getContactLists() {
    try {
        debugger;
        let url = services.url.getContactList;
        let payload = JSON.stringify({
            InterfaceID: 'ADFCA_CRM_SBL_005',
            TradeLicenseNumber: 'CN-0932'
        })
        const response = await callToGetContactList(url, payload);
        if (response) {
            debugger;
            return response
        }
        else {
            return response
        }
    }
    catch (e) {
        // ToastAndroid.show('Failed to Get Lov Data ,Please Try again', 1000);
    }
}


const callToQuestionarieAttachmentAPI = (url: string, payload: string) => {
    debugger;
    return APICallingService.sendPostRequestJson(url, payload, (res: any) => {
    });
}

async function fetchFoodAlertService(payload: any, auth: string) {
    try {
        let url = services.url.getFoodAlerturl;
        const response = await callToPostJSonService(payload, url, auth);
        if (response) {
            // debugger;
            return response
        }
        else {
            return response
        }
    }
    catch (e) {
        // ToastAndroid.show('Failed to Get Lov Data ,Please Try again', 1000);
    }
}

async function fetchGetQuestionarieAttachmentApi(payload: any) {

    let url = services.url.postSignatureURL;

    const response = await callToQuestionarieAttachmentAPI(url, payload);
    if (response) {
        debugger;
        return response
    }
    else {
        ToastAndroid.show('Failed To Upload Attachment', 1000);
    }
}

const callToGetQuestionarie = (url: string) => {


    return APICallingService.sendRequestForGetWithAuth(url, '', (res: any) => {
    });

}

async function fetchGetQuestionarieApi(lang: string, taskId: string) {
    try {
        debugger;
        let url = services.url.getQuestioneries + 'InterfaceID=ADFCA_CRM_SBL_067&LanguageType=' + lang + '&TaskId=' + taskId;
        const response = await callToGetQuestionarie(url);
        if (response) {
            return response
        }
        else {
            return response
        }
    }
    catch (e) {
        ToastAndroid.show('Failed to Get Checklist ,Please Try again', 1000);
    }
}

async function fetchGetCampaignChecklistApi(payload: any) {
    debugger;
    let url = services.url.getChecklistUrl;
    const response = await callToGetChecklistAPI(url, payload);
    if (response) {
        //   ToastAndroid.show('response' + response, 1000);
        return response;
    }
    else {
        ToastAndroid.show('No Checklist Available', 1000);
    }

}

async function fetchClosureInspection(payload: any) {
    try {
        debugger;
        // let url = services.url.srDetails;
        let url = services.url.closureInspectionurl;
        const response = await callToClosureInspection(url, payload);
        if (response) {
            debugger;
            return response
        }
        else {
            return response
        }
    }
    catch (e) {
        // ToastAndroid.show('Failed to Get Lov Data ,Please Try again', 1000);
    }
}

export {
    fetchLovDataService, InspectionSubmitService, fetchSrDetails, fetchAcknowldgeApi, LoginService, fetchGetTaskApi, fetchGetChecklistApi, fetchGetBusinessActivity, callToSearchByEst, fetchHistoryVehicleData, createAdhocTask, scheduleTaskDetails, getAccountSyncService, submitCondemnationService, fetchGetEfstDataService, UpdateFoodHandlerCountService, fetchGetOnHoldRequestService
    , callToPostRequestForClouser, fetchGetSignature, callToGetContactList, getContactLists, fetchFoodAlertService, fetchGetQuestionarieAttachmentApi, fetchGetQuestionarieApi, fetchNocChecklist, fetchGetCampaignChecklistApi, fetchClosureInspection
};