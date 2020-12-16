import {
    types,
    Instance,
    flow

} from 'mobx-state-tree';
import { Alert, ToastAndroid } from 'react-native';
import { RealmController } from './../../database/RealmController';
import TaskSchema from './../../database/TaskSchema';
import LoginSchema from './../../database/LoginSchema';
import CheckListSchema from './../../database/CheckListSchema';
let realm = RealmController.getRealmInstance();
import checkListModel from './../checkList/checkListModel';
import NavigationService from './../../services/NavigationService';
export type MyTaskStoreModel = Instance<typeof MyTaskStore>
import { fetchGetCampaignChecklistApi, fetchGetTaskApi, fetchGetChecklistApi, fetchGetBusinessActivity, InspectionSubmitService, fetchAcknowldgeApi, fetchGetQuestionarieApi } from './../../services/WebServices';

let moment = require('moment');

const MyTaskStore = types.model('MyTaskModel', {

    scoreFollow: types.string,
    myTaskResponse: types.string,
    selectedTask: types.string,
    checkListArray: types.string,
    noCheckList: types.string,
    count: types.string,
    isMyTaskClick: types.string,
    getTaskApiResponse: types.string,
    getChecklistResponse: types.string,
    getBusinessActivityResponse: types.string,
    getAcknowldgeResponse: types.string,
    getQuestionarieResponse: types.string,
    getCampaignChecklistResponse: types.string,
    state: types.enumeration("State", ["pending", "done", "error", "navigate", 'getBASuccess', 'getChecklistSuccess', 'acknowledgeSuccess', 'submitInspection', 'getQuestionarieSuccess', 'getCampaignChecklistSuccess']),
    campaignList: types.string,
    surveyList: types.string,
    NOCList: types.string,
    complaintAndFoodPosioningList: types.string,
    eventsList: types.string,
    farmTaskArray: types.string,
    directFarmArray: types.string,
    dataArray: types.string,
    dataArray1: types.string,
    desc: types.string,
    contactName: types.string,
    mobileNumber: types.string,
    emiratesId: types.string,
    result: types.string,
    finalComment: types.string,
    taskId: types.string,
    isCompletedOfflineList: types.string,
    estListArray: types.string,
    myTaskCount: types.string,
    licenseCount: types.string,
    caseCount: types.string,
    tempPermit: types.string,
    evidanceAttachment1: types.string,
    evidanceAttachment2: types.string,
    licencesAttachment1: types.string,
    licencesAttachment2: types.string,
    EmiratesIdAttachment1: types.string,
    EmiratesIdAttachment2: types.string,
    evidanceAttachment1Url: types.string,
    evidanceAttachment2Url: types.string,
    licencesAttachment1Url: types.string,
    licencesAttachment2Url: types.string,
    EmiratesIdAttachment1Url: types.string,
    EmiratesIdAttachment2Url: types.string,
    isPostPoned: types.boolean
}).actions(self => ({
    setDashboardClisk(data: string) {
        self.myTaskResponse = data
    },
    setSelectedTask(data: string) {
        self.selectedTask = data
    },
    setScoreFollow(data: string) {
        self.scoreFollow = data
    },
    setCount(count: string) {
        self.count = count
    },
    setState(state: string) {
        self.state = state
    },
    setIsMyTaskClick(isMyTaskClick: string) {
        self.isMyTaskClick = isMyTaskClick
    },
    setCampaignList(campaignList: string) {
        self.campaignList = campaignList
    },
    setSurveyList(surveyList: string) {
        self.surveyList = surveyList
    },
    setNocList(nocList: string) {
        self.NOCList = nocList
    },
    setMyTaskCount(myTaskCount: string) {
        self.myTaskCount = myTaskCount
    },
    setLicenseCount(licenseCount: string) {
        self.licenseCount = licenseCount
    },
    setCaseCount(caseCount: string) {
        self.caseCount = caseCount
    },
    setComplaintAndFoodPosioningList(complaintAndFoodPosioningList: string) {
        self.complaintAndFoodPosioningList = complaintAndFoodPosioningList
    },
    setEventsList(eventsList: string) {
        self.eventsList = eventsList
    },
    setFarmTaskArray(farmTaskArray: string) {
        self.farmTaskArray = farmTaskArray
    },
    setDirectFarmArray(directFarmArray: string) {
        self.directFarmArray = directFarmArray
    },
    setDataArray(dataArray: string) {
        self.dataArray = dataArray
    },
    setDataArray1(dataArray1: string) {
        self.dataArray1 = dataArray1
    },
    setDesc(desc: string) {
        self.desc = desc
    },
    setCheckListArray(checkListArray: string) {
        self.checkListArray = checkListArray;
    },
    setContactName(ContactName: string) {
        self.contactName = ContactName;
    },
    setMobileNumber(MobileNumber: string) {
        self.mobileNumber = MobileNumber;
    },
    setEmiratesId(EmiratesId: string) {
        self.emiratesId = EmiratesId;
    },
    setResult(result: string) {
        self.result = result;
    },
    setFinalComment(finalComment: string) {
        self.finalComment = finalComment;
    },
    setBusinessActivityResponse(getBusinessActivityResponse: string) {
        self.getBusinessActivityResponse = getBusinessActivityResponse
    },
    setTaskId(taskId: string) {
        self.taskId = taskId
    },
    setIsCompletedOfflineList(isCompletedOfflineList: string) {
        self.isCompletedOfflineList = isCompletedOfflineList
    },
    setEstListArray(estListArray: string) {
        self.estListArray = estListArray
    },
    setEvidanceAttachment1(data: string) {
        self.evidanceAttachment1 = data
    },
    setEvidanceAttachment1Url(data: string) {
        self.evidanceAttachment1Url = data
    },
    setEvidanceAttachment2(data: string) {
        self.evidanceAttachment2 = data
    },
    setEvidanceAttachment2Url(data: string) {
        self.evidanceAttachment2Url = data
    },
    setLicencesAttachment1(data: string) {
        self.licencesAttachment1 = data
    },
    setLicencesAttachment1Url(data: string) {
        self.licencesAttachment1Url = data
    },
    setLicencesAttachment2(data: string) {
        self.licencesAttachment2 = data
    },
    setLicencesAttachment2Url(data: string) {
        self.licencesAttachment2Url = data
    },
    setEmiratesIdAttachment1(data: string) {
        self.EmiratesIdAttachment1 = data
    },
    setEmiratesIdAttachment1Url(data: string) {
        self.EmiratesIdAttachment1Url = data
    },
    setEmiratesIdAttachment2(data: string) {
        self.EmiratesIdAttachment2 = data
    },
    setEmiratesIdAttachment2Url(data: string) {
        self.EmiratesIdAttachment2Url = data
    },
    setNoCheckList(data: string) {
        self.noCheckList = data
    },
    setDataBlank() {
        self.contactName = '',
            self.mobileNumber = '',
            self.emiratesId = '',
            self.result = '',
            self.finalComment = ''
    },
    setIsPostPoned(isPostPoned: boolean) {
        self.isPostPoned = isPostPoned
    },
    callToGetTaskApi: flow(function* (loginData) {

        self.state = "pending";
        try {
            debugger;

            // // console.log('getTaskResponse' + self.getTaskApiResponse);

            let getTaskApiResponse = yield fetchGetTaskApi(loginData);
            debugger;
            if (getTaskApiResponse && getTaskApiResponse.Status == "Success" && getTaskApiResponse.GetTasklist.Inspection.length > 0) {

                let _MS_PER_DAY = 1000 * 60 * 60 * 24;
                let tempArray = Array(), responseArr = Array();

                function dateDiffInDays(a: any, b: any) {
                    // Discard the time and time-zone information.
                    let utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
                    let utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

                    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
                }
                let taskArrayComplaintAndFoodPosioningList = Array();
                let taskArrayEventsList = Array();
                let taskArrayFarm = Array();
                let taskArrayCampaignList = Array();
                let taskArrayDistributeAllTaskDetailsArray = Array();
                let taskArraydataArray1 = Array();
                let taskDataArrayDataArray = Array();
                let taskDataArray = Array();
                let taskArrayNOCList = Array();
                let taskArraySurveyList = Array();

                console.log('length:' + getTaskApiResponse.GetTasklist.Inspection.length);

                for (let index = 0; index < getTaskApiResponse.GetTasklist.Inspection.length; index++) {

                    const obj = getTaskApiResponse.GetTasklist.Inspection[index];

                    if (obj.CompletionDate == "") {
                        // obj.completionDateWithDayRemaining = obj.CompletionDate + '(0 days remaining)';
                        obj.completionDateWithDayRemaining = '(0 days remaining)';
                    }
                    else {
                        let date = new Date();
                        let date2 = obj.CompletionDate ? new Date(obj.CompletionDate) : new Date();
                        let diff = dateDiffInDays(date, date2);
                        if (diff < 0) {
                            // obj.completionDateWithDayRemaining = obj.CompletionDate + '(' + Math.abs(diff) + ' days delayed)';
                            obj.completionDateWithDayRemaining = '(' + Math.abs(diff) + ' days delayed)';
                            obj.color = "Red";
                        }
                        else if (diff > 0) {
                            let s = obj.CompletionDate;
                            s = s.slice(0, 10);
                            //obj.CompletionDate = '';
                            // obj.completionDateWithDayRemaining = s + '(' + diff + ' days remaining)';
                            obj.completionDateWithDayRemaining = '(' + diff + ' days remaining)';
                        }
                        else {
                            // obj.completionDateWithDayRemaining = obj.CompletionDate + '(0 days remaining)';
                            obj.completionDateWithDayRemaining = '(0 days remaining)';
                        }
                    }

                    if (obj.TaskStatus == 'Acknowledged') {
                        obj.isAcknowledge = true;
                    }
                    else {
                        obj.isAcknowledge = false;
                    }

                    responseArr.push(obj);

                    if (obj.TaskType) {

                        // if (obj.mappingData && obj.mappingData[0].isCompltedOffline) {

                        //     let completedTaskArray = self.isCompletedOfflineList != '' ? JSON.parse(self.isCompletedOfflineList) : [];
                        //     completedTaskArray.push(obj);
                        //     // console.log("Completed in dash", obj.mappingData);
                        //     self.setIsCompletedOfflineList(JSON.stringify(completedTaskArray));
                        // }

                        if (obj.TaskType.toLowerCase() == 'campaign inspection') {

                            if (obj.TaskStatus != 'Rescheduled') {
                                taskArrayCampaignList.push(obj);
                            }

                        }
                        else if (obj.TaskType == 'تفتيش إستطلاع وبحث' || obj.TaskType.toLowerCase() == 'survey inspection') {

                            if (obj.TaskStatus != 'Rescheduled') {
                                taskArraySurveyList.push(obj);

                            }

                        }
                        else if (obj.TaskType.toLowerCase() == "noc inspection_ara" || obj.TaskType.toLowerCase() == "noc inspection" || obj.TaskType.toLowerCase() == "temporary noc inspection" || obj.TaskType == 'تفتيش ترخيص' || obj.TaskType == 'تفتيش ترخيص مؤقت') {

                            if (obj.TaskStatus != 'Rescheduled') {

                                taskArrayNOCList.push(obj);

                            }

                        }
                        else if (obj.TaskType.toLowerCase() == "food poisoning" || obj.TaskType.toLowerCase() == "food poison" || obj.TaskType.toLowerCase() == "complaints" || obj.TaskType == 'شكاوي') {

                            if (obj.TaskStatus != 'Rescheduled') {
                                taskArrayComplaintAndFoodPosioningList.push(obj);
                            }

                        }
                        else if (obj.TaskType.toLowerCase() == "temporary routine inspection" || obj.TaskType == 'تفتيش روتيني مؤقت'
                            || (obj.TaskType.toLowerCase() == "follow-up" && obj.ActivitySRId != null)) {

                            if (obj.TaskStatus != 'Rescheduled') {

                                taskArrayEventsList.push(obj);
                                taskDataArray.push(obj);
                            }

                        }
                        else if (obj.TaskType == "Routine Farm Inspection" || obj.TaskType == "Direct Farm Inspection" || (obj.TaskType == "Appeal Inspection" && obj.SystemType == "AMSFarms")) {
                            if (obj.TaskStatus != 'Rescheduled') {
                                taskArrayFarm.push(obj);
                                // self.farmTaskArray.push(obj);
                            }
                        }
                        else if (obj.TaskType == "Follow-Up" && obj.SystemType == "AMSFarms") {
                            if (obj.TaskStatus != 'Rescheduled') {
                                taskArrayCampaignList.push(obj);
                            }
                        }
                        else if (obj.TaskType == "Farm Re Opening Inspection") {
                            if (obj.TaskStatus != 'Rescheduled') {
                                taskArrayDistributeAllTaskDetailsArray.push(obj);
                            }

                        }
                        //else if (obj.TaskType == "Routine Farm Inspection") {
                        //    myTaskDraft.directFarmArray.push(obj);
                        //}
                        else {
                            if (obj.TaskStatus != 'Rescheduled') {
                                taskArraydataArray1.push(obj);

                                taskDataArrayDataArray.push(obj);
                            }
                        }
                    }

                    // else {
                    //     tempArray.push(obj);
                    // }
                }


                self.myTaskCount = taskArraydataArray1.length.toString();
                self.licenseCount = taskArrayNOCList.length.toString();
                self.caseCount = taskArrayComplaintAndFoodPosioningList.length.toString();
                self.tempPermit = taskArrayEventsList.length.toString();

                self.campaignList = JSON.stringify(taskArrayCampaignList);
                self.surveyList = (JSON.stringify(taskArraySurveyList));
                self.NOCList = (JSON.stringify(taskArrayNOCList));
                self.complaintAndFoodPosioningList = (JSON.stringify(taskArrayComplaintAndFoodPosioningList));
                self.eventsList = (JSON.stringify(taskArrayEventsList));
                self.dataArray = (JSON.stringify(taskDataArray));
                self.farmTaskArray = (JSON.stringify(taskArrayFarm))
                self.campaignList = (JSON.stringify(taskArrayCampaignList))
                self.directFarmArray = (JSON.stringify(taskArrayDistributeAllTaskDetailsArray));
                self.dataArray1 = (JSON.stringify(taskArraydataArray1));
                self.dataArray = (JSON.stringify(taskDataArrayDataArray))

                self.getTaskApiResponse = JSON.stringify(getTaskApiResponse.GetTasklist.Inspection);

                self.state = 'done';

                debugger
                let dbFromTasks = RealmController.getTasks(realm, TaskSchema.name);
                let tempDbFromTasksArray = Array();
                tempDbFromTasksArray = Object.values(dbFromTasks);
                tempDbFromTasksArray = tempDbFromTasksArray.filter(i => i.isCompleted == false);

                for (let index = 0; index < getTaskApiResponse.GetTasklist.Inspection.length; index++) {
                    const obj = getTaskApiResponse.GetTasklist.Inspection[index];

                    if (dbFromTasks && dbFromTasks['0']) {
                        let dbFromTasksArray = Array();
                        dbFromTasksArray = Object.values(dbFromTasks);
                        if (!(dbFromTasksArray.filter(e => e.TaskId == obj.TaskId).length)) {
                            tempArray.push(obj);
                        }
                    }
                }
                let loginInfo = RealmController.getLoginData(realm, LoginSchema.name);

                for (let j = 0; j < tempArray.length; j++) {
                    const elementTempArr = tempArray[j];

                    elementTempArr.mappingData = [{
                        addressIDs: [
                            {
                                AddressLine1: "",
                                AddressLine2: "",
                                City: "",
                                Country: "",
                                lat: "",
                                long: "",
                                PostalCode: null
                            }
                        ],
                        Area: "",
                        completionDate: elementTempArr.CompletionDate,
                        completionDateWithDayRemaining: elementTempArr.completionDateWithDayRemaining,//pending
                        condemnationReport: [],
                        ContactName: "",//signature page 
                        ContactNumber: "",
                        CustomerName: "",//Establishment
                        CustomerNameEnglish: "",
                        dataLoggerCBValue: "",
                        detentionReport: [],
                        EFSTFlag: false,//false compalsary
                        EHSRiskClassification: "",//Establishment resp
                        EmiratesId: "",
                        EstablishmentClass: "",//Establishment resp
                        EstablishmentDetailsList: undefined,
                        EstablishmentId: elementTempArr.EstablishmentId,
                        EstablishmentType: "",
                        finalResult: "",//lowest score
                        flashlightCBValue: "N",//equipment page
                        Grade: null,
                        grade: null,
                        grade_percentage: "",
                        inspectionForm: [],
                        InspectortobeEvaluatedId: null,
                        InspFullName: " ",
                        isCompltedOffline: false,
                        isuploadedToserver: false,
                        isViolated: "false",//score 0 asal tar
                        LicenseCode: elementTempArr.LicenseCode,
                        LicenseNumber: elementTempArr.LicenseNumber,
                        LicenseSource: "",
                        luxmeterCBValue: "N",
                        ManagerID: null,//contact page
                        ManagerMobile: null,
                        ManagerName: null,
                        MobileNumber: "",//Establishment resp
                        next_visit_date: "",//calculate
                        NumOfEST: elementTempArr.NumOfEST,
                        onlineReq: '',
                        onlineRes: [],
                        overallComments: "",
                        PendingRequests: [],
                        PlanAbuDhabi: null,
                        PlanAlAin: null,
                        PlanAlGharbia: null,
                        PlanEndDate: null,
                        PlanId: null,
                        PlanName: null,
                        PlanNumber: null,
                        PlanStartDate: null,
                        PlanStatus: null,
                        printingelementect: {
                            ActualInspectionDate: "",
                            Address: "",
                            BusinessActivity: elementTempArr.BusinessActivity,
                            CertificateExpDate: "",//Establishment resp
                            CertificateNo: elementTempArr.LicenseCode,//LicenseCode
                            ClientName: '',//ContactName
                            CustomerSignature: "",
                            Duration: "",
                            EquipmentsUsed: "",
                            EstablishNameInArabic: "",
                            IdentificationNumber: "",
                            InspectionNearestGracePeriod: '',//finala grace peroid
                            InspectionNo: elementTempArr.TaskId,//taskId
                            InspectionOverallInspectionComment: "",
                            InspectionResult: "",//final result
                            InspectionUserID: loginInfo.username ? loginInfo.username : '',
                            InspectorName: loginInfo.loginResponse && loginInfo.loginResponse.InspectorName,
                            isSatisfactory: "",//depend on finalResult
                            LicenseExpiryDate: "",
                            MajorNonComplianceInspectionParameter: [],
                            MinorNonComplianceInspectionParameter: [],
                            ModerateNonComplianceInspectionParameter: [],
                            OmittedInspectionParameter: [],
                            PhoneNo: "",
                            ScheduledInspectionDate: "",//completionDate0
                            TypeofInspection: elementTempArr.TaskType
                        },
                        printingReport: [],
                        ResponseSubmitted: null,
                        SampleSize: null,
                        samplingReport: [],
                        Scope: "",// resp
                        Sector: null,
                        signatureBase64: "",
                        taskId: elementTempArr.TaskId,
                        tempScore: '',//overall min score
                        thermometerCBValue: "",
                        TimeElapsed: "",//start checklist
                        timerStarted: "",
                        TimeStarted: "",//start checklist
                        total_score: '',
                        TradeExpiryDate: "",//Establishment resp
                        TradeLicenseCreatedDate: "",//Establishment resp
                        TradeLicenseNumber: "",// Establishment resp
                        UVlightCBValue: "",
                        Visittype: ""
                    }];
                    elementTempArr.isCompleted = false;

                    RealmController.addTaskDetails(realm, elementTempArr, TaskSchema.name, () => {
                    });
                }

                // let dbTasks = RealmController.getTasks(realm, TaskSchema.name);
                // let latestDbFromTasksArray = Array();
                // latestDbFromTasksArray = Object.values(dbTasks);
                // latestDbFromTasksArray = latestDbFromTasksArray.filter(i => i.isCompleted == false);

                // self.getTaskApiResponse = JSON.stringify(latestDbFromTasksArray);
                // // console.log('getTaskResponse' + self.getTaskApiResponse);
                self.state = 'done';
            }
            else {
                // ToastAndroid.show(I18n.t('others.failedToAgainPleaseTryAgainLater'), 1000);
                self.state = "error";
            }

        }
        catch (error) {
            // ... including try/catch error handling
            // console.log(error)
            debugger
            // alert(error)
            self.state = "error"
        }

    }),

    callToSubmitTaskApi: flow(function* (payload: any) {
        {
            self.state = "pending"
            try {

                let TaskSubmitApiResponse = yield InspectionSubmitService(payload);
                debugger;
                let taskDetails = { ...JSON.parse(self.selectedTask) }
                let mappingData = taskDetails.mappingData ? typeof (taskDetails.mappingData) == 'string' ? JSON.parse(taskDetails.mappingData) : taskDetails.mappingData : [{}];
                mappingData.isCompltedOffline = true;
                taskDetails.mappingData = mappingData;

                if (TaskSubmitApiResponse && TaskSubmitApiResponse.Status == "Success") {
                    ToastAndroid.show('Task submited successfully ', 1000);
                    taskDetails.isCompleted = true;
                    taskDetails.TaskStatus = 'Completed';
                    
                    debugger
                    RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {
                        // ToastAndroid.show('Task objct successfully ', 1000);
                        NavigationService.navigate('Dashboard');
                    });

                    self.state = 'navigate'
                }
                else {
                    // ToastAndroid.show(I18n.t('others.failedToAgainPleaseTryAgainLater'), 1000);
                    ToastAndroid.show('Failed to submit Task', 1000);
                    taskDetails.isCompleted = true;
                    taskDetails.TaskStatus = 'Failed';
                    
                    debugger
                    RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {
                        // ToastAndroid.show('Task objct successfully ', 1000);
                        NavigationService.navigate('Dashboard');
                    });

                    self.state = 'navigate'
                }

            } catch (error) {
                // ... including try/catch error handling
                self.state = "error"
            }
        }
    }),

    callToGetBAApi: flow(function* (item: any) {
        // self.state = "pending"
        try {

            debugger;
            let getBusinessActivityResponse = yield fetchGetBusinessActivity(item);
            debugger;

            let baArray = Array();
            if (getBusinessActivityResponse && getBusinessActivityResponse.Status && (getBusinessActivityResponse.Status.toLowerCase() == 'success')) {

                let baTempArray = [];
                debugger;

                if (getBusinessActivityResponse.GetChildBusinessActvities.Account.length) {
                    baTempArray = getBusinessActivityResponse.GetChildBusinessActvities.Account;
                }
                else {
                    baTempArray.push(getBusinessActivityResponse.GetChildBusinessActvities.Account)
                }

                debugger;
                
                for (let index = 0; index < baTempArray.length; index++) {
                    let obj = Object();
                    let elementArr = Array();
                    const element = baTempArray[index];

                    obj.AccountNumber = element.AccountNumber;
                    obj.ArabicName = element.ArabicName;
                    obj.EstablishmentName = element.EstablishmentName;
                    obj.ListOfAdfcaActionAccount = element.ListOfAdfcaActionAccount;
                    obj.AdfcaActionAccount = []
                    let listOfAdfcaActionAccount = element.ListOfAdfcaActionAccount;
                    if (listOfAdfcaActionAccount && listOfAdfcaActionAccount != '') {
                        let AdfcaActionAccount = listOfAdfcaActionAccount.AdfcaActionAccount
                        console.log("baTempArray: ", JSON.stringify(AdfcaActionAccount))
                        for (let index = 0; index < AdfcaActionAccount.length; index++) {

                            let actionAccountObj = Object()

                            actionAccountObj.MainActivitty = AdfcaActionAccount[index].MainActivitty;
                            actionAccountObj.Description = AdfcaActionAccount[index].Description;
                            actionAccountObj.ParentActivityDesc = AdfcaActionAccount[index].ParentActivityDesc;
                            actionAccountObj.RiskCategory = AdfcaActionAccount[index].RiskCategory;
                            actionAccountObj.SubActivityFlag = AdfcaActionAccount[index].SubActivityFlag;
                            actionAccountObj.BusinessActivity = AdfcaActionAccount[index].BusinessActivity;
                            actionAccountObj.Status = AdfcaActionAccount[index].Status;
                            obj.AdfcaActionAccount.push(actionAccountObj)

                        }
                    }
                    obj.TradeLicense = element.TradeLicense;
                    baArray.push(obj);
                    // alert(JSON.stringify(baArray))
                }
                self.getBusinessActivityResponse = JSON.stringify(baArray);
                self.state = 'getBASuccess';
            }
        }
        catch (error) {
            // ... including try/catch error handling
            self.state = "error"
        }
    }),

    callToGetChecklistApi: flow(function* (dataObj: any, isArabic: boolean) {
        // {
        debugger;
        // self.state = "pending"
        try {

            let checkListData = RealmController.getCheckListForTaskId(realm, CheckListSchema.name, self.taskId);
            if (checkListData && checkListData['0'] && checkListData['0'].checkList && JSON.parse(checkListData[0].checkList).length) {
                self.getChecklistResponse = (checkListData['0'].checkList);
                self.noCheckList = '';
                self.checkListArray = (checkListData['0'].checkList);
            }
            else {
                let getChecklistResponse = yield fetchGetChecklistApi(dataObj);
                debugger;
                if (getChecklistResponse && getChecklistResponse != '') {
                    self.state = 'getChecklistSuccess'
                    // Alert.alert('checklistResponse' + JSON.stringify(getChecklistResponse))
                    // self.getChecklistResponse = JSON.stringify(getChecklistResponse);
                    // let parseString = require('react-native-xml2js').parseString;
                    // let xml = getChecklistResponse;
                    // debugger;

                    // parseString(xml, function (err: string, result: any) {
                    // // console.log("result" + result);
                    let checkListArray = [];
                    debugger;
                    // let questionsArray = result["env:Envelope"]["env:Body"][0]["ns0:assess-response"][0]["ns0:global-instance"][0] != '' ? result["env:Envelope"]["env:Body"][0]["ns0:assess-response"][0]["ns0:global-instance"][0]["ns0:entity"][1]["ns0:instance"] : [];
                    let questionsArray = getChecklistResponse['global-instance'] ? getChecklistResponse['global-instance'].entity[1]["instance"] : [];
                    debugger;
                    if (questionsArray) {
                        for (let i = 0; i < questionsArray.length; i++) {
                            let questionaire = Object();
                            questionaire.parameter_score = Array(5);
                            questionaire.parameter_score_desc = Array(5);
                            questionaire.parameter_non_comp_desc = Array(5);
                            for (let j = 0; j < questionsArray[i]['attribute'].length; j++) {

                                switch (questionsArray[i]['attribute'][j]['@id']) {
                                    case 'parameter':
                                        questionaire.parameter = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                        break;
                                    case 'parameter_weight_mobility':
                                        questionaire.parameter_weight_mobility = questionsArray[i]['attribute'][j]['number-val'] ? questionsArray[i]['attribute'][j]['number-val'] : '';
                                        break;
                                    case 'parameter_score_desc_2':
                                        debugger;
                                        questionaire.parameter_score_desc_2 = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                        questionaire.parameter_score_desc[2] = questionaire.parameter_score_desc_2;
                                        // questionaire.parameter_score_desc.push(questionaire.parameter_score_desc_2);
                                        break;
                                    case 'parameter_EHS_Risk':
                                        questionaire.parameter_EHS_Risk = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                        break;
                                    case 'parameter_score_4':
                                        questionaire.parameter_score_4 = questionsArray[i]['attribute'][j]['number-val'] ? questionsArray[i]['attribute'][j]['number-val'] : '';
                                        questionaire.parameter_score[4] = questionaire.parameter_score_4;
                                        // questionaire.parameter_score.push(questionaire.parameter_score_4);
                                        break;
                                    case 'parameter_score_desc_3':
                                        questionaire.parameter_score_desc_3 = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                        questionaire.parameter_score_desc[3] = questionaire.parameter_score_desc_3;
                                        // questionaire.parameter_score_desc.push(questionaire.parameter_score_desc_3);
                                        break;
                                    case 'parameter_EHS':
                                        questionaire.parameter_EHS = questionsArray[i]['attribute'][j]['boolean-val'] ? questionsArray[i]['attribute'][j]['boolean-val'] : '';
                                        break;
                                    case 'parameter_guidance_rules':
                                        questionaire.parameter_guidance_rules = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                        break;
                                    case 'parameter_grace_minimum':
                                        questionaire.parameter_grace_minimum = questionsArray[i]['attribute'][j]['number-val'] ? questionsArray[i]['attribute'][j]['number-val'] : '';
                                        break;
                                    case 'parameter_score_desc_1':
                                        questionaire.parameter_score_desc_1 = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                        questionaire.parameter_score_desc[1] = questionaire.parameter_score_desc_1;
                                        // questionaire.parameter_score_desc.push(questionaire.parameter_score_desc_1);
                                        break;
                                    case 'parameter_reference':
                                        questionaire.parameter_reference = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                        break;
                                    case 'parameter_score_desc_4':
                                        questionaire.parameter_score_desc_4 = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                        questionaire.parameter_score_desc[4] = questionaire.parameter_score_desc_4;
                                        // questionaire.parameter_score_desc.push(questionaire.parameter_score_desc_4);
                                        break;
                                    case 'parameter_non_comp_desc_4':
                                        questionaire.parameter_non_comp_desc_4 = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                        questionaire.parameter_non_comp_desc[4] = questionaire.parameter_non_comp_desc_4;
                                        // questionaire.parameter_non_comp_desc.push(questionaire.parameter_non_comp_desc_4);
                                        break;
                                    case 'parameter_non_comp_desc_2':
                                        questionaire.parameter_non_comp_desc_2 = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                        questionaire.parameter_non_comp_desc[2] = questionaire.parameter_non_comp_desc_2;
                                        // questionaire.parameter_non_comp_desc.push(questionaire.parameter_non_comp_desc_2);
                                        break;
                                    case 'parameter_non_comp_desc_3':
                                        questionaire.parameter_non_comp_desc_3 = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                        questionaire.parameter_non_comp_desc[3] = questionaire.parameter_non_comp_desc_3;
                                        // questionaire.parameter_non_comp_desc.push(questionaire.parameter_non_comp_desc_3);
                                        break;
                                    case 'parameter_non_comp_desc_0':
                                        questionaire.parameter_non_comp_desc_0 = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                        questionaire.parameter_non_comp_desc[0] = questionaire.parameter_non_comp_desc_0;
                                        // questionaire.parameter_non_comp_desc.push(questionaire.parameter_non_comp_desc_0);
                                        break;
                                    case 'parameter_non_comp_desc_1':
                                        questionaire.parameter_non_comp_desc_1 = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                        questionaire.parameter_non_comp_desc[1] = questionaire.parameter_non_comp_desc_1;
                                        // questionaire.parameter_non_comp_desc.push(questionaire.parameter_non_comp_desc_1);
                                        break;
                                    case 'parameter_subtype':
                                        questionaire.parameter_subtype = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                        break;
                                    case 'parameter_reg_6':
                                        questionaire.parameter_reg_6 = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                        break;
                                    case 'parameter_score_desc_0':
                                        questionaire.parameter_score_desc_0 = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                        questionaire.parameter_score_desc[0] = questionaire.parameter_score_desc_0;
                                        // questionaire.parameter_score_desc.push(questionaire.parameter_score_desc_0);
                                        break;
                                    case 'parameter_score_1':
                                        questionaire.parameter_score_1 = questionsArray[i]['attribute'][j]['number-val'] ? questionsArray[i]['attribute'][j]['number-val'] : '';
                                        questionaire.parameter_score[1] = questionaire.parameter_score_1;
                                        // questionaire.parameter_score.push(questionaire.parameter_score_1);
                                        break;
                                    case 'parameter_score_0':
                                        questionaire.parameter_score_0 = questionsArray[i]['attribute'][j]['number-val'] || (questionsArray[i]['attribute'][j]['number-val'] == 0) || (questionsArray[i]['attribute'][j]['number-val'] == 0.0) ? questionsArray[i]['attribute'][j]['number-val'] : ''
                                        questionaire.parameter_score[0] = questionaire.parameter_score_0;
                                        // questionaire.parameter_score.push(questionaire.parameter_score_0);
                                        break;
                                    case 'parameter_score_3':
                                        questionaire.parameter_score_3 = questionsArray[i]['attribute'][j]['number-val'] ? questionsArray[i]['attribute'][j]['number-val'] : '';
                                        questionaire.parameter_score[3] = questionaire.parameter_score_3;
                                        // questionaire.parameter_score.push(questionaire.parameter_score_3);
                                        break;
                                    case 'parameter_score_2':
                                        questionaire.parameter_score_2 = questionsArray[i]['attribute'][j]['number-val'] ? questionsArray[i]['attribute'][j]['number-val'] : '';
                                        questionaire.parameter_score[2] = questionaire.parameter_score_2;
                                        // questionaire.parameter_score.push(questionaire.parameter_score_2);
                                        break;
                                    case 'parameter_reg_1':
                                        questionaire.parameter_reg_1 = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                        break;
                                    case 'parameter_grace_maximum':
                                        questionaire.parameter_grace_maximum = questionsArray[i]['attribute'][j]['number-val'] ? questionsArray[i]['attribute'][j]['number-val'] : '';
                                        break;
                                    case 'parameter_type':
                                        questionaire.parameter_type = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                        break;
                                    case 'parameter_EFST':
                                        questionaire.parameter_EFST = questionsArray[i]['attribute'][j]['boolean-val'] ? questionsArray[i]['attribute'][j]['boolean-val'] : '';
                                        break;
                                    default:
                                        break;
                                }
                            }

                            questionaire.parameter_score = questionaire.parameter_score.reverse();
                            questionaire.parameter_score_desc = questionaire.parameter_score_desc.reverse();
                            questionaire.parameter_non_comp_desc = questionaire.parameter_non_comp_desc.reverse();
                            questionaire.Answers = "";
                            questionaire.grace = "";
                            checkListArray.push(questionaire);
                        }
                        debugger;

                        if (checkListArray.length == 0) {
                            self.noCheckList = 'NocheckListAvailable';
                            ToastAndroid.show('No Checklist Available ', 1000);
                        }
                        else {

                            let obj: any = {};
                            let checkArr: any = [];
                            debugger;
                            for (let index = 0; index < checkListArray.length; index++) {
                                const element = checkListArray[index];
                                element.Answers = '';
                                element.color = "#ffffff";
                                element.gracePeriod = "";
                                element.guidance = "";
                                element.Lang = isArabic ? "Arabic" : "ENU";
                                element.parameter_reference_original = element.parameter_reference;
                                element.parameter_score_desc = element.parameter_score_desc;
                                element.parameter_score = element.parameter_score;
                                element.parameter_non_comp_desc = element.parameter_non_comp_desc;
                                element.parameterno = index;
                                element.role = "";
                                element.score = "";
                                element.Score = "";
                                element.syncDate = moment().format('L');
                                element.TotalscoreForQuestion = "";
                                checkArr.push(element)
                            }
                            if (checkArr.length == 0) {
                                self.noCheckList = 'NocheckListAvailable';
                                ToastAndroid.show('No Checklist Available ', 1000);
                            } else {
                                self.noCheckList = '';
                            }
                            obj.checkList = JSON.stringify(checkArr);
                            self.checkListArray = JSON.stringify(checkArr);
                            obj.taskId = self.taskId;
                            obj.timeElapsed = moment().format('MMMM Do YYYY, h:mm:ss a');
                            obj.timeStarted = moment().format('MMMM Do YYYY, h:mm:ss a');
                            debugger

                            RealmController.addCheckListInDB(realm, obj, () => {
                                // ToastAndroid.show('Task added to db successfully', 1000);
                            });

                            self.state = 'getChecklistSuccess'

                        }
                    }
                    else {
                        self.noCheckList = 'NocheckListAvailable';
                        ToastAndroid.show('No Checklist Available ', 1000);
                    }
                }
                else {
                    // ToastAndroid.show(I18n.t('others.failedToAgainPleaseTryAgainLater'), 1000);
                    self.state = "error";
                }
            }

        }
        catch (e) {
            // console.log('Exception My Task' + e);
        }

    }),

    callToGetQuestionaries: flow(function* (lang: string, taskId: string) {
        // self.state = "pending"
        try {

            let getQuestionarieResponse = yield fetchGetQuestionarieApi(lang, taskId);
            debugger;
            if (getQuestionarieResponse && getQuestionarieResponse != '') {
                self.noCheckList = '';
                debugger;
                for (let index = 0; index < getQuestionarieResponse.InspectionCheckList.Inspection.length; index++) {
                    const element = getQuestionarieResponse.InspectionCheckList.Inspection[index];
                    let checkListArray = Array();
                    let count = 1;
                    let questionaireList = Object();
                    questionaireList.TaskId = element.TaskId;
                    questionaireList.Thermometer = element.Thermometer;
                    questionaireList.Flashlight = element.Flashlight;
                    questionaireList.DataLogger = element.DataLogger;
                    questionaireList.LuxMeter = element.LuxMeter;
                    questionaireList.UVLight = element.UVLight;
                    for (let checkListIndex = 0; checkListIndex < element.ListOfFsExpenseItem.Checklist.length; checkListIndex++) {
                        const checklistElement = element.ListOfFsExpenseItem.Checklist[checkListIndex];
                        let checkListObj = Object();
                        checkListObj.Answers = checklistElement.Answers;
                        checkListObj.originalScore = parseInt(checklistElement.Answers);
                        checkListObj.DescriptionArabic = checklistElement.DescriptionArabic;
                        checkListObj.GracePeriod = checklistElement.GracePeriod;
                        checkListObj.QuestionNameArabic = checklistElement.QuestionNameArabic;
                        checkListObj.QuestionNameEnglish = checklistElement.QuestionNameEnglish;
                        checkListObj.Weightage = checklistElement.Weightage;
                        if (isNaN(parseInt(checkListObj.Weightage))) {
                            checkListObj.Weightage = 1;
                        }
                        if (checkListObj.Weightage.toString().length == 0) {
                            checkListObj.Weightage = 1;
                        }
                        if (parseInt(checkListObj.Weightage) == 0) {
                            checkListObj.Weightage = 1;
                        }
                        if (parseInt(checkListObj.Weightage) > 1)
                            checkListObj.color = '#ffff66';
                        else
                            checkListObj.color = '#ffffff';
                        checkListObj.NonComplianceEnglish = checklistElement.NonComplianceEnglish;
                        checkListObj.NonComplianceArabic = checklistElement.NonComplianceArabic;
                        checkListObj.GracePeriodDate = checklistElement.GracePeriodDate;
                        //  checkListObj.GracePeriodDate = "11 / 01 / 2015";
                        checkListObj.NA = checklistElement.NA;
                        checkListObj.EFSTFlag = checklistElement.EFSTFlag;
                        checkListObj.Action = checklistElement.Action;
                        checkListObj.NI = checklistElement.NI;
                        checkListObj.Comments = checklistElement.Comments;
                        checkListObj.MaxGracePeriod = checklistElement.MaxGracePeriod;
                        checkListObj.MinGracePeriod = checklistElement.MinGracePeriod;
                        checkListObj.DescriptionEnglish = checklistElement.DescriptionEnglish;
                        checkListObj.ParameterNumber = checklistElement.ParameterNumber;
                        checkListObj.Regulation = checklistElement.Regulation;
                        checkListObj.image1 = '';
                        checkListObj.image2 = '';

                        if (checkListObj.Answers == null) {
                            checkListObj.Answers = "";
                        }
                        checkListObj.image1Base64 = '';
                        checkListObj.image2Base64 = '';
                        checkListObj.Score = checklistElement.Score;
                        checkListObj.FinalScore = checkListObj.Answers;
                        if (isNaN(parseInt(checkListObj.Score)))
                            checkListObj.Score = checkListObj.Answers * checkListObj.Weightage;
                        if (checkListObj.Answers != null && checkListObj.Answers.length > 0) {
                            // checkListObj.Score = parseInt(checkListObj.Answers);
                            checkListObj.FinalScore == parseInt(checkListObj.Answers);
                        }
                        else if (checkListObj.NI == 'Y' || checkListObj.NA == 'Y') {

                            if (checkListObj.NI == 'Y') {

                                checkListObj.NI = true;

                                if (checkListObj.Answers != '' && checkListObj.Answers != 5) {
                                    checkListObj.NI = false;
                                }
                                else {
                                    checkListObj.Score = 5;
                                    checkListObj.Answers = 5;
                                    checkListObj.originalScore = 5;
                                    checkListObj.FinalScore == parseInt(checkListObj.Answers);
                                }
                            }
                        }
                        if (checkListObj.NA != 'Y' && checkListObj.QuestionNameEnglish.toUpperCase() != 'EHS') {  //   && checkListObj.NI != 'Y'

                            checkListObj.NA = false;
                            if (checkListObj.NI == 'Y') {
                                checkListObj.NI = true;
                                checkListObj.wasNIDuringSync = true;

                                if (checkListObj.Answers != '' && checkListObj.Answers != 5) {
                                    checkListObj.NI = false;
                                }
                                else {
                                    checkListObj.Score = 5;
                                    checkListObj.Answers = 5;
                                    checkListObj.originalScore = parseInt(checkListObj.Answers);
                                    checkListObj.FinalScore == parseInt(checkListObj.Answers);
                                }
                            }
                            else if (checkListObj.NI == 'N')
                                checkListObj.NI = false;
                            debugger;
                            if (!(checkListObj.NI == 'N' && checkListObj.Answers == null)) {
                                if (checkListObj.Answers != null && checkListObj.Answers.toString().length) {
                                    checkListObj.parameterno = count++;
                                    checkListArray.push(checkListObj);
                                }
                                else {
                                    continue;
                                }
                            }
                        }
                    }
                    questionaireList.questions = checkListArray;
                    if (checkListArray.length <= 0) {
                        self.state = 'done';
                        ToastAndroid.show('No Checklist Available ', 1000);
                    }
                    else {

                        self.getQuestionarieResponse = JSON.stringify(questionaireList);
                        let obj: any = {};
                        obj.checkList = JSON.stringify(checkListArray);
                        obj.taskId = self.taskId;
                        self.noCheckList = '';
                        obj.timeElapsed = '';
                        obj.timeStarted = '';

                        RealmController.addCheckListInDB(realm, obj, function dataWrite(params: any) {
                            //     ToastAndroid.show('Task added to db successfully', 1000);
                        });
                        self.state = 'getQuestionarieSuccess';
                    }

                }

            }
        }
        catch (e) {
            // console.log(e);
        }
    }),

    callToGetAcknowlege: flow(function* (taskId: any) {
        debugger;
        self.state = "pending";

        try {
            let payload = {
                "InterfaceID": "ADFCA_CRM_SBL_068",
                "Longitude": "",
                "Latitude": "",
                "DateTime": "",
                "Comments": "",
                "LanguageType": "ENU",
                "InspectorName": "",
                "RequestType": "",
                "Reason": "",
                "TaskStatus": "Acknowledged",
                "TaskId": taskId,
                "InspectorId": "",
                "PreposedDateTime": ""
            }
            let getAcknowldgeResponse = yield fetchAcknowldgeApi(payload);
            debugger;

            if (getAcknowldgeResponse && getAcknowldgeResponse.Status && (getAcknowldgeResponse.Status.toLowerCase() == 'success')) {

                self.noCheckList = '';
                let acknowldged = RealmController.getTaskIsAck(realm, TaskSchema.name, taskId);

                if (acknowldged && acknowldged['0']) {
                    delete acknowldged['0'].isAcknowledge;

                    acknowldged['0'].isAcknowledge = true
                    RealmController.addTaskDetails(realm, acknowldged['0'], TaskSchema.name, () => {
                        ToastAndroid.show('Task acknowldged successfully ', 1000);
                    });

                }
                self.state = 'acknowledgeSuccess';

            }
            else {
                ToastAndroid.show('Task Alredy Acknowledged', 1000);
                let acknowldged = RealmController.getTaskIsAck(realm, TaskSchema.name, taskId);
                if (acknowldged && acknowldged['0']) {
                    delete acknowldged['0'].isAcknowledge;

                    acknowldged['0'].isAcknowledge = true
                    // alert(JSON.stringify(acknowldged['0']));
                    // alert(acknowldged['0'])
                    RealmController.addTaskDetails(realm, acknowldged['0'], TaskSchema.name, () => {
                        ToastAndroid.show('Task acknowldged successfully ', 1000);
                    });

                }
                self.state = 'acknowledgeSuccess';
            }

        }
        catch (e) {
            // console.log('Exception My Task' + e);
        }
    }),

    callToGetCampaignChecklistApi: flow(function* (campaignType: string) {
        // {
        debugger;
        self.state = "pending"
        try {
            let payload = {

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
                            "@id": "service_name",
                            "@type": "text",
                            "text-val": "Campaigns"

                        },
                        {
                            "@id": "campaign_type",
                            "@type": "text",
                            "text-val": campaignType


                        }
                    ]
                }

            }

            debugger;
            
            let getCampaignChecklistResponse = yield fetchGetCampaignChecklistApi(payload);
            // console.log('getCampaignChecklist Response' + JSON.stringify(getCampaignChecklistResponse));
            if (getCampaignChecklistResponse && getCampaignChecklistResponse != '') {
                self.state = 'getCampaignChecklistSuccess';
                self.getCampaignChecklistResponse = JSON.stringify(getCampaignChecklistResponse);
                let questionaireListfinal = Array();
                debugger;

                let result = getCampaignChecklistResponse["global-instance"].entity

                let campaignArray: any = []
                for (let i = 0; i < result.length; i++) {

                    if (result[i].instance) {
                        campaignArray = result[i].instance
                    }
                }

                for (let index = 0; index < campaignArray.length; index++) {
                    const elementArray = campaignArray[index].attribute;
                    var questionaire = Object();
                    questionaire.parameter_score = Array(5);
                    questionaire.parameter_score_desc = Array(5);
                    questionaire.parameter_non_comp_desc = Array(5);
                    questionaire.regulation = Array();
                    var param = '';

                    for (let elementIndex = 0; elementIndex < elementArray.length; elementIndex++) {
                        // const element = elementArray[elementIndex];
                        a: switch (elementArray[elementIndex]['@id']) {
                            case 'campaign_parameter_reg_1':
                                questionaire.regulation.push(elementArray[elementIndex]['text-val']);
                                break;
                            case 'campaign_parameter_type':
                                questionaire.parameter_type = elementArray[elementIndex]['text-val'];
                                break;

                            case 'campaign_parameter_grace_minimum':
                                questionaire.parameter_grace_minimum = parseInt(elementArray[elementIndex]['number-val']);
                                break;

                            case 'campaign_parameter_score_desc_4':
                                if (elementArray[elementIndex]['text-val'])
                                    questionaire.parameter_score_desc[4] = elementArray[elementIndex]['text-val'];
                                questionaire.parameter_score[4] = 4;
                                break;

                            case 'campaign_parameter_reference':
                                questionaire.parameter_reference = elementArray[elementIndex]['text-val'];
                                questionaire.parameter_reference_original = elementArray[elementIndex]['text-val'];
                                var last2 = questionaire.parameter_reference.slice(-2);
                                var last1 = questionaire.parameter_reference.slice(-1);
                                if (isNaN(last2) && !isNaN(last1)) {
                                    var char1 = questionaire.parameter_reference.charAt(questionaire.parameter_reference.length - 1);
                                    questionaire.parameter_reference = questionaire.parameter_reference.replace(char1, "0" + char1);
                                }
                                break;

                            case 'campaign_parameter_score_desc_0':
                                if (elementArray[elementIndex]['text-val'])
                                    questionaire.parameter_score_desc[0] = elementArray[elementIndex]['text-val'];
                                questionaire.parameter_score[0] = 0;
                                break;

                            case 'campaign_parameter_grace_maximum':
                                questionaire.parameter_grace_maximum = parseInt(elementArray[elementIndex]['number-val']);
                                if ((questionaire.parameter_grace_maximum == 4) || (questionaire.parameter_grace_maximum == '4'))
                                    questionaire.parameter_grace_maximum = 30;
                                break;

                            case 'campaign_parameter_score_4':
                                if (elementArray[elementIndex]['number-val'])
                                    questionaire.parameter_score[4] = parseInt(elementArray[elementIndex]['number-val']);
                                break;

                            case 'campaign_parameter_score_desc_3':
                                if (elementArray[elementIndex]['text-val'])
                                    questionaire.parameter_score_desc[3] = elementArray[elementIndex]['text-val'];
                                questionaire.parameter_score[3] = 3;
                                break;

                            case 'campaign_parameter_score_1':
                                if (elementArray[elementIndex]['number-val'])
                                    questionaire.parameter_score[1] = parseInt(elementArray[elementIndex]['number-val']);
                                break;

                            case 'campaign_parameter_score_0':
                                if (elementArray[elementIndex]['number-val'])
                                    questionaire.parameter_score[0] = parseInt(elementArray[elementIndex]['number-val']);
                                break;

                            case 'campaign_parameter_score_3':
                                if (elementArray[elementIndex]['number-val'])
                                    questionaire.parameter_score[3] = parseInt(elementArray[elementIndex]['number-val']);

                                break;

                            case 'campaign_parameter_score_2':
                                if (elementArray[elementIndex]['number-val'])
                                    questionaire.parameter_score[2] = parseInt(elementArray[elementIndex]['number-val']);
                                break;

                            case 'campaign_parameter':
                                param = elementArray[elementIndex]['text-val'];
                                if (param)
                                    break a;
                                break;

                            case 'campaign_parameter_non_comp_desc_0':
                                if (elementArray[elementIndex]['text-val'].length > 0)
                                    questionaire.parameter_score_desc[0] = elementArray[elementIndex]['text-val'];
                                questionaire.parameter_score[0] = 0;
                                break;

                            case 'campaign_parameter_score_desc_2':
                                if (elementArray[elementIndex]['text-val'].length > 0)
                                    questionaire.parameter_score_desc[2] = elementArray[elementIndex]['text-val'];
                                questionaire.parameter_score[2] = 2;
                                break;

                            case 'campaign_parameter_reg_6':
                                if (elementArray[elementIndex]['text-val'].length > 0)
                                    questionaire.regulation.push(elementArray[elementIndex]['text-val'].length > 0);
                                break;

                            case 'campaign_parameter_EFST':
                                questionaire.parameter_EFST = elementArray[elementIndex]['boolean-val'];
                                break;

                            case 'campaign_parameter_guidance_rules':
                                questionaire.parameter_guidance_rules = elementArray[elementIndex]['text-val'];
                                break;

                            case 'campaign_parameter_non_comp_desc_4':
                                if (elementArray[elementIndex]['text-val'].length > 0)
                                    questionaire.parameter_score_desc[4] = elementArray[elementIndex]['text-val'];
                                break;

                            case 'campaign_parameter_weight_mobility':
                                questionaire.parameter_weight_mobility = elementArray[elementIndex]['ns0:number-val'];
                                break;

                            case 'campaign_parameter_non_comp_desc_2':
                                if (elementArray[elementIndex]['text-val'].length > 0)
                                    questionaire.parameter_score_desc[2] = elementArray[elementIndex]['text-val'];
                                break;

                            case 'campaign_parameter_non_comp_desc_3':
                                if (elementArray[elementIndex]['text-val'].length > 0)
                                    questionaire.parameter_score_desc[3] = elementArray[elementIndex]['text-val'];
                                break;

                            case 'campaign_parameter_score_desc_1':
                                questionaire.parameter_score[1] = 1;
                                if (elementArray[elementIndex]['text-val'].length > 0)
                                    questionaire.parameter_score_desc[1] = elementArray[elementIndex]['text-val'];
                                break;

                            case 'campaign_parameter_non_comp_desc_1':
                                if (elementArray[elementIndex]['text-val'].length > 0)
                                    questionaire.parameter_score_desc[4] = elementArray[elementIndex]['text-val'];
                                break;

                            case 'campaign_parameter_subtype':
                                questionaire.parameter_subtype = elementArray[elementIndex]['text-val'];
                                break;

                            case 'campaign_businessactivityscase parameters':
                                questionaire.parameter_subtype = elementArray[elementIndex]['text-val'];
                                break;

                            case 'global_parametersforthecampaigns_rev':
                                questionaire.parameter_subtype = elementArray[elementIndex]['text-val'];
                                break;

                        } // end of switch
                        if (param) {
                            questionaire.parameter = param;
                        }
                        //  Questionaires.questions[0].imageURL1

                    } // end of elementIndex

                    questionaire.image1 = '';
                    questionaire.image2 = '';
                    questionaire.image1Base64 = '';
                    questionaire.image2Base64 = '';
                    questionaire.guidance = '';
                    questionaire.role = '';
                    questionaire.comments = '';
                    questionaire.grace = 7;
                    questionaire.NA = false;
                    questionaire.NI = false;
                    questionaire.NAValue = 'N';
                    questionaire.NIValue = 'N';
                    questionaire.score = '-';
                    questionaire.TotalscoreForQuestion = '';
                    questionaire.gracePeriod = '';
                    questionaire.parameterno = index + 1;
                    questionaireListfinal.push(questionaire);

                }
                for (var i = 0; i < questionaireListfinal.length; i++)
                    questionaireListfinal[i].parameterno = i + 1;

                if (questionaireListfinal.length <= 0) {
                    self.state = 'done';
                    Alert.alert("No checklist Available")
                }
                else {
                    self.getQuestionarieResponse = JSON.stringify(questionaireListfinal);
                    self.checkListArray = JSON.stringify(questionaireListfinal);
                    let obj: any = {};
                    obj.checkList = JSON.stringify(questionaireListfinal);
                    obj.taskId = self.taskId;
                    obj.timeElapsed = '';
                    obj.timeStarted = '';

                    RealmController.addCheckListInDB(realm, obj, function dataWrite(params: any) {
                        ToastAndroid.show('Task added to db successfully', 1000);
                    });
                    self.state = 'getCampaignChecklistSuccess';
                }

                self.getCampaignChecklistResponse = JSON.stringify(questionaireListfinal);
                // alert(JSON.stringify(getCampaignChecklistResponse));
            }
            else {
                // ToastAndroid.show(I18n.t('others.failedToAgainPleaseTryAgainLater'), 1000);
                self.state = "error";
            }
        }
        catch (e) {
            self.state = "error";
            // console.log('Exception My Task' + e);
        }
    }),

})).views(self => ({
    getDashboardClisk() {
        return self.myTaskResponse
    },
    getSelectedTask() {
        return self.selectedTask
    },
    getCheckListArray() {
        return self.checkListArray
    },
    getState() {
        return self.state
    },
    getBusinessActivityRes() {
        return self.getBusinessActivityResponse
    },
    getCampaignList() {
        return self.campaignList
    },
    getEstListArray() {
        return self.estListArray
    },
    getIsCompletedOfflineList() {
        return self.isCompletedOfflineList
    }
}));

export default MyTaskStore;