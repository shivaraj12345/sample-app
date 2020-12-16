import React, { useContext, useState, useEffect } from 'react';
import { Image, View, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView, Text, ImageBackground, Dimensions, ToastAndroid, PermissionsAndroid, Platform, Alert } from "react-native";
import Header from './../components/Header';
import BottomComponent from './../components/BottomComponent';
import ButtonComponent from './../components/ButtonComponent';
import TextInputComponent from './../components/TextInputComponent';
const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;
import { fontFamily, fontColor } from '../config/config';
import Strings from './../config/strings';
import { observer } from 'mobx-react';
import { Context } from '../utils/Context';
import KeyValueComponent from './../components/KeyValueComponent';
import NavigationService from '../services/NavigationService';
import AccordionComponent from '../components/AccordionComponent';
import { RealmController } from '../database/RealmController';
let realm = RealmController.getRealmInstance();
import { RootStoreModel } from '../store/rootStore';
import useInject from "../hooks/useInject";
import moment from 'moment';
import CheckListSchema from '../database/CheckListSchema';
import AlertComponentForError from '../components/AlertComponentForError';
import AlertComponentForComment from './AlertComponentForComment';
import AlertComponentForGrace from './AlertComponentForGrace';
import AlertComponentForInformation from '../components/AlertComponentForError';
import AlertComponentForScore from './AlertComponentForScore';
import AlertComponentForRegulation from './AlertComponentForRegulation';
import AlertComponentForAttachment from './AlertComponentForAttachment';
import ImagePicker from 'react-native-image-picker';
import ChecklisConponentFrNOC from './../components/ChecklisConponentFrNOC';

