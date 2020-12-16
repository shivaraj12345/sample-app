import {
    types,
    Instance,
    destroy,
    getParent,
    cast,
    SnapshotIn,
    flow
} from 'mobx-state-tree';
export type detentionStoreModel = Instance<typeof detentionModel>
import { RealmController } from '../../database/RealmController';
import LoginSchema from '../../database/LoginSchema';
import NavigationService from '../../services/NavigationService';
import { ToastAndroid, Alert } from 'react-native';
import { fetchGetQuestionarieAttachmentApi, submitCondemnationService } from './../../services/WebServices';
import TaskSchema from '../../database/TaskSchema';
let realm = RealmController.getRealmInstance();
let moment = require('moment');

const detentionModel = types.model('detentionModel', {
    serialNumber: types.string,
    detentionArray: types.string,
    type: types.string,
    unit: types.string,
    quantity: types.string,
    netWeight: types.string,
    package: types.string,
    batchNumber: types.string,
    brandName: types.string,
    productionDate: types.string,
    decisions: types.string,
    attachment1: types.string,
    attachment2: types.string,
    state: types.enumeration("State", ["pending", "done", "error", "navigate",])
}).actions(self => ({

    setClearData() {
        self.serialNumber = '';
        self.type = '';
        self.unit = '';
        self.quantity = '';
        self.netWeight = '';
        self.package = '';
        self.batchNumber = '';
        self.brandName = '';
        self.productionDate = '';
        self.decisions = '';
        self.attachment1 = '';
        self.attachment2 = '';

    },

    callToSubmitDetentionService: flow(function* (taskDetails: any, businessActivity: string) {
        // <- note the star, this a generator function!
        self.state = "pending"
        try {

            let loginData = RealmController.getLoginData(realm, LoginSchema.name);
            loginData = loginData[0] ? loginData[0] : {};

            debugger
            let arr = self.detentionArray != '' ? JSON.parse(self.detentionArray) : [], subPayload = [];

            for (let index = 0; index < arr.length; index++) {
                const element = arr[index];
               
                let obj = {
                    "Latitude": "",
                    "Longitude": "",
                    "IntegrationId": element.serialNumber,
                    "Temprature": '',
                    "Volume": element.netWeight,
                    "DetentionFlag": "Y",
                    "DetentionAction": "",
                    "Comments": '',
                    "BrandName": element.brandName,
                    "UnitofMeasure": element.unit,
                    "ProductionDate": element.productionDate,
                    "Container": "",
                    "BatchNumber": element.batchNumber,
                    "PackingType": element.package,
                    "Place": '',
                    "ProductName": '',
                    "BusinessActivity": businessActivity,
                    "Analysis": "",
                    "InspectionType": "Detention",
                    "Reason": element.decisions,
                    "CountryofOrigin": "United Arab Emirates",
                    "ExpiryDate": moment().format('L'),
                    "NoofItems": element.quantity,
                    "Code": "",
                    "MadeInCountry": "United Arab Emirates"
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

            console.log(JSON.stringify(payload))
            let response: any = yield submitCondemnationService(payload);
            debugger;
            if (response && response != '') {
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


                    // NavigationService.goBack();
                    // NavigationService.navigate('StartInspection');
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
                                    self.state = 'done'
                                    // Alert.alert('checklistResponse' + JSON.stringify(getChecklistResponse))
                                    // self.getQuestionarieAttachmentResponse = JSON.stringify(getQuestionarieAttachmentResponse);
                                    // alert(JSON.stringify(getQuestionarieAttachmentResponse));
                                    // let parseString = require('react-native-xml2js').parseString;
                                    // let xml = getQuestionarieAttachmentResponse;
                                    debugger;
                                }
                                else {
                                    ToastAndroid.show('Failed To Upload Attachment', 1000);
                                }
                            }
                        }
                    }
                }
                else {
                    debugger;
                    ToastAndroid.show(response.ErrorMessage ? response.ErrorMessage : ' Failed', 1000);
                    // NavigationService.goBack();
                    self.state = "error";
                }
                // });
            }

        } catch (error) {
            // ... including try/catch error handling
            self.state = "error"
        }

    }),

    setDetentionArray(detentionArray: string) {
        self.detentionArray = detentionArray
    },
    setSerialNumber(serialNumber: string) {
        self.serialNumber = serialNumber
    },
    setType(type: string) {
        self.type = type
    },
    setUnit(unit: string) {
        self.unit = unit
    },
    setQuantity(quantity: string) {
        self.quantity = quantity
    },
    setNeWeight(netWeight: string) {
        self.netWeight = netWeight
    },
    setPackage(packages: string) {
        self.package = packages
    },
    setBatchNumber(batchNumber: string) {
        self.batchNumber = batchNumber
    },
    setBrandName(brandName: string) {
        self.brandName = brandName
    },
    setProductionDate(productionDate: string) {
        self.productionDate = productionDate
    },
    setDecisions(decisions: string) {
        self.decisions = decisions
    },
    setAttachment1(attachment1: string) {
        self.attachment1 = attachment1
    },
    setAttachment2(attachment2: string) {
        self.attachment2 = attachment2
    },
    callToSubmitDetenationService: flow(function* (taskId: string, businessActivity: string) {
        // <- note the star, this a generator function!
        self.state = "pending"
        try {

            let loginData = RealmController.getLoginData(realm, LoginSchema.name);
            loginData = loginData[0] ? loginData[0] : {};

            debugger
            let arr = self.detentionArray != '' ? JSON.parse(self.detentionArray) : [], subPayload = '';

            for (let index = 0; index < arr.length; index++) {
                const element = arr[index];
                subPayload = subPayload + ` <gbl:InspectionTaskType>
                                    <gbl:Latitude></gbl:Latitude>
                                    <gbl:Longitude></gbl:Longitude>
                                    <gbl:IntegrationId>${element.serialNumber}</gbl:IntegrationId>
                                    <gbl:Temprature>1</gbl:Temprature>
                                    <gbl:Volume>${element.netWeight}</gbl:Volume>
                                    <gbl:DetentionFlag></gbl:DetentionFlag>
                                    <gbl:DetentionAction></gbl:DetentionAction>
                                    <gbl:Comments>${element.remarks}</gbl:Comments>
                                    <gbl:BrandName>${element.brandName}</gbl:BrandName>
                                    <gbl:UnitofMeasure>${element.unit}</gbl:UnitofMeasure>
                                    <gbl:ProductionDate>${moment().format('L')}</gbl:ProductionDate>
                                    <gbl:Container></gbl:Container>
                                    <gbl:BatchNumber>${element.batchNumber}</gbl:BatchNumber>
                                    <gbl:PackingType>${element.package}</gbl:PackingType>
                                    <gbl:Place>${element.place}</gbl:Place>
                                    <gbl:ProductName>${element.productName}</gbl:ProductName>
                                    <gbl:BusinessActivity>${businessActivity}</gbl:BusinessActivity>
                                    <gbl:Analysis></gbl:Analysis>
                                    <gbl:InspectionType>Sampling</gbl:InspectionType>
                                    <gbl:Reason>${element.reason}</gbl:Reason>
                                    <gbl:CountryofOrigin>United Arab Emirates</gbl:CountryofOrigin>
                                    <gbl:ExpiryDate>${moment().format('L')}</gbl:ExpiryDate>
                                    <gbl:NoofItems>${element.quantity}</gbl:NoofItems>
                                    <gbl:Code></gbl:Code>
                                    <gbl:MadeInCountry>United Arab Emirates</gbl:MadeInCountry>
                            </gbl:InspectionTaskType>`;

            }

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
                <gbl:Sampling_Input
                    xmlns:gbl="http://xmlns.oracle.com/GBL_ADFCA_SERV_Dev/GBL_ADFCA_SERV_SamplingInspection/GBL_ADFCA_SERV_SamplingInspectionBPEL">
                    <gbl:InterfaceID>ADFCA_CRM_SBL_008</gbl:InterfaceID>
                    <gbl:LanguageType>ENU</gbl:LanguageType>
                    <gbl:InspectorName>${loginData.username}</gbl:InspectorName>
                    <gbl:SamplingDetentionCondemnationTask>
                        <gbl:TaskDetails>
                            <gbl:TaskId>${'1-658603735'}</gbl:TaskId>
                            <gbl:ListOfAdfcaActionFollowUpActionsInt>
                            ${subPayload}
                            </gbl:ListOfAdfcaActionFollowUpActionsInt>
                        </gbl:TaskDetails>
                    </gbl:SamplingDetentionCondemnationTask>
                    <gbl:InspectorId>${loginData.username}</gbl:InspectorId>
                </gbl:Sampling_Input>
            </soap:Body>
        </soap:Envelope>`
            debugger;//

            let response: any = yield submitCondemnationService(payload);
            debugger;
            if (response && response != '') {
                var parseString = require('react-native-xml2js').parseString;
                var xml = response;
                debugger;

                parseString(xml, function (err: string, result: any) {
                    let Status = result["env:Envelope"]["env:Body"][0]['ns0:Sampling_Output'][0]["ns0:Status"][0];
                    let ErrorMessage = result["env:Envelope"]["env:Body"][0]['ns0:Sampling_Output'][0]["ns0:ErrorMessage"][0];
                    if (Status == 'Success') {

                        ToastAndroid.show(' Success', 1000);

                    }
                    else {
                        debugger;
                        ToastAndroid.show(ErrorMessage ? ErrorMessage : ' Failed', 1000);
                        self.state = "error";
                    }
                });
            }


        } catch (error) {
            // ... including try/catch error handling
            self.state = "error"
        }

    }),


})).views(self => ({

}));


export default detentionModel;
