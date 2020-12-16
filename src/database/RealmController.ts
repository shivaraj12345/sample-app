const Realm = require('realm');

import LoginSchema from './LoginSchema';
import LanguageSchema from './LanguageSchema';
import CheckListSchema from './CheckListSchema'
import LOVSchema from './LOVSchema'
import ArabicLOVSchema from './ArabicLOVSchema'
import EstablishmentSchema from './EstablishmentSchema'
import TaskSchema from './TaskSchema';
import ProfileDetailsSchema from './ProfileSchema';
import AllEstablishmentSchema from './AllEstablishmentSchema';

export const RealmController = {

    getRealmInstance: () => {
        let realm;
        return realm = new Realm({
            schema: [LoginSchema, LanguageSchema, CheckListSchema, LOVSchema, ArabicLOVSchema, EstablishmentSchema, TaskSchema, ProfileDetailsSchema, AllEstablishmentSchema], schemaVersion: 24

        });
    },

    addLoginInformation: (realm: any, obj: any, cb: any) => {

        try {
            let updt = realm.objects(LoginSchema.name);
            realm.write(() => {
                realm.delete(updt);
                realm.create(LoginSchema.name, {
                    isLoggedIn: obj.isLoggedIn,
                    loginResponse: obj.loginResponse,
                    username: obj.username,
                    password: obj.password
                }, true);
            });
            cb();
        }
        catch (e) {
            // console.log("Error in realm: ", e + obj);
        }
    },

    getLoginData: (realm: any, schemaName: string) => {
        try {
            let data = realm.objects(schemaName);
            return JSON.parse(JSON.stringify(data));
        }
        catch (e) {
            // console.log("Error in realm: ", e);
        }
    },

    deleteLoginData: (realm: any, cb: any) => {
        try {
            let updt = realm.objects(LoginSchema.name);
            realm.write(() => {
                realm.delete(updt);
            })
            cb()
        }
        catch (e) {
            // console.log("Error in realm: ", e);
        }
    },

    addLanguage: (realm: any, obj: any) => {

        realm.write(() => {
            realm.create(LanguageSchema.name, {
                LangId: obj.langId,
                Lang: obj.lan

            }, true);
        });

    },

    getLanguage: (realm: any, schemaName: string, langId: any): any => {

        let data = realm.objects(schemaName);
        let filterData = data.filtered(`LangId = "${langId}"`);
        return filterData;

    },

    addCheckListInDB: (realm: any, obj: any, cb: any) => {
        try {
            realm.write(() => {
                realm.create(CheckListSchema.name, {
                    checkList: obj.checkList,
                    taskId: obj.taskId,
                    timeElapsed: obj.timeElapsed,
                    timeStarted: obj.timeStarted
                }, true);
            });
            cb();
        } catch (e) {
            // console.log("Error in realm: ", e + obj);
        }
    },

    getCheckListForTaskId: (realm: any, schemaName: string, taskId: any) => {
        // debugger;
        let data = realm.objects(schemaName);
        let filterData = data.filtered(`taskId = "${taskId}"`);
        return JSON.parse(JSON.stringify(filterData));
    },

    addLovDetails: (realm: any, obj: any, schemaName: string, cb: any) => {
        try {
            // debugger
            let updt = realm.objects(schemaName);
            realm.write(() => {
                realm.delete(updt);
            })
            for (let i = 0; i < obj.length; i++) {
                realm.write(() => {
                    realm.create(schemaName, {
                        key: (obj[i].key),
                        value: JSON.stringify(obj[i].value),
                    }, true);
                });
            }
            cb();
        }
        catch (e) {
            // debugger
            // console.log("Error in realm: ", e + JSON.stringify(obj));
        }
    },

    addAllEstablishments: (realm: any, obj: any, schemaName: string, cb: any) => {
        try {
       
            // for (let i = 0; i < obj.length; i++) {
                realm.write(() => {
                    realm.create(schemaName, {
                        PREMISE_ID: obj.PREMISE_ID,
                        ACCOUNT_NUMBER: obj.ACCOUNT_NUMBER, // primary key
                        TL_NUMBER: obj.TL_NUMBER,
                        PREMISE_NAME: obj.PREMISE_NAME,
                        PREMISE_NAME_AR: obj.PREMISE_NAME_AR,
                        STATUS: obj.STATUS,
                        PREMISE_CATEGORY: obj.PREMISE_CATEGORY,
                        ADDRESS: obj.PREMISE_CATEGORY,
                        CITY: obj.CITY,
                        AREA: obj.AREA,
                        PREMISE_TYPE: obj.PREMISE_TYPE,
                        MOBILE_NUMBER: obj.MOBILE_NUMBER,
                        INSPECTOR: obj.INSPECTOR,
                        SOURCE: obj.SOURCE,
                        ON_HOLD: obj.ON_HOLD,
                        ON_HOLD_REASON: obj.ON_HOLD_REASON,
                        LATITUDE: obj.LATITUDE,
                        LONGITUDE: obj.LONGITUDE,
                        LAND_LINE: obj.LAND_LINE,
                        EMAIL: obj.EMAIL
                    }, true);
                });
                cb();
            // }
        }
        catch (e) {
            debugger
            console.log("Error in realm: "+ (e));
        }
    },

    getAllEstablishments: (realm: any, schemaName: string): any => {

        let data = realm.objects(schemaName);
        debugger
        return JSON.parse(JSON.stringify(data));
        // let filterData = data.filtered(`LangId = "${langId}"`);
        // return filterData;

    },

    addEstablishmentDetails: (realm: any, obj: any, schemaName: string, cb: any) => {
        try {
            // debugger
            let updt = realm.objects(schemaName);
            // realm.write(() => {
            //     realm.delete(updt);
            // })
            debugger
            for (let i = 0; i < obj.length; i++) {
                realm.write(() => {
                    realm.create(schemaName, {
                        Id: obj[i].Id,
                        ADCCNumber: obj[i].ADCCNumber,
                        ArabicName: obj[i].ArabicName,
                        ADFCAIntialTradeLicense: obj[i].ADFCAIntialTradeLicense,
                        Mobile: obj[i].Mobile,
                        PreferredLanguage: obj[i].PreferredLanguage,
                        LicenseExpiryDate: obj[i].LicenseExpiryDate,
                        LicenseNumber: obj[i].LicenseNumber,
                        LicenseRegDate: obj[i].LicenseRegDate,
                        AccountNumber: obj[i].AccountNumber,
                        AccountRegion: obj[i].AccountRegion,
                        Status: obj[i].Status,
                        AccountClass: obj[i].AccountClass,
                        Alias: obj[i].Alias,
                        BankCode: obj[i].BankCode,
                        EHSRiskClassification: obj[i].EHSRiskClassification,
                        LicenseCode: obj[i].LicenseCode,
                        Sent: obj[i].Sent,
                        URL: obj[i].URL,
                        OnHold: obj[i].OnHold,
                        Reference: obj[i].Reference,
                        LegalStatus: obj[i].LegalStatus,
                        Site: obj[i].Site,
                        Email: obj[i].Email,
                        MainFaxNumber: obj[i].MainFaxNumber,
                        LandlineNumber: obj[i].LandlineNumber,
                        Area: obj[i].Area,
                        Sector: obj[i].Sector,
                        City: obj[i].City,
                        EnglishName: obj[i].EnglishName,
                        AccountCategory: obj[i].AccountCategory,
                        Parent: obj[i].Parent,
                        LicenseSource: obj[i].LicenseSource,
                        AccountType: obj[i].AccountType,
                        PrimaryAddressId: obj[i].PrimaryAddressId,
                        NumofWH: obj[i].NumofWH,
                        NumofSheds: obj[i].NumofSheds,
                        NumofFishPonds: obj[i].NumofFishPonds,
                        CapofWH: obj[i].CapofWH,
                        CapofSheds: obj[i].CapofSheds,
                        CapofFishPonds: obj[i].CapofFishPonds,
                        ADFCAAgrEstGrade: obj[i].ADFCAAgrEstGrade,
                        isUploaded: obj[i].isUploaded,
                        addressObj: obj[i].addressObj
                    }, true);
                });
            }
            cb();
        }
        catch (e) {
            debugger
            // console.log("Error in realm: ", e + JSON.stringify(obj));
        }
    },

    getSingleXlsxEstablishmentById: (realm: any, schemaName: string, Id: any) => {
        debugger;
        let data = realm.objects(schemaName);
        let filterData = data.filtered(`PREMISE_ID = "${Id}"`);
        return JSON.parse(JSON.stringify(filterData));
    },

    getEstablishmentById: (realm: any, schemaName: string, Id: any) => {
        debugger;
        let data = realm.objects(schemaName);
        let filterData = data.filtered(`Id = "${Id}"`);
        return JSON.parse(JSON.stringify(filterData));
    },

    getLovData: (realm: any, schemaName: string) => {
        let data = realm.objects(schemaName);
        return JSON.parse(JSON.stringify(data));
    },

    getLovDataByKey: (realm: any, schemaName: string, key: any) => {
        try {
            let data = realm.objects(schemaName);
            let filterData = data.filtered(`key = "${key}"`);
            if (filterData && filterData[0] && filterData[0].value) {
                return (JSON.parse(filterData[0].value));
            }
            else {
                if (Object.keys(filterData).length === 0) {
                    return ([])
                }
            }
        }
        catch (e) {
            // console.log("Error in realm: ", e);
        }
    },

    deleteLovData: (realm: any, schemaName: string, cb: any) => {
        let updt = realm.objects(schemaName);
        realm.write(() => {
            realm.delete(updt);
        })
        cb();
    },

    updateTaskDetails: (realm: any, TaskId: any, schemaName: string, cb: any) => {
        debugger;
        try {
            let impala = realm.objects(schemaName).filtered(`TaskId = "${TaskId}"`);

            realm.write(() => {
                impala.isAcknowledge = true;
            });

            cb();
        }
        catch (e) {
            // console.log("Error in update Task realm: ", e);
        }

    },

    updateTaskMappingData: (realm: any, TaskId: string, obj: string, schemaName: string, cb: any) => {
        debugger;
        try {

            let taskDetails = realm.objects(schemaName).filtered(`TaskId = "${TaskId}"`);
            realm.write(() => {
                taskDetails.MappingData = obj;
            });

            cb();
        }
        catch (e) {
            // console.log("Error in update Task realm: ", e);
        }

    },

    addTaskDetails: (realm: any, obj: any, schemaName: string, cb: any) => {
        try {
            debugger;
            let updt = realm.objects(schemaName);

            debugger;

            realm.write(() => {

                realm.create(schemaName, {
                    TaskId: obj.TaskId,
                    Updated: obj.Updated,
                    InspectortobeEvaluatedId: obj.InspectortobeEvaluatedId,
                    InspLogin: obj.InspLogin,
                    InspJobTitle: obj.InspJobTitle,
                    InspFullName: obj.InspFullName,
                    LicenseCode: obj.LicenseCode,
                    LicenseNumber: obj.LicenseNumber,
                    PlanStatus: obj.PlanStatus,
                    PlanStartDate: obj.PlanStartDate,
                    PlanNumber: obj.PlanNumber,
                    PlanName: obj.PlanName,
                    PlanEndDate: obj.PlanEndDate,
                    PlanAlAin: obj.PlanAlAin,
                    PlanAlGharbia: obj.PlanAlGharbia,
                    PlanAbuDhabi: obj.PlanAbuDhabi,
                    BAId: obj.BAId,
                    EstablishmentId: obj.EstablishmentId,
                    ActivitySRId: obj.ActivitySRId,
                    RiskCategory: obj.RiskCategory,
                    InspectorId: obj.InspectorId,
                    Grade: obj.Grade,
                    Comment: obj.Comment,
                    Description: obj.Description,
                    CreatedDate: obj.CreatedDate,
                    Score: obj.Score,
                    CompletionDate: obj.CompletionDate,
                    LoginName: obj.LoginName,
                    PrimaryOwnerId: obj.PrimaryOwnerId,
                    TaskPriority: obj.TaskPriority,
                    PlanId: obj.PlanId,
                    CampaignType: obj.CampaignType,
                    BusinessActivity: obj.BusinessActivity,
                    StartDate: obj.StartDate,
                    TaskStatus: obj.TaskStatus,
                    NumOfEST: obj.NumOfEST,
                    TaskType: obj.TaskType,
                    SampleSize: obj.SampleSize,
                    SystemType: obj.SystemType,
                    ListOfAdfcaAccountThinBc: (typeof (obj.ListOfAdfcaAccountThinBc) == 'string') ? obj.ListOfAdfcaAccountThinBc : JSON.stringify(obj.ListOfAdfcaAccountThinBc),
                    FinAcctCurrentBank: obj.FinAcctCurrentBank,
                    Name: obj.Name,
                    isAcknowledge: obj.isAcknowledge,
                    isCompleted: obj.isCompleted,
                    mappingData: (typeof(obj.mappingData)== 'string') ? obj.mappingData : JSON.stringify(obj.mappingData),
                    completionDateWithDayRemaining: obj.completionDateWithDayRemaining,
                    condemnationFlag:obj.condemnationFlag,
                    detentionFlag:obj.detentionFlag,
                    samplingFlag:obj.samplingFlag,
                }, true);

            });
            // console.log('dataobj' + JSON.stringify(obj));
            cb();
        }
        catch (e) {
            debugger
            // console.log("Error in realm: ", e + JSON.stringify(obj));
        }
    },

    getTaskDetails: (realm: any, schemaName: string, TaskId: string) => {
        try {
            debugger;
            let data = realm.objects(schemaName);
            let filterData = data.filtered(`TaskId = "${TaskId}"`);
            return JSON.parse(JSON.stringify(filterData));
        }
        catch (e) {
            debugger;
            // console.log("Error in realm: ", e);
        }
    },

    getTaskIsAck: (realm: any, schemaName: string, TaskId: string) => {
        debugger;
        try {
            let data = realm.objects(schemaName);
            let filterData = data.filtered(`TaskId = "${TaskId}"`);
            return JSON.parse(JSON.stringify(filterData));
        }
        catch (e) {
            debugger;
            // console.log("Error in realm: ", e);
        }
    },


    getTasks: (realm: any, schemaName: string) => {
        debugger;
        try {
            let data = realm.objects(schemaName);
            // let filterData = data.filtered(`TaskId = "${TaskId}"`);
            return JSON.parse(JSON.stringify(data));
        }
        catch (e) {
            debugger;
            // console.log("Error in realm: ", e);
        }
    },

    addProfileInformationInDB: (realm: any, obj: any, cb: any) => {
        try {
            realm.write(() => {
                realm.create(ProfileDetailsSchema.name, {
                    inspectorName: obj.inspectorName,
                    position: obj.position,
                    inspectionArea: obj.inspectionArea,
                    unit: obj.unit,
                    UserId: obj.UserId,
                }, true);
            });
            cb();
        } catch (e) {
            // console.log("Error in realm: ", e + obj);
        }
    },

    getProfileData: (realm: any, schemaName: string, UserId: any) => {
        // debugger;
        let data = realm.objects(schemaName);
        let filterData = data.filtered(`UserId= "${UserId}"`);
        return JSON.parse(JSON.stringify(filterData));
    },

    updateEstDetails: (realm: any, Id: any, schemaName: string, cb: any) => {
        debugger;
        try {
            // console.log("updateEstDetails: ", Id);
            let data = realm.objects(schemaName).filtered(`Id = "${Id}"`);

            realm.write(() => {
                data.isUploaded = "true";
            });


            cb();
        }
        catch (e) {
            // console.log("Error in updateEstDetails Est realm: ", e);
        }

    },




}