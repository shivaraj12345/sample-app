import {
    types,
    Instance,
    destroy,
    getParent,
    cast,
    SnapshotIn,
    flow
} from 'mobx-state-tree';


export type licenseActionStoreModel = Instance<typeof AdhocClosureStore>
import { RealmController } from '../../database/RealmController';
import LoginSchema from '../../database/LoginSchema';
import { ToastAndroid, Alert } from 'react-native';
import { $nonEmptyObject } from 'mobx-state-tree/dist/internal';
let realm = RealmController.getRealmInstance();
import NavigationService from './../../services/NavigationService';
import { callToPostRequestForClouser, LoginService } from './../../services/WebServices'

const AdhocClosureStore = types.model('AdhocClosureModel', {
    inspectionId: types.string,
    type: types.string,
    createdBy: types.string,
    establishment: types.string,
    comments: types.string,

    state: types.enumeration("State", ["pending", "done", "error", "navigate",])
}).actions(self => ({


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
    setComments(comments: string) {
        self.comments = comments
    },

    callToRequest: flow(function* () {

        self.state = "pending"

        try {

            var date = Date.now();
            let loginInfo = RealmController.getLoginData(realm, LoginSchema.name);

            // console.log("Login info", loginInfo)

            let obj = {
                inspectionId: self.inspectionId,
                comments: self.comments,
                establishment: self.establishment,
                action: 'Violation',
                violationDescription: self.comments,
                violationName: self.comments,
                inspectionParams: self.comments,
                violationType: 'Request for Closure',
                inspectorId: 'SALEH.BALKHAIR'


            }


            let closureResponse = yield callToPostRequestForClouser(obj);
            var parseString = require('react-native-xml2js').parseString;
            var xml = closureResponse;

            parseString(xml, function (err: string, result: any) {
                // console.log("result", JSON.stringify(result));
                let closureResponse = result['env:Envelope']['env:Body'][0]['ns0:MobViolation_Output'][0]['ns0:Status'];

                if (closureResponse == 'Success') {
                    ToastAndroid.show('Closure Request sent  Successfully', 1000);
                    NavigationService.goBack();  //added for back navigation.
                    // Alert.alert('Closure Request sent  Successfully')

                }
                else {
                    ToastAndroid.show('Error in Closure Request', 1000);

                }
            });


        } catch (error) {

            self.state = "error"
            // console.log("Error", error)
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
    getComments() {
        return self.comments
    }

}));


export default AdhocClosureStore;
