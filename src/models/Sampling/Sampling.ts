import {
    types,
    Instance,
    destroy,
    getParent,
    cast,
    SnapshotIn,
    flow
} from 'mobx-state-tree';


export type samplingStoreModel = Instance<typeof Sampling>
import { RealmController } from '../../database/RealmController';
import LoginSchema from '../../database/LoginSchema';
import { ToastAndroid, Alert } from 'react-native';
import { fetchGetQuestionarieAttachmentApi, submitCondemnationService } from './../../services/WebServices';
import NavigationService from '../../services/NavigationService';
import TaskSchema from '../../database/TaskSchema';
let realm = RealmController.getRealmInstance();
let moment = require('moment');

const Sampling = types.model('samplingModel', {
    samplingArray: types.string,
    serialNumber: types.string,
    sampleCollectionReason: types.string,
    sampleName: types.string,
    dateofSample: types.string,
    sampleState: types.string,
    sampleTemperature: types.string,
    remainingQuantity: types.string,
    type: types.string,
    unit: types.string,
    quantity: types.string,
    netWeight: types.string,
    package: types.string,
    batchNumber: types.string,
    brandName: types.string,
    productionDate: types.string,
    expiryDate: types.string,
    countryOfOrigin: types.string,
    remarks: types.string,
    attachment1: types.string,
    attachment2: types.string,
    state: types.enumeration("State", ["pending", "done", "error", "navigate",])
}).actions(self => ({

    setClearData() {
        self.serialNumber = '';
        self.sampleCollectionReason = '';
        self.sampleName = '';
        self.dateofSample = '';
        self.sampleState = '';
        self.sampleTemperature = '';
        self.remainingQuantity = '';
        self.type = '';
        self.unit = '';
        self.quantity = '';
        self.netWeight = '';
        self.package = '';
        self.batchNumber = '';
        self.brandName = '';
        self.productionDate = '';
        self.expiryDate = '';
        self.countryOfOrigin = '';
        self.remarks = '';
        self.attachment1 = '';
        self.attachment2 = '';
    },
    setSamplingArray(samplingArray: string) {
        self.samplingArray = samplingArray
    },
    setSerialNumber(serialNumber: string) {
        self.serialNumber = serialNumber
    },
    setSampleCollectionReason(sampleCollectionReason: string) {
        self.sampleCollectionReason = sampleCollectionReason
    },
    setSampleState(sampleCollectionReason: string) {
        self.sampleState = sampleCollectionReason
    },
    setSampleName(sampleName: string) {
        self.sampleName = sampleName
    },
    setDateofSample(dateofSample: string) {
        self.dateofSample = dateofSample
    },
    setSampleTemperature(sampleTemperatures: string) {
        self.sampleTemperature = sampleTemperatures
    },
    setRemainingQuantity(remainingQuantity: string) {
        self.remainingQuantity = remainingQuantity
    },
    setType(type: string) {
        self.type = type
    },
    setremarks(remarks: string) {
        self.remarks = remarks
    },
    setUnit(data: string) {
        self.unit = data
    },
    setquantity(data: string) {
        self.quantity = data
    },
    setnetWeight(data: string) {
        self.netWeight = data
    },
    setpackage(data: string) {
        self.package = data
    },
    setbatchNumber(data: string) {
        self.batchNumber = data
    },
    setbrandName(data: string) {
        self.brandName = data
    },
    setproductionDate(data: string) {
        self.productionDate = data
    },
    setExpiryDate(data: string) {
        self.expiryDate = data
    },
    setCountryOfOrigin(countryOfOrigin: string) {
        self.countryOfOrigin = countryOfOrigin
    },
    setRemarks(remarks: string) {
        self.remarks = remarks
    },
    setAttachment1(attachment1: string) {
        self.attachment1 = attachment1
    },
    setAttachment2(attachment2: string) {
        self.attachment2 = attachment2
    },
    callToSubmitSamplingService: flow(function* (taskDetails: any, businessActivity: string) {
        // <- note the star, this a generator function!
        self.state = "pending"
        try {

            let loginData = RealmController.getLoginData(realm, LoginSchema.name);
            loginData = loginData[0] ? loginData[0] : {};

            debugger
            let arr = self.samplingArray != '' ? JSON.parse(self.samplingArray) : [], subPayload = [];

            for (let index = 0; index < arr.length; index++) {
                const element = arr[index];

                let obj = {
                    "Latitude": "",
                    "Longitude": "",
                    "IntegrationId": element.serialNumber,
                    "Temprature": element.sampleTemperature,
                    "Volume": element.netWeight,
                    "DetentionFlag": "",
                    "DetentionAction": "",
                    "Comments": element.remarks,
                    "BrandName": element.brandName,
                    "UnitofMeasure": element.unit,
                    "ProductionDate": element.productionDate,
                    "Container": "",
                    "BatchNumber": element.batchNumber,
                    "PackingType": element.package,
                    "Place": '',
                    "ProductName": element.sampleName,
                    "BusinessActivity": businessActivity,
                    "Analysis": "",
                    "InspectionType": "Sampling",
                    "Reason": element.sampleCollectionReason,
                    "CountryofOrigin": element.countryOfOrigin,
                    "ExpiryDate": element.expiryDate,
                    "NoofItems": element.remainingQuantity,
                    "Code": "",
                    "MadeInCountry": element.countryOfOrigin
                }
                subPayload.push(obj);
            }

            let payload = {
                "InterfaceID": "ADFCA_CRM_SBL_008",
                "LanguageType": "ENU",
                "InspectorName": loginData.username,
                "SamplingDetentionCondemnationTask": {
                    "TaskDetails": {
                        "TaskId": taskDetails.taskId,
                        "ListOfAdfcaActionFollowUpActionsInt": {
                            "InspectionTaskType": subPayload
                        }
                    }
                },
                "InspectorId": loginData.username
            }

            let response: any = yield submitCondemnationService(payload);
            debugger;
            if (response) {
                if (response.Status == 'Success') {
                    self.state = 'done';
                    ToastAndroid.show(' Success', 1000);

                    let objct = RealmController.getTaskDetails(realm, TaskSchema.name, taskDetails.taskId);
                    let inspectionDetails = objct['0'] ? objct['0'] : taskDetails;
                    inspectionDetails.detentionFlag = true;
                    RealmController.addTaskDetails(realm, inspectionDetails, TaskSchema.name, () => {
                        // ToastAndroid.show('Task updated successfully ', 1000);
                        NavigationService.goBack();

                    });

                    for (let index = 0; index < arr.length; index++) {
                        const elementAtt = arr[index];
                        let base64one = elementAtt.attachment1;
                        let base64two = elementAtt.attachment2;
                        let tmp = [base64one, base64two]

                        for (let i = 0; i < tmp.length; i++) {
                            const element = tmp[i];
                            if (element && element != '') {
                                let payloadAttachment = {
                                    "InterfaceID": "ADFCA_CRM_SBL_039",
                                    "LanguageType": "ENU",
                                    "InspectorId": [
                                        loginData.username
                                    ],
                                    "InspectorName": loginData.username,
                                    "Checklistattachment": {
                                        "Inspection": {
                                            "TaskId": taskDetails.taskId,
                                            "ListOfActionAttachment": {
                                                "QuestAttachment": {
                                                    "FileExt": "jpg",
                                                    "FileName": "image_0_1.jpg",
                                                    "FileSize": "",
                                                    "FileSrcPath": "",
                                                    "FileSrcType": "",
                                                    "Comment": "",
                                                    "FileBuffer": element
                                                }
                                            }
                                        }
                                    }

                                }

                                let getQuestionarieAttachmentResponse = yield fetchGetQuestionarieAttachmentApi(payloadAttachment);
                                // }
                                debugger;
                                if (getQuestionarieAttachmentResponse && getQuestionarieAttachmentResponse != '') {
                                    self.state = 'done';
                                    NavigationService.goBack();

                                    // NavigationService.navigate('StartInspection');
                                    // NavigationService.goBack();
                                    // Alert.alert('checklistResponse' + JSON.stringify(getChecklistResponse))
                                    // self.getQuestionarieAttachmentResponse = JSON.stringify(getQuestionarieAttachmentResponse);
                                    // alert(JSON.stringify(getQuestionarieAttachmentResponse));
                                    // let parseString = require('react-native-xml2js').parseString;
                                    // let xml = getQuestionarieAttachmentResponse;
                                    debugger;
                                }
                                else {
                                    self.state = 'done';
                                    ToastAndroid.show('Failed To Upload Attachment', 1000);
                                    NavigationService.goBack();
                                }
                            }
                        }
                    }
                    NavigationService.goBack();
                }
                else {
                    debugger;
                    ToastAndroid.show(response.ErrorMessage ? response.ErrorMessage : ' Failed', 1000);
                    self.state = "error";
                }
                // });
            }


        } catch (error) {
            // ... including try/catch error handling
            self.state = "error"
        }

    }),

})).views(self => ({


}));


export default Sampling;
