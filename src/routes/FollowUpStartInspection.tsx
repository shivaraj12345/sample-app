import React, { useContext, useState, useEffect } from 'react';
import { Image, View, StyleSheet, SafeAreaView, TouchableOpacity, Text, ImageBackground, Dimensions, ScrollView, Alert, PermissionsAndroid, ToastAndroid, BackHandler, Platform, TextInput } from "react-native";
import { useIsFocused } from '@react-navigation/native';
import ImagePicker from 'react-native-image-picker';
import NavigationService from '../services/NavigationService';
import Header from './../components/Header';
import BottomComponent from './../components/BottomComponent';
import FollowUpComponent from './../components/FollowUpComponent';
import FollowUpDocumentationComponent from './../components/FollowUpDocumentationComponent';
import FollowUpSubmissionComponent from './../components/FollowUpSubmissionComponent';
import { observer } from 'mobx-react';
import { Context } from '../utils/Context';
import submissionPayload from '../utils/payloads/ChecklistSubmitPayload'
import { RootStoreModel } from '../store/rootStore';
import Strings from '../config/strings';
import { fontFamily, fontColor } from '../config/config';
import useInject from "../hooks/useInject";
import { RealmController } from '../database/RealmController';
import CheckListSchema from './../database/CheckListSchema';
import LoginSchema from './../database/LoginSchema';
let realm = RealmController.getRealmInstance();
import TaskSchema from '../database/TaskSchema';
import {
    Menu,
    MenuProvider,
    MenuOptions,
    MenuTrigger,
    renderers,
} from 'react-native-popup-menu';
const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;
let moment = require('moment');
const { Popover } = renderers

let estSelectedItem: any = {}

