import {
    types,
    Instance,
    destroy,
    getParent,
    cast,
    SnapshotIn,
    flow
} from 'mobx-state-tree';


export type nnHoldeRequestModelStore = Instance<typeof OnHoldeRequestStore>
import { RealmController } from '../../database/RealmController';
import LoginSchema from '../../database/LoginSchema';
import { ToastAndroid, Alert } from 'react-native';
import { $nonEmptyObject } from 'mobx-state-tree/dist/internal';
import {fetchGetOnHoldRequestService } from './../../services/WebServices';
import NavigationService from './../../services/NavigationService';
let realm = RealmController.getRealmInstance();


const OnHoldeRequestStore = types.model('OnHoldeRequestModel', {
    inspectionId: types.string,
    type: types.string,
    createdBy: types.string,
    establishment: types.string,
    reason: types.string,
    comments: types.string,
    state: types.enumeration("State", ["pending", "done", "error", "navigate",])
}).actions(self => ({

    setLicenseEstablishmentDataBlank() {
        self.inspectionId = '',
            self.type = '',
            self.createdBy = '',
            self.establishment = '',
            self.reason = '',
            self.comments = '',
            self.state = 'done'
    },

    setInspectionId(inspectionId: string) {
        self.inspectionId = inspectionId
    },
    setType(type: string) {
        self.type = type
    },
    setCreatedBy(createdBy: string) {
        self.createdBy = createdBy
    },
    setEstablishment(establishment: string) {
        self.establishment = establishment
    },
    setReason(reason: string) {
        self.reason = reason
    },
    setComments(comments: string) {
        self.comments = comments
    },

    callToOnHoldDataService: flow(function* (taskId:any,reason:any,comments:any) {
        // console.log("onHoldRequestData in Model",taskId,reason,comments)
       
        self.state = "pending"
        try {
            let onHoldResponse = yield fetchGetOnHoldRequestService(taskId,reason,comments);
            var parseString = require('react-native-xml2js').parseString;
            var xml = onHoldResponse;
            parseString(xml, function (err: string, result: any) {
            // console.log("result",JSON.stringify(result));
                let onHoldResponse = result["env:Envelope"]["env:Body"][0]['ns0:MobViolation_Output'][0]['ns0:Status'][0];
                    // console.log('onHoldResponse' + onHoldResponse);
                if (onHoldResponse === "Success") {
                    //ToastAndroid.show('onHold Request Form Submitted Successfully', 1000);
                    NavigationService.goBack();
                     
                }
                else {
                    ToastAndroid.show('Failed', 1000);

                }
            });


        } catch (error) {

            self.state = "error"
        }

    }),


})).views(self => ({
    getInspectionId() {
        return self.inspectionId
    },
    getType() {
        return self.type
    },
    getCreatedBy() {
        return self.createdBy
    },
    getEstablishment() {
        return self.establishment
    },
    getReason() {
        return self.reason
    },
    getComments() {
        return self.comments
    },



}));


export default OnHoldeRequestStore;





