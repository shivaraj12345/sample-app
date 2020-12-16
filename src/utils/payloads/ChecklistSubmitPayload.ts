import moment from 'moment';
import { getFormattedDate } from './../../config/validator'
let test: any = [];
let nocChecklistArray = Array();
let totalscore = 0;
let score = 0;
let totalScoreFollow = 0;
let maxScore = 0;
let minScore = 99;
let minGrace = 99;
let minGraceFollow = 0;
let scorePercentageFollow: any = 0;
let scorePercentage: any = 0;
let grade = '';
let gradeFollow = '';
let visitFrequency = 0;
let nextVisitDate = '';
let action = '';
let opaDesc: any = '';
let inspectionStatus = '';
let inspectionStatusFlag = false;
let result = '';

const getAction = (minScore: any) => {
    let scoreText = 'Satisfactory';
    switch (minScore) {
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
    }
    return scoreText;
}

const getGrade = (scorePercentage: any) => {
    let grade = 'E';
    if (scorePercentage >= 90 && scorePercentage <= 100) {
        grade = 'A';
    } else if (scorePercentage >= 75 && scorePercentage < 90) {
        grade = 'B';
    } else if (scorePercentage >= 60 && scorePercentage < 75) {
        grade = 'C';
    } else if (scorePercentage >= 45 && scorePercentage < 60) {
        grade = 'D';
    } else if (scorePercentage < 45) {
        grade = 'E';
    }
    return grade;
}

const getVisitFrequencyForHigh = (grade: any) => {
    let temp: any = '';
    switch (grade) {
        case 'Grade A':
            temp = 3;
            break;
        case 'Grade B':
            temp = 4;
            break;
        case 'Grade C':
            temp = 9;
            break;
        case 'Grade D':
            temp = 13;
            break;
        case 'Grade E':
            temp = 13;
            break;
    }
    return temp;
}

// const calculation = () => {
//     console.log("Inside cal");
//     taskItem.mappingData[0].isViolated = false;

//     var score = 0, totalScore = 0, scorePercentage = 0, minGrace = 1000, minScore = 99, weightage = 1;
//     for (var i = 0; i < checklistArray.length; i++) {

//         let obj = checklistArray[i];

//         if (checklistArray[i].NI == true) {
//             if (checklistArray[i].Comments.length == 0) {
//                 var j = i + 1;
//                 return;
//             }
//             else if (checklistArray[i].GracePeriod.toString().length > 0 && minGrace > parseInt(checklistArray[i].GracePeriod) && parseInt(checklistArray[i].GracePeriod) > 0) {
//                 minGrace = parseInt(checklistArray[i].GracePeriod);
//                 continue;
//             }
//             if (checklistArray[i].NI && (checklistArray[i].calculatedGracePeriod == '-')) {
//                 var j = i + 1;
//                 return;
//             }

//         }
//         else {
//             if (checklistArray[i].Comments.length == 0) {

//                 var j = i + 1;
//                 return;

//             }
//             if (checklistArray[i].Weightage == "" || checklistArray[i].Weightage == null) {
//                 weightage = 1;
//             } else {
//                 weightage = parseInt(checklistArray[i].Weightage);
//             }

//         }
//         //if (checklistArray[i].NI == true && checklistArray[i].Answers != 5) {
//         //    checklistArray[i].NI = false;
//         //}
//         //checklistArray[i].originalScore = checklistArray[i].FinalScore;
//         if (checklistArray[i].score == 'Y') {
//             checklistArray[i].FinalScore = 4;
//             checklistArray[i].GracePeriod = 0;
//             checklistArray[i].calculatedGracePeriod = 0;
//         }
//         if (parseInt(checklistArray[i].score) == 4) {
//             // For Score == 4
//             //  Score Calculation
//             checklistArray[i].FinalScore = 4;
//             checklistArray[i].GracePeriod = 0;
//             checklistArray[i].calculatedGracePeriod = 0;
//             score = score + parseInt(checklistArray[i].FinalScore) * checklistArray[i].Weightage;
//             totalScore = totalScore + (4 * weightage);