const FollowUpStartInspection = (props: any) => {

    const context = useContext(Context);
    let startTime: any = '';
    let timeStarted: any = '';
    let timeElapsed: any = '';
    const mapStore = (rootStore: RootStoreModel) => ({ licenseMyTasksDraft: rootStore.licenseMyTaskModel, myTasksDraft: rootStore.myTasksModel, adhocTaskEstablishmentDraft: rootStore.adhocTaskEstablishmentModel ,establishmentDraft: rootStore.establishmentModel })
    const { licenseMyTasksDraft, myTasksDraft, adhocTaskEstablishmentDraft,establishmentDraft } = useInject(mapStore)

    const [modifiedCheckListData, setModifiedCheckListData] = useState([]);
    const [sendModifiedCheckListData, setSendModifiedCheckListData] = useState([]);
    const [inspectionDetails, setInspectionDetails] = useState(Object());

    // individual section and index for checklist
    const [currentSection, setCurrentSection] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [scoreArray, setScoreArray] = useState([]);
    const [count, setCount] = useState(1);

    // alert components variables
    const [showCommentAlert, setShowCommentAlert] = useState(false);
    const [isCalculated, setIsCalculated] = useState(false);
    const [showScoreAlert, setShowScoreAlert] = useState(false);
    const [showGraceAlert, setShowGraceAlert] = useState(false);
    const [showInformationAlert, setShowInformationAlert] = useState(false);
    const [showRegulationAlert, setShowRegulationAlert] = useState(false);
    const [showAttachmentAlert, setShowAttachmentAlert] = useState(false);

    // regulation array of checklist
    const [regulationString, setRegulationString] = useState('');

    const [base64One, setBase64One] = useState('');
    const [base64Two, setBase64two] = useState('');

    const [commentErrorIndex, setCommentErrorIndex] = useState(0);
    const [errorGraceAlert, setErrorGraceAlert] = useState(false);
    const [errorCommentAlert, setErrorCommentAlert] = useState(false);
    const [graceErrorIndex, setGraceErrorIndex] = useState(0);
    const [graceErrorSectionTitle, setGraceErrorSectionTtile] = useState('');
    const [commentErrorSectionTitle, setCommentErrorSectionTtile] = useState('');
    const [finalTime, setFinalTime] = useState('00:00:00');

    const [comment, setComment] = useState('');
    const [grace, setGrace] = useState('');
    const [score, setScore] = useState('');
    const [info, setInfo] = useState('');
    const [attachment, setAttachment] = useState('');

    const backButtonHandler: any = () => {

        setTimeout(() => {

            let timeElapsed = new Date();

            let obj: any = {};
            obj.checkList = JSON.stringify(modifiedCheckListData);
            obj.taskId = props.selectedTaskId;
            obj.timeElapsed = timeElapsed.toString();
            obj.timeStarted = startTime.toString();

            RealmController.addCheckListInDB(realm, obj, function dataWrite(params: any) {
                // props.updateLoding(false);
            });

        }, 2000)

    }
    if (myTasksDraft.state === 'navigate') {
        NavigationService.navigate('Dashboard');
    }

    useEffect(() => {
        myTasksDraft.setCount("1");
        let objct = RealmController.getTaskIsAck(realm, TaskSchema.name, myTasksDraft.taskId);

        let inspection = myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask) : {}
        // alert(JSON.stringify(inspection.mappingData))
        setInspectionDetails(objct['0']);
        estSelectedItem = adhocTaskEstablishmentDraft.getSelectedItem() != '' ? JSON.parse(adhocTaskEstablishmentDraft.getSelectedItem()) : {};
    }, []);

    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", backButtonHandler);
        return () => {
            BackHandler.removeEventListener("hardwareBackPress", backButtonHandler);
        };
    }, [backButtonHandler]);




    useEffect(() => {

        // if (myTasksDraft.selectedTask != '' && myTasksDraft.selectedTask.length > 0) {

        // let taskId = JSON.parse(myTasksDraft.selectedTask).TaskId;
        // let checkListData = RealmController.getCheckListForTaskId(realm, CheckListSchema.name, taskId);
        // debugger;
        // if (checkListData && checkListData['0'] && checkListData['0'].checkList && JSON.parse(checkListData[0].checkList).length) {
        //     let tempData = JSON.parse(checkListData[0].checkList);
        //     debugger;
        //     if (tempData && tempData.length > 0) {

        //         setModifiedCheckListData(tempData);
        //         if (taskDetails.mappingData && taskDetails.mappingData[0].inspectionForm) {
        //             taskDetails.mappingData[0].inspectionForm = tempData;
        //         }
        //         setSendModifiedCheckListData(tempData);
        //     }
        // }
        // else {

        //     let tempModifiedCheckListData: any = [];
        debugger;

        let taskType = JSON.parse(myTasksDraft.selectedTask).TaskType;
        let temp: any = Array();
        if ((taskType.toLowerCase() == "noc inspection_ara" || taskType.toLowerCase() == "noc inspection" || taskType.toLowerCase() == "temporary noc inspection" || taskType == 'تفتيش ترخيص' || taskType == 'تفتيش ترخيص مؤقت')) {
            temp = licenseMyTasksDraft.checkListArray != '' ? JSON.parse(licenseMyTasksDraft.checkListArray) : [];
            setModifiedCheckListData(temp);
            setSendModifiedCheckListData(temp);
        }
        else {
            temp = myTasksDraft.checkListArray != '' ? JSON.parse(myTasksDraft.checkListArray) : [];
        }

        let objct = RealmController.getTaskIsAck(realm, TaskSchema.name, myTasksDraft.taskId);

        let inspectionDetails = objct['0'] ? objct['0'] : JSON.parse(myTasksDraft.selectedTask)
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
            setSendModifiedCheckListData(temp);
        }
        else {
            // myTasksDraft.setState('pending')
        }
        // }
        // }
    }, [myTasksDraft.checkListArray, licenseMyTasksDraft.checkListArray]);//myTasksDraft.checkListArray


    setInterval(() => {
        if (modifiedCheckListData.length) {
            let tempArray: any = [...modifiedCheckListData], taskDetails = { ...inspectionDetails };
            debugger
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
    }, 30000)




    useEffect(() => {
        if (myTasksDraft.selectedTask != '') {

            let taskId = JSON.parse(myTasksDraft.selectedTask).TaskId;
            let checkListData = RealmController.getCheckListForTaskId(realm, CheckListSchema.name, taskId);
            //  debugger;
            if (checkListData && checkListData['0'] && checkListData['0'].checkList && JSON.parse(checkListData[0].checkList).length) {
                let tempData = JSON.parse(checkListData[0].checkList);

                //  debugger;
                if (tempData && tempData.length > 0) {
                    setModifiedCheckListData(tempData);
                    setSendModifiedCheckListData(tempData);
                }
                console.log("Inside if start follow", JSON.stringify(tempData))

            }
            else {
                console.log("inside elde start foll")
                let tempModifiedCheckListData: any = [];
                let temp: any = myTasksDraft.checkListArray != '' ? JSON.parse(myTasksDraft.checkListArray) : [];
                debugger
                // let temp: any = [];
                if (temp && temp.length > 0) {
                    console.log("Temo lenghth", temp.length);

                    setModifiedCheckListData(temp);
                    setSendModifiedCheckListData(temp);
                    console.log("Inside else start follow", JSON.stringify(temp))

                }
            }
        }
    }, []);


    const displayCounter = () => {
        let timerCounter = setInterval(() => {
            let diff = Math.abs(new Date().valueOf() - startTime);
            setFinalTime(finalTime => msToTime(diff))
        }, 1000);
    }

    const msToTime = (duration: any) => {

        let milliseconds = (parseInt(duration) % 1000) / 100;
        let seconds = Math.round((parseInt(duration) / 1000) % 60);
        let minutes = Math.round((parseInt(duration) / (1000 * 60)) % 60);
        let hours = Math.round((parseInt(duration) / (1000 * 60 * 60)) % 24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return hours + ":" + minutes + ":" + seconds;

    }

    const onRegulationClick = (item: any) => {
        //  debugger
        let tempArray: any = [...modifiedCheckListData];
        console.log("tempArray", tempArray);
        let header = item.parameterno;
        console.log("header", header);
        let sectionIndex = tempArray.findIndex((item: any) => item.parameterno == header);
        console.log("sectionIndex ", sectionIndex);
        // debugger

        // set current item and index 
        setCurrentSection(sectionIndex);
        setCurrentIndex(sectionIndex);

        let regulationArray = tempArray[sectionIndex].regulation;
        console.log("regulationArray", regulationArray);
        let tempRegulationString = '';
        if (regulationArray && regulationArray.length > 0) {
            for (let index = 0; index < regulationArray.length; index++) {
                // debugger
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

    // useEffect(() => {
    //     let checkListData = RealmController.getCheckListForTaskId(realm, CheckListSchema.name, props.selectedTaskId);
    //     // debugger;
    //     if (checkListData && checkListData['0'] && checkListData['0'].timeElapsed) {
    //         timeStarted = checkListData['0'].timeStarted;
    //         timeElapsed = checkListData['0'].timeElapsed;
    //         let temp, time;
    //         if (timeStarted) {
    //             temp = new Date(timeStarted).getTime();
    //             time = new Date(timeElapsed).getTime() - temp;
    //         } else {
    //             temp = new Date().getTime();
    //             time = temp - new Date(timeElapsed).getTime();
    //         }
    //         startTime = moment().subtract(parseInt(time / 1000), 'seconds').toDate();
    //     } else {
    //         startTime = new Date();
    //     }
    //     displayCounter();
    // }, []);


    const onClickScoreListItem = (item: any) => {
        setShowScoreAlert(false);

        let tempArray: any = [...modifiedCheckListData];
        // debugger;
        console.log("tempArray", tempArray);
        tempArray = tempArray.map((u: any) => u.parameterno !== item.parameterno ? u : item);
        // setComment(tempArray[currentSection].comment);
        setModifiedCheckListData(tempArray);
    }

    const updateGraceValue = (item: any) => {
        let tempArray: any = [...modifiedCheckListData];

        tempArray = tempArray.map((u: any) => u.parameterno !== item.parameterno ? u : item);
        console.log("tempArray", tempArray);
        setModifiedCheckListData(tempArray);
    }

    const updateCommentValue = (item: any) => {
        let tempArray: any = [...modifiedCheckListData];

        tempArray = tempArray.map((u: any) => u.parameterno !== item.parameterno ? u : item);
        setModifiedCheckListData(tempArray);
    }

    const backPress = () => {
        // props.updateLoding(true);

        setTimeout(() => {
            let timeElapsed = new Date();

            let obj: any = {};
            obj.checkList = JSON.stringify(modifiedCheckListData);
            obj.taskId = props.selectedTaskId;
            obj.timeElapsed = timeElapsed.toString();
            obj.timeStarted = startTime.toString();
            // debugger;
            RealmController.addCheckListInDB(realm, obj, function dataWrite(params: any) {
                // props.updateLoding(false);
                myTasksDraft.setCount("1");
                NavigationService.goBack();
            });

        }, 2000)

    }


    const isScoreCalculated = () => {
        console.log("checked in follow page")
        setIsCalculated(true);
    }

    const submitButtonPress = async () => {
        // props.updateCheckList(modifiedCheckListData);
        // NavigationService.navigate('SubmitInspectionScreen');
        let TaskItem = myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask) : '';
        let loginData = RealmController.getLoginData(realm, LoginSchema.name);
        loginData = loginData[0] ? loginData[0] : {};

        let taskDetails = { ...inspectionDetails };
        let tempArray = [...modifiedCheckListData];
        let scoreFollowArray = myTasksDraft.getScoreFollow();
        console.log("ScoreFollow QArray", scoreFollowArray);


        if (myTasksDraft.mobileNumber == "") {
            Alert.alert("Please enter mobile number");
            return;
        }

        if (myTasksDraft.emiratesId == "") {
            Alert.alert("Please enter emirates ID");
            return;
        }

        if (myTasksDraft.contactName == "") {
            Alert.alert("Please enter contact name");
            return;
        }


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

        let payload: any = await submissionPayload(scoreFollowArray, taskDetails, tempArray, TaskItem.TaskId, TaskItem, loginData.username, myTasksDraft.contactName, myTasksDraft.mobileNumber, myTasksDraft.emiratesId, finalTime, myTasksDraft.finalComment, myTasksDraft.result);
        console.log("taskDetails ", taskDetails);

        console.log("Payload follow", payload)

        // let objct = RealmController.getTaskIsAck(realm, TaskSchema.name, myTasksDraft.taskId);
        debugger;

        if (taskDetails && taskDetails.mappingData && payload.InspectionCheckList && payload.InspectionCheckList.Inspection && payload.InspectionCheckList.Inspection.Score) {
            let tempdata = taskDetails
            let tempObjct = tempdata.mappingData ? tempdata.mappingData : [{}]

            tempObjct.total_score = payload.InspectionCheckList.Inspection.Score;
            // delete tempdata.mappingData;
            tempdata.mappingData = tempObjct;

            RealmController.addTaskDetails(realm, tempdata, TaskSchema.name, () => {
                // ToastAndroid.show('Task objct successfully ', 1000);
            });

        }
        debugger;
        myTasksDraft.callToSubmitTaskApi(payload);

    }

    return (
        <SafeAreaView style={{ flex: 1 }}>

            <ImageBackground style={{ height: HEIGHT, width: WIDTH }} source={context.isArabic ? require('./../assets/images/backgroundimgReverse.jpg') : require('./../assets/images/backgroundimg.jpg')}>

                <View style={{ flex: 1.5, alignSelf: 'center', width: '90%' }}>
                    <Header isArabic={context.isArabic} />
                </View>

                <View style={{ flex: 1 }}>

                    <View style={{ flex: 1, flexDirection: 'row', width: '80%', alignSelf: 'center' }}>

                        <View style={{ flex: 1.1 }}>
                            <View style={{ flex: 0.5, borderBottomColor: '#5C666F', borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                        <View style={{ flex: 0.8, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: '#5C666F', fontSize: 14, fontWeight: 'bold' }}>{Strings[context.isArabic ? 'ar' : 'en'].scheduled.followUp}</Text>
                        </View>

                        <View style={{ flex: 1.1 }}>
                            <View style={{ flex: 0.5, borderBottomColor: '#5C666F', borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                    </View>

                </View>
{/* 
                <View style={{ flex: 0.5, flexDirection: context.isArabic ? 'row-reverse' : 'row', width: '85%', justifyContent: 'center', alignSelf: 'center', borderWidth: 1, borderRadius: 18, borderColor: '#abcfbf' }}>

                   

                    <View style={{ flex: 1.2, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold' }}>{myTasksDraft.taskId ? myTasksDraft.taskId : '-'}</Text>
                    </View>

                    <View style={{ flex: 0.008, height: '50%', alignSelf: 'center', borderWidth: 0.2, borderColor: '#5C666F' }} />

                    <View style={{ flex: 0.7, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold', textAlign: context.isArabic ? 'right' : 'left' }}>{'Lulu 01'}</Text>
                    </View>

                    <View style={{ flex: 0.3 }} />

                </View> */}


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

                            if (myTasksDraft.isMyTaskClick == 'license' || myTasksDraft.isMyTaskClick == 'tempPermit') {
                                if (context.isArabic) {
                                    let count = parseInt(myTasksDraft.count);
                                    count = count + 1;
                                    if (count <= 2 && count >= 1) {
                                        myTasksDraft.setCount(count.toString())
                                    }
                                } else {
                                    let count = parseInt(myTasksDraft.count);
                                    count = count - 1;
                                    if (parseInt(myTasksDraft.count) <= 2 && parseInt(myTasksDraft.count) > 1) {
                                        myTasksDraft.setCount(count.toString())
                                    }
                                }
                            }
                            else {
                                if (context.isArabic) {
                                    let count = parseInt(myTasksDraft.count);
                                    count = count + 1;
                                    if (count <= 3 && count >= 1) {
                                        myTasksDraft.setCount(count.toString())
                                    }
                                } else {
                                    let count = parseInt(myTasksDraft.count);
                                    count = count - 1;
                                    if (parseInt(myTasksDraft.count) <= 3 && parseInt(myTasksDraft.count) > 1) {
                                        myTasksDraft.setCount(count.toString())
                                    }
                                }
                            }
                        }}
                        style={{ flex: 0.5, backgroundColor: '#abcfbe', justifyContent: 'center', borderTopLeftRadius: 18, borderBottomLeftRadius: 18 }} >
                        <Image style={{ alignSelf: 'center', transform: [{ rotate: '180deg' }] }} source={require('./../assets/images/startInspection/arrow.png')} />
                    </TouchableOpacity>

                    <View style={{ flex: 3, alignItems: 'center', justifyContent: 'center', backgroundColor: '#c4ddd2' }}>
                        <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold', textAlign: 'right' }}>{parseInt(myTasksDraft.count) == 1 ? Strings[context.isArabic ? 'ar' : 'en'].startInspection.checklist :
                            parseInt(myTasksDraft.count) == 2 ? Strings[context.isArabic ? 'ar' : 'en'].startInspection.documentation :
                                Strings[context.isArabic ? 'ar' : 'en'].startInspection.submission}</Text>

                    </View>

                    <TouchableOpacity
                        onPress={() => {




                            if (myTasksDraft.isMyTaskClick == 'license' || myTasksDraft.isMyTaskClick == 'tempPermit') {

                                if (context.isArabic) {
                                    let count = parseInt(myTasksDraft.count);
                                    count = count - 1;
                                    if (parseInt(myTasksDraft.count) < 2 && parseInt(myTasksDraft.count) > 1) {
                                        myTasksDraft.setCount(count.toString())
                                    }
                                }
                                else {
                                    let count = parseInt(myTasksDraft.count);
                                    count = count + 1;
                                    if (count <= 2 && count >= 1) {
                                        myTasksDraft.setCount(count.toString())
                                    }
                                }
                            }
                            else {

                                if (parseInt(myTasksDraft.count) == 1 && isCalculated) {
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
                                            myTasksDraft.setCount(count.toString())
                                        }
                                    }
    
                                } 
                                
                                else if(parseInt(myTasksDraft.count) == 1 && !isCalculated){
                                    Alert.alert("Please submit the checklist");
                                    return;
                                }
                                else  {
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
                                            myTasksDraft.setCount(count.toString())
                                        }
                                    }
                                }


                            
                            }


      
                        }}
                        style={{ flex: 0.5, backgroundColor: '#abcfbe', justifyContent: 'center', borderTopRightRadius: 18, borderBottomRightRadius: 18 }} >
                        <Image style={{ alignSelf: 'center' }} source={require('./../assets/images/startInspection/arrow.png')} />
                    </TouchableOpacity>

                </View>

                <View style={{ flex: 0.2 }} />

                <View style={{ flex: 7, width: '85%', alignSelf: 'center' }}>
                    {


                        parseInt(myTasksDraft.count) == 1 ?
                            sendModifiedCheckListData && sendModifiedCheckListData.length ?


                                <FollowUpComponent
                                    //     DocumentationAndRecordComponent={onRegulationClick}
                                    //    onClickScoreListItem ={(item: any) => { onClickScoreListItem(item) }}
                                    //    updateGraceValue={(item: any) => { updateGraceValue(item) }}
                                    modifiedCheckListData={sendModifiedCheckListData}
                                    inspDetails={inspectionDetails}
                                    isArabic={context.isArabic}
                                    isScoreCalculated={isScoreCalculated}
                                />

                                : null

                            :
                            parseInt(myTasksDraft.count) == 2 ?
                              
                                    <FollowUpDocumentationComponent isArabic={context.isArabic} />
                                   
                                :
                                parseInt(myTasksDraft.count) == 3 ?
                                    <FollowUpSubmissionComponent submitButtonPress={submitButtonPress} isArabic={context.isArabic} /> : null
                    }
                </View>

                <BottomComponent isArabic={context.isArabic} />

            </ImageBackground>

        </SafeAreaView >
    )
}


export default observer(FollowUpStartInspection);

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