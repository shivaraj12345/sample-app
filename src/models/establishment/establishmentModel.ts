import {
    types,
    Instance,
    destroy,
    getParent,
    cast,
    SnapshotIn,
    flow
} from 'mobx-state-tree';

export type establishmentStoreModel = Instance<typeof EstablishmentStore>
import { RealmController } from '../../database/RealmController';
import { getAccountSyncService } from './../../services/WebServices';
import EstablishmentSchema from '../../database/EstablishmentSchema';
import { ToastAndroid, Alert } from 'react-native';
let realm = RealmController.getRealmInstance();
let moment = require('moment');

const EstablishmentStore = types.model('EstablishmentModel', {
    establishmentName: types.string,
    licenseSource: types.string,
    licensestartDate: types.string,
    licenseEndDate: types.string,
    licenseNumber: types.string,
    contactDetails: types.string,
    address: types.string,
    area: types.string,
    sector: types.string,
    response: types.string,
    estId:types.string,
    state: types.enumeration("State", ["pending", "done", "error", "navigate","AccountSyncSuccess"])
}).actions(self => ({

    setEstablishmentDataBlank() {
        self.establishmentName = '',
            self.licenseSource = '',
            self.licensestartDate = '',
            self.licenseEndDate = '',
            self.licenseNumber = '',
            self.contactDetails = '',
            self.address = '',
            self.area = '',
            self.response = '',
            self.sector = '',
            self.state = 'done'
    },

    setEstablishmentName(establishmentName: string) {
        self.establishmentName = establishmentName
    },
    setLicenseSource(licenseSource: string) {
        self.licenseSource = licenseSource
    },
    setLicenseStartDate(licensestartDate: string) {
        self.licensestartDate = licensestartDate
    },
    setLicenseEndDate(licenseEndDate: string) {
        self.licenseEndDate = licenseEndDate
    },
    setLicenseNumber(licenseNumber: string) {
        self.licenseNumber = licenseNumber
    },
    setContactDetails(contactDetails: string) {
        self.contactDetails = contactDetails
    },
    setAddress(address: string) {
        self.address = address
    },
    setArea(area: string) {
        self.area = area
    },
    setSector(sectore: string) {
        self.sector = sectore
    },
    setEstIds(estId:string){
        self.estId = estId
    },
    callToAccountSyncService: flow(function* (licenceId: string, isArabic: boolean) {
        // <- note the star, this a generator function!
        self.state = "pending"
        try {

            let auth = '';
            let payload = {}
            let url = `?Login=SALEH.BALKHAIR&RecToDate=${moment().format('L')}&Start_spcRow=0&RecFromDate=${moment().format('L')}&Page_spcSize=3000&TransactionType=Record&Attrib5=1.5.4&AccountCategory=Food&tempflg=2507&LicenceNumber=${licenceId}`;
            let response: any = yield getAccountSyncService( url, auth);
            debugger;

            if (response) {

                let accountSyncAddressArray:any = [], accountSyncArray = [];
                // console.log("accountSyncAddressArray: ", JSON.stringify(response))
                for (let i = 0; i < parseInt(response.NumOfRec); i++) {
                    let adfcaAccountThinBcObj: any = {};
                    let adfcaAccountThinBc = response.ListOfAdfcaAccountSyncIo.AdfcaAccountThinBc[i];
                    adfcaAccountThinBcObj.Id = adfcaAccountThinBc.Id;
                    adfcaAccountThinBcObj.ADCCNumber = adfcaAccountThinBc.ADCCNumber;
                    adfcaAccountThinBcObj.ArabicName = adfcaAccountThinBc.ArabicName;
                    adfcaAccountThinBcObj.ADFCAIntialTradeLicense = adfcaAccountThinBc.ADFCAIntialTradeLicense;
                    adfcaAccountThinBcObj.Mobile = adfcaAccountThinBc.Mobile;
                    adfcaAccountThinBcObj.PreferredLanguage = adfcaAccountThinBc.PreferredLanguage;
                    adfcaAccountThinBcObj.LicenseExpiryDate = adfcaAccountThinBc.LicenseExpiryDate
                    adfcaAccountThinBcObj.LicenseNumber = adfcaAccountThinBc.LicenseNumber;
                    adfcaAccountThinBcObj.LicenseRegDate = adfcaAccountThinBc.LicenseRegDate;
                    adfcaAccountThinBcObj.AccountNumber = adfcaAccountThinBc.AccountNumber;
                    adfcaAccountThinBcObj.AccountRegion = adfcaAccountThinBc.AccountRegion;
                    adfcaAccountThinBcObj.Status = adfcaAccountThinBc.Status;
                    adfcaAccountThinBcObj.AccountClass = adfcaAccountThinBc.AccountClass;
                    adfcaAccountThinBcObj.Alias = adfcaAccountThinBc.Alias;
                    adfcaAccountThinBcObj.BankCode = adfcaAccountThinBc.BankCode;
                    adfcaAccountThinBcObj.EHSRiskClassification = adfcaAccountThinBc.EHSRiskClassification;
                    adfcaAccountThinBcObj.LicenseCode = adfcaAccountThinBc.LicenseCode;
                    adfcaAccountThinBcObj.Sent = adfcaAccountThinBc.Sent;
                    adfcaAccountThinBcObj.URL = adfcaAccountThinBc.URL;
                    adfcaAccountThinBcObj.OnHold = adfcaAccountThinBc.OnHold;
                    adfcaAccountThinBcObj.Reference = adfcaAccountThinBc.Reference;
                    adfcaAccountThinBcObj.LegalStatus = adfcaAccountThinBc.LegalStatus;
                    adfcaAccountThinBcObj.Site = adfcaAccountThinBc.Site;
                    adfcaAccountThinBcObj.Email = adfcaAccountThinBc.Email;
                    adfcaAccountThinBcObj.MainFaxNumber = adfcaAccountThinBc.MainFaxNumber;
                    adfcaAccountThinBcObj.LandlineNumber = adfcaAccountThinBc.LandlineNumber;
                    adfcaAccountThinBcObj.Area = adfcaAccountThinBc.Area;
                    adfcaAccountThinBcObj.Sector = adfcaAccountThinBc.Sector;
                    adfcaAccountThinBcObj.City = adfcaAccountThinBc.City;
                    adfcaAccountThinBcObj.EnglishName = adfcaAccountThinBc.EnglishName;
                    adfcaAccountThinBcObj.AccountCategory = adfcaAccountThinBc.AccountCategory;
                    adfcaAccountThinBcObj.Parent = adfcaAccountThinBc.Parent;
                    adfcaAccountThinBcObj.LicenseSource = adfcaAccountThinBc.LicenseSource;
                    adfcaAccountThinBcObj.AccountType = adfcaAccountThinBc.AccountType;
                    adfcaAccountThinBcObj.PrimaryAddressId = adfcaAccountThinBc.PrimaryAddressId;

                    adfcaAccountThinBcObj.NumofWH = adfcaAccountThinBc.NumofWH;
                    adfcaAccountThinBcObj.NumofSheds = adfcaAccountThinBc.NumofSheds;
                    adfcaAccountThinBcObj.NumofFishPonds = adfcaAccountThinBc.NumofFishPonds;
                    adfcaAccountThinBcObj.CapofWH = adfcaAccountThinBc.CapofWH;
                    adfcaAccountThinBcObj.CapofSheds = adfcaAccountThinBc.CapofSheds;
                    adfcaAccountThinBcObj.CapofFishPonds = adfcaAccountThinBc.CapofFishPonds;
                    adfcaAccountThinBcObj.ADFCAAgrEstGrade = adfcaAccountThinBc.ADFCAAgrEstGrade;
                    adfcaAccountThinBcObj.isUploaded = "false";
                 

                    // // console.log('adfcaAccountThinBcObj::'+JSON.stringify(adfcaAccountThinBcObj))
                    let numOfAddress = 0;
                    if (adfcaAccountThinBc.ListOfADFCAAccountThinBC_BusinessAddress) {

                        // for (let j = 0; j < adfcaAccountThinBc.ListOfADFCAAccountThinBC_BusinessAddress[0].ADFCAAccountThinBC_BusinessAddress.length; j++)
                        for (let j = 0; j < adfcaAccountThinBc.ListOfADFCAAccountThinBC_BusinessAddress.length; j++) {
                            numOfAddress++;
                            let adfcaBusinessAddress = adfcaAccountThinBc.ListOfADFCAAccountThinBC_BusinessAddress[j].ADFCAAccountThinBC_BusinessAddress;
                            let addressObj: any = {};
                            addressObj.Id = adfcaBusinessAddress.Id;
                            addressObj.ADFCAId = adfcaBusinessAddress.ADFCAId;
                            addressObj.IsPrimary = adfcaBusinessAddress.IsPrimary;
                            addressObj.Updated = adfcaBusinessAddress.Updated;
                            addressObj.City = adfcaBusinessAddress.City;
                            addressObj.Country = adfcaBusinessAddress.Country;
                            addressObj.POBox = adfcaBusinessAddress.POBox;
                            addressObj.AddressLine1 = adfcaBusinessAddress.Address;
                            addressObj.AddressLine2 = adfcaBusinessAddress.Address2;
                            addressObj.EstabilishmentID = adfcaAccountThinBc.Id;
                            accountSyncAddressArray.push(addressObj);
                        }//end for loop j
                    }

                    adfcaAccountThinBcObj.mainAddresObj = numOfAddress;//escape(JSON.stringify(mainAddresObj));
                    adfcaAccountThinBcObj.addressObj = JSON.stringify(accountSyncAddressArray)
                    accountSyncArray.push(adfcaAccountThinBcObj);

                }//end for loop i

                // }
                let responseObject: any = {};
                responseObject.Error_spcMessage = response.Error_spcMessage;
                responseObject.lastPageFlag = response.Last_spcPage;
                responseObject.NumOfRec = parseInt(response.NumOfRec);
                responseObject.Status = response.Status;

                if(response.Status=="Success"){

                responseObject.accountSyncArray = accountSyncArray;
                responseObject.accountSyncAddressArray = accountSyncAddressArray;

                self.address = accountSyncArray[0].PrimaryAddressId ? accountSyncArray[0].PrimaryAddressId : ''
                self.area = (accountSyncArray[0].Area ? accountSyncArray[0].Area : '')
                self.sector = (accountSyncArray[0].Sector ? accountSyncArray[0].Sector : '')
                self.contactDetails = (accountSyncArray[0].Sector ? accountSyncArray[0].Sector : '')
                self.establishmentName = (isArabic ? accountSyncArray[0].ArabicName ? accountSyncArray[0].ArabicName : '' : accountSyncArray[0].EnglishName ? accountSyncArray[0].EnglishName : '')
                self.licenseEndDate = (accountSyncArray[0].LicenseExpiryDate ? accountSyncArray[0].LicenseExpiryDate : '')
                self.licensestartDate = (accountSyncArray[0].LicenseRegDate ? accountSyncArray[0].LicenseRegDate : '')
                self.licenseNumber = (accountSyncArray[0].LicenseNumber ? accountSyncArray[0].LicenseNumber : '')
                self.licenseSource = (accountSyncArray[0].LicenseSource ? accountSyncArray[0].LicenseSource : '')

                self.response = JSON.stringify(accountSyncArray);

                RealmController.addEstablishmentDetails(realm, accountSyncArray, EstablishmentSchema.name, () => {
                });
            }
                self.state = 'AccountSyncSuccess'
            }
            else {
                // ToastAndroid.show(I18n.t('others.failedToAgainPleaseTryAgainLater'), 1000);
                self.state = "error";
            }

        } catch (error) {
            // ... including try/catch error handling
            self.state = "error"
        }
    }),


})).views(self => ({
    getEstablishmentName() {
        return self.establishmentName
    },
    getLicenseSource() {
        return self.licenseSource
    },
    getLicenseStartDate() {
        return self.licensestartDate
    },
    getLicenseEndDate() {
        return self.licenseEndDate
    },
    getLicenseNumber() {
        return self.licenseNumber
    },
    getContactDetails() {
        return self.contactDetails
    },
    getAddress() {
        return self.address
    },
    getArea() {
        return self.area
    },
    getEstIds(){
        return self.estId
    },

}));


export default EstablishmentStore;