//         }
//         else {
//             // For score other than 4 , 
//             // If date is from future, do score and grace calculations
//             if (new Date(checklistArray[i].GracePeriodDate) > new Date()) {
//                 //Non Conformant Answered
//                 if (checklistArray[i].score != '' && checklistArray[i].score != '-' && !checklistArray[i].NI) {
//                     checklistArray[i].FinalScore = checklistArray[i].Answers;
//                     score = score + (parseInt(checklistArray[i].FinalScore) * weightage);
//                     totalScore = totalScore + (4 * weightage);
//                 }
//                 else {
//                     // Non Conformant not answered
//                     try {
//                         checklistArray[i].isNotAnswered = true;
//                         if (!isNaN(parseInt(checklistArray[i].score))) {
//                             checklistArray[i].FinalScore = checklistArray[i].score
//                         }
//                         else if (!isNaN(parseInt(checklistArray[i].Answers))) {
//                             checklistArray[i].FinalScore = checklistArray[i].Answers
//                         }

//                     }
//                     catch (e) {

//                     }
//                 }

//             }
//             else {
//                 // If current date,
//                 if (((checklistArray[i].score == '') || ((checklistArray[i].score) == '-')) && !App.isFromCompletedTask) {
//                     if (!(checklistArray[i].NI)) {
//                         var j = i + 1;
//                         return;
//                     }
//                 }
//                 else {
//                     var temp;
//                     if ((!isNaN(parseInt(checklistArray[i].Answers)))) {
//                         temp = parseInt(checklistArray[i].Answers);
//                     }
//                     else {
//                         temp = parseInt((checklistArray[i].Score / weightage));
//                     }
//                     if ((parseInt(checklistArray[i].Answers) > 0)) {
//                         if (!isNaN(parseInt(checklistArray[i].score))) {
//                             checklistArray[i].FinalScore = checklistArray[i].score;

//                         }
//                         else if ((checklistArray[i].score == 'N') && checklistArray[i].originalScore > 0) {
//                             checklistArray[i].FinalScore = checklistArray[i].originalScore - 1;
//                             checklistArray[i].Answers = checklistArray[i].FinalScore;
//                         }
//                     }
//                     else if ((parseInt(checklistArray[i].Answers) == 0)) {
//                         checklistArray[i].FinalScore = checklistArray[i].Answers;
//                     }
//                     score = score + (parseInt(checklistArray[i].FinalScore) * weightage);
//                     totalScore = totalScore + (4 * weightage);

//                 }
//             }
//         }
//         if ((checklistArray[i].GracePeriod) < 0) {
//             checklistArray[i].GracePeriod = 0;
//             checklistArray[i].calculatedGracePeriod = 0;
//         }
//         if (minScore > parseInt(checklistArray[i].FinalScore) && ((checklistArray[i].score.toString().length > 0) && (checklistArray[i].score != '-') && (!checklistArray[i].NI)))
//             minScore = parseInt(checklistArray[i].FinalScore);
//         if (checklistArray[i].GracePeriod.toString().length > 0 && minGrace > parseInt(checklistArray[i].GracePeriod) && parseInt(checklistArray[i].GracePeriod) > 0 && parseInt(checklistArray[i].FinalScore) < 4)
//             minGrace = parseInt(checklistArray[i].GracePeriod);
//         if (checklistArray[i])
//             checklistArray[i].isCalculated = true;

//     }



//     if (score == 0)
//         scorePercentage = 0;
//     else
//         scorePercentage = ((score / totalScore) * 100).toFixed(2);


//     //if (minScore > 0 && minScore!=4)
//     //  minScore--;

//     if (minScore == 0) {
//         taskItem.mappingData[0].isViolated = true;
//     }
//     if (minGrace == 1000) {
//         minGrace = 0;
//     }
//     else {
//         minGrace = 7;
//     }

//     grade = 'Grade' + ' ' + getGrade(scorePercentage);

//     scorePercentageFollow = scorePercentage;
//     minGraceFollow = minGrace;
//     totalScoreFollow = totalScore

// }

const getVisitFrequencyForMedium = (grade: string) => {
    let temp: any = '';
    switch (grade) {
        case 'Grade A':
            temp = 2;
            break;
        case 'Grade B':
            temp = 3;
            break;
        case 'Grade C':
            temp = 6;
            break;
        case 'Grade D':
            temp = 9;
            break;
        case 'Grade E':
            temp = 9;
            break;
    }
    return temp;
}