const ChecklistComponentStepOne = (props: any) => {

    const context = useContext(Context);
    const [modifiedCheckListData, setModifiedCheckListData] = useState(Array());
    let startTime: any = '';
    let timeStarted: any = '';
    let timeElapsed: any = '';

    const mapStore = (rootStore: RootStoreModel) => ({ myTasksDraft: rootStore.myTasksModel, bottomBarDraft: rootStore.bottomBarModel })
    const { myTasksDraft, bottomBarDraft } = useInject(mapStore)

    // individual section and index for checklist
    const [currentSection, setCurrentSection] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [scoreArray, setScoreArray] = useState(Array());

    // alert alert components variables
    const [showCommentAlert, setShowCommentAlert] = useState(false);
    const [showScoreAlert, setShowScoreAlert] = useState(false);
    const [showGraceAlert, setShowGraceAlert] = useState(false);
    const [showInformationAlert, setShowInformationAlert] = useState(false);
    const [showRegulationAlert, setShowRegulationAlert] = useState(false);
    const [showAttachmentAlert, setShowAttachmentAlert] = useState(false);
    const [showDescAlert, setShowDescAlert] = useState(false);

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

    useEffect(() => {

        let tempModifiedCheckListData: any = [];
        let temp: any = props.modifiedCheckListData ? props.modifiedCheckListData : [];
        debugger;
        if (JSON.parse(myTasksDraft.selectedTask).TaskType.toLowerCase().includes('noc') || JSON.parse(myTasksDraft.selectedTask).TaskType.toLowerCase().includes('food')) {
            setModifiedCheckListData(temp);
        }
        else {

            if (temp && temp.length > 0) {

                let result = Array.from(new Set(temp.map((item: any) => item.parameter_type)))
                    .map(parameter_type => {
                        return { parameter_type: parameter_type };
                    });

                for (let i = 0; i < result.length; i++) {
                    let dataArray = [];
                    for (let j = 0; j < temp.length; j++) {
                        let element: any = temp[j];
                        debugger
                        if (element.parameter_type == result[i].parameter_type) {
                            let obj: any = element;
                            if (element.parameter_type === 'EHS') {
                                obj.naNiDisableForEHS = true;
                                obj.informationDisableForEHS = true;
                            }
                            dataArray.push(obj);
                        }
                    }

                    tempModifiedCheckListData.push({
                        'title': result[i].parameter_type,
                        'data': dataArray
                    })
                }
                debugger;
                setModifiedCheckListData(tempModifiedCheckListData);
            }

        }

    }, [props.modifiedCheckListData]);

    const displayCounter = () => {
        let timerCounter = setInterval(() => {
            let diff = Math.abs(new Date().valueOf() - startTime);
            setFinalTime(finalTime => msToTime(diff))
        }, 1000);
    }

    const msToTime = (duration: any) => {

        let milliseconds = (parseFloat(duration) % 1000) / 100;
        let seconds = (parseFloat(duration) / 1000) % 60;
        let minutes = (parseFloat(duration) / (1000 * 60)) % 60;
        let hours = (parseFloat(duration) / (1000 * 60 * 60)) % 24;

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return hours + ":" + minutes + ":" + seconds;
    }

    const onRegulationClick = (item: any, index: any) => {
        let tempArray: any = [...modifiedCheckListData];

        let header = item.parameter_type;
        let sectionIndex = tempArray.findIndex((item: any) => item.title == header);

        // set current item and index 
        setCurrentSection(sectionIndex);
        setCurrentIndex(index);

        let regulationArray = tempArray[sectionIndex].data[index].regulation;
        let tempRegulationString = '';
        if (regulationArray && regulationArray.length > 0) {
            for (let index = 0; index < regulationArray.length; index++) {
                if (index === 0) {
                    tempRegulationString = regulationArray[index];
                }
                if (index === 1) {
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
        setShowAttachmentAlert(false);
    }

    useEffect(() => {
        let checkListData = RealmController.getCheckListForTaskId(realm, CheckListSchema.name, myTasksDraft.taskId);
        debugger;
        if (checkListData && checkListData['0'] && checkListData['0'].timeElapsed) {
            timeStarted = checkListData['0'].timeStarted;
            timeElapsed = checkListData['0'].timeElapsed;
            let temp, time;
            if (timeStarted) {
                temp = new Date(timeStarted).getTime();
                time = new Date(timeElapsed).getTime() - temp;
            } else {
                temp = new Date().getTime();
                time = temp - new Date(timeElapsed).getTime();
            }
            startTime = moment().subtract(parseInt(time / 1000), 'seconds').toDate();
        } else {
            startTime = new Date();
        }
        displayCounter();
    }, []);

    const onClickScoreListItem = (item: any, index: any) => {

        setShowScoreAlert(false);

        let tempArray: any = [...modifiedCheckListData];

        tempArray[currentSection].data[currentIndex].Answers = Math.round(item.score); // selected score will go in Answers and socre * weighted will go into score

        if (tempArray[currentSection].data[currentIndex].parameter_EHS == 'true') {
            tempArray[currentSection].data[currentIndex].comment = item.description.replace(/[$~"?<>{}]/g, ' ');
        }
        else {
            tempArray[currentSection].data[currentIndex].comment = item.nonCompliance.replace(/[$~"?<>{}]/g, ' ');
        }

        if (tempArray[currentSection].data[currentIndex].parameter_EHS == 'true') {
            if (item.score == 0) {
                tempArray[currentSection].data[currentIndex].grace = 7;
            } else if (item.score == 1) {
                tempArray[currentSection].data[currentIndex].grace = 7;
            }
        } else if (myTasksDraft.isMyTaskClick == 'campaign') {
            if (item.score == 0) {
                tempArray[currentSection].data[currentIndex].grace = 7;
            } else if (item.score == 1) {
                tempArray[currentSection].data[currentIndex].grace = 15;
            } else if (item.score == 2) {
                tempArray[currentSection].data[currentIndex].grace = 7;
            } else if (item.score == 3) {
                tempArray[currentSection].data[currentIndex].grace = 7;
            } else if (item.score == 4) {
                tempArray[currentSection].data[currentIndex].grace = 0;
            }
        } else {
            if (item.score == 0) {
                tempArray[currentSection].data[currentIndex].grace = 7;
            } else if (item.score == 1) {
                tempArray[currentSection].data[currentIndex].grace = 7;
            } else if (item.score == 2) {
                tempArray[currentSection].data[currentIndex].grace = 15;
            } else if (item.score == 3) {
                tempArray[currentSection].data[currentIndex].grace = 15;
            } else if (item.score == 4) {
                tempArray[currentSection].data[currentIndex].grace = 0;
            }
        }
        debugger;
        let parameter_weight = tempArray[currentSection].data[currentIndex].parameter_weight_mobility != '' ? tempArray[currentSection].data[currentIndex].parameter_weight_mobility : 1
        tempArray[currentSection].data[currentIndex].score = Math.round(item.score) * tempArray[currentSection].data[currentIndex].parameter_weight_mobility;
        tempArray[currentSection].data[currentIndex].Score = Math.round(item.score) * tempArray[currentSection].data[currentIndex].parameter_weight_mobility;
        tempArray[currentSection].data[currentIndex].TotalScoreForQuestion = Math.round(parseInt(item.score)) * parseInt(parameter_weight);
        debugger;

        props.onClickScoreListItem(tempArray[currentSection].data[currentIndex]);
        // setComment(tempArray[currentSection].data[currentIndex].comment);
        setModifiedCheckListData(tempArray);

    }

    const onScoreImageClick = (item: any, index: any) => {
        let tempScoreArray: any = [];

        let tempArray: any = [...modifiedCheckListData];

        if (JSON.parse(myTasksDraft.selectedTask).TaskType.toLowerCase().includes('food')) {
            tempArray[index].Score = item.Score;
            setModifiedCheckListData(tempArray);
        }
        else {
            let header = item.parameter_type;
            let sectionIndex = tempArray.findIndex((item: any) => item.title == header);

            debugger;

            // set current item and index 
            setCurrentSection(sectionIndex);
            setCurrentIndex(index);

            let parameter_score_desc = tempArray[sectionIndex].data[index].parameter_score_desc;
            let parameter_score = tempArray[sectionIndex].data[index].parameter_score;
            let parameter_non_comp_desc = tempArray[sectionIndex].data[index].parameter_non_comp_desc;

            let length = parameter_score_desc.length;
            for (let i = 0; i < length; i++) {
                // alert(tempArray[sectionIndex].data[index].parameter_EHS)
                if (tempArray[sectionIndex].data[index].parameter_EHS == true || tempArray[sectionIndex].data[index].parameter_EHS == 'true') {

                    let obj: any = {}
                    obj.score = (parameter_score[i] || (parameter_score[i] == 0.0) || (parameter_score[i] == 0 / 0)) ? Math.round(parameter_score[i]) : '';
                    obj.description = parameter_score_desc[i] ? parameter_score_desc[i] === 'uncertain' ? '-' : parameter_score_desc[i] : '';
                    obj.nonCompliance = parameter_non_comp_desc[i] ? parameter_non_comp_desc[i] === 'uncertain' ? '-' : parameter_non_comp_desc[i] : '';
                    if ((obj.score == 0) && ((obj.description == '-' || (obj.description == 'NA')))) {
                    }
                    else {
                        tempScoreArray.push(obj);
                    }
                } else {
                    if (parameter_non_comp_desc[i] && (parameter_non_comp_desc[i] == "N/A" || parameter_non_comp_desc[i] == "NA" || parameter_non_comp_desc[i] == "Not Applicable" || parameter_non_comp_desc[i] == "N/ A" || parameter_non_comp_desc[i] == "N /A" || parameter_non_comp_desc[i] == "N / A" || parameter_non_comp_desc[i] == "")) {

                    } else {
                        let obj: any = {}
                        obj.score = (parameter_score[i] || parameter_score[i] == 0 || parameter_score[i] == 0.0) ? Math.round(parameter_score[i]) : '';
                        obj.description = parameter_score_desc[i] ? parameter_score_desc[i] === 'uncertain' ? '-' : parameter_score_desc[i] : '';
                        obj.nonCompliance = parameter_non_comp_desc[i] ? parameter_non_comp_desc[i] === 'uncertain' ? '-' : parameter_non_comp_desc[i] : '';

                        if (obj.score == 0 || obj.score != '') {
                            tempScoreArray.push(obj);
                        }

                    }
                }
            }
            setScoreArray(tempScoreArray);

            setShowScoreAlert(true);
            setShowGraceAlert(false);
            setShowCommentAlert(false);
            setShowInformationAlert(false);
            setShowRegulationAlert(false);
            setShowAttachmentAlert(false);
        }
    }

    const updateGraceValue = (val: any) => {
        let tempArray: any = [...modifiedCheckListData];
        tempArray[currentSection].data[currentIndex].grace = val;
        props.updateGraceValue(tempArray[currentSection].data[currentIndex]);
        setModifiedCheckListData(tempArray);
        setShowAttachmentAlert(false);
    }

    const onGraceImageClick = (item: any, index: any) => {
        let tempArray = [...modifiedCheckListData];

        let header = item.parameter_type;
        let sectionIndex = tempArray.findIndex((item: any) => item.title == header);

        // set current item and index 
        setCurrentSection(sectionIndex);
        setCurrentIndex(index);

        setShowGraceAlert(true);
        setShowCommentAlert(false);
        setShowScoreAlert(false);
        setShowInformationAlert(false);
        setShowRegulationAlert(false);
        setShowAttachmentAlert(false);
    }

    const updateCommentValue = (val: any) => {
        let tempArray: any = [...modifiedCheckListData];
        if (JSON.parse(myTasksDraft.selectedTask).TaskType.toLowerCase().includes('noc') || JSON.parse(myTasksDraft.selectedTask).TaskType.toLowerCase().includes('food')) {
            tempArray[currentSection].comment = val;
        }
        else {
            tempArray[currentSection].data[currentIndex].comment = val;
            props.updateCommentValue(tempArray[currentSection].data[currentIndex]);
        }
        setModifiedCheckListData(tempArray);
    }

    const onCommentImageClick = (item: any, index: any) => {

        let tempArray = [...modifiedCheckListData];
        if (JSON.parse(myTasksDraft.selectedTask).TaskType.toLowerCase().includes('noc') || JSON.parse(myTasksDraft.selectedTask).TaskType.toLowerCase().includes('food')) {
            let tempArray = [...modifiedCheckListData];
            // alert('index ' + index);
            // let header = item.NOC_parameter_sl_no;
            // let sectionIndex = tempArray.findIndex((item: any) => item.NOC_parameter_sl_no == header);
            // set current item and index 
            setCurrentSection(index);
            setCurrentIndex(index);
        }
        else {
            let header = item.parameter_type;
            let sectionIndex = tempArray.findIndex((item: any) => item.title == header);

            // set current item and index 
            setCurrentSection(sectionIndex);
            setCurrentIndex(index);
        }
        setShowCommentAlert(true);
        setShowGraceAlert(false);
        setShowScoreAlert(false);
        setShowInformationAlert(false);
        setShowRegulationAlert(false);
        setShowAttachmentAlert(false);
    }

    const onComplianceClick = (item: any, index: any, value: string) => {
        debugger;
        let tempArray = [...modifiedCheckListData];
        // let header = item.NOC_parameter_sl_no;
        // let sectionIndex = tempArray.findIndex((item: any) => item.NOC_parameter_sl_no == header);
        tempArray[index].Score = value;
        // set current item and index 
        // setCurrentSection(index);
        setCurrentIndex(index);
        setModifiedCheckListData(tempArray);

        setShowInformationAlert(false);
        setShowGraceAlert(false);
        setShowCommentAlert(false);
        setShowScoreAlert(false);
        setShowRegulationAlert(false);
        setShowAttachmentAlert(false);

    }

    const onInfoImageClick = (item: any, index: any) => {
        debugger;
        if (JSON.parse(myTasksDraft.selectedTask).TaskType.toLowerCase().includes('noc') || JSON.parse(myTasksDraft.selectedTask).TaskType.toLowerCase().includes('food')) {
            // let tempArray = [...modifiedCheckListData];

            // let header = item.NOC_parameter_sl_no;
            // let sectionIndex = tempArray.findIndex((item: any) => item.NOC_parameter_sl_no == header);

            // set current item and index 
            setCurrentSection(index);
            setCurrentIndex(index);

            setShowInformationAlert(true);
            setShowGraceAlert(false);
            setShowCommentAlert(false);
            setShowScoreAlert(false);
            setShowRegulationAlert(false);
            setShowAttachmentAlert(false);
        }
        else {
            let tempArray = [...modifiedCheckListData];

            let header = item.parameter_type;
            let sectionIndex = tempArray.findIndex((item: any) => item.title == header);

            // set current item and index 
            setCurrentSection(sectionIndex);
            setCurrentIndex(index);

            setShowInformationAlert(true);
            setShowGraceAlert(false);
            setShowCommentAlert(false);
            setShowScoreAlert(false);
            setShowRegulationAlert(false);
            setShowAttachmentAlert(false);
        }

    }

    const onDescImageClick = (item: any, index: any) => {
        let tempArray = [...modifiedCheckListData];

        if (JSON.parse(myTasksDraft.selectedTask).TaskType.toLowerCase().includes('noc') || JSON.parse(myTasksDraft.selectedTask).TaskType.toLowerCase().includes('food')) {
            let tempArray = [...modifiedCheckListData];
            // set current item and index 
            setCurrentIndex(index);
        }
        else {
            let header = item.parameter_type;
            let sectionIndex = tempArray.findIndex((item: any) => item.title == header);
            // set current item and index 
            setCurrentSection(sectionIndex);
            setCurrentIndex(index);
        }

        setShowDescAlert(true);
        setShowInformationAlert(false);
        setShowGraceAlert(false);
        setShowCommentAlert(false);
        setShowScoreAlert(false);
        setShowRegulationAlert(false);
        setShowAttachmentAlert(false);

    }

    const onNAClick = (item: any, index: any) => {
        let tempArray: any = [...modifiedCheckListData];

        if (JSON.parse(myTasksDraft.selectedTask).TaskType.toLowerCase().includes('noc') || JSON.parse(myTasksDraft.selectedTask).TaskType.toLowerCase().includes('food')) {
            let tempArray = [...modifiedCheckListData];
            // set current item and index 
            tempArray[index].NAValue = item.NAValue;
            setModifiedCheckListData(tempArray);
            setCurrentIndex(index);
            // alert('tempArray' + JSON.stringify(tempArray));
        }
        else {

            let header = item.parameter_type;
            let sectionIndex = tempArray.findIndex((item: any) => item.title == header);

            // set current item and index 
            setCurrentSection(sectionIndex);
            setCurrentIndex(index);

            if (tempArray[sectionIndex].data[index].NA === 'Y') {
                tempArray[sectionIndex].data[index].scoreDisable = false;
                tempArray[sectionIndex].data[index].NA = "N";
                tempArray[sectionIndex].data[index].NAValue = false;
            } else {
                tempArray[sectionIndex].data[index].scoreDisable = true;
                tempArray[sectionIndex].data[index].NA = "Y";
                tempArray[sectionIndex].data[index].NAValue = true;
            }

            tempArray[sectionIndex].data[index].NI = "N";
            tempArray[sectionIndex].data[index].NIValue = false;
            tempArray[sectionIndex].data[index].score = '';
            tempArray[sectionIndex].data[index].grace = '';
            tempArray[sectionIndex].data[index].Answers = '';
            tempArray[currentSection].data[currentIndex].comment = '';
            tempArray[sectionIndex].data[index].Score = '';
            tempArray[sectionIndex].data[index].TotalScoreForQuestion = '';

            setModifiedCheckListData(tempArray);
        }
    }

    const onDashClick = (item: any, index: any) => {
        let tempArray: any = [...modifiedCheckListData];

        let header = item.parameter_type;
        let sectionIndex = tempArray.findIndex((item: any) => item.title == header);

        // set current item and index 
        setCurrentSection(sectionIndex);
        setCurrentIndex(index);

        tempArray[sectionIndex].data[index].NA = "N";
        tempArray[sectionIndex].data[index].NAValue = false;

        if (tempArray[sectionIndex].data[index].NI === 'N') {
            tempArray[sectionIndex].data[index].scoreDisable = false;
            tempArray[sectionIndex].data[index].NI = "N";
            tempArray[sectionIndex].data[index].NIValue = false;
        } else {
            tempArray[sectionIndex].data[index].scoreDisable = false;
            tempArray[sectionIndex].data[index].NI = "N";
            tempArray[sectionIndex].data[index].NIValue = false;
        }

        tempArray[sectionIndex].data[index].Answers = '';
        tempArray[currentSection].data[currentIndex].comment = '';
        tempArray[sectionIndex].data[index].Score = '';
        tempArray[sectionIndex].data[index].TotalScoreForQuestion = '';

        setModifiedCheckListData(tempArray);
    }

    const onNIClick = (item: any, index: any) => {
        let tempArray: any = [...modifiedCheckListData];
        if (JSON.parse(myTasksDraft.selectedTask).TaskType.toLowerCase().includes('noc') || JSON.parse(myTasksDraft.selectedTask).TaskType.toLowerCase().includes('food')) {

            let tempArray = [...modifiedCheckListData];
            // set current item and index 
            tempArray[index].NAValue = item.NAValue;
            setModifiedCheckListData(tempArray);
            setCurrentIndex(index);

        }
        else {

            let header = item.parameter_type;
            let sectionIndex = tempArray.findIndex((item: any) => item.title == header);

            // set current item and index 
            setCurrentSection(sectionIndex);
            setCurrentIndex(index);

            tempArray[sectionIndex].data[index].NA = "N";
            tempArray[sectionIndex].data[index].NAValue = false;

            if (tempArray[sectionIndex].data[index].NI === 'Y') {
                tempArray[sectionIndex].data[index].scoreDisable = false;
                tempArray[sectionIndex].data[index].NI = "N";
                tempArray[sectionIndex].data[index].NIValue = false;
            }
            else {
                tempArray[sectionIndex].data[index].scoreDisable = true;
                tempArray[sectionIndex].data[index].NI = "Y";
                tempArray[sectionIndex].data[index].NIValue = true;
            }

            tempArray[sectionIndex].data[index].Answers = '';
            tempArray[currentSection].data[currentIndex].comment = '';
            tempArray[sectionIndex].data[index].Score = '';
            tempArray[sectionIndex].data[index].TotalScoreForQuestion = '';

            setModifiedCheckListData(tempArray);

        }
    }

    const onAttachmentImageClick = (item: any, index: any) => {

        if (JSON.parse(myTasksDraft.selectedTask).TaskType.toLowerCase().includes('noc') || JSON.parse(myTasksDraft.selectedTask).TaskType.toLowerCase().includes('food')) {
            let tempArray = [...modifiedCheckListData];
            setCurrentSection(index);
            setCurrentIndex(index);
        }
        else {
            let tempArray = [...modifiedCheckListData];

            let header = item.parameter_type;
            let sectionIndex = tempArray.findIndex((item: any) => item.title == header);
            // set current item and index 
            setCurrentSection(sectionIndex);
            setCurrentIndex(index);
        }

        setShowGraceAlert(false);
        setShowCommentAlert(false);
        setShowScoreAlert(false);
        setShowInformationAlert(false);
        setShowRegulationAlert(false);
        setShowAttachmentAlert(true);
    }

    const attachedImageToAlertImageView = async (item: any) => {
        try {
            if (Platform.OS === 'ios') {
                selectImage(item);
            } else if (Platform.OS === 'android') {

                PermissionsAndroid.requestMultiple(
                    [
                        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                        PermissionsAndroid.PERMISSIONS.CAMERA
                    ]
                ).then((result) => {
                    debugger;
                    if (result['android.permission.READ_EXTERNAL_STORAGE'] && result['android.permission.CAMERA'] && result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted') {
                        // selectImage(item);
                    } else if (result['android.permission.READ_EXTERNAL_STORAGE'] || result['android.permission.CAMERA'] || result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'never_ask_again') {
                        ToastAndroid.show('Please Go into Settings -> Applications -> APP_NAME -> Permissions and Allow permissions to continue', ToastAndroid.LONG);
                    }

                })

                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA, {
                    title: 'Smart control App',
                    message: 'You want to use the camera',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                })
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    selectImage(item);
                } else {
                }
            }
        } catch (err) {
            console.warn(err);
        }
    }

    const selectImage = (item: any) => {
        let options = {
            title: 'Select Image',
            noData: false,
            customButtons: [
                { name: 'Test', title: 'Cancel' },
            ],
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };
        try {
            ImagePicker.launchCamera(options, (response) => {
                if (response.didCancel) {
                    // console.log('User cancelled image picker');
                } else if (response.error) {
                    // console.log('ImagePicker Error: ' + response.error);
                } else if (response.customButton) {
                    // console.log('User tapped custom button: ', response.customButton);
                } else {
                    // // console.log('ImageResponse: ', response);
                    debugger;
                    if (response.fileSize) {
                        if (item == 'one') {
                            let tempArray: any = [...modifiedCheckListData];
                            if (JSON.parse(myTasksDraft.selectedTask).TaskType.toLowerCase().includes('noc') || JSON.parse(myTasksDraft.selectedTask).TaskType.toLowerCase().includes('food')) {
                                tempArray[currentIndex].image1 = response.fileName;
                                tempArray[currentIndex].image1Base64 = response.data;
                                tempArray[currentIndex].image1Uri = response.uri;
                            }
                            else {
                                tempArray[currentSection].data[currentIndex].image1 = response.fileName;
                                tempArray[currentSection].data[currentIndex].image1Base64 = response.data;
                                tempArray[currentSection].data[currentIndex].image1Uri = response.uri;
                            }

                            setBase64One(response.data);
                            setModifiedCheckListData(tempArray);
                        }
                        else {
                            let tempArray: any = [...modifiedCheckListData];
                            if (JSON.parse(myTasksDraft.selectedTask).TaskType.toLowerCase().includes('noc') || JSON.parse(myTasksDraft.selectedTask).TaskType.toLowerCase().includes('food')) {
                                tempArray[currentIndex].image2 = response.fileName;
                                tempArray[currentIndex].image2Base64 = response.data;
                                tempArray[currentIndex].image1Uri = response.uri;
                            }
                            else {
                                tempArray[currentSection].data[currentIndex].image2 = response.fileName;
                                tempArray[currentSection].data[currentIndex].image2Base64 = response.data;
                                tempArray[currentSection].data[currentIndex].image2Uri = response.uri;
                            }
                            setBase64two(response.data);
                            setModifiedCheckListData(tempArray);
                        }
                    } else {
                        ToastAndroid.show("File grater than 2MB", ToastAndroid.LONG);
                    }
                }
            });

        } catch (error) {
            debugger
            // alert((error))

        }
    }

    return (

        <View style={{ flex: 1, width: '100%', alignSelf: 'center' }}>

            <ScrollView style={{ minHeight: HEIGHT * 0.2, height: 'auto' }}>
                {
                    errorGraceAlert
                        ?
                        <AlertComponentForError
                            showMessage={true}
                            title={'Warning'}
                            message={`Select grace for question number ${graceErrorIndex + 1} from section ${graceErrorSectionTitle}`}
                            closeAlert={() => {
                                setErrorGraceAlert(false);
                            }}
                        />
                        :
                        null
                }

                {
                    errorCommentAlert
                        ?
                        <AlertComponentForError
                            showMessage={true}
                            title={'Warning'}
                            message={`Select comment for question number ${commentErrorIndex + 1} from section ${commentErrorSectionTitle}`}
                            closeAlert={() => {
                                setErrorCommentAlert(false);
                            }}
                        />
                        :
                        null
                }

                {
                    showCommentAlert ?
                        <AlertComponentForComment
                            okmsg={'Ok'}
                            cancelmsg={'Cancel'}
                            title={'Comment'}
                            comment={

                                (JSON.parse(myTasksDraft.selectedTask).TaskType.toLowerCase().includes('noc') || JSON.parse(myTasksDraft.selectedTask).TaskType.toLowerCase().includes('food')) ?
                                    modifiedCheckListData[currentSection].comment
                                    :
                                    modifiedCheckListData && modifiedCheckListData.length > 0
                                        ?
                                        currentSection === '' && currentIndex === ''
                                            ?
                                            ''
                                            :
                                            modifiedCheckListData[currentSection].data[currentIndex].comment
                                        :
                                        ''

                            }
                            disabled={bottomBarDraft.profileClick}
                            message={
                                (JSON.parse(myTasksDraft.selectedTask).TaskType.toLowerCase().includes('noc') || JSON.parse(myTasksDraft.selectedTask).TaskType.toLowerCase().includes('food')) ?
                                'Enter comment' :
                                modifiedCheckListData[currentSection].data[currentIndex].parameter_type == 'EHS' ? '-' : 'Enter comment'}
                            updateCommentValue={updateCommentValue}
                            closeAlert={() => {
                                setShowCommentAlert(false);
                            }}
                            okAlert={() => {
                                setShowCommentAlert(false);
                            }}
                        />
                        :
                        null
                }

                {
                    showGraceAlert ?
                        <AlertComponentForGrace
                            okmsg={'Ok'}
                            cancelmsg={'Cancel'}
                            title={'Enter Grace'}
                            updateGraceValue={updateGraceValue}
                            disabled={bottomBarDraft.profileClick}
                            minGrace={
                                modifiedCheckListData && modifiedCheckListData.length > 0
                                    ?
                                    currentSection === '' && currentIndex === ''
                                        ?
                                        ''
                                        :
                                        modifiedCheckListData[currentSection].data[currentIndex].parameter_grace_minimum
                                    :
                                    ''
                            }
                            maxGrace={
                                modifiedCheckListData && modifiedCheckListData.length > 0
                                    ?
                                    currentSection === '' && currentIndex === ''
                                        ?
                                        ''
                                        :
                                        modifiedCheckListData[currentSection].data[currentIndex].parameter_grace_maximum
                                    :
                                    ''
                            }
                            helperText={'Enter grace in between'}
                            grace={
                                modifiedCheckListData && modifiedCheckListData.length > 0
                                    ?
                                    currentSection === '' && currentIndex === ''
                                        ?
                                        ''
                                        :
                                        modifiedCheckListData[currentSection].data[currentIndex].grace
                                    :
                                    ''
                            }
                            message={'Enter Grace'}
                            closeAlert={() => {
                                setShowGraceAlert(false);
                            }}
                            okAlert={() => {
                                setShowGraceAlert(false);
                            }}
                        />
                        :
                        null
                }

                {
                    showInformationAlert
                        ?
                        <AlertComponentForInformation
                            showMessage={true}
                            title={'Information'}
                            message={
                                modifiedCheckListData && modifiedCheckListData.length > 0
                                    ?
                                    modifiedCheckListData[currentSection].NOC_parameter_inspection_criteria
                                    :
                                    ''
                            }
                            closeAlert={() => {
                                setShowInformationAlert(false);
                            }}
                        />
                        :
                        null
                }

                {
                    showScoreAlert
                        ?
                        <AlertComponentForScore
                            title={'Select score'}
                            showScore={true}
                            onClickScoreListItem={onClickScoreListItem}
                            scoreArray={scoreArray}
                            closeAlert={() => {
                                setShowScoreAlert(false);
                            }}
                        />
                        :
                        null
                }

                {
                    showRegulationAlert
                        ?
                        <AlertComponentForRegulation
                            title={'Regulation'}
                            message={regulationString}
                            closeAlert={() => {
                                setShowRegulationAlert(false);
                            }}
                        />
                        :
                        null
                }

                {
                    showDescAlert
                        ?
                        <AlertComponentForRegulation
                            title={'Regulation'}
                            message={
                                JSON.parse(myTasksDraft.selectedTask).TaskType.toLowerCase().includes('noc') ?
                                    modifiedCheckListData[currentSection].NOC_parameter_regulation_article_no
                                    :
                                    regulationString
                            }
                            closeAlert={() => {
                                setShowDescAlert(false);
                            }}
                        />
                        :
                        null
                }
                {
                    showAttachmentAlert
                        ?
                        <AlertComponentForAttachment
                            title={'Attachment'}
                            attachmentOne={async () => {
                                await attachedImageToAlertImageView('one');
                            }}
                            attachmentTwo={async () => {
                                await attachedImageToAlertImageView('two');
                            }}
                            image1Uri={(JSON.parse(myTasksDraft.selectedTask).TaskType.toLowerCase().includes('noc') || JSON.parse(myTasksDraft.selectedTask).TaskType.toLowerCase().includes('food')) ?
                                modifiedCheckListData[currentIndex].image1Uri
                                :
                                modifiedCheckListData[currentSection].data[currentIndex].image1Uri
                            }
                            image2Uri={(JSON.parse(myTasksDraft.selectedTask).TaskType.toLowerCase().includes('noc') || JSON.parse(myTasksDraft.selectedTask).TaskType.toLowerCase().includes('food')) ?
                                modifiedCheckListData[currentIndex].image2Uri
                                :
                                modifiedCheckListData[currentSection].data[currentIndex].image2Uri
                            }
                            base64One={
                                (JSON.parse(myTasksDraft.selectedTask).TaskType.toLowerCase().includes('noc') || JSON.parse(myTasksDraft.selectedTask).TaskType.toLowerCase().includes('food')) ?
                                    (modifiedCheckListData && modifiedCheckListData.length > 0
                                        ?
                                        currentIndex === ''
                                            ?
                                            ''
                                            :
                                            modifiedCheckListData[currentSection].attachment1
                                        :
                                        '')
                                    :
                                    (modifiedCheckListData && modifiedCheckListData.length > 0
                                        ?
                                        currentSection === '' && currentIndex === ''
                                            ?
                                            ''
                                            :
                                            modifiedCheckListData[currentSection].data[currentIndex].image1Base64
                                        :
                                        '')
                            }
                            base64Two={
                                (JSON.parse(myTasksDraft.selectedTask).TaskType.toLowerCase().includes('noc') || JSON.parse(myTasksDraft.selectedTask).TaskType.toLowerCase().includes('food')) ?
                                    modifiedCheckListData && modifiedCheckListData.length > 0
                                        ?
                                        currentSection === '' && currentIndex === ''
                                            ?
                                            ''
                                            :
                                            modifiedCheckListData[currentSection].attachment2
                                        :
                                        ''
                                    :
                                    modifiedCheckListData && modifiedCheckListData.length > 0
                                        ?
                                        currentSection === '' && currentIndex === ''
                                            ?
                                            ''
                                            :
                                            modifiedCheckListData[currentSection].data[currentIndex].image2Base64
                                        :
                                        ''
                            }
                            disabled={bottomBarDraft.profileClick}
                            closeAlert={() => {
                                setShowAttachmentAlert(false);
                            }}
                        />
                        :
                        null
                }

                <View style={{ minHeight: HEIGHT * 0.25, height: 'auto' }}>
                    {
                        JSON.parse(myTasksDraft.selectedTask).TaskType.toLowerCase().includes('noc') || JSON.parse(myTasksDraft.selectedTask).TaskType.toLowerCase().includes('food') ?

                            <ChecklisConponentFrNOC
                                onNAClick={onNAClick}
                                onNIClick={onNIClick}
                                onScoreImageClick={onScoreImageClick}
                                onGraceImageClick={onGraceImageClick}
                                onCommentImageClick={onCommentImageClick}
                                onInfoImageClick={onInfoImageClick}
                                onDescImageClick={onDescImageClick}
                                onAttachmentImageClick={onAttachmentImageClick}
                                onRegulationClick={onRegulationClick}
                                onComplianceClick={onComplianceClick}
                                isArabic={context.isArabic}
                                data={modifiedCheckListData}
                            />
                            :
                            modifiedCheckListData && modifiedCheckListData.length > 0
                                ?
                                <AccordionComponent
                                    onDashClick={onDashClick}
                                    onNAClick={onNAClick}
                                    onNIClick={onNIClick}
                                    onScoreImageClick={onScoreImageClick}
                                    onGraceImageClick={onGraceImageClick}
                                    onCommentImageClick={onCommentImageClick}
                                    onInfoImageClick={onInfoImageClick}
                                    onDescImageClick={onDescImageClick}
                                    onAttachmentImageClick={onAttachmentImageClick}
                                    onRegulationClick={onRegulationClick}
                                    selectedTaskType={myTasksDraft.isMyTaskClick}
                                    isArabic={context.isArabic}
                                    data={modifiedCheckListData} />
                                :
                                null
                    }
                </View>

                <View style={{ height: 15 }} />
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    diamondView: {
        width: 45,
        height: 45,
        transform: [{ rotate: '45deg' }]
    }
});

export default observer(ChecklistComponentStepOne);
