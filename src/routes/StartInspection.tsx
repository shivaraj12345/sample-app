import React, { createRef, useRef, useContext, useState, useEffect } from 'react';
import { Image, View, StyleSheet, SafeAreaView, TouchableOpacity, Text, ImageBackground, Dimensions, ScrollView, Alert, PermissionsAndroid, ToastAndroid, BackHandler, Platform, TextInput } from "react-native";
import { useIsFocused } from '@react-navigation/native';
import ImagePicker from 'react-native-image-picker';
import NavigationService from '../services/NavigationService';
import Header from './../components/Header';
import BottomComponent from './../components/BottomComponent';
import TextComponent from '../components/TextComponent';
import { observer } from 'mobx-react';
import { Context } from '../utils/Context';
import submissionPayload, { scoreCalculations } from '../utils/payloads/ChecklistSubmitPayload';
import { RootStoreModel } from '../store/rootStore';
import Strings from '../config/strings';
import { fontFamily, fontColor, checkListData } from '../config/config';
import useInject from "../hooks/useInject";
import { RealmController } from '../database/RealmController';
import CheckListSchema from './../database/CheckListSchema';
import LoginSchema from './../database/LoginSchema';
import FinalComponent from '../components/FinalComponent';
import ChecklistComponentStepOne from '../components/ChecklistComponentStepOne';
import DocumentationAndRecordComponent from '../components/DocumentationAndRecordComponent';
import SubmissionComponent from '../components/SubmissionComponent';
import TaskSchema from '../database/TaskSchema';
import EstablishmentSchema from './../database/EstablishmentSchema';
import Spinner from 'react-native-loading-spinner-overlay';
import {
    Menu,
    MenuProvider,
    MenuOptions,
    MenuTrigger,
    renderers,
} from 'react-native-popup-menu';
import ButtonComponent from '../components/ButtonComponent';
let realm = RealmController.getRealmInstance();

const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;
let moment = require('moment');
let clone = require('clone');
const { Popover } = renderers

let estSelectedItem: any = {}