const getVisitFrequencyForLow = (grade: any) => {
    let temp: any = '';
    switch (grade) {
        case 'Grade A':
            temp = 2;
            break;
        case 'Grade B':
            temp = 3;
            break;
        case 'Grade C':
            temp = 5;
            break;
        case 'Grade D':
            temp = 6;
            break;
        case 'Grade E':
            temp = 6;
            break;
    }
    return temp;
}

const replaceAll1 = (str: string, find: string, replace: string) => {
    if (str)
        return str.replace(new RegExp(find, 'g'), replace);
    else
        return '';
}

const checklistPayload = (checklistArray: any, taskItem: any) => {


    try {

        for (let index = 0; index < checklistArray.length; index++) {

            if (taskItem.TaskType.toLowerCase().includes('noc')) {

                if (checklistArray[index].Score == "Y" && !checklistArray[index].NAValue) {
                    checklistArray[index].Score = 4;
                }
                else if (checklistArray[index].Score == "N" && !checklistArray[index].NAValue) {
                    checklistArray[index].Score = 0;
                }
                else if (checklistArray[index].NAValue) {
                    checklistArray[index].Score = "";
                }
            }
            else {

                if (checklistArray[index].Score == "Y" && !checklistArray[index].NAValue && !checklistArray[index].NIValue) {
                    checklistArray[index].Score = 4;
                }
                else if (checklistArray[index].Score == "N" && !checklistArray[index].NAValue && !checklistArray[index].NIValue) {
                    checklistArray[index].Score = 0;
                }
                else if (checklistArray[index].NAValue || checklistArray[index].NIValue) {
                    checklistArray[index].Score = "";
                }
            }

            checklistArray[index].comment = checklistArray[index].comment.replace(/[$~"?<>{}]/g, ' ');

            let checklist = {

                'GracePeriodDate': '',
                'Answers': checklistArray[index].Score,
                'DescriptionArabic': '',
                'GracePeriod': '',
                'QuestionNameArabic': '',
                'QuestionNameEnglish': checklistArray[index].NOC_parameter_regulation_article_no.toString().replaceAll('&', '&amp;'),
                'Weightage': '',
                'NonComplianceEnglish': '',
                'NonComplianceArabic': '',
                'NA': checklistArray[index].NAValue,
                'NI': checklistArray[index].NIValue ? checklistArray[index].NIValue : '',
                'Comments': checklistArray[index].comment.toString().replace('&', '&amp;'),
                'DescriptionEnglish': checklistArray[index].NOC_parameter_inspection_criteria.toString().replaceAll('&', '&amp;'),
                'ParameterNumber': checklistArray[index].NOC_parameter_sl_no,
                'Regulation': '',
                'Score': checklistArray[index].Score

            };

            nocChecklistArray.push(checklist);

        }
    } catch (error) {
        console.log(error)
    }

}

const submissionPayload = (checklistArray: any, taskId: string, taskItem: any, inspectorName: string, contactName: string, mobileNumber: string, emiratesId: string, finalTime: string, mainComment: string, rejectBtnClick: boolean) => {

    try {
        debugger;
        let payload = Object();

        if (taskItem.TaskType.toLowerCase().includes('noc') || taskItem.TaskType.toLowerCase().includes('food')) {
            checklistPayload(checklistArray, taskItem);

        }
        else {
            scoreCalculations(checklistArray, taskItem);
        }

        if (taskItem.TaskType.toLowerCase().includes('noc') || taskItem.TaskType.toLowerCase().includes('food')) {

            debugger;
            if (rejectBtnClick) {
                action = 'Not Completed';
                nocChecklistArray = [];
            }
            else {
                if (action == 'satisfactory') {
                    action = 'Inspection Approved';
                }
                else {
                    action = 'Inspection Rejeted';
                }
            }
            payload = {
                "InterfaceID": "ADFCA_CRM_SBL_007",
                "TimeStamp": finalTime,
                "LegalRepName": "",
                "InspectionCheckList": {
                    "Inspection": {
                        "OPADesc": opaDesc,
                        "InspectorId": inspectorName,
                        "NearestDate": nextVisitDate,
                        "InspectorName": inspectorName,
                        "LanguageType": "ENU",
                        "GracePeriod": 1,
                        "TaskId": taskId,
                        "Thermometer": "",
                        "Flashlight": "",
                        "DataLogger": "",
                        "LuxMeter": "",
                        "UVLight": "",
                        "ActualInspectionDate": opaDesc,
                        "ScorePercent": '',
                        "ContactName": contactName,
                        "MobileNumber": mobileNumber,
                        "EmiratesId": emiratesId,
                        "Latitude": "",
                        "Longitude": "",
                        "Grade": '',
                        "Comment": mainComment,
                        "Score": '',
                        "Action": action,
                        "InspectionStatus": inspectionStatus,
                        "ListOfFsExpenseItem": {
                            "Checklist": nocChecklistArray
                        }
                    }
                }
            }
        }
        else {
            payload = {
                "InterfaceID": "ADFCA_CRM_SBL_007",
                "TimeStamp": finalTime,
                "LegalRepName": "",
                "InspectionCheckList": {
                    "Inspection": {
                        "OPADesc": opaDesc,
                        "InspectorId": inspectorName,
                        "NearestDate": nextVisitDate,
                        "InspectorName": inspectorName,
                        "LanguageType": "ENU",
                        "GracePeriod": taskItem.TaskType == "Follow-Up" ? minGraceFollow : minGrace,
                        "TaskId": taskId,
                        "Thermometer": "",
                        "Flashlight": "",
                        "DataLogger": "",
                        "LuxMeter": "",
                        "UVLight": "",
                        "ActualInspectionDate": opaDesc,
                        "ScorePercent": taskItem.TaskType == "Follow-Up" ? scorePercentageFollow : scorePercentage,
                        "ContactName": contactName,
                        "MobileNumber": mobileNumber,
                        "EmiratesId": emiratesId,
                        "Latitude": "",
                        "Longitude": "",
                        "Grade": taskItem.TaskType == "Follow-Up" ? gradeFollow : grade,
                        "Comment": mainComment,
                        "Score": taskItem.TaskType == "Follow-Up" ? totalScoreFollow : totalscore,
                        "Action": taskItem.TaskType == "Follow-Up" ? result : action,
                        "InspectionStatus": inspectionStatus,
                        "ListOfFsExpenseItem": {
                            "Checklist": test
                        }
                    }
                },
                "IsReschedule": ""
            }
        }
        // alert(JSON.stringify(payload))

        return payload;
    }
    catch (e) {
        console.log("error: ", e)
        // alert(e);
        return null
    }
}

export default submissionPayload;

const scoreCalculations = (checklistArray: any, taskItem: any) => {
    debugger;
    try {

        if (taskItem.TaskType.toLowerCase().includes('noc')) {
            for (let index = 0; index < checklistArray.length; index++) {

                let obj: any = checklistArray[index];
                // calculate inspection status
                action = 'Satisfactory';
                if (obj.Score == "N") {
                    action = 'UnSatisfactory';
                    break;
                }
                else{
                    continue;
                }
            }
            return { action }
        }
        else {
            for (let index = 0; index < checklistArray.length; index++) {

                let obj: any = checklistArray[index];
                // calculate inspection status


                if (obj.parameter_type === 'EHS') {
                    // TODO
                } else {
                    if (!obj.NA && !obj.NI) {
                        if ((parseInt(obj.Answers) !== 4) && !isNaN(parseInt(obj.Answers))) {
                            inspectionStatusFlag = true;
                            break;
                        }
                    }
                }
                for (let index = 0; index < checklistArray.length; index++) {

                    let obj = checklistArray[index];
                    if (taskItem.TaskType == "Follow-Up") {
                        console.log("In follow")
                        minGraceFollow = parseInt(obj.GracePeriod);
                        score = score + (parseInt(obj.FinalScore) * parseInt(obj.Weightage));
                        totalScoreFollow = totalScoreFollow + (4 * parseInt(obj.Weightage));
                        scorePercentageFollow = ((score / totalScoreFollow) * 100).toFixed(2);
                        gradeFollow = 'Grade' + ' ' + getGrade(scorePercentageFollow);

                    }

                    // calculate total score
                    let scor = obj.TotalScoreForQuestion != '' ? parseInt(obj.TotalScoreForQuestion) : 0;
                    totalscore = totalscore + scor;
                    // calculate max score
                    maxScore = maxScore + (4 * parseInt(obj.parameter_weight_mobility));

                    if (obj.parameter_type === 'EHS') {
                        // TODO
                    } else {
                        // calculate min score
                        if (minScore > parseInt(obj.Answers)) {
                            minScore = parseInt(obj.Answers);
                        }
                    }

                    // calculate min grade
                    if (obj.grace && (minGrace > parseInt(obj.grace)) && (parseInt(obj.Answers) !== 4)) {
                        minGrace = parseInt(obj.grace);
                    }
                    // debugger;

                    let tempObject = {
                        "GracePeriodDate": "",
                        "Answers": obj.Answers,
                        "DescriptionArabic": "",
                        "GracePeriod": obj.grace,
                        "QuestionNameArabic": "",
                        "QuestionNameEnglish": replaceAll1(obj.parameter_type, '&', '&amp;'),
                        "Weightage": obj.parameter_weight_mobility,
                        "NonComplianceEnglish": "",
                        "NonComplianceArabic": "",
                        "NA": obj.NAValue,
                        "EFSTFlag": "",
                        "Action": "",
                        "NI": obj.NIValue,
                        "Comments": replaceAll1(obj.comment, '&', '&amp;'),
                        "MaxGracePeriod": obj.parameter_grace_maximum ? parseInt(obj.parameter_grace_maximum) : 30,
                        "MinGracePeriod": obj.parameter_grace_minimum ? parseInt(obj.parameter_grace_minimum) : 0,
                        "DescriptionEnglish": replaceAll1(obj.parameter, '&', '&amp;'),
                        "ParameterNumber": obj.parameter_reference,
                        "Regulation": "",
                        "Score": obj.TotalScoreForQuestion
                    };

                    test.push(tempObject);
                }

                // calculate grade percentage
                if (totalscore) {
                    totalscore = totalscore
                }
                else {
                    totalscore = 0
                }
                scorePercentage = ((totalscore / maxScore) * 100);
                scorePercentage = scorePercentage.toFixed(2);
                // calculate grade 
                grade = 'Grade' + ' ' + getGrade(scorePercentage);

                // calculate next visit date
                if (taskItem.RiskCategory) {
                    if (taskItem.RiskCategory.toLowerCase() === "high") {
                        let temp = getVisitFrequencyForHigh(grade);
                        visitFrequency = Math.round((365 / temp));
                        debugger;
                    } else if (taskItem.RiskCategory.toLowerCase() === "medium") {
                        let temp = getVisitFrequencyForMedium(grade);
                        visitFrequency = Math.round((365 / temp));
                        debugger;
                    } else if (taskItem.RiskCategory.toLowerCase() === "low") {
                        let temp = getVisitFrequencyForLow(grade);
                        visitFrequency = Math.round((365 / temp));
                        debugger;
                    }
                }

                if (moment().add(visitFrequency, 'days').format('dddd') === 'Friday') {
                    visitFrequency += 2
                } else if (moment().add(visitFrequency, 'days').format('dddd') === 'Saturday') {
                    ++visitFrequency;
                }

                nextVisitDate = moment().add(visitFrequency, 'days').format('YYYY-MM-DD');

                // calculate action using mins score
                action = getAction(minScore);

                // get formatted date
                opaDesc = getFormattedDate(new Date());

                // inspection status
                if (inspectionStatusFlag) {
                    inspectionStatus = 'Inspection Rejected';
                } else {
                    inspectionStatus = 'Inspection Approved';
                }

                debugger;
                if (taskItem.TaskType.toLowerCase() == 'complaint') {
                    nextVisitDate = '';
                    grade = '';
                    totalscore = 0;
                } else if (taskItem.TaskType.toLowerCase() == 'campaign inspection') {
                    if (taskItem.tradeEnglishName && taskItem.tradeEnglishName != "") {
                        totalscore = replaceAll1(taskItem.tradeEnglishName, '&', '&amp;');
                    } else {
                        totalscore = ""
                    }
                }

                return { action }
            }
        }
    }
    catch (error) {
        console.log(error)
    }

}

export { scoreCalculations }