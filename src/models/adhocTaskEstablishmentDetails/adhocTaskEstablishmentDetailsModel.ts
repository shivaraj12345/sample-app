import {
    types,
    Instance,
    destroy,
    getParent,
    cast,
    SnapshotIn,
    flow
} from 'mobx-state-tree';


export type AdhocTaskEstablishmentDetailsStoreModel = Instance<typeof AdhocTaskEstablishmentDetailsStore>
import { RealmController } from '../../database/RealmController';
import LoginSchema from '../../database/LoginSchema';
import { ToastAndroid, Alert } from 'react-native';
import { $nonEmptyObject } from 'mobx-state-tree/dist/internal';
import Detention from '../../routes/Detention';
import { add } from 'react-native-reanimated';
let realm = RealmController.getRealmInstance();

import { createAdhocTask,scheduleTaskDetails } from './../../services/WebServices';


const AdhocTaskEstablishmentDetailsStore = types.model('AdhocTaskEstablishmentDetailsModel', {
    establishmentName:types.string,
    licenseNumber:types.string,
    licenseStartDate:types.string,
    licenseEndDate:types.string, 
    arabicEstablishmentName:types.string,   
    contactDetails: types.string,
    address: types.string,  
    emailId: types.string,
    onHold: types.string,
    businessActivity: types.string,  
    selectVehicle: types.string,
    taskType: types.string,
    city:types.string,
    address1:types.string,
    address2:types.string,
    accountType:types.string,
    taskId:types.string,
    state: types.enumeration("State", ["pending", "done", "error", "navigate","adhocSuccess","scheduleTaskSuccess"])
}).actions(self => ({

    setEstablishmentName(establishmentName: string) {
        self.establishmentName = establishmentName
    },
    setLicenseNumber(licenseNumber: string) {
        self.licenseNumber = licenseNumber
    },
    setLicenseStartDate(licenseStartDate: string) {
        self.licenseStartDate = licenseStartDate
    },
    setLicenseEndDate(licenseEndDate: string) {
        self.licenseEndDate = licenseEndDate
    },
    setarabicEstablishmentName(arabicEstablishmentName: string) {
        self.arabicEstablishmentName = arabicEstablishmentName
    },
    setContactDetails(contactDetails: string) {
        self.contactDetails = contactDetails
    },   
    setAddress(address: string) {
        self.address = address
    },
    setEmailId(emailId: string) {
        self.emailId = emailId
    },
    setOnHold(onHold: string) {
        self.onHold = onHold
    },
    setBusinessActivity(businessActivity: string) {
        self.businessActivity = businessActivity
    },
    setSelectVehicle(selectVehicle: string) {
        self.selectVehicle = selectVehicle
    },
    setTaskType(taskType: string) {
        self.taskType = taskType
    },
    setAddress1(address1: string) {
        self.address1 = address1
    },
    setAddress2(address2: string) {
        self.address2 = address2
    },    
    setCity(city: string) {
        self.city = city
    }, 
    setAccountType(accountType:string){
        self.accountType = accountType
    },
    setTaskId(taskId:string){
        self.taskId = taskId
    },

    callToAdhocInspection: flow(function* () {
        {
            self.state = "pending"
            try {

                let obj:any = {
                    Address2 : self.address2,
                    InspectionType: self.taskType,
                    AccountArabicName:self.arabicEstablishmentName ,
                    PhoneNumber:self.contactDetails,
                    City:self.city,
                    TradeLicenseNumber: self.licenseNumber,
                    InspectorName:"SALEH.BALKHAIR",
                    AccountName:"", //hardcoded
                    Score:"",    
                    MailAddress: self.emailId,
                    Address1:self.address1,
                    AccountType:self.accountType, 
                    Action: self.businessActivity,
                    LicenseExpDate: self.licenseEndDate,
                    LicenseRegDate: self.licenseStartDate,  

                }

              
               
                let  callAdhocTaskResponse = yield createAdhocTask(obj);

             
                debugger;
                if (callAdhocTaskResponse && callAdhocTaskResponse != '') {
                    var parseString = require('react-native-xml2js').parseString;
                    var xml = callAdhocTaskResponse;
                    debugger;
                   
    
                    parseString(xml, function (err: string, result: any) {
                        // console.log("callAdhocTaskResponse: ", result)
                        let resultArr = result["env:Envelope"]['env:Body'][0]['ns0:NewInspection_Output'][0];
                        // console.log("resultArr: ", resultArr["ns0:Status"])
                        if( resultArr && resultArr["ns0:Status"][0]=="Success"){
                            self.state = "adhocSuccess"
                            self.taskId =  resultArr["ns0:TaskId"][0]
                        }else{
                            self.state = "error"

                            ToastAndroid.show(resultArr["ns0:ErrorMessage"][0], ToastAndroid.CENTER);
                        }
                       
                    })
                }else{

                }

            } catch (error) {
                // ... including try/catch error handling
                self.state = "error"
            }
        }
    }),

    callToScheduleTaskDetails: flow(function* () {
        {
            self.state = "pending"
            try {

                let obj:any = {

                    TaskId : self.taskId,
                    lang:''
                }

               
               
                let  scheduleTaskDetailsResponse = yield scheduleTaskDetails(obj);
                
                debugger;
                if (scheduleTaskDetailsResponse && scheduleTaskDetailsResponse != '') {
                    var parseString = require('react-native-xml2js').parseString;
                    var xml = scheduleTaskDetailsResponse;
                    debugger;
                   
    
                    parseString(xml, function (err: string, result: any) {
                        ///// console.log("scheduleTaskDetailsResponse1: ", JSON.stringify(result))
                        let resultArr = result["env:Envelope"]["env:Body"][0]["ns0:ScheduleTask_Output"][0]
                        
                        if( resultArr && resultArr["ns0:Status"][0]=="Success"){
                            
                            self.state = "scheduleTaskSuccess"
                            
                            let eHSRiskClassification =resultArr["ns0:TodoListTask"][0]["ns0:Inspection"][0]["ns0:ListOfAccount"][0]["ns0:Establishment"][0]["ns0:EHSRiskClassification"][0]
                            
                            
                           

                        }else{
                            self.state = "error"
                            ToastAndroid.show(resultArr["ns0:ErrorMessage"][0], ToastAndroid.CENTER);
                        }
                       
                    })
                }

            } catch (error) {
                // ... including try/catch error handling
                self.state = "error"
            }
        }
    }),
})).views(self => ({

    getEstablishmentName() {
        return self.establishmentName 
    },
    getLicenseNumber() {
         return self.licenseNumber 
    },
    getLicenseStartDate() {
         return self.licenseStartDate 
    },
    getLicenseEndDate() {
       return self.licenseEndDate 
    },
    getarabicEstablishmentName() {
         return self.arabicEstablishmentName 
    },
    getContactDetails() {
         return self.contactDetails 
    },   
    getAddress() {
         return self.address 
    },
    getEmailId() {
        return self.emailId 
    },
    getOnHold() {
         return self.onHold 
    },
    getBusinessActivity() {
         return self.businessActivity 
    },
    getSelectVehicle() {
        return  self.selectVehicle 
    },
    getTaskType() {
         return self.taskType
    },
    getAddress1() {
        return self.address1 
    },
    getAddress2() {
        return self.taskType 
    },    
    getCity() {
        return self.city
    },
    getAccountType(){
       return self.accountType
    },
    getState(){
        return self.state
    }


}));


export default AdhocTaskEstablishmentDetailsStore;