const StartInspection = (props: any) => {
    const context = useContext(Context);
    const checklistComponentStepOneRef = useRef(null);

    let startTime: any = '';
    let timeStarted: any = '';
    let timeElapsed: any = '';

    const mapStore = (rootStore: RootStoreModel) => ({ myTasksDraft: rootStore.myTasksModel, completedTaskDraft: rootStore.completdMyTaskModel, adhocTaskEstablishmentDraft: rootStore.adhocTaskEstablishmentModel, establishmentDraft: rootStore.establishmentModel, licenseMyTasksDraft: rootStore.licenseMyTaskModel, bottomBarDraft: rootStore.bottomBarModel, documantationDraft: rootStore.documentationAndReportModel })
    const { licenseMyTasksDraft, myTasksDraft, completedTaskDraft, adhocTaskEstablishmentDraft, establishmentDraft, bottomBarDraft, documantationDraft } = useInject(mapStore)
    let taskDetails: any = myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask) : {};
    // taskDetails.mappingData = taskDetails.mappingData && taskDetails.mappingData.length ? taskDetails.mappingData : [{}]

    const [modifiedCheckListData, setModifiedCheckListData] = useState(Array());
    const [sendModifiedCheckListData, setSendModifiedCheckListData] = useState(Array());
    const [taskLoading, setTaskLoading] = useState(true);
    const [inspectionDetails, setInspectionDetails] = useState(Object());

    // individual section and index for checklist
    const [currentSection, setCurrentSection] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [scoreArray, setScoreArray] = useState(Array());
    const [count, setCount] = useState(1);

    // alert components variables
    const [showCommentAlert, setShowCommentAlert] = useState(false);
    const [showScoreAlert, setShowScoreAlert] = useState(false);
    const [showGraceAlert, setShowGraceAlert] = useState(false);
    const [showInformationAlert, setShowInformationAlert] = useState(false);
    const [showRegulationAlert, setShowRegulationAlert] = useState(false);
    const [showAttachmentAlert, setShowAttachmentAlert] = useState(false);

    // regulation array of checklist
    const [regulationString, setRegulationString] = useState('');
    const [finalTime, setFinalTime] = useState('00:00:00');

    const backButtonHandler: any = () => {

        let timeElapsed = new Date();
        let obj: any = {};
        obj.checkList = JSON.stringify(modifiedCheckListData);
        obj.taskId = myTasksDraft.taskId;
        obj.timeElapsed = timeElapsed.toString();
        obj.timeStarted = startTime.toString();
        debugger;
        RealmController.addCheckListInDB(realm, obj, function dataWrite(params: any) {
        });

    }

    useEffect(() => {
        try {
            debugger;
            if (myTasksDraft.state == 'navigate') {

                if (myTasksDraft.isMyTaskClick == 'campaign') {

                    myTasksDraft.setDataBlank()
                    let estListArray = JSON.parse(myTasksDraft.getEstListArray());
                    estSelectedItem.isUploaded = "true"
                    let arrayTemp: any = [];
                    arrayTemp.push(estSelectedItem);

                    RealmController.addEstablishmentDetails(realm, arrayTemp, EstablishmentSchema.name, () => {
                        // ToastAndroid.show('Task acknowldged successfully ', 1000);
                        let isUploaded = estListArray.map((item: any) => {
                            let temp = RealmController.getEstablishmentById(realm, EstablishmentSchema.name, item.Id);
                            // console.log("temp ", temp[0])

                            if (temp && temp[0]) {
                                return temp[0].isUploaded
                            }
                        });
                        let temp = isUploaded.some((item: any) => item === 'false');
                        if (temp) {
                            NavigationService.navigate('CampaignDetails');
                        }
                        else {
                            NavigationService.navigate('Dashboard');
                        }
                    });
                } else {
                    let taskDetails = { ...inspectionDetails }
                    // let objct = RealmController.getTaskIsAck(realm, TaskSchema.name, myTasksDraft.taskId);
                    // if (objct && objct['0']) {

                    debugger;
                    taskDetails.isCompleted = true;
                    let mappingData = taskDetails.mappingData ? taskDetails.mappingData : [{}];
                    mappingData.isCompltedOffline = true;
                    taskDetails.mappingData = mappingData;

                    let CompletedTaskArray = completedTaskDraft.completedTaskArray == '' ? [] : JSON.parse(completedTaskDraft.completedTaskArray)
                    CompletedTaskArray.push(taskDetails);
                    completedTaskDraft.setCompletedTaskArray(JSON.stringify(CompletedTaskArray));
                    debugger
                    licenseMyTasksDraft.setIsRejectBtnClick(false);
                    RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {
                        // ToastAndroid.show('Task objct successfully ', 1000);
                        debugger;
                        licenseMyTasksDraft.setIsRejectBtnClick(false);
                        NavigationService.navigate('Dashboard');
                    });
                }
            }
        }
        catch (error) {
            console.log(error)
        }

    }, [myTasksDraft.state]);


    useEffect(() => {
        estSelectedItem = adhocTaskEstablishmentDraft.getSelectedItem() != '' ? JSON.parse(adhocTaskEstablishmentDraft.getSelectedItem()) : {};
        myTasksDraft.setCount("1");

        let checkListData = RealmController.getCheckListForTaskId(realm, CheckListSchema.name, myTasksDraft.taskId);
        debugger;
        if (myTasksDraft.noCheckList == 'NocheckListAvailable') {
            debugger
            NavigationService.goBack();
            setTaskLoading(false);
            // myTasksDraft.setState('pending')
        }
        if (checkListData && checkListData['0'] && checkListData['0'].timeElapsed) {
            timeStarted = checkListData['0'].timeStarted;
            timeElapsed = checkListData['0'].timeElapsed;
            let temp, time: any;
            if (timeStarted) {
                temp = new Date(timeStarted).getTime();
                time = new Date(timeElapsed).getTime() - temp;
            } else {
                temp = new Date().getTime();
                time = temp - new Date(timeElapsed).getTime();
            }
            startTime = moment().subtract(parseInt(time / 1000), 'seconds').toDate();
            setModifiedCheckListData(checkListData['0'] ? JSON.parse(checkListData['0'].checkList) : []);
            setSendModifiedCheckListData(checkListData['0'] ? JSON.parse(checkListData['0'].checkList) : []);
            if (bottomBarDraft.profileClick) {
                setTaskLoading(false)
            }
        }
        else {
            startTime = new Date();
            if (bottomBarDraft.profileClick) {
                setTaskLoading(false)
            }
        }
        displayCounter();

    }, []);

    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", backButtonHandler);
        return () => {
            BackHandler.removeEventListener("hardwareBackPress", backButtonHandler);
        };
    }, [backButtonHandler]);

    useEffect(() => {
        debugger;
        // alert(myTasksDraft.noCheckList)
        let taskType = myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask).TaskType : "";
        console.log("myTasksDraft.selectedTask: ", myTasksDraft.selectedTask)
        let temp: any = Array();
        if ((taskType.toLowerCase() == "noc inspection_ara" || taskType.toLowerCase() == "noc inspection" || taskType.toLowerCase() == "temporary noc inspection" || taskType == 'تفتيش ترخيص' || taskType == 'تفتيش ترخيص مؤقت' || taskType.toLowerCase() == "food poisoning" || taskType.toLowerCase() == "food poison")) {
            temp = licenseMyTasksDraft.checkListArray != '' ? JSON.parse(licenseMyTasksDraft.checkListArray) : [];
            setModifiedCheckListData(temp);
            setSendModifiedCheckListData(temp);
        }
        else {
            temp = myTasksDraft.checkListArray != '' ? JSON.parse(myTasksDraft.checkListArray) : [];
        }

        let objct = RealmController.getTaskIsAck(realm, TaskSchema.name, myTasksDraft.taskId);

        let inspectionDetails = objct['0'] ? objct['0'] :  myTasksDraft.selectedTask ? JSON.parse(myTasksDraft.selectedTask) : []
        debugger
        // alert(JSON.stringify(inspection.mappingData))
        let mappingData = (inspectionDetails.mappingData && (inspectionDetails.mappingData != '') && (typeof (inspectionDetails.mappingData) == 'string')) ? JSON.parse(inspectionDetails.mappingData) : [{}];
        inspectionDetails.mappingData = mappingData;

        setInspectionDetails(inspectionDetails);
        debugger

        let taskDetails = { ...inspectionDetails }
        // let temp: any = [];
        // alert(JSON.stringify(myTasksDraft.checkListArray))
        if (temp && temp.length > 0) {

            debugger;
            // let Obj = { ...taskDetails };
            let mappingData = (taskDetails.mappingData && (taskDetails.mappingData != '') && (typeof (taskDetails.mappingData) == 'string')) ? JSON.parse(taskDetails.mappingData) : [{}];
            debugger;

            if (mappingData) {
                // taskDetails.mappingData = mappingData;
                for (let index = 0; index < taskDetails.mappingData.length; index++) {
                    taskDetails.mappingData[0].inspectionForm = temp;
                }
                // taskDetails.mappingData[0] = newData;
                debugger;
            }
            else {
                if (taskDetails.TaskId) {
                    taskDetails.mappingData = [{
                        inspectionForm: temp
                    }]
                }
                else {
                    taskDetails = JSON.parse(myTasksDraft.selectedTask)
                    taskDetails.mappingData = [{
                        inspectionForm: temp
                    }]
                }
            }
            myTasksDraft.setState('done')

            // alert((( (taskDetails.mappingData))))

            // alert(JSON.stringify(taskDetails.mappingData));
            // let obj: any = {};
            // obj.checkList = JSON.stringify(temp);
            // obj.taskId = myTasksDraft.taskId;
            // obj.timeElapsed = '';
            // obj.timeStarted = '';

            // RealmController.addCheckListInDB(realm, obj, function dataWrite(params: any) {
            //     // ToastAndroid.show('Task added to db successfully', 1000);
            // });

            RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {
                // ToastAndroid.show('Task objct successfully ', 1000);
            });
            // setInspectionDetails(taskDetails);

            // }
            setModifiedCheckListData(temp);
            setTaskLoading(false)
            setSendModifiedCheckListData(temp);
        }
        if (myTasksDraft.noCheckList == 'NocheckListAvailable') {
            debugger
            NavigationService.goBack()
            setTaskLoading(false)
            // myTasksDraft.setState('pending')
        }
        // }
        // }
    }, [myTasksDraft.checkListArray, myTasksDraft.noCheckList, licenseMyTasksDraft.checkListArray]);//myTasksDraft.checkListArray

    // setInterval(()=>{ 
    //     if (modifiedCheckListData.length) {
    //         let tempArray: any = [...modifiedCheckListData], taskDetails = { ...inspectionDetails };
    //         debugger
    //         if (taskDetails.mappingData) {
    //             let mappingData = taskDetails.mappingData ? taskDetails.mappingData : [{}];
    //             mappingData[0].inspectionForm = tempArray;
    //             taskDetails.mappingData = mappingData;
    //             // RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {
    //                 saveDataInDB();
    //                 // ToastAndroid.show('Task objct successfully ', 1000);
    //             // });
    //         }
    //         setInspectionDetails(taskDetails);
    //         setModifiedCheckListData(tempArray);
    //     }
    // },30000)

    const displayCounter = () => {
        let timerCounter = setInterval(() => {
            let diff = Math.abs(new Date().valueOf() - startTime);
            setFinalTime(finalTime => msToTime(diff))
        }, 1000);
    }

    const msToTime = (duration: any) => {

        let milliseconds = (parseInt(duration) % 1000) / 100;
        let seconds: any = Math.round((parseInt(duration) / 1000) % 60);
        let minutes: any = Math.round((parseInt(duration) / (1000 * 60)) % 60);
        let hours: any = Math.round((parseInt(duration) / (1000 * 60 * 60)) % 24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return hours + ":" + minutes + ":" + seconds;

    }

    const onRegulationClick = (item: any) => {
        debugger
        let tempArray: any = [...modifiedCheckListData];
        let header = item.parameterno;
        let sectionIndex = tempArray.findIndex((item: any) => item.parameterno == header);
        debugger

        // set current item and index 
        setCurrentSection(sectionIndex);
        setCurrentIndex(sectionIndex);

        let regulationArray = tempArray[sectionIndex].regulation;
        let tempRegulationString = '';
        if (regulationArray && regulationArray.length > 0) {
            for (let index = 0; index < regulationArray.length; index++) {
                debugger
                if (index == 0) {
                    tempRegulationString = regulationArray[index];
                }
                if (index == 1) {
                    tempRegulationString = tempRegulationString + ", " + regulationArray[index];
                }
            }
            setRegulationString(tempRegulationString)
        }

        setShowRegulationAlert(true);
        setShowScoreAlert(false);
        setShowCommentAlert(false);
        setShowInformationAlert(false);
        setShowGraceAlert(false);
    }

    const onClickScoreListItem = (item: any) => {
        setShowScoreAlert(false);

        let tempArray: any = [...modifiedCheckListData];
        debugger;
        tempArray = tempArray.map((u: any) => u.parameterno !== item.parameterno ? u : item);
        // setComment(tempArray[currentSection].comment);
        debugger
        let taskDetails = { ...inspectionDetails };
        if (taskDetails.mappingData) {
            let mappingData = taskDetails.mappingData ? taskDetails.mappingData : [{}];
            mappingData[0].inspectionForm = tempArray;
            taskDetails.mappingData = mappingData;
            RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {
                // ToastAndroid.show('Task objct successfully ', 1000);
            });
        }
        setInspectionDetails(taskDetails);
        setModifiedCheckListData(tempArray);
    }

    const updateGraceValue = (item: any) => {
        let tempArray: any = [...modifiedCheckListData];
        let taskDetails = { ...inspectionDetails };

        tempArray = tempArray.map((u: any) => u.parameterno !== item.parameterno ? u : item);
        if (taskDetails.mappingData) {
            let mappingData = taskDetails.mappingData ? taskDetails.mappingData : [{}];
            mappingData[0].inspectionForm = tempArray;
            taskDetails.mappingData = mappingData;
            RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {
                // ToastAndroid.show('Task objct successfully ', 1000);
            });
        }
        setInspectionDetails(taskDetails);
        setModifiedCheckListData(tempArray);
    }

    const updateCommentValue = (item: any) => {
        let tempArray: any = [...modifiedCheckListData];
        let taskDetails = { ...inspectionDetails };

        tempArray = tempArray.map((u: any) => u.parameterno !== item.parameterno ? u : item);
        if (taskDetails.mappingData) {
            let mappingData = taskDetails.mappingData ? taskDetails.mappingData : [{}];
            mappingData[0].inspectionForm = tempArray;
            taskDetails.mappingData = mappingData;
            RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {
                // ToastAndroid.show('Task objct successfully ', 1000);
            });
        }
        setInspectionDetails(taskDetails);
        setModifiedCheckListData(tempArray);
    }

    const saveDataInDB = () => {

        // setTimeout(() => {
        let timeElapsed = new Date();

        let obj: any = {};
        obj.checkList = JSON.stringify(modifiedCheckListData);
        obj.taskId = myTasksDraft.taskId;
        obj.timeElapsed = timeElapsed.toString();
        obj.timeStarted = startTime.toString();
        debugger;
        RealmController.addCheckListInDB(realm, obj, function dataWrite(params: any) {
            // props.updateLoding(false);
            // myTasksDraft.setCount("1");
            // NavigationService.goBack();
        });

        // }, 20000)

    }

    const submitButtonPress = async () => {
        try {
            let TaskItem = myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask) : '';
            let loginData = RealmController.getLoginData(realm, LoginSchema.name);
            loginData = loginData[0] ? loginData[0] : {};

            let taskDetails = { ...inspectionDetails };
            let tempArray = [...modifiedCheckListData];
            debugger;
            if (myTasksDraft.isMyTaskClick == "campaign") {

                if (estSelectedItem.EnglishName && estSelectedItem.EnglishName != '') {
                    TaskItem.tradeEnglishName = estSelectedItem.EnglishName
                } else {
                    TaskItem.tradeEnglishName = ''
                }

                // console.log("estSelectedItem", JSON.stringify(estSelectedItem))
            }

            // console.log("payload1: ", TaskItem)

            let payload: any = await submissionPayload(tempArray, TaskItem.TaskId, TaskItem, loginData.username, myTasksDraft.contactName, myTasksDraft.mobileNumber, myTasksDraft.emiratesId, finalTime, myTasksDraft.finalComment, licenseMyTasksDraft.rejectBtnClick);

            // let objct = RealmController.getTaskIsAck(realm, TaskSchema.name, myTasksDraft.taskId);
            debugger;

            if (taskDetails && taskDetails.mappingData && payload.InspectionCheckList && payload.InspectionCheckList.Inspection && payload.InspectionCheckList.Inspection.Score) {
                let tempdata = taskDetails
                let tempObjct = tempdata.mappingData ? tempdata.mappingData : [{}]

                tempObjct[0].total_score = payload.InspectionCheckList.Inspection.Score;
                tempObjct[0].signatureBase64 = documantationDraft.fileBuffer;
                tempObjct[0].ContactName = myTasksDraft.contactName;
                tempObjct[0].ContactNumber = myTasksDraft.mobileNumber;
                // delete tempdata.mappingData;
                tempdata.mappingData = tempObjct;

                RealmController.addTaskDetails(realm, tempdata, TaskSchema.name, () => {
                    // ToastAndroid.show('Task objct successfully ', 1000);
                });

            }
            myTasksDraft.setSelectedTask(JSON.stringify(taskDetails))
            debugger;
            // console.log(JSON.stringify(payload))
            if (documantationDraft.fileBuffer === '') {
                Alert.alert("","Signature is mandetary")
            }
            else if (myTasksDraft.contactName === '') {
                Alert.alert("","Contact name is mandetary")
            }
            else if (myTasksDraft.mobileNumber === '') {
                Alert.alert("","Mobile number is mandetary")
            }
            else{
                myTasksDraft.callToSubmitTaskApi(payload);
            }
        } catch (error) {
            // alert(error)
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>

            <Spinner
                visible={(taskLoading || myTasksDraft.state == 'pending') ? true : false}
                // textContent={'Loading...'}
                overlayColor={'rgba(0,0,0,0.7)'}
                color={'#b6a176'}
                textStyle={{ fontSize: 14, color: 'white' }}
            />

            <ImageBackground style={{ height: HEIGHT, width: WIDTH }} source={context.isArabic ? require('./../assets/images/backgroundimgReverse.jpg') : require('./../assets/images/backgroundimg.jpg')}>

                <View style={{ flex: 1.5, alignSelf: 'center', width: '90%' }}>
                    <Header isArabic={context.isArabic} />
                </View>

                <View style={{ flex: 1 }}>

                    <View style={{ flex: 1, flexDirection: 'row', width: '80%', alignSelf: 'center' }}>

                        {/*   <View style={{ flex: myTasksDraft.isMyTaskClick == 'scheduledroutlineInspection' ? 0.4 : 0.5 }}>
                            <View style={{ flex: 0.5, borderBottomColor: '#5C666F', borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>
                        {
                            myTasksDraft.isMyTaskClick == 'scheduledfollowUp' ?
                                <View style={{ flex: 1.5, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                                    <View style={{ flex: 0.9, alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ color: fontColor.TitleColor, fontSize: 14, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].scheduled.scheduled)} </Text>
                                    </View>
                                    <View style={{ flex: 0.008, height: '20%', alignSelf: 'center', borderWidth: 0.5, borderColor: '#5C666F' }} />
                                    <View style={{ flex: 0.9, alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ color: fontColor.TitleColor, fontSize: 14, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].scheduled.followUp)} </Text>
                                    </View>
                                </View> :

                                myTasksDraft.isMyTaskClick == 'scheduledroutlineInspection' ?

                                    <View style={{ flex: 2.2, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                                        <View style={{ flex: 0.7, alignItems: 'center', justifyContent: 'center' }}>
                                            <Text style={{ color: fontColor.TitleColor, fontSize: 14, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].scheduled.scheduled)} </Text>
                                        </View>

                                        <View style={{ flex: 0.008, height: '20%', alignSelf: 'center', borderWidth: 0.5, borderColor: '#5C666F' }} />
                                        <View style={{ flex: 1.2, alignItems: 'center', justifyContent: 'center' }}>
                                            <Text numberOfLines={1} style={{ color: fontColor.TitleColor, fontSize: 14, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].scheduled.routineInspection)} </Text>
                                        </View>
                                    </View> :

                                    myTasksDraft.isMyTaskClick == 'license' ?
                                        <View style={{ flex: 1.5, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                                           
                                            <View style={{ flex: 0.9, alignItems: 'center', justifyContent: 'center' }}>
                                                <Text style={{ color: fontColor.TitleColor, fontSize: 14, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].scheduled.license)} </Text>
                                            </View>
                                        </View>
                                        :

                                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                            <Text style={{ color: '#5C666F', fontSize: 14, fontWeight: 'bold' }}>{myTasksDraft.isMyTaskClick == 'campaign' ? Strings[context.isArabic ? 'ar' : 'en'].campaignDetails.campaignInspection : Strings[context.isArabic ? 'ar' : 'en'].taskList.routineInspection}</Text>
                                        </View>
                        }
                        <View style={{ flex: myTasksDraft.isMyTaskClick == 'scheduledroutlineInspection' ? 0.4 : 0.5 }}>
                            <View style={{ flex: 0.5, borderBottomColor: '#5C666F', borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View> */}
                        <View style={{ flex: 0.5 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: fontColor.TitleColor, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily, fontSize: 14, fontWeight: 'bold' }}>{myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask).TaskType.toString().toUpperCase() : ' - '}</Text>
                        </View>

                        <View style={{ flex: 0.5 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>
                    </View>

                </View>


                <View style={{ flex: 0.5, flexDirection: context.isArabic ? 'row-reverse' : 'row', width: '85%', justifyContent: 'center', alignSelf: 'center', borderWidth: 1, borderRadius: 18, borderColor: '#abcfbf' }}>

                    {/* <View style={{ flex: 0.2 }} /> */}

                    {/* <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold' }}>{Strings[context.isArabic ? 'ar' : 'en'].inspectionDetails.taskId + ":-"}</Text>
                    </View> */}

                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold' }}>{myTasksDraft.taskId ? myTasksDraft.taskId : '-'}</Text>
                    </View>

                    <View style={{ flex: 0.003, height: '50%', alignSelf: 'center', borderWidth: 0.2, borderColor: '#5C666F' }} />

                    <View style={{ flex: 0.1 }} />

                    <View style={{ flex: 0.8, alignItems: 'center', justifyContent: 'center' }}>
                        <Menu renderer={Popover} rendererProps={{ preferredPlacement: 'bottom' }}>
                            <MenuTrigger style={styles.menuTrigger}>
                                <Text numberOfLines={1} style={{ color: '#5C666F', textDecorationLine: 'underline', fontSize: 13, fontWeight: 'bold', textAlign: context.isArabic ? 'right' : 'left' }}>{establishmentDraft.establishmentName ? establishmentDraft.establishmentName : '-'}</Text>
                            </MenuTrigger>
                            <MenuOptions style={styles.menuOptions}>
                                {/* <MenuOption onSelect={() => { }} > */}
                                <Text numberOfLines={1} style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold', textAlign: context.isArabic ? 'right' : 'left' }}>{establishmentDraft.establishmentName ? establishmentDraft.establishmentName : '-'}</Text>
                                {/* </MenuOption> */}

                            </MenuOptions>
                        </Menu>
                    </View>

                    <View style={{ flex: 0.3 }} />

                </View>

                <View style={{ flex: 0.2 }} />

                <View style={{ flex: 0.5, flexDirection: 'row', width: '85%', justifyContent: 'center', alignSelf: 'center', borderWidth: 1, borderRadius: 18, borderColor: '#abcfbf' }}>

                    <TouchableOpacity
                        onPress={() => {

                            // if (myTasksDraft.isMyTaskClick == 'tempPermit') {
                            //     if (context.isArabic) {
                            //         let count = parseInt(myTasksDraft.count);
                            //         count = count + 1;
                            //         if (count <= 2 && count >= 1) {
                            //             myTasksDraft.setCount(count.toString())
                            //         }
                            //     } else {
                            //         let count = parseInt(myTasksDraft.count);
                            //         count = count - 1;
                            //         if (parseInt(myTasksDraft.count) <= 2 && parseInt(myTasksDraft.count) > 1) {
                            //             myTasksDraft.setCount(count.toString())
                            //         }
                            //     }
                            // }
                            // else {
                            if (context.isArabic) {
                                let count = parseInt(myTasksDraft.count);
                                count = count + 1;
                                if (JSON.parse(myTasksDraft.selectedTask).TaskType.toLowerCase() == 'complaints') {
                                    if (scoreArray.length <= 0) {
                                        Alert.alert('Enter Score For Atlest One Question');
                                    }
                                    else {
                                        if (count <= 3 && count >= 1) {
                                            let finalresult: any = scoreCalculations(modifiedCheckListData, inspectionDetails)
                                            myTasksDraft.setResult(finalresult.action)
                                            myTasksDraft.setCount(count.toString())
                                            saveDataInDB();
                                        }
                                    }
                                }
                            } else {
                                let count = parseInt(myTasksDraft.count);
                                count = count - 1;
                                if (parseInt(myTasksDraft.count) <= 3 && parseInt(myTasksDraft.count) > 1) {
                                    myTasksDraft.setCount(count.toString())
                                    saveDataInDB();
                                }
                            }
                            // }
                        }}
                        style={{ flex: 0.5, backgroundColor: '#abcfbe', justifyContent: 'center', borderTopLeftRadius: 18, borderBottomLeftRadius: 18 }}
                        disabled={bottomBarDraft.profileClick}
                    >
                        {
                            bottomBarDraft.profileClick ?
                                null
                                :
                                <Image style={{ alignSelf: 'center', transform: [{ rotate: '180deg' }] }} source={require('./../assets/images/startInspection/arrow.png')} />
                        }
                    </TouchableOpacity>

                    <View style={{ flex: 3, alignItems: 'center', justifyContent: 'center', backgroundColor: '#c4ddd2' }}>
                        <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold', textAlign: 'right' }}>{parseInt(myTasksDraft.count) == 1 ? Strings[context.isArabic ? 'ar' : 'en'].startInspection.checklist :
                            parseInt(myTasksDraft.count) == 2 ? myTasksDraft.isMyTaskClick == "History" ? Strings[context.isArabic ? 'ar' : 'en'].startInspection.finalResult : Strings[context.isArabic ? 'ar' : 'en'].startInspection.documentation :
                                Strings[context.isArabic ? 'ar' : 'en'].startInspection.submission}</Text>

                    </View>

                    <TouchableOpacity
                        onPress={() => {

                            // if (myTasksDraft.isMyTaskClick == 'tempPermit') {

                            //     if (context.isArabic) {
                            //         let count = parseInt(myTasksDraft.count);
                            //         count = count - 1;
                            //         if (parseInt(myTasksDraft.count) < 2 && parseInt(myTasksDraft.count) > 1) {
                            //             myTasksDraft.setCount(count.toString())
                            //         }
                            //     }
                            //     else {
                            //         let count = parseInt(myTasksDraft.count);
                            //         count = count + 1;
                            //         if (count <= 2 && count >= 1) {
                            //             myTasksDraft.setCount(count.toString())
                            //         }
                            //     }
                            // }
                            //
                            if (JSON.parse(myTasksDraft.selectedTask).TaskType.toLowerCase().includes('noc')) {
                                let flag = false;
                                let flagNo = false;
                                let scoreflag = false;
                                let naFlag = false;
                                let questionNo = 0;
                                for (let index = 0; index < modifiedCheckListData.length; index++) {
                                    const element: any = modifiedCheckListData[index];
                                    if (element.Score == 'N' && element.comment == '') {
                                        flag = true;
                                        questionNo = (index + 1);
                                        break;
                                    }
                                    if (element.Score == 'N') {
                                        flagNo = true;
                                    }
                                    if (element.NAValue == 'Y') {
                                        naFlag = true;
                                    }
                                    else if (element.Score == '' && element.NAValue == '') {
                                        scoreflag = true;
                                        questionNo = (index + 1);
                                        break;
                                    }
                                    else {
                                        continue;
                                    }
                                }
                                if (flag) {
                                    alert('comment is mandatory for question number ' + questionNo);
                                    // licenseMyTasksDraft.setIsScoreN('Y');
                                }
                                else if (scoreflag) {
                                    alert('Score is mandatory for question number ' + questionNo);
                                    // licenseMyTasksDraft.setIsScoreN('Y');
                                }
                                else {
                                    debugger;
                                    // if (naFlag && !flagNo) {
                                    //     licenseMyTasksDraft.setIsScoreN('N');
                                    // }
                                    let finalResult = scoreCalculations(modifiedCheckListData, inspectionDetails);
                                    debugger;
                                    if (finalResult.action.toLowerCase() == 'satisfactory') {
                                        licenseMyTasksDraft.setIsScoreN('N');
                                    }
                                    else {
                                        licenseMyTasksDraft.setIsScoreN('Y');
                                    }
                                    if (licenseMyTasksDraft.rejectBtnClick) {
                                        myTasksDraft.setResult('UnSatisfactory');
                                    }
                                    else {
                                        myTasksDraft.setResult(finalResult.action);
                                    }
                                    let count = parseInt(myTasksDraft.count);
                                    count = count + 1;
                                    if (count <= 3 && count >= 1) {
                                        saveDataInDB();
                                        myTasksDraft.setCount(count.toString())
                                    }
                                }
                            }
                            else if (JSON.parse(myTasksDraft.selectedTask).TaskType.toLowerCase().includes('food')) {
                                let flag = false;
                                let questionNo = 0;
                                for (let index = 0; index < modifiedCheckListData.length; index++) {
                                    const element: any = modifiedCheckListData[index];
                                    if (element.Score == 'N' && element.comment == '') {
                                        flag = true;
                                        questionNo = (index + 1);
                                        break;
                                    }
                                    else {
                                        continue;
                                    }
                                }
                                if (flag) {
                                    alert('comment is mandatory for question number ' + questionNo);
                                }
                                else {
                                    let count = parseInt(myTasksDraft.count);
                                    count = count + 1;
                                    if (count <= 3 && count >= 1) {
                                        saveDataInDB();
                                        myTasksDraft.setCount(count.toString())
                                    }
                                }
                            }
                            else {

                                if (context.isArabic) {
                                    let count = parseInt(myTasksDraft.count);
                                    count = count - 1;
                                    if (parseInt(myTasksDraft.count) <= 3 && parseInt(myTasksDraft.count) > 1) {
                                        myTasksDraft.setCount(count.toString())
                                    }
                                }
                                else {

                                    let count = parseInt(myTasksDraft.count);
                                    count = count + 1;
                                    if (count <= 3 && count >= 1) {
                                        let finalresult: any = scoreCalculations(modifiedCheckListData, inspectionDetails)
                                        myTasksDraft.setResult(finalresult.action)
                                        myTasksDraft.setCount(count.toString())
                                        saveDataInDB();
                                    }
                                }
                            }
                        }}
                        style={{ flex: 0.5, backgroundColor: '#abcfbe', justifyContent: 'center', borderTopRightRadius: 18, borderBottomRightRadius: 18 }}
                        disabled={bottomBarDraft.profileClick}
                    >
                        {
                            bottomBarDraft.profileClick ?
                                null
                                :
                                <Image style={{ alignSelf: 'center' }} source={require('./../assets/images/startInspection/arrow.png')} />
                        }

                    </TouchableOpacity>

                </View>

                <View style={{ flex: 0.2 }} />

                <View style={{ flex: 7, width: '85%', alignSelf: 'center' }}>
                    {parseInt(myTasksDraft.count) == 1 ?
                        sendModifiedCheckListData.length ?
                            <ChecklistComponentStepOne
                                ref={checklistComponentStepOneRef}
                                DocumentationAndRecordComponent={onRegulationClick}
                                onClickScoreListItem={(item: any) => { onClickScoreListItem(item) }}
                                updateGraceValue={(item: any) => { updateGraceValue(item) }}
                                updateCommentValue={(item: any) => { updateCommentValue(item) }}
                                modifiedCheckListData={sendModifiedCheckListData}
                            />
                            :
                            <TextComponent textStyle={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold', textAlign: 'center' }} label={Strings[context.isArabic ? 'ar' : 'en'].startInspection.checklistNotAvailable} />
                        :
                        parseInt(myTasksDraft.count) == 2 ?
                            //  Strings[context.isArabic ? 'ar' : 'en'].startInspection.submission}</Text>
                            <DocumentationAndRecordComponent isArabic={context.isArabic} submit={submitButtonPress} />
                            :
                            parseInt(myTasksDraft.count) == 3 ?
                                <SubmissionComponent submitButtonPress={submitButtonPress} isArabic={context.isArabic} /> : null
                    }
                </View>

                {
                    bottomBarDraft.profileClick ?
                        null
                        :
                        <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', alignItems: 'center' }}>

                            <View style={{ flex: 0.1 }} />

                            {parseInt(myTasksDraft.count) > 1 ?

                                <View style={{ flexDirection: 'row', flex: 1, height: '80%', alignItems: 'flex-start', justifyContent: 'flex-start' }}>

                                    <ButtonComponent
                                        style={{
                                            height: '100%', width: parseInt(myTasksDraft.count) <= 3 ? '30%' : '18%', backgroundColor: fontColor.ButtonBoxColor,
                                            borderRadius: 40, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                            textAlign: 'center'
                                        }}
                                        isArabic={context.isArabic}
                                        buttonClick={() => {
                                            if (context.isArabic) {
                                                let count = parseInt(myTasksDraft.count);
                                                count = count + 1;
                                                if (JSON.parse(myTasksDraft.selectedTask).TaskType.toLowerCase() == 'complaints') {
                                                    if (scoreArray.length <= 0) {
                                                        Alert.alert('Enter Score For Atlest One Question');
                                                    }
                                                    else {
                                                        if (count <= 3 && count >= 1) {
                                                            let finalresult: any = scoreCalculations(modifiedCheckListData, inspectionDetails)
                                                            myTasksDraft.setResult(finalresult.action)
                                                            myTasksDraft.setCount(count.toString())
                                                            saveDataInDB();
                                                        }
                                                    }
                                                }
                                            } else {
                                                let count = parseInt(myTasksDraft.count);
                                                count = count - 1;
                                                if (parseInt(myTasksDraft.count) <= 3 && parseInt(myTasksDraft.count) > 1) {
                                                    myTasksDraft.setCount(count.toString())
                                                    saveDataInDB();
                                                }
                                            }
                                        }}
                                        imageStyle={{ right: 3, height: '42%', width: '42%', alignSelf: 'center', transform: [{ rotate: '180deg' }] }}
                                        textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                                        buttonText={(Strings[context.isArabic ? 'ar' : 'en'].startInspection.back)}
                                        image={require('./../assets/images/startInspection/rightIcon32.png')}

                                    />

                                </View>
                                : <View style={{ flexDirection: 'row', flex: 1 }} />
                            }
                            <View style={{ flex: 0.1 }} />

                            {parseInt(myTasksDraft.count) < 3 ?

                                <View style={{ flexDirection: 'row', flex: 1, height: '80%', alignItems: 'flex-end', justifyContent: 'flex-end' }}>

                                    <ButtonComponent
                                        style={{
                                            height: '100%', width: parseInt(myTasksDraft.count) >= 1 ? '30%' : '17%', backgroundColor: fontColor.ButtonBoxColor,
                                            borderRadius: 40, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                            textAlign: 'center'
                                        }}
                                        isArabic={context.isArabic}
                                        buttonClick={() => {
                                            if (JSON.parse(myTasksDraft.selectedTask).TaskType.toLowerCase().includes('noc')) {
                                                let flag = false;
                                                let flagNo = false;
                                                let scoreflag = false;
                                                let naFlag = false;
                                                let questionNo = 0;
                                                for (let index = 0; index < modifiedCheckListData.length; index++) {
                                                    const element: any = modifiedCheckListData[index];
                                                    if (element.Score == 'N' && element.comment == '') {
                                                        flag = true;
                                                        questionNo = (index + 1);
                                                        break;
                                                    } 
                                                    if (element.Score == 'N') {
                                                        flagNo = true;
                                                    }
                                                    if (element.NAValue == 'Y') {
                                                        naFlag = true;
                                                    }
                                                    else if (element.Score == '' && element.NAValue == '') {
                                                        scoreflag = true;
                                                        questionNo = (index + 1);
                                                        break;
                                                    }
                                                    else {
                                                        continue;
                                                    }
                                                }
                                                if (flag) {
                                                    alert('comment is mandatory for question number ' + questionNo);
                                                }
                                                else if (scoreflag) {
                                                    alert('Score is mandatory for question number ' + questionNo);
                                                }
                                                else {
                                                    debugger;
                                                    // if (naFlag && !flagNo) {
                                                    //     licenseMyTasksDraft.setIsScoreN('N');
                                                    // }
                                                    // else  if (!naFlag && flagNo) {
                                                    //     licenseMyTasksDraft.setIsScoreN('Y');
                                                    // }
                                                    // else {
                                                    //     licenseMyTasksDraft.setIsScoreN('Y');
                                                    // }
                                                    let finalResult = scoreCalculations(modifiedCheckListData, inspectionDetails);
                                                    if (finalResult.action.toLowerCase() == 'satisfactory') {
                                                        licenseMyTasksDraft.setIsScoreN('N');
                                                    }
                                                    else {
                                                        licenseMyTasksDraft.setIsScoreN('Y');
                                                    }

                                                    debugger;
                                                    if (licenseMyTasksDraft.rejectBtnClick) {
                                                        myTasksDraft.setResult('UnSatisfactory');
                                                    }
                                                    else {
                                                        myTasksDraft.setResult(finalResult.action);
                                                    }
                                                    let count = parseInt(myTasksDraft.count);
                                                    count = count + 1;
                                                    if (count <= 3 && count >= 1) {
                                                        saveDataInDB();
                                                        myTasksDraft.setCount(count.toString())
                                                    }
                                                }
                                            }
                                            else if (JSON.parse(myTasksDraft.selectedTask).TaskType.toLowerCase().includes('food')) {
                                                let flag = false;
                                                let questionNo = 0;
                                                for (let index = 0; index < modifiedCheckListData.length; index++) {
                                                    const element: any = modifiedCheckListData[index];
                                                    if (element.Score == 'N' && element.comment == '') {
                                                        flag = true;
                                                        questionNo = (index + 1);
                                                        break;
                                                    }
                                                    else {
                                                        continue;
                                                    }
                                                }
                                                if (flag) {
                                                    alert('comment is mandatory for question number ' + questionNo);
                                                }
                                                else {
                                                    let count = parseInt(myTasksDraft.count);
                                                    count = count + 1;
                                                    if (count <= 3 && count >= 1) {
                                                        saveDataInDB();
                                                        myTasksDraft.setCount(count.toString())
                                                    }
                                                }
                                            }
                                            else {
                
                                                if (context.isArabic) {
                                                    let count = parseInt(myTasksDraft.count);
                                                    count = count - 1;
                                                    if (parseInt(myTasksDraft.count) <= 3 && parseInt(myTasksDraft.count) > 1) {
                                                        myTasksDraft.setCount(count.toString())
                                                    }
                                                }
                                                else {
                
                                                    let count = parseInt(myTasksDraft.count);
                                                    count = count + 1;
                                                    if (count <= 3 && count >= 1) {
                                                        let finalresult: any = scoreCalculations(modifiedCheckListData, inspectionDetails)
                                                        myTasksDraft.setResult(finalresult.action)
                                                        myTasksDraft.setCount(count.toString())
                                                        saveDataInDB();
                                                    }
                                                }
                                            }
                                        }}
                                        imageStyle={{ left: 3, height: '42%', width: '42%', alignSelf: 'center' }}
                                        textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                                        image={require('./../assets/images/startInspection/rightIcon32.png')}
                                    />

                                </View>
                                : <View style={{ flexDirection: 'row', flex: 1 }} />
                            }
                            <View style={{ flex: 0.1 }} />

                        </View>
                }

                <BottomComponent isArabic={context.isArabic} />

            </ImageBackground>

        </SafeAreaView >
    )
}


export default observer(StartInspection);

const styles = StyleSheet.create({
    diamondView: {
        width: 45,
        height: 45,
        transform: [{ rotate: '45deg' }]
    },
    menuOptions: {
        padding: 10,
    },
    menuTrigger: {
        padding: 5,
    }
});