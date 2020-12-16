import {
    types,
    Instance,
    destroy,
    getParent,
    cast,
    SnapshotIn,
    flow
} from 'mobx-state-tree';


export type establishmentStoreModel = Instance<typeof TemporaryPermitsServiceRequestStore>
import { RealmController } from '../../database/RealmController';
import LoginSchema from '../../database/LoginSchema';
import { ToastAndroid, Alert } from 'react-native';
import { $nonEmptyObject } from 'mobx-state-tree/dist/internal';
let realm = RealmController.getRealmInstance();


const TemporaryPermitsServiceRequestStore = types.model('TemporaryPermitsServiceRequestModel', {
    serviceRequestNumber: types.string,
    city: types.string,
    application: types.string,
    applicationType: types.string,
    status: types.string,
    creationDate: types.string,
    closedDate: types.string,
    permitStartDate: types.string,
    permitEndDate: types.string,
    state: types.enumeration("State", ["pending", "done", "error", "navigate",])
}).actions(self => ({

    setTemporaryPermitsServiceRequestDataBlank() {
        self.serviceRequestNumber = '',
            self.city = '',
            self.application = '',
            self.applicationType = '',
            self.status = '',
            self.creationDate = '',
            self.closedDate = '',
            self.permitStartDate = '',
            self.permitEndDate = '',
            self.state = 'done'
    },

    setServiceRequestNumber(serviceRequestNumber: string) {
        self.serviceRequestNumber = serviceRequestNumber
    },
    setCity(city: string) {
        self.city = city
    },
    setApplication(application: string) {
        self.application = application
    },
    setApplicationType(applicationType: string) {
        self.applicationType = applicationType
    },
    setStatus(status: string) {
        self.status = status
    },
    setCreationDate(creationDate: string) {
        self.creationDate = creationDate
    },
    setClosedDate(closedDate: string) {
        self.closedDate = closedDate
    },
    setPermitStartDate(permitStartDate: string) {
        self.permitStartDate = permitStartDate
    },
    setPermitEndDate(permitEndDate: string) {
        self.permitEndDate = permitEndDate
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


})).views(self => ({

    getServiceRequestNumber() {
        return self.serviceRequestNumber
    },
    getCity() {
        return self.city
    },
    getApplication() {
        return self.application
    },
    getApplicationType() {
        return self.applicationType
    },
    getStatus() {
        return self.status
    },
    getCreationDate() {
        return self.creationDate
    },
    getClosedDate() {
        return self.closedDate
    },
    getPermitStartDate() {
        return self.permitStartDate
    },
    getPermitEndDate() {
        return self.permitEndDate
    },




}));


export default TemporaryPermitsServiceRequestStore;
