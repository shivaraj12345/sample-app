import {
    types,
    Instance,
    destroy,
    getParent,
    cast,
    SnapshotIn,
    flow
} from 'mobx-state-tree';


export type adhocTaskEstablishmentStoreModel = Instance<typeof AdhocTaskEstablishmentStore>
import { RealmController } from '../../database/RealmController';
import LoginSchema from '../../database/LoginSchema';
import { ToastAndroid, Alert } from 'react-native';
import { $nonEmptyObject } from 'mobx-state-tree/dist/internal';
import Detention from '../../routes/Detention';
let realm = RealmController.getRealmInstance();

import { callToSearchByEst } from './../../services/WebServices';
import { services } from './../../config/config';
import NavigationService from './../../services/NavigationService';


const AdhocTaskEstablishmentStore = types.model('AdhocTaskEstablishmentModel', {
    englishTradeName: types.string,
    arabicTradeName: types.string,
    licenseSource: types.string,
    licenseNo: types.string,
    area: types.string,
    sector: types.string,
    tradeLicenseHistoryResponse: types.string,
    clikedItem: types.string,
    state: types.enumeration("State", ["pending", "done", "error", "navigate", "success"])
}).actions(self => ({

    setEnglishTradeName(englishTradeName: string) {
        self.englishTradeName = englishTradeName
    },
    setArabicTradeName(arabicTradeName: string) {
        self.arabicTradeName = arabicTradeName
    },
    setLicenseSource(licenseSource: string) {
        self.licenseSource = licenseSource
    },
    setLicenseNo(licenseNo: string) {
        self.licenseNo = licenseNo
    },
    setArea(area: string) {
        self.area = area
    },
    setSector(sector: string) {
        self.sector = sector
    },
    setTradeLicenseHistory(tradeLicenseHistory: string) {
        self.tradeLicenseHistoryResponse = tradeLicenseHistory
    },
    setState(state: string) {
        self.state = state
    },
    setAdhocEstDataBlank() {
        self.englishTradeName = '',
            self.arabicTradeName = '',
            self.licenseSource = '',
            self.licenseNo = '',
            self.area = '',
            self.sector = '',
            self.tradeLicenseHistoryResponse = '',
            self.state = 'done'
    },
    setSelectedItem(clikedItem: string) {
        self.clikedItem = clikedItem
    },

    callToSearchByEstablishmentService: flow(function* () {
        // <- note the star, this a generator function!
        self.state = "pending"
        try {

            // ... yield can be used in async/await style
            let payload = {
                "InterfaceID": "ADFCA_CRM_SBL_005",
                "LanguageType": "",
                "TradeLicenseNumber": self.licenseNo,
                "InspectorName": "",
                "LicenseSource": self.licenseSource,
                "InspectorId": "",
                "EnglishName": self.englishTradeName + "*",
                "ArabicName": self.arabicTradeName,
                "AdditionalTag1": "",
                "Sector": self.sector,
                "AdditionalTag2": "",
                "Area": self.area,
                "AdditionalTag3": ""
            }

            let url = services.url.searchHistory
             const estResponse = yield callToSearchByEst(url, payload);

            if (estResponse && estResponse.Status == "Success") {

                self.state = "success"
                self.tradeLicenseHistoryResponse = JSON.stringify(estResponse.TradelicenseHistory.Establishment);

            } else {
                self.state = "error"
                ToastAndroid.show(estResponse.ErrorMessage, ToastAndroid.CENTER);
            }

        } catch (error) {
            // ... including try/catch error handling
            self.state = "error"
            // console.log("error: ", error)
            ToastAndroid.show("Failed to get response", ToastAndroid.CENTER);

        }

    }),
})).views(self => ({

    getEnglishTradeName() {
        return self.englishTradeName
    },
    getArabicTradeName() {
        return self.arabicTradeName
    },
    getLicenseSource() {
        return self.licenseSource
    },
    getLicenseNo() {
        return self.licenseNo
    },
    gtArea() {
        return self.area
    },
    getSector() {
        return self.sector
    },
    getTradeLicenseHistory() {
        return self.tradeLicenseHistoryResponse
    },
    getState() {
        return self.state
    },
    getSelectedItem() {
        return self.clikedItem
    }



}));


export default AdhocTaskEstablishmentStore;
