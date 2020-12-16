import {
    types,
    Instance,
    destroy,
    getParent,
    cast,
    SnapshotIn,
    flow
} from 'mobx-state-tree';


export type contactStoreModel = Instance<typeof LicenseMyTaskStore>
import { RealmController } from '../../database/RealmController';
import LoginSchema from '../../database/LoginSchema';
import { ToastAndroid } from 'react-native';
import { fetchGetTaskApi, fetchGetChecklistApi, fetchGetBusinessActivity, fetchNocChecklist } from './../../services/WebServices';

let realm = RealmController.getRealmInstance();

const LicenseMyTaskStore = types.model('LicenseMyTaskModel', {
    inspection: types.string,
    type: types.string,
    getNocChecklistResponse: types.string,
    taskId: types.string,
    checkListArray: types.string,
    isScoreN: types.string,
    rejectBtnClick: types.boolean,
    state: types.enumeration("State", ["pending", "done", "error", "navigate", "getChecklistSuccess"])
}).actions(self => ({
    setLicenseContactDataBlank() {
        self.inspection = '',
            self.type = '',
            self.state = 'done'
    },
    setInspection(inspection: string) {
        self.inspection = inspection
    },
    setType(type: string) {
        self.type = type
    },
    setTaskId(taskId: string) {
        self.taskId = taskId
    },
    setState(state: string) {
        self.state = state
    },
    setCheckListArray(checkListArray: string) {
        self.checkListArray = checkListArray;
    },
    setIsScoreN(isScoreN: string) {
        self.isScoreN = isScoreN;
    },
    setIsRejectBtnClick(isRejectBtnClick: boolean) {
        self.rejectBtnClick = isRejectBtnClick;
    },
    callToLovDataByKeyService: flow(function* () {
        // <- note the star, this a generator function!
        self.state = "pending"
        try {

            // ... yield can be used in async/await style
            let payload = {
                "Type": "shop_types"
            }
            let loginInfo = RealmController.getLoginData(realm, LoginSchema.name);
            let auth = '';

            if (loginInfo && loginInfo[0] && loginInfo[0].loginResponse) {
                auth = "Bearer " + JSON.parse(loginInfo[0].loginResponse).Data.JWT;
            }

        } catch (error) {
            // ... including try/catch error handling
            self.state = "error"
        }

    }),



    callToGetNocChecklist: flow(function* (type: string) {

        self.state = "pending";

        try {
            let inspectionType = ''
            if (type.toLowerCase() == "noc inspection_ara" || type.toLowerCase() == "noc inspection" || type.toLowerCase() == 'تفتيش ترخيص') {
                inspectionType = 'No Objection Certificate';
            }
            else if (type.toLowerCase() == "temporary noc inspection" || type == "تفتيش ترخيص مؤقت") {
                inspectionType = 'Temporary NOC Inspection'
            }
            if (type.toLowerCase() == "food poisoning" || type.toLowerCase() == "food poison") {
                inspectionType = 'Suspected Food Poisoning Case(s)';
            }

            let payload = {
                "config": {},
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
                            "text-val": inspectionType
                        }
                    ]
                }
            }

            let getChecklistResponse = yield fetchNocChecklist(payload);
            debugger;
            if (getChecklistResponse && getChecklistResponse != '') {
                // Alert.alert('checklistResponse' + JSON.stringify(getChecklistResponse))
                self.getNocChecklistResponse = JSON.stringify(getChecklistResponse);
                debugger;
                let checkListArray = [];
                let NOCQuestions = [];
                //     debugger;
                if (type.toLowerCase() == "food poisoning" || type.toLowerCase() == "food poison") {
                    checkListArray = getChecklistResponse["global-instance"].entity[2]['instance'];
                }
                else if (type.toLowerCase() == "noc inspection_ara" || type.toLowerCase() == "noc inspection" || type.toLowerCase() == 'تفتيش ترخيص' || type.toLowerCase() == "temporary noc inspection" || type == "تفتيش ترخيص مؤقت") {
                    checkListArray = getChecklistResponse["global-instance"].entity[0]['instance'];
                }
                debugger;
                for (let i = 0; i < checkListArray.length; i++) {

                    let NocObject = Object();

                    for (let j = 0; j < checkListArray[i]['attribute'].length; j++) {

                        if (type.toLowerCase() == "food poisoning" || type.toLowerCase() == "food poison") {
                            let id = checkListArray[i]['attribute'][j]['@id'];
                            switch (id) {
                                case 'food_poisoning_parameter_inspection_criteria':
                                    NocObject.NOC_parameter_inspection_criteria = checkListArray[i]['attribute'][j]['text-val'] ? checkListArray[i]['attribute'][j]['text-val'] : '';
                                    break;
                                case 'food_poisoning_parameter_regulation_article_no':
                                    NocObject.NOC_parameter_regulation_article_no = checkListArray[i]['attribute'][j]['text-val'] ? checkListArray[i]['attribute'][j]['text-val'] : '';
                                    break;
                                case 'food_poisoning_parameter_sl_no':
                                    NocObject.NOC_parameter_sl_no = checkListArray[i]['attribute'][j]['text-val'] ? checkListArray[i]['attribute'][j]['text-val'] : '';
                                    break;
                                case 'service_food_poisoning':
                                    try {
                                        NocObject.rev_noc_parameter_service = checkListArray[i]['attribute'][j]['text-val'] ? checkListArray[i]['attribute'][j]['text-val'] : '';
                                    }
                                    catch (e) {
                                        NocObject.rev_noc_parameter_service = '';
                                    }
                                    break;
                                case 'food_poisoning_parameter_category':
                                    NocObject.NOC_parameter_category = checkListArray[i]['attribute'][j]['text-val'] ? checkListArray[i]['attribute'][j]['text-val'] : '';
                                    break;
                            }
                        }
                        else if (type.toLowerCase() == "noc inspection_ara" || type.toLowerCase() == "noc inspection" || type.toLowerCase() == 'تفتيش ترخيص' || type.toLowerCase() == "temporary noc inspection" || type == "تفتيش ترخيص مؤقت") {

                            let id = checkListArray[i]['attribute'][j]['@id'];

                            switch (id) {

                                case 'NOC_parameter_inspection_criteria':
                                    NocObject.NOC_parameter_inspection_criteria = checkListArray[i]['attribute'][j]['text-val'] ? checkListArray[i]['attribute'][j]['text-val'] : '';
                                    break;
                                case 'NOC_parameter_regulation_article_no':
                                    NocObject.NOC_parameter_regulation_article_no = checkListArray[i]['attribute'][j]['text-val'] ? checkListArray[i]['attribute'][j]['text-val'] : '';
                                    break;
                                case 'NOC_parameter_sl_no':
                                    NocObject.NOC_parameter_sl_no = checkListArray[i]['attribute'][j]['text-val'] ? checkListArray[i]['attribute'][j]['text-val'] : '';
                                    break;
                                case 'rev_noc_parameter_service':
                                    try {
                                        NocObject.rev_noc_parameter_service = checkListArray[i]['attribute'][j]['text-val'] ? checkListArray[i]['attribute'][j]['text-val'] : '';
                                    }
                                    catch (e) {
                                        NocObject.rev_noc_parameter_service = '';
                                    }
                                    break;
                                case 'NOC_parameter_category':
                                    NocObject.NOC_parameter_category = checkListArray[i]['attribute'][j]['text-val'] ? checkListArray[i]['attribute'][j]['text-val'] : '';
                                    break;
                            }

                        }
                    }
                    // }
                    NocObject.comment = '';
                    NocObject.attchment1 = '';
                    NocObject.attachment2 = '';
                    NocObject.Score = '';
                    NocObject.NAValue = '';
                    NocObject.EFSTFlag = false;
                    if (type.toLowerCase() == "food poisoning" || type.toLowerCase() == "food poison") {
                        NocObject.Score = 'N';
                        NocObject.NIValue = '';
                    }
                    NOCQuestions.push(NocObject)

                }
                if (NOCQuestions.length <= 0) {
                    ToastAndroid.show('No Checklist Available ', 1000);
                }
                else {
                   // alert(JSON.stringify(NOCQuestions));
                    self.checkListArray = JSON.stringify(NOCQuestions);
                    let obj: any = {};
                    obj.checkList = JSON.stringify(NOCQuestions);
                    obj.taskId = self.taskId;
                    obj.timeElapsed = '';
                    obj.timeStarted = '';

                    RealmController.addCheckListInDB(realm, obj, function dataWrite(params: any) {
                        // ToastAndroid.show('Task added to db successfully', 1000);
                    });

                    self.state = 'getChecklistSuccess';
                }

            }
            else {
                // ToastAndroid.show(I18n.t('others.failedToAgainPleaseTryAgainLater'), 1000);
                self.state = "error";
            }
        }
        catch (e) {

        }

    })


})).views(self => ({
    getInspection(inspection: string) {
        self.inspection = inspection
    },
    getType() {
        return self.type
    },

}));


export default LicenseMyTaskStore;
