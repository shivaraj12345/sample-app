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
import AccordionComponentForFollowUp from '../components/AccordionComponentForFollowUp';
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
import FollowUpAlertComponentForScore from './FollowUpAlertComponentForScore';
import AlertComponentForRegulation from './AlertComponentForRegulation';
import AlertComponentForAttachment from './AlertComponentForAttachment';
import ImagePicker from 'react-native-image-picker';
// import inspectionDetails from '../../src/routes/inspectionDetails';

const FollowUpComponent = (props: any) => {

    const context = useContext(Context);
    const [modifiedCheckListData, setModifiedCheckListData] = useState([]);
    let startTime: any = '';
    let timeStarted: any = '';
    let timeElapsed: any = '';

    const mapStore = (rootStore: RootStoreModel) => ({ myTasksDraft: rootStore.myTasksModel })
    const { myTasksDraft } = useInject(mapStore)

    // individual section and index for checklist
    const [currentSection, setCurrentSection] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentScore, setCurrentScore] = useState(Boolean);
    const [currentGrace, setCurrentGrace] = useState(Boolean);



    // alert alert components variables
    const [showCommentAlert, setShowCommentAlert] = useState(false);
    const [showScoreAlert, setShowScoreAlert] = useState(false);
    const [showGraceAlert, setShowGraceAlert] = useState(false);
    const [showInformationAlert, setShowInformationAlert] = useState(false);
    const [showRegulationAlert, setShowRegulationAlert] = useState(false);
    const [showAttachmentAlert, setShowAttachmentAlert] = useState(false);

    const [title, setTitle] = useState('');
    const [scoreArray, setScoreArray] = useState([
        { score: "0", description: "Violations" },
        { score: "1", description: "Final Warning" },
        { score: "2", description: "First Warning" },
        { score: "3", description: "Notice" },
        { score: "4", description: "Satisfactory" }
    ]
    );

    const [scoreArray1, setScoreArray1] = useState(
        [
            { score: "Y", title: 'Yes' },
            { score: "N", title: 'No' },
        ]

    );

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
    const [inspectionDetails, setinspectionDetails] = useState(Object());
    useEffect(() => {
        //  setinspectionDetails(JSON.parse(myTasksDraft.selectedTask));

        let inspTemp: any = props.inspDetails ? props.inspDetails : {};
        setinspectionDetails(inspTemp);

        console.log("setInsp", inspTemp);

        setCurrentGrace(true);
        setCurrentScore(true);

        let tempModifiedCheckListData: any = [];
        let temp: any = props.modifiedCheckListData ? props.modifiedCheckListData : [];
        console.log("temp in follow component", temp)

        if (temp && temp.length > 0) {
            let result = Array.from(new Set(temp.map((item: any) => item.Answers)))
                .map(Answers => {
                    return { Answers: Answers };
                });


            for (let i = 0; i < result.length; i++) {
                let dataArray = [];
                for (let j = 0; j < temp.length; j++) {
                    let element: any = temp[j];

                    if (element.Answers == result[i].Answers) {
                        let obj: any = element;
                        dataArray.push(obj)
                    }
                }

                tempModifiedCheckListData.push({
                    'title': result[i].Answers,
                    'data': dataArray
                })
            }
            //  debugger;
            console.log("  tempModifiedCheckListData ", JSON.stringify(tempModifiedCheckListData))
            setModifiedCheckListData(tempModifiedCheckListData);

            //   startCalculation();
        }
    }, []);


    const startCalculation = () => {
        try {
            let tempScore = 99;
            let tempArray: any = [...modifiedCheckListData];

            console.log("InStart")

            for (var k = 0; k < tempArray.length; k++) {

                for (var i = 0; i < tempArray[k].data.length; i++) {
                    if (!tempArray[k].data[i].originalScore && tempArray[k].data[i].originalScore != 0) {
                        if (tempArray[k].data[i].FinalScore != "" || tempArray[k].data[i].FinalScore == "0") {
                            tempArray[k].data[i].originalScore = JSON.parse(JSON.stringify(tempArray[k].data[i].FinalScore));
                        }
                        else {

                            tempArray[k].data[i].originalScore = JSON.parse(JSON.stringify(tempArray[k].data[i].Answers));

                        }
                    }
                    //if (isNaN(parseInt(tempArray[k].data[i].Answers))) {
                    //    tempArray[k].data[i].Answers = 4;
                    //}
                    if (tempArray[k].data[i].NI || tempArray[k].data[i].NA) {
                        if (tempArray[k].data[i].score == '-')
                            tempArray[k].data[i].wasUnAnswered = false;
                    }
                    //if (!tempArray[k].data[i].originalScore && tempArray[k].data[i].originalScore != 0) {
                    //    tempArray[k].data[i].originalScore = tempArray[k].data[i].FinalScore;
                    //}
                    if (!tempArray[k].data[i].NI && !tempArray[k].data[i].NA)
                    //if ((tempScore >= tempArray[k].data[i].Answers) && (tempArray[k].data[i].score != '-')) {
                    //    tempScore = tempArray[k].data[i].Answers;
                    //    if (tempArray[k].data[i].score == "N" && tempArray[k].data[i].originalScore > 0) { 
                    //        tempScore = tempArray[k].data[i].originalScore - 1;
                    //    tempArray[k].data[i].Answers = tempScore;
                    //}
                    //    else if (tempArray[k].data[i].Answers == 0) {
                    //        tempScore = tempArray[k].data[i].Answers
                    //    }
                    //    tempArray[k].data[i].wasUnAnswered = false;
                    //}
                    {
                        if ((tempScore >= tempArray[k].data[i].Answers) && (tempArray[k].data[i].score != '-')) {
                            tempScore = tempArray[k].data[i].Answers;
                            if (tempArray[k].data[i].score == "N" && tempArray[k].data[i].originalScore > 0) {
                                tempScore = tempArray[k].data[i].originalScore - 1;
                                tempArray[k].data[i].Answers = tempScore;
                                // tempArray[k].data[i].Score = tempScore;

                            }
                            else if (tempArray[k].data[i].Answers == 0) {
                                tempScore = tempArray[k].data[i].Answers;
                            }
                            tempArray[k].data[i].wasUnAnswered = false;
                        }
                        else if (tempScore < tempArray[k].data[i].Answers && tempArray[k].data[i].score == "N") {
                            tempArray[k].data[i].Answers = tempArray[k].data[i].originalScore - 1;
                        }

                        else if (tempArray[k].data[i].score == '-') {
                            tempArray[k].data[i].wasUnAnswered = true;
                        }
                    }
                }
            }
            var valScore = getScoreTextFromScoreValue(tempScore);


            let objInspectionReport = new Object();

            if (inspectionDetails.mappingData) {
                if (inspectionDetails.mappingData[0])
                    if (inspectionDetails.mappingData[0].tempScore) {
                        tempScore = inspectionDetails.mappingData[0].tempScore;
                    }
                    else {
                        tempScore = 99;
                    }
            }

            try {
                for (var i = 0; i < tempArray[k].data.length; i++) {

                    var weightage = parseInt(tempArray[k].data[i].Weightage);
                    if (isNaN(parseInt(weightage)))
                        weightage = 1;
                    else if (weightage.toString().length == 0)
                        weightage = 1;
                    else
                        weightage = parseInt(tempArray[k].data[i].Weightage);

                    tempArray[k].data[i].Weightage = weightage;
                    tempArray[k].data[i].isCalculated = false;
                    if (tempArray[k].data[i].NI) {
                        tempArray[k].data[i].Answers = 5;
                        tempArray[k].data[i].Score = tempArray[k].data[i].Answers * tempArray[k].data[i].Weightage;
                        tempArray[k].data[i].GracePeriod = tempArray[k].data[i].GracePeriod || '-';
                        tempArray[k].data[i].calculatedGracePeriod = tempArray[k].data[i].calculatedGracePeriod || "-";
                        tempArray[k].data[i].Grace = tempArray[k].data[i].Grace || "-";
                    }

                    if (parseInt(tempArray[k].data[i].score) == 4) {
                        tempArray[k].data[i].GracePeriod = 0;
                        tempArray[k].data[i].calculatedGracePeriod = 0;
                    }

                    var temp;
                    if (tempArray[k].data[i].Weightage == 2) {

                        tempArray[k].data[i].color = "#ffff66";

                    }

                    if (tempArray[k].data[i].Answers == 0) {
                        tempArray[k].data[i].color = "pink";
                    }
                    if (parseInt(tempArray[k].data[i].Score / weightage) != parseInt(tempArray[k].data[i].Answers))
                        temp = parseInt(tempArray[k].data[i].Answers);
                    else
                        temp = parseInt(Math.ceil(tempArray[k].data[i].Score / weightage));

                    if (((tempArray[k].data[i].score == '') || (tempArray[k].data[i].score == '-')) && (!tempArray[k].data[i].NI)) {
                        if (parseInt(tempArray[k].data[i].Score) == 4 && weightage == 1) {
                            tempArray[k].data[i].score = 4;
                            tempArray[k].data[i].GracePeriod = 0;
                            tempArray[k].data[i].calculatedGracePeriod = 0;
                        }
                        else if (parseInt(tempArray[k].data[i].Score) == 8 && weightage == 2) {
                            tempArray[k].data[i].score = 4;
                            tempArray[k].data[i].GracePeriod = 0;
                            tempArray[k].data[i].calculatedGracePeriod = 0;
                        }
                        else if (parseInt(tempArray[k].data[i].Score) == 4 && weightage == 1) {
                            tempArray[k].data[i].score = 4;
                            tempArray[k].data[i].GracePeriod = 0;
                            tempArray[k].data[i].calculatedGracePeriod = 0;
                        }
                        else if (parseInt(tempArray[k].data[i].Answers) == 4) {
                            tempArray[k].data[i].score = 4;
                            tempArray[k].data[i].GracePeriod = 0;
                            tempArray[k].data[i].calculatedGracePeriod = 0;
                        }
                    }

                    if (tempArray[k].data[i].score == 4) {
                        tempArray[k].data[i].wasSatisfactory = true;
                    }
                    if ((parseInt(tempArray[k].data[i].score) == 4) && (tempArray[k].data[i].GracePeriod.toString().length < 1)) {
                        tempArray[k].data[i].GracePeriod = 0;
                        tempArray[k].data[i].calculatedGracePeriod = 0;
                    }

                    if (tempArray[k].data[i].score != '' && tempArray[k].data[i].score != '-' && parseInt(tempArray[k].data[i].score) != 4 && tempArray[k].data[i].isCalculated) {
                        if (((parseInt(tempArray[k].data[i].Answers)) < 4) && (!tempArray[k].data[i].wasSatisfactory)) {
                            tempArray[k].data[i].score = 'N';
                        }
                        else if (((parseInt(tempArray[k].data[i].Answers)) <= parseInt(tempArray[k].data[i].score)) && (parseInt(tempArray[k].data[i].Score) != 4) && (!tempArray[k].data[i].wasSatisfactory))
                            tempArray[k].data[i].score = 'Y';
                    }
                    if ((parseInt(tempArray[k].data[i].Answers) < (parseInt(tempArray[k].data[i].FinalScore))) && ((parseInt(tempArray[k].data[i].FinalScore == 4)))) {
                        tempArray[k].data[i].score = '-';
                    }



                }
            }
            catch (e) {

            }


            //    CheckisViolated();

            setModifiedCheckListData(tempArray);
            console.log("Array in start functuon", JSON.stringify(modifiedCheckListData))
        }
        catch (e) {
            console.log(e);
        }



    }



    const displayCounter = () => {
        let timerCounter = setInterval(() => {
            let diff = Math.abs(new Date() - startTime);
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

        let header = item.FinalScore;
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

    // useEffect(() => {
    //     let checkListData = RealmController.getCheckListForTaskId(realm, CheckListSchema.name, props.selectedTaskId);
    //   //  debugger;
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


    const onClickScoreListItemSatisfactory = (item: any, index: any) => {
        console.log("Iside score");
        setShowScoreAlert(false);




        let tempArray: any = [...modifiedCheckListData];
        let currentObj = tempArray[currentSection].data[currentIndex];


        setCurrentScore(false);
        setCurrentGrace(false);
        console.log("|Current Score . ", item.score);


        currentObj.wasNI = false;
        currentObj.isScore = true;



        currentObj.score = item.score;
        currentObj.Answers = item.score;
        currentObj.Score = item.score * currentObj.Weightage;
        currentObj.NI = false;
        currentObj.NA = false;


        if (item.score == 4) {
            currentObj.GracePeriod = 0;
            currentObj.calculatedGracePeriod = 0;
            //var listView = document.getElementById("simpleBinding").winControl;
            //listView.forceLayout();
        }
        else if (item.score == 3 || item.score == 2) {
            currentObj.GracePeriod = 15;
            currentObj.calculatedGracePeriod = 15;
            //selectedItem.getElementsByClassName('sblInspComment-cls')[0].value = "";
            currentObj.Comments = "";
        }
        else if (item.score == 1) {
            currentObj.GracePeriod = 7;
            currentObj.calculatedGracePeriod = 7;
            //selectedItem.getElementsByClassName('sblInspComment-cls')[0].value = "";
            currentObj.Comments = "";
        }
        else if (item.score == 2) {
            currentObj.GracePeriod = 15;
            currentObj.calculatedGracePeriod = 15;
            //selectedItem.getElementsByClassName('sblInspComment-cls')[0].value = "";
            currentObj.Comments = "";
        }
        else if (item.score == 0) {
            currentObj.GracePeriod = 7;
            currentObj.calculatedGracePeriod = 7;
            currentObj.Comments = "";
        }
        // currentObj.GracePeriod = 7;
        if (parseInt(item.score) == 4) {
            currentObj.Comments = "Satisfactory";
            currentObj.GracePeriod = 0;
            currentObj.calculatedGracePeriod = 0;
        }

        console.log("CurrentObj.grace", currentObj.GracePeriod);

        currentObj.isCalculated = false;
        var tempScore;
        tempScore = 99;
        for (var i = 0; i < tempArray[currentSection].data.length; i++) {


            if (!tempArray[currentSection].data[i].NI && !tempArray[currentSection].data[i].NA) {

                if ((tempScore >= tempArray[currentSection].data[i].Answers) && (tempArray[currentSection].data[i].score != '-')) {
                    tempScore = tempArray[currentSection].data[i].Answers;
                    if (tempArray[currentSection].data[i].score == "N" && tempArray[currentSection].data[i].originalScore > 0) {
                        tempScore = tempArray[currentSection].data[i].originalScore - 1;
                        tempArray[currentSection].data[i].Answers = tempScore;
                        // tempArray[currentSection].data[i].Score = tempScore;

                    }
                    else if (tempArray[currentSection].data[i].Answers == 0) {
                        tempScore = tempArray[currentSection].data[i].Answers;
                    }
                }
                else if (tempScore < tempArray[currentSection].data[i].Answers && tempArray[currentSection].data[i].score == "N") {
                    tempArray[currentSection].data[i].Answers = tempArray[currentSection].data[i].originalScore - 1;
                }
            }
        }

        //   CheckisViolated();
        if (currentObj.Weightage == 2) {
            currentObj.color = "#ffff66";
        }

        if (currentObj.Answers == 0) {
            currentObj.color = "pink";
        }
        else if (parseInt(currentObj.Weightage) == 2) {
            currentObj.color = "#ffff66";
        }
        else {
            currentObj.color = "#ffffff";
        }
        setModifiedCheckListData(tempArray);

        console.log(" lowest Score val", tempScore);
        getScoreTextFromScoreValue(tempScore);



        console.log("Modified in satis", tempArray[currentSection].data[currentIndex])
        console.log("Current Obj in satis", currentObj);


    }

    const getScoreTextFromScoreValue = (score: any) => {
        console.log("Score val before parse", score);
        score = parseInt(score);
        var scoreText = '';
        console.log("score val " + score);
        if (score > 4)
            return "Satisfactory";


        switch (parseInt(score)) {
            case 0:
                scoreText = "Violation";
                break;
            case 1:
                scoreText = "Final Warning";
                break;
            case 2:
                scoreText = "First Warning";
                break;
            case 3:
                scoreText = "Notice";
                break;
            case 4:
                scoreText = "Satisfactory";
                break;
            case 99:
                scoreText = "Satisfactory";
                break;
        }
        console.log("score text ", scoreText);
        myTasksDraft.setResult(scoreText);
        return scoreText;
    }


    // function CheckisViolated() {
    //     scoreObj.isSatisfactory = true;
    //     for (var i = 0; i < tempArray[sectionIndex].data.length; i++) {
    //         if (!tempArray[sectionIndex].data[i].NI && !tempArray[sectionIndex].data[i].NA) {

    //             if ((tempArray[sectionIndex].data[i].score == '' && tempArray[sectionIndex].data[i].score != 0) || tempArray[sectionIndex].data[i].score == '-')
    //                 continue;

    //             if (tempArray[sectionIndex].data[i].score != 'Y' && parseInt(tempArray[sectionIndex].data[i].score) != 4) {
    //                 console.log("tempArray[sectionIndex].data[i].score::" + tempArray[sectionIndex].data[i].score)
    //                 scoreObj.isSatisfactory = false;
    //                 document.getElementById("inspectorRecommendationSbl").value = "Unsatisfactory";
    //                 break;
    //             }    


    //         }
    //     }
    //     if (scoreObj.isSatisfactory)
    //         document.getElementById("inspectorRecommendationSbl").value = "Satisfactory";
    // }


    const onClickScoreListItem = (item: any, index: any) => {



        console.log("Inside on score click yes or no", item);

        setShowScoreAlert(false);



        let tempArray: any = [...modifiedCheckListData];
        let currentObj = tempArray[currentSection].data[currentIndex];

        console.log("       tempArray[currentSection].indexx", tempArray[currentSection].data[currentIndex]);

        currentObj.wasNI = false;
        currentObj.isScore = true;


        currentObj.score = item.score;
        currentObj.NI = false;
        currentObj.NA = false;
        currentObj.GracePeriod = 7;
        currentObj.calculatedGracePeriod = 7;


        if (item.score == "Y") {
            console.log("Score is yes")
            currentObj.GracePeriod = 0;
            currentObj.calculatedGracePeriod = 0;
            currentObj.Answers = 4;
            currentObj.Score = 4 * currentObj.Weightage;
            currentObj.Comments = "Satisfactory";
        }

        else if (item.score == "N") {
            currentObj.Answers = parseInt(currentObj.FinalScore);
            currentObj.GracePeriod = 7;
            currentObj.calculatedGracePeriod = 7;
            if (currentObj.Action == "Violation") {
                currentObj.Answers = 0;
            }
            if (currentObj.Answers == "-" || currentObj.Answers == 4) {
                currentObj.Answers = currentObj.originalScore;
            }
            currentObj.Score = currentObj.Answers * currentObj.Weightage;


        }
        var tempScore;
        tempScore = 99;

        for (var i = 0; i < tempArray[currentSection].data.length; i++) {
            if (!currentObj.NI && !currentObj.NA) {

                if ((tempScore >= currentObj.Answers) && (currentObj.score != '-')) {
                    tempScore = currentObj.Answers;
                    if (currentObj.score == "N" && currentObj.originalScore > 0) {
                        tempScore = currentObj.originalScore - 1;
                        currentObj.Answers = tempScore;
                        // currentObj.Score = tempScore;

                    }
                    else if (currentObj.originalScore == 0 && currentObj.score == "N") {
                        tempScore = currentObj.originalScore;
                        currentObj.Answers = tempScore;

                    }
                }
                else if (tempScore < currentObj.Answers && currentObj.score == "N") {
                    currentObj.Answers = currentObj.originalScore - 1;
                }
            }
        }

        if (currentObj.Answers == 0) {
            currentObj.color = 'pink';
        }
        else if (currentObj.Weightage == 2) {
            currentObj.color = "#ffff66";
        }
        else {
            currentObj.color = "#ffffff";
        }



        setModifiedCheckListData(tempArray);


        getScoreTextFromScoreValue(tempScore);

        console.log("    setModifiedCheckListData   tempArray[currentSection].indexx", tempArray[currentSection].data[currentIndex]);


    }


    const calculateScore = () => {
        let scoreObj: any = {}

        let tempArray: any = [...modifiedCheckListData];
        var score = 0, totalScore = 0, scorePercentage = 0, minGrace = 1000, minScore = 99, weightage = 1;
        for (var k = 0; k < tempArray.length; k++) {

            console.log("TempArr lrnght insp ", inspectionDetails);



            for (var i = 0; i < tempArray[k].data.length; i++) {

                let section = '';
                if (tempArray[k].title == 0) {
                    section = 'Violation'
                } else if (tempArray[k].title == 1) {
                    section = 'Final Warning'
                } else if (tempArray[k].title == 2) {
                    section = 'First Warning'
                } else if (tempArray[k].title == 3) {
                    section = 'Notices'
                } else if (tempArray[k].title == 4) {
                    section = 'Satisfactory'
                } else {
                }

                console.log("TempArr lrnght", tempArray[k].data[i].Comments);




                if (tempArray[k].data[i].NI == true) {
                    if (tempArray[k].data[i].Comments.length == 0) {
                        var j = i + 1;
                        // alert(resourceMap.startinspectionsbl_commentforquestion_alert_msg.candidates[langID].valueAsString + j);
                        Alert.alert("Please enter the comment for " + section + "- question no: " + j);
                        return;
                    }
                    else if (tempArray[k].data[i].GracePeriod.toString().length > 0 && minGrace > parseInt(tempArray[k].data[i].GracePeriod) && parseInt(tempArray[k].data[i].GracePeriod) > 0) {
                        minGrace = parseInt(tempArray[k].data[i].GracePeriod);
                        continue;
                    }
                    if (tempArray[k].data[i].NI && (tempArray[k].data[i].GracePeriod == '-')) {
                        var j = i + 1;
                        Alert.alert("Please enter grace for section" + section + " question no " + j);
                        //     alert(resourceMap.startinspection_entergrace_alert_msg.candidates[langID].valueAsString + j);
                        return;
                    }

                }
                else {
                    if (tempArray[k].data[i].Comments.length == 0) {
                        var j = i + 1;
                        Alert.alert("Please enter the comment for " + section + "- question no: " + j);
                        //  alert(resourceMap.startinspection_entercomment_alert_msg.candidates[langID].valueAsString + j);
                        return;

                    }
                    if (tempArray[k].data[i].Weightage == "" || tempArray[k].data[i].Weightage == null) {
                        weightage = 1;
                    } else {
                        weightage = parseInt(tempArray[k].data[i].Weightage);
                    }

                }
                //if (tempArray[k].data[i].NI == true && tempArray[k].data[i].Answers != 5) {
                //    tempArray[k].data[i].NI = false;
                //}
                //tempArray[k].data[i].originalScore = tempArray[k].data[i].FinalScore;
                if (tempArray[k].data[i].score == 'Y') {
                    tempArray[k].data[i].FinalScore = 4;
                    tempArray[k].data[i].GracePeriod = 0;
                    tempArray[k].data[i].calculatedGracePeriod = 0;
                }
                if (parseInt(tempArray[k].data[i].score) == 4) {
                    // For Score == 4
                    //  Score Calculation
                    tempArray[k].data[i].FinalScore = 4;
                    tempArray[k].data[i].GracePeriod = 0;
                    tempArray[k].data[i].calculatedGracePeriod = 0;
                    score = score + parseInt(tempArray[k].data[i].FinalScore) * tempArray[k].data[i].Weightage;
                    totalScore = totalScore + (4 * weightage);

                }
                else {
                    // For score other than 4 , 
                    // If date is from future, do score and grace calculations
                    if (Date.parse(tempArray[k].data[i].GracePeriodDate) > new Date()) {
                        //Non Conformant Answered
                        if (tempArray[k].data[i].score != '' && tempArray[k].data[i].score != '-' && !tempArray[k].data[i].NI) {
                            tempArray[k].data[i].FinalScore = tempArray[k].data[i].Answers;
                            score = score + (parseInt(tempArray[k].data[i].FinalScore) * weightage);
                            totalScore = totalScore + (4 * weightage);
                        }
                        else {
                            // Non Conformant not answered
                            try {
                                tempArray[k].data[i].isNotAnswered = true;
                                if (!isNaN(parseInt(tempArray[k].data[i].score))) {
                                    tempArray[k].data[i].FinalScore = tempArray[k].data[i].score
                                }
                                else if (!isNaN(parseInt(tempArray[k].data[i].Answers))) {
                                    tempArray[k].data[i].FinalScore = tempArray[k].data[i].Answers
                                }

                            }
                            catch (e) {

                            }
                        }

                    }
                    else {
                        // If current date,
                        if (((tempArray[k].data[i].score == '') || ((tempArray[k].data[i].score) == '-')) && !scoreObj.isFromCompletedTask) {
                            if (!(tempArray[k].data[i].NI)) {
                                var j = i + 1;
                                //   alert(resourceMap.startinspectionsbl_answerforquestionnumber_alert_msg.candidates[langID].valueAsString + j);
                                return;
                            }
                        }
                        else {
                            var temp;
                            if ((!isNaN(parseInt(tempArray[k].data[i].Answers))))
                                temp = parseInt(tempArray[k].data[i].Answers);
                            else
                                temp = parseInt((tempArray[k].data[i].Score / weightage));
                            if ((parseInt(tempArray[k].data[i].Answers) > 0)) {
                                if (!isNaN(parseInt(tempArray[k].data[i].score))) {
                                    tempArray[k].data[i].FinalScore = tempArray[k].data[i].score;

                                }
                                else if ((tempArray[k].data[i].score == 'N') && tempArray[k].data[i].originalScore > 0) {
                                    tempArray[k].data[i].FinalScore = tempArray[k].data[i].originalScore - 1;
                                    tempArray[k].data[i].Answers = tempArray[k].data[i].FinalScore;
                                }
                            }
                            else if ((parseInt(tempArray[k].data[i].Answers) == 0)) {
                                tempArray[k].data[i].FinalScore = tempArray[k].data[i].Answers;
                            }
                            score = score + (parseInt(tempArray[k].data[i].FinalScore) * weightage);
                            totalScore = totalScore + (4 * weightage);

                        }
                    }
                }
                if ((tempArray[k].data[i].GracePeriod) < 0) {
                    tempArray[k].data[i].GracePeriod = 0;
                    tempArray[k].data[i].calculatedGracePeriod = 0;
                }
                if (minScore > parseInt(tempArray[k].data[i].FinalScore) && (tempArray[k].data[i].score != '-') && (!tempArray[k].data[i].NI))
                    minScore = parseInt(tempArray[k].data[i].FinalScore);
                if (tempArray[k].data[i].GracePeriod.toString().length > 0 && minGrace > parseInt(tempArray[k].data[i].GracePeriod) && parseInt(tempArray[k].data[i].GracePeriod) > 0 && parseInt(tempArray[k].data[i].FinalScore) < 4)
                    minGrace = parseInt(tempArray[k].data[i].GracePeriod);
                if (tempArray[k].data[i])
                    tempArray[k].data[i].isCalculated = true;


            }
        }


        scoreObj.minGrace = minGrace;
        if (score == 0)
            scorePercentage = 0;
        else
            scorePercentage = ((score / totalScore) * 100).toFixed(2);
        scoreObj.score = score;    
        scoreObj.maxOverallScore = totalScore;
        scoreObj.scorePercent = scorePercentage;

        //if (minScore > 0 && minScore!=4)
        //  minScore--;

        if (minScore == 0)
            inspectionDetails.mappingData[0].isViolated = true;

        scoreObj.maxScoreFinal = getScoreTextFromScoreValue(minScore);
        if (!scoreObj.isFromCompletedTask)
            inspectionDetails.mappingData[0].minScore = scoreObj.maxScoreFinal;
        // scoreObj.overallComments = document.getElementById("overallCommentsSbl").value;
        console.log(scoreObj.maxScoreFinal + "Min Score :: " + minScore);
        if (minGrace == 1000) {
            if (scoreObj.isSatisfactory == true) {
                scoreObj.minGrace = "";
            }
            else {
                scoreObj.minGrace = 7;
            }
        }
        if (!scoreObj.isFromCompletedTask)
            inspectionDetails.mappingData[0].minScore = scoreObj.maxScoreFinal;
        inspectionDetails.mappingData[0].total_score = score;

        /**********************************************************NEw code *******************************/
        inspectionDetails.mappingData[0].grade_percentage = scorePercentage;


        console.log("Score Obj", scoreObj);
        let scoreArray:any = [];
        scoreArray.push(scoreObj);
        myTasksDraft.setScoreFollow(JSON.stringify(scoreArray));


        setModifiedCheckListData(tempArray);

        props.isScoreCalculated();


    }



    const onScoreImageClick = (item: any, index: any) => {



        let tempScoreArray: any = [];

        let tempArray: any = [...modifiedCheckListData];

        let header = item.FinalScore;
        let sectionIndex = tempArray.findIndex((item: any) => item.title == header);

        //debugger;

        setTitle(item.FinalScore);
        // set current item and index 
        setCurrentSection(sectionIndex);
        setCurrentIndex(index);

        setShowScoreAlert(true);
        setShowGraceAlert(false);
        setShowCommentAlert(false);
        setShowInformationAlert(false);
        setShowRegulationAlert(false);
        setShowAttachmentAlert(false);
    }

    const updateGraceValue = (val: any) => {
        let tempArray: any = [...modifiedCheckListData];
        tempArray[currentSection].data[currentIndex].GracePeriod = val;

        // props.updateGraceValue(tempArray[currentSection].data[currentIndex]);
        setModifiedCheckListData(tempArray);
        setShowAttachmentAlert(false);
    }

    const onGraceImageClick = (item: any, index: any) => {


        let tempArray = [...modifiedCheckListData];

        let header = item.FinalScore;
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
        tempArray[currentSection].data[currentIndex].Comments = val;
        //  props.updateCommentValue(tempArray[currentSection].data[currentIndex]);
        setModifiedCheckListData(tempArray);
    }

    const onCommentImageClick = (item: any, index: any) => {

        let tempArray = [...modifiedCheckListData];

        let header = item.FinalScore;
        let sectionIndex = tempArray.findIndex((item: any) => item.title == header);

        // set current item and index 
        setCurrentSection(sectionIndex);
        setCurrentIndex(index);

        setShowCommentAlert(true);
        setShowGraceAlert(false);
        setShowScoreAlert(false);
        setShowInformationAlert(false);
        setShowRegulationAlert(false);
        setShowAttachmentAlert(false);
    }

    const onInfoImageClick = (item: any, index: any) => {


        let tempArray = [...modifiedCheckListData];

        let header = item.FinalScore;
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


    const onNAClick = (item: any, index: any) => {
        let tempArray: any = [...modifiedCheckListData];

        let header = item.FinalScore;
        let sectionIndex = tempArray.findIndex((item: any) => item.title == header);

        // set current item and index 
        setCurrentSection(sectionIndex);
        setCurrentIndex(index);


        // setModifiedCheckListData(tempArray);
    }

    const dateDiffInDays = (a: any, b: any) => {
        // Discard the time and time-zone information.
        var _MS_PER_DAY = 1000 * 60 * 60 * 24;
        a = new Date(a);
        var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
        var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

        return Math.floor((utc2 - utc1) / _MS_PER_DAY);

    }

    const onDashClick = (item: any, index: any) => {
        console.log("Dash clicked");

        let tempArray: any = [...modifiedCheckListData];
        let header = item.FinalScore;
        let sectionIndex = tempArray.findIndex((item: any) => item.title == header);

        // set current item and index 
        setCurrentSection(sectionIndex);
        setCurrentIndex(index);

        let currentObj = tempArray[sectionIndex].data[index];

        currentObj.isScore = false;
        currentObj.wasNI = false;
        currentObj.scoreDisable = false;

        setModifiedCheckListData(tempArray);

    }



    const onNIClick = (item: any, index: any) => {
        console.log("NI clicked");

        let tempArray: any = [...modifiedCheckListData];
        let header = item.FinalScore;
        let sectionIndex = tempArray.findIndex((item: any) => item.title == header);

        // set current item and index 
        setCurrentSection(sectionIndex);
        setCurrentIndex(index);

        let currentObj = tempArray[sectionIndex].data[index];

        currentObj.isScore = true;
        currentObj.scoreDisable = true;


        if (currentObj.NI) {
            currentObj.score = '-';
            currentObj.Comments = '';
            currentObj.grace = '-';
            currentObj.GracePeriod = '-';
            currentObj.calculatedGracePeriod = '-';
            currentObj.Answers = 5;
            currentObj.NA = false;

        }
        else {
            if (!currentObj.wasUnAnswered) {
                currentObj.Answers = 4;
                currentObj.Comments = 'Satisfactory';
                currentObj.score = 4;
                currentObj.Score = currentObj.Answers * currentObj.Weightage;
                currentObj.wasNI = true;
                currentObj.GracePeriod = 0;
                currentObj.calculatedGracePeriod = 0;
                currentObj.grace = 0;
            }
            else {

                currentObj.score = '-';
                currentObj.Comments = '';
                var gracePeriodTemp = (-dateDiffInDays(currentObj.GracePeriodDate, new Date()));
                if (gracePeriodTemp < 0) {
                    gracePeriodTemp = 0;
                }
                currentObj.GracePeriod = gracePeriodTemp;
                currentObj.calculatedGracePeriod = gracePeriodTemp;
                currentObj.grace = gracePeriodTemp;

                currentObj.Answers = '-';
                //currentObj.Score = '';
                currentObj.wasNI = true;
                if (currentObj.calculatedGracePeriod < 0) {
                    currentObj.GracePeriod = 0;
                    currentObj.calculatedGracePeriod = 0;
                    currentObj.grace = 0;
                }
            }


        }

        let tempScore;
        tempScore = 99;
        for (var i = 0; i < tempArray[sectionIndex].data.length; i++) {
            if (!tempArray[sectionIndex].data[i].NI && !tempArray[sectionIndex].data[i].NA) {
                if ((tempScore >= tempArray[sectionIndex].data[i].Answers) && (tempArray[sectionIndex].data[i].score != '-')) {
                    tempScore = tempArray[sectionIndex].data[i].Answers;
                    if (tempArray[sectionIndex].data[i].score == "N" && tempArray[sectionIndex].data[i].originalScore > 0) {
                        tempScore = tempArray[sectionIndex].data[i].originalScore - 1;
                        tempArray[sectionIndex].data[i].Answers = tempScore;

                    }
                    else if (tempArray[sectionIndex].data[i].Answers == 0) {
                        tempScore = tempArray[sectionIndex].data[i].Answers;
                    }
                }
                else if (tempScore < tempArray[sectionIndex].data[i].Answers && tempArray[sectionIndex].data[i].score == "N") {
                    tempArray[sectionIndex].data[i].Answers = tempArray[sectionIndex].data[i].originalScore - 1;
                }
            }
        }
        if (parseInt(currentObj.Weightage) == 2) {
            currentObj.color = "#ffff66";
        } else {
        }

        setModifiedCheckListData(tempArray);


        getScoreTextFromScoreValue(tempScore);


        console.log("Current Obj in NI", currentObj);

    }

    const onAttachmentImageClick = (item: any, index: any) => {
        let tempArray = [...modifiedCheckListData];

        let header = item.FinalScore;
        let sectionIndex = tempArray.findIndex((item: any) => item.title == header);

        // set current item and index 
        setCurrentSection(sectionIndex);
        setCurrentIndex(index);

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
                ).then(async (result) => {
                    //;
                    if (result['android.permission.READ_EXTERNAL_STORAGE'] && result['android.permission.CAMERA'] && result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted') {
                        selectImage(item);
                    } else if (result['android.permission.READ_EXTERNAL_STORAGE'] || result['android.permission.CAMERA'] || result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'never_ask_again') {
                        ToastAndroid.show('Please Go into Settings -> Applications -> APP_NAME -> Permissions and Allow permissions to continue', ToastAndroid.LONG);
                    }

                })

                // const granted = await PermissionsAndroid.request(
                //     PermissionsAndroid.PERMISSIONS.CAMERA, {
                //     title: 'Smart control App',
                //     message: 'You want to use the camera',
                //     buttonNeutral: 'Ask Me Later',
                //     buttonNegative: 'Cancel',
                //     buttonPositive: 'OK',
                // })
                // if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                //     selectImage(item);
                // } else {
                // }
            }
        } catch (err) {
            console.warn(err);
        }
    }

    const selectImage = async (item: any) => {
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
                    console.log('User cancelled image picker');
                } else if (response.error) {
                    console.log('ImagePicker Error: ' + response.error);
                } else if (response.customButton) {
                    console.log('User tapped custom button: ', response.customButton);
                } else {
                    console.log('ImageResponse: ', response);
                    // debugger;
                    if (response.fileSize) {
                        if (item == 'one') {
                            let tempArray: any = [...modifiedCheckListData];
                            tempArray[currentSection].data[currentIndex].image1 = response.fileName;
                            // tempArray[currentSection].data[currentIndex].image1Base64 = response.data;
                            tempArray[currentSection].data[currentIndex].image1Base64 = response.uri;

                            setBase64One(response.data);
                            setModifiedCheckListData(tempArray);
                        }
                        else {
                            let tempArray: any = [...modifiedCheckListData];
                            tempArray[currentSection].data[currentIndex].image2 = response.fileName;
                            // tempArray[currentSection].data[currentIndex].image2Base64 = response.data;
                            tempArray[currentSection].data[currentIndex].image2Base64 = response.uri;

                            setBase64two(response.data);
                            setModifiedCheckListData(tempArray);
                        }
                    } else {
                        ToastAndroid.show("File grater than 2MB", ToastAndroid.LONG);
                    }
                }
            });

        } catch (error) {
            // alert(JSON.stringify(error))

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
                            okmsg={'OK'}
                            cancelmsg={'Cancel'}
                            title={'Comment'}
                            comment={
                                modifiedCheckListData && modifiedCheckListData.length > 0
                                    ?
                                    currentSection === '' && currentIndex === ''
                                        ?
                                        ''
                                        :
                                        modifiedCheckListData[currentSection].data[currentIndex].Comments
                                    :
                                    ''
                            }
                            message={'Enter comment'}
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
                            minGrace={
                                modifiedCheckListData && modifiedCheckListData.length > 0
                                    ?
                                    currentSection === '' && currentIndex === ''
                                        ?
                                        ''
                                        :
                                        modifiedCheckListData[currentSection].data[currentIndex].MinGracePeriod
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
                                        modifiedCheckListData[currentSection].data[currentIndex].MaxGracePeriod
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
                                        modifiedCheckListData[currentSection].data[currentIndex].GracePeriod
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
                                    currentSection === '' && currentIndex === ''
                                        ?
                                        ''
                                        :
                                        modifiedCheckListData[currentSection].data[currentIndex].DescriptionEnglish
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
                        <FollowUpAlertComponentForScore
                            title={'Select score'}
                            title1={title}
                            currentScore={currentScore}
                            currentGrace={currentGrace}
                            nonCompliance={true}
                            onClickScoreListItem={onClickScoreListItem}
                            onClickScoreListItemSatisfactory={onClickScoreListItemSatisfactory}
                            scoreArray={title == '4' ? scoreArray : scoreArray1}
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
                            base64One={
                                modifiedCheckListData && modifiedCheckListData.length > 0
                                    ?
                                    currentSection === '' && currentIndex === ''
                                        ?
                                        ''
                                        :
                                        modifiedCheckListData[currentSection].data[currentIndex].image1Base64
                                    :
                                    ''
                            }
                            base64Two={
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
                            closeAlert={() => {
                                setShowAttachmentAlert(false);
                            }}
                        />
                        :
                        null
                }

                <View style={{ minHeight: HEIGHT * 0.25, height: 'auto' }}>
                    {
                        modifiedCheckListData && modifiedCheckListData.length > 0
                            ?
                            <AccordionComponentForFollowUp
                                currentScore={currentScore}
                                currentGrace={currentGrace}
                                onDashClick={onDashClick}
                                onNIClick={onNIClick}
                                onScoreImageClick={onScoreImageClick}
                                onGraceImageClick={onGraceImageClick}
                                onCommentImageClick={onCommentImageClick}
                                onInfoImageClick={onInfoImageClick}
                                onAttachmentImageClick={onAttachmentImageClick}
                                onRegulationClick={onRegulationClick}
                                isArabic={context.isArabic}
                                data={modifiedCheckListData} />
                            :
                            null
                    }
                </View>

                <ButtonComponent
                    style={{
                        height: '10%', width: '35%', backgroundColor: fontColor.ButtonBoxColor,
                        borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                        textAlign: 'center'
                    }}
                    buttonClick={() => {
                        calculateScore();


                    }}
                    buttonText={Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.submit}
                />




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

export default observer(FollowUpComponent);
