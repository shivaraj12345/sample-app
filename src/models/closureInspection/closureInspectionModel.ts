import {
    types,
    Instance,
    destroy,
    getParent,
    cast,
    SnapshotIn,
    flow
} from 'mobx-state-tree';
export type closureInspectionStoreModel = Instance<typeof ClosureInspectionStore>
import { RealmController } from '../../database/RealmController';
import LoginSchema from '../../database/LoginSchema';
import { Alert, ToastAndroid } from 'react-native';
let realm = RealmController.getRealmInstance();
import { fetchGetTaskApi, fetchGetChecklistApi, fetchClosureInspection} from './../../services/WebServices';
import { fetchGetSignature } from './../../services/WebServices';


const ClosureInspectionStore = types.model('ClosureInspectionModel', {

    taskId: types.string,
    taskType: types.string,
    englishTradeName: types.string,
    licenseNo: types.string,
    address: types.string,
    inspectorName: types.string,
    comment: types.string,
    fileBuffer:types.string,
    image:types.string,
    imageExtension:types.string,
    saveImageFlag: types.string,
    state: types.enumeration("State", ["pending", "done", "error", "navigate",])
}).actions(self => ({

    setDocumentationAndReportDataBlank() {
            self.taskId = '',
            self.taskType = '',
            self.englishTradeName = '',
            self.licenseNo = '',
            self.address = '',
            self.inspectorName = '',
            self.comment = '',
            self.fileBuffer ='',
            self.image = '',
            self.imageExtension = '',
            self.saveImageFlag = '',
            self.state = 'done'
    },
    setTaskId(taskId: string) {
        self.taskId = taskId
    },
    setLicenseNumber(licenseNo: string){
        self.licenseNo = licenseNo
    },
    setTaskType(taskType: string) {
        self.taskType = taskType
    },
    setEnglishTradeName(englishTradeName: string) {
        self.englishTradeName = englishTradeName
    },
    setAddress(address: string) {
        self.address = address
    },
    setComment(comment: string) {
        self.comment = comment
    },
    setInspectorName(inspectorName: string) {
        self.inspectorName = inspectorName
    },
    setFileBuffer(fileBuffer: string){
         self.fileBuffer = fileBuffer
    },
    setImage(image: string){
        self.image = image
    },
    setImageExtension(imageExtension:string){
        self.imageExtension
    },
    setSaveImageFlag(saveImageFlag: string) {
        self.saveImageFlag = saveImageFlag
    },

    callToClosureInspectionChecklist: flow(function* (payload: any) {
        {
            self.state = "pending"
            try {

                let TaskSubmitApiResponse = yield fetchClosureInspection(payload);
                debugger;
                // alert("res" + JSON.stringify(TaskSubmitApiResponse))
                if (TaskSubmitApiResponse && TaskSubmitApiResponse.Status == "Success") {
                    //ToastAndroid.show('Task submited successfully ', 1000);
                    // self.TaskSubmitApiResponse = JSON.stringify(TaskSubmitApiResponse);
                    self.state = 'navigate'
                }
                else {
                    // ToastAndroid.show(I18n.t('others.failedToAgainPleaseTryAgainLater'), 1000);
                  //  ToastAndroid.show('Failed submit Task', 1000);
                    self.state = "error";
                }

            } catch (error) {
                // ... including try/catch error handling
                self.state = "error"
            }
        }
    }),

    postToSignature: flow(function* () {
        // <- note the star, this a generator function

        self.state = "pending"
        try {
            let loginInfo = RealmController.getLoginData(realm, LoginSchema.name);

            // console.log("Login info", loginInfo)

            let obj = {
                taskId: self.taskId,
                fileBuffer:self.fileBuffer
            }

            let documentResponse = yield fetchGetSignature(obj);
         
                if (documentResponse.Status == 'Success') {
                    ToastAndroid.show('Signature added successfully ', 1000);
                    // Alert.alert('Signature added successfully');
                }
                else {
                    // Alert.alert('Signature is not added');
                    ToastAndroid.show('Signature is not added', 1000);
                }
            // });
        } catch (error) {
            self.state = "error"
        }

    }),

})).views(self => ({


    getTaskId() {
        return self.taskId
    },

    getTaskType() {
        return self.taskType
    },
    getEnglishTradeName() {
        return self.englishTradeName
    },
    getAddress() {
        return self.address
    },
    getLicenseNumber() {
        return self.licenseNo
    },
    getInspectorName() {
        return self.inspectorName
    },
    getComment(comment: string) {
        self.comment = comment
    },
    getFileBuffer(fileBuffer: string){
        self.fileBuffer = fileBuffer
    },
    getImage(image: string){
        self.image= image
    },
    getImageExtension(imageExtension: string){
        self.imageExtension=imageExtension
    },
    getSaveImageFlag() {
        return self.saveImageFlag
    },

}));


export default ClosureInspectionStore;
