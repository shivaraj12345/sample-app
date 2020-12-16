import React, { useContext, useState, useEffect } from 'react';
import {
    View, ToastAndroid,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Image, ScrollView,
    FlatList
} from 'react-native';
import { fontColor, fontFamily } from './../../config/config';
import Strings from './../../config/strings';

// get hight and width
const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;
var fs = 20;
// imports
import * as Animatable from 'react-native-animatable';
import TextComponent from '../TextComponent';
import strings from '../../config/strings';
import { Context } from '../../utils/Context';
import ViewShot from "react-native-view-shot";
import RNImageToPdf from 'react-native-image-to-pdf';
import Share from "react-native-share";
import FileViewer from 'react-native-file-viewer';
import InspectionDetails from '../../routes/InspectionDetails';

const ModalComponent = (props: any) => {
    let ChecklistScore: any = {}
    ChecklistScore.MajorArray = [];
    ChecklistScore.ModerateArray = [];
    ChecklistScore.MinorArray = [];
    ChecklistScore.OmittedArray = [];



    let context = useContext(Context);
    const [isClick, setIsClick] = useState({
        pdfCreated: false,
    })

    const [inspectionDetails, setInspectionDetails] = useState(Object());
    const [mappingData, setMappingData] = useState(Object());
    const [checklist, setchecklist] = useState(Array());
    const [equipmentUsed, setEquipmentUsed] = useState(String());
    const [loginName, setLoginName] = useState(String());


    const [majorArray, setMajorArray] = useState(Array())
    const [minorArray, setMinorArray] = useState(Array())
    const [moderateArray, setModerateArray] = useState(Array())
    const [omittedArray, setOmittedArray] = useState(Array())

    const [imageUri, setImageUri] = useState(Object());
    const [pdfPath, SetPdfPath] = useState(Object());



    useEffect(() => {

        let tempMappingData = props.data.mappingData !== '' ? JSON.parse(props.data.mappingData) :[];
        let temp = tempMappingData[0].inspectionForm
        setchecklist(temp);

        let tempData = props.data;
        let name = tempData.LoginName;
        let name1 = name.replace(".", " ");
        setLoginName(name1);
        // console.log("LoginName", name1);
        setInspectionDetails(tempData);


        // let tempMappingData = props.data.mappingData[0];

        let equpmentused = " "
        if (tempMappingData.thermometerCBValue == 'Y') {
            equpmentused = equpmentused + "Thermometer" + ",";
        }
        if (tempMappingData.dataLoggerCBValue == 'Y') {
            equpmentused = equpmentused + " DataLogger" + ",";
        }
        if (tempMappingData.UVlightCBValue == 'Y') {
            equpmentused = equpmentused + " UVlight" + ",";
        }
        if (tempMappingData.flashlightCBValue == 'Y') {
            equpmentused = equpmentused + " FlashLight" + ",";
        }
        if (tempMappingData.luxmeterCBValue == 'Y') {
            equpmentused = equpmentused + " LuxMeter" + ",";
        }

        // console.log("EquipmentUsed", equpmentused);
        let updatedEquipt = equpmentused.slice(0, -1);
        setEquipmentUsed(updatedEquipt);
        // console.log("EquipmentUsed global", equipmentUsed);
        setMappingData(tempMappingData);

        for (let i = 0; i < temp.length; i++) {
            let score = temp[i].score;
            // // console.log("Score", score);
            if (score == 0) {
                var MajorNonComplianceParameters: any = new Object();
                MajorNonComplianceParameters.ParameterNo = temp[i].parameter_reference;
                MajorNonComplianceParameters.ParameterName = temp[i].parameter;
                MajorNonComplianceParameters.ParameterComment = temp[i].comments;
                if (temp[i].image1) {
                    MajorNonComplianceParameters.img1 = temp[i].image1;
                }
                if (temp[i].image2) {
                    MajorNonComplianceParameters.img2 = temp[i].image2;
                }
                ChecklistScore.MajorArray.push(MajorNonComplianceParameters)
            }

            if (score == 1 || score == 2) {
                // // console.log("Ibnside if")
                var ModerateNonComplianceParameters: any = new Object();
                ModerateNonComplianceParameters.ParameterNo = temp[i].parameter_reference;
                ModerateNonComplianceParameters.ParameterName = temp[i].parameter;
                ModerateNonComplianceParameters.ParameterComment = temp[i].comments;
                ChecklistScore.ModerateArray.push(ModerateNonComplianceParameters);
                // // console.log("Checkliosy arrat", ChecklistScore);
            }

            if (score == 3 || score == 4) {
                var MinorNonComplianceParameters: any = new Object();
                MinorNonComplianceParameters.ParameterNo = temp[i].parameter_reference;
                MinorNonComplianceParameters.ParameterName = temp[i].parameter;
                MinorNonComplianceParameters.ParameterComment = temp[i].comments;
                ChecklistScore.MinorArray.push(MinorNonComplianceParameters);
            }


            if (score == 5) {
                var OmittedParameters: any = new Object();
                OmittedParameters.ParameterNo = temp[i].parameter_reference;
                OmittedParameters.ParameterName = temp[i].parameter;
                OmittedParameters.ParameterComment = temp[i].comments;
                ChecklistScore.OmittedArray.push(OmittedParameters);
            }
            // // console.log("Checkliosy arrat1   ", ChecklistScore);
        }
        // alert(JSON.stringify(ChecklistScore.OmittedArray))

        setMajorArray(ChecklistScore.MajorArray);
        setMinorArray(ChecklistScore.MinorArray);
        setModerateArray(ChecklistScore.ModerateArray);
        // setOmittedArray(ChecklistScore.OmittedArray);

        // console.log("setchecklist", checklist.length);
        //  loginName = inspectionDetails.LoginName.replace(".", " "); 

    }, []);


    // grace variable

    const cancelAlert = () => {
        props.closeAlert();
    }


    const shareOptions = () => {
        // console.log("Click on share", pdfPath);

        Share.open({
            url: 'file://' + pdfPath
        })
    }
    const viewPDF = () => {

        const path: any = 'file://' + pdfPath
        FileViewer.open(path)
            .then(() => {
                // console.log("Click on view success");
            })
            .catch(error => {
                // console.log("Error", error);
            });
    }



    const myAsyncPDFFunction = async () => {
        // console.log("Image path", imageUri);    
        try {
            const options = {
                imagePaths: [imageUri.toString()],
                name: inspectionDetails.TaskId + '.pdf',
                maxSize: { // optional maximum image dimension - larger images will be resized
                    width: 900,
                    height: Math.round(HEIGHT / WIDTH * 900),
                },
                 quality: 1, // optional compression paramter
            };
            const pdf = await RNImageToPdf.createPDFbyImages(options);

            setIsClick(prevState => {
                return { ...prevState, pdfCreated: true }
            });
            ToastAndroid.show(Strings[props.isArabic ? 'ar' : 'en'].completedTasks.pdfCreated, 1000);

            // console.log("Success", pdf);
            SetPdfPath(pdf.filePath);
        } catch (e) {
            // console.log("Errior", e);
        }
    }


    const onCapture = (uri: any) => {


        let newUri = uri.substring(7)
        setImageUri(newUri);
        // console.log("do something with ", uri);
    }

    const renderScorelist = (item: any, index: number) => {
        // // console.log("Chewckh", ChecklistScore);
        // // console.log("MajorArray", majorArray);

        // // console.log("Item", item)
        return (

            <TouchableOpacity
                key={item.ContactName}
                style={[context.isArabic ? { borderTopLeftRadius: 10, borderBottomLeftRadius: 10, borderRightColor: '#d51e17', borderRightWidth: 5, borderLeftColor: '#5C666F' } : { borderTopRightRadius: 10, borderBottomRightRadius: 10, borderLeftColor: '#d51e17', borderLeftWidth: 5, borderRightColor: '#5C666F' }, {
                    height: 'auto', padding: 10, flexDirection: "row", width: '95%', alignSelf: 'center', justifyContent: 'center', borderWidth: 1, shadowRadius: 1, backgroundColor: 'white', borderTopColor: '#5C666F', borderBottomColor: '#5C666F', shadowOpacity: 15, shadowColor: 'grey', elevation: 0

                }]}>

                <View style={[{
                    height: 'auto', width: '10%', justifyContent: 'center', flexDirection: context.isArabic ? 'row-reverse' : 'row'
                }]}>
                    <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{item.ParameterNo ? item.ParameterNo :''} </Text>
                </View>
                <View style={[{
                    height: 'auto', width: '30%', justifyContent: 'center', flexDirection: context.isArabic ? 'row-reverse' : 'row'
                }]}>
                    <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{item.ParameterName ? item.ParameterName : ''} </Text>
                </View>
                <View style={[{
                    height: 'auto', width: '60%', justifyContent: 'center', flexDirection: context.isArabic ? 'row-reverse' : 'row'
                }]}>
                    <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{item.ParameterComment ? item.ParameterComment :''} </Text>
                </View>


            </TouchableOpacity>
        )
    }

    return (
        <View style={{ height: 'auto', width: WIDTH, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 20, zIndex: 8, position: 'absolute', ...StyleSheet.absoluteFillObject }}>

            <Animatable.View duration={300} animation='zoomIn' style={[styles.textModal, { height: HEIGHT * 0.90, borderRadius: 20 }]}>

                <View style={{ flex: 1, height: HEIGHT, justifyContent: 'center', backgroundColor: fontColor.greenShade, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>


                    <TouchableOpacity
                        onPress={() => {
                            cancelAlert()
                        }}
                        style={{ height: HEIGHT * 0.04, width: '20%', alignItems: 'center', justifyContent: 'flex-end', alignSelf: 'flex-end', flexDirection: 'row', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>

                        <Image
                            resizeMode="contain"
                            source={require("./../../assets/images/alert_images/close.png")}
                            style={{ height: '70%', width: '70%', flexDirection: 'row', alignSelf: 'center' }} />

                    </TouchableOpacity>

                    <ScrollView
                        contentContainerStyle={{ marginBottom: 10, width: '100%', justifyContent: 'flex-start', alignItems: 'center' }}
                        style={{ backgroundColor: 'white' }}>
                        {/* 
                        <TextComponent
                            textStyle={[styles.alerttext, { color: '#5c666f', fontStyle: 'italic', textAlign: 'center', fontSize: 14, fontWeight: 'normal' }]}
                            label={props.data.TaskId}
                        /> */}


                        <View style={{ width: '100%', height: 'auto' }}>
                            <ViewShot onCapture={onCapture}
                                //   captureMode="continuous"
                                captureMode="mount"
                                 options={{ format: "jpg", quality: 1 }}
                                >

                                <View style={{ height: HEIGHT * 0.16, flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', backgroundColor:'white' }}>

                                    <View style={{height:HEIGHT*0.15,marginVertical:20, width: '100%',marginHorizontal:'5%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', backgroundColor: 'white' }}>
                                        {/* <Text style={{ color: "#58595b", fontSize: 14, textAlign: 'center', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{"ABU DHABI FOOD CONTROL AUTHIRITY"} </Text>
                                        <Text style={{ color: "#58595b", fontSize: 14, textAlign: 'center', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{"سلطة أبو ظبي في الرقابة الغذائية"} </Text> */}
                                 
                                 
                                 <Image
                                            resizeMode="contain"
                                            source={require("./../../assets/images/adfca_new_logo.png")}
                                            style={{ height: '100%', width: '100%', flexDirection: 'row', alignSelf: 'center' }} />

                                    </View>

                                    {/* <View style={{ width: '20%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', backgroundColor: fontColor.greenShade }}>
                                        <Image
                                            resizeMode="contain"
                                            source={require("./../../assets/images/logo-size/SmartControl_Logo.png")}
                                            style={{ height: '70%', width: '70%', flexDirection: 'row', alignSelf: 'center' }} />


                                    </View> */}

                                </View>

                                <View style={{ backgroundColor: fontColor.greenShade, height: HEIGHT * 0.002, width: '90%', justifyContent: 'center', alignItems: 'center', marginHorizontal: '5%' }}></View>


                                <View style={{
                                    width: '100%', alignSelf: 'center', justifyContent: 'flex-start',
                                    shadowRadius: 1, backgroundColor: fontColor.white,
                                }}>

                                    <View style={{ height: HEIGHT * 0.05, flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center', }}>
                                        <View style={{ height: HEIGHT * 0.05, width: '45%', justifyContent: 'center', alignItems: 'flex-start' }}>

                                            <Text style={{ color: fontColor.TitleColor, fontSize: 14, textAlign: 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{"Final Inspection Report"} </Text>
                                        </View>

                                        <View style={{ height: HEIGHT * 0.05, width: '45%', justifyContent: 'center', alignItems: 'flex-end' }}>

                                            <Text style={{ color: fontColor.TitleColor, fontSize: 14, textAlign: 'right', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{"تقرير الفحص النهائي"} </Text>
                                        </View>
                                    </View>


                                    <Text style={{height:'auto', marginTop: 10, color: "#58595b", fontSize: 14, textAlign: 'center', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{mappingData.finalResult ? mappingData.finalResult : ''} </Text>


                                    <View style={{ backgroundColor: fontColor.grey, height: HEIGHT * 0.002, width: '90%', justifyContent: 'center', alignItems: 'center', marginHorizontal: '5%' }}></View>

                                    <View style={{
                                        marginTop: 10,
                                        height: HEIGHT * 0.6, width: '95%', alignSelf: 'center', justifyContent: 'flex-start', borderWidth: 2, borderColor: fontColor.greenShade,
                                        shadowRadius: 1, backgroundColor: fontColor.white, borderRadius: 10, shadowOpacity: 15, shadowColor: fontColor.grey, elevation: 0
                                    }}>


                                        <View style={{ backgroundColor: 'white', height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey, borderRadius: 10 }}>
                                            <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"No"} </Text>
                                            </View>

                                            <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ color: 'black', textAlign: 'center' }}>{inspectionDetails.TaskId}  </Text>
                                            </View>

                                            <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"رقم"}  </Text>
                                            </View>

                                        </View>

                                        <View style={{ backgroundColor: fontColor.lightGrey, height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey }}>
                                            <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"Date"} </Text>
                                            </View>

                                            <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ color: 'black', textAlign: 'center' }}>{inspectionDetails.CompletionDate}</Text>
                                            </View>

                                            <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{'تاريخ'}</Text>
                                            </View>

                                        </View>



                                        <View style={{ backgroundColor: 'white', height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey, borderRadius: 10 }}>
                                            <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"Establishment Name"} </Text>
                                            </View>

                                            <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ color: 'black', textAlign: 'center' }}>{mappingData.CustomerNameEnglish ? mappingData.CustomerNameEnglish :''}</Text>
                                            </View>

                                            <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"اسم المؤسسة"}</Text>
                                            </View>

                                        </View>

                                        <View style={{ backgroundColor: fontColor.lightGrey, height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey }}>
                                            <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"Activity"} </Text>
                                            </View>

                                            <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ color: 'black', textAlign: 'center' }}>{inspectionDetails.BusinessActivity}</Text>
                                            </View>

                                            <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"نشاط"}</Text>
                                            </View>

                                        </View>
                                        <View style={{ backgroundColor: 'white', height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey, borderRadius: 10 }}>
                                            <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"Client Name"} </Text>
                                            </View>

                                            <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ color: 'black', textAlign: 'center' }}>{mappingData.ContactName ? mappingData.ContactName : ''}  </Text>
                                            </View>

                                            <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"اسم العميل"}</Text>
                                            </View>

                                        </View>

                                        <View style={{ backgroundColor: fontColor.lightGrey, height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey }}>
                                            <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"Identification No"} </Text>
                                            </View>

                                            <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ color: 'black', textAlign: 'center' }}>{mappingData.EmiratesId ? mappingData.EmiratesId : ''}  </Text>
                                            </View>

                                            <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"رقم التعريف"}</Text>
                                            </View>

                                        </View>
                                        <View style={{ backgroundColor: 'white', height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey, borderRadius: 10 }}>
                                            <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"Address"} </Text>
                                            </View>

                                            <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ color: 'black', textAlign: 'center' }}>{mappingData.Area ? mappingData.Area : ''}  </Text>
                                            </View>

                                            <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"عنوان"}</Text>
                                            </View>

                                        </View>

                                        <View style={{ backgroundColor: fontColor.lightGrey, height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey }}>
                                            <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"Phone"} </Text>
                                            </View>

                                            <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ color: 'black', textAlign: 'center' }}>{mappingData.ContactNumber ? mappingData.ContactNumber : ''}  </Text>
                                            </View>

                                            <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"هاتف"}</Text>
                                            </View>

                                        </View>
                                        <View style={{ backgroundColor: 'white', height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey, borderRadius: 10 }}>
                                            <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"License No"} </Text>
                                            </View>

                                            <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ color: 'black', textAlign: 'center' }}>{mappingData.LicenseCode ? mappingData.LicenseCode :''}  </Text>
                                            </View>

                                            <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"رقم الرخصة"}</Text>
                                            </View>

                                        </View>

                                        <View style={{ backgroundColor: fontColor.lightGrey, height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey }}>
                                            <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"License Expiry Date"} </Text>
                                            </View>

                                            <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ color: 'black', textAlign: 'center' }}>{mappingData.TradeExpiryDate ? mappingData.TradeExpiryDate : ''}</Text>
                                            </View>

                                            <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"تاريخ انتهاء الترخيص"}</Text>
                                            </View>

                                        </View>
                                        <View style={{ backgroundColor: 'white', height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey, borderRadius: 10 }}>
                                            <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"Type Of Inspection"} </Text>
                                            </View>

                                            <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ color: 'black', textAlign: 'center' }}>{inspectionDetails.TaskType}</Text>
                                            </View>

                                            <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"نوع الفحص"}</Text>
                                            </View>

                                        </View>



                                        <View style={{ backgroundColor: fontColor.lightGrey, height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0 }}>
                                            <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"Date Of Inspection"} </Text>
                                            </View>

                                            <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ color: 'black', textAlign: 'center' }}>{inspectionDetails.CompletionDate}</Text>
                                            </View>

                                            <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"تاريخ الفحص"}</Text>
                                            </View>

                                        </View>

                                        <View style={{ backgroundColor: fontColor.white, height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                                            <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"Name Of inspector"} </Text>
                                            </View>

                                            <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ color: 'black', textAlign: 'center' }}>{loginName}</Text>
                                            </View>

                                            <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"اسم المفتش"}</Text>
                                            </View>

                                        </View>

                                    </View>

                                    <Text style={{ margin: 10, color: fontColor.TitleColor, fontSize: 16, textAlign: 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{"Description of Inspection"} </Text>

                                    <Text style={{ marginHorizontal: 10, color: fontColor.TitleColor, fontSize: 12, textAlign: 'left', fontWeight: '600', fontFamily: fontFamily.textFontFamily }}>{"This inspection has been carried out as per the requiorements of the following inspection method.related temp and other criteria as applicable"} </Text>


                                    <Text style={{ margin: 10, color: fontColor.TitleColor, fontSize: 16, textAlign: 'right', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{"وصف التفتيش"} </Text>

                                    <Text style={{ marginHorizontal: 10, color: fontColor.TitleColor, fontSize: 12, textAlign: 'right', fontWeight: '600', fontFamily: fontFamily.textFontFamily }}>{"تم إجراء هذا الفحص وفقًا لمتطلبات طريقة الفحص التالية: قائمة المراجعة ذات الصلة والمعايير الأخرى حسب الاقتضاء"} </Text>


                                    <View style={{ marginVertical: 10, backgroundColor: fontColor.grey, height: HEIGHT * 0.002, width: '95%', justifyContent: 'center', alignItems: 'center', marginHorizontal: '2.5%' }}></View>


                                    <View style={{ height: HEIGHT * 0.03, flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center', }}>
                                        <View style={{ height: HEIGHT * 0.05, width: '45%', justifyContent: 'center', alignItems: 'flex-start' }}>

                                            <Text style={{ color: fontColor.TitleColor, fontSize: 14, textAlign: 'left', fontWeight: '600', fontFamily: fontFamily.textFontFamily }}>{"Inspection Method Used"} </Text>
                                        </View>

                                        <View style={{ height: HEIGHT * 0.05, width: '45%', justifyContent: 'center', alignItems: 'flex-end' }}>

                                            <Text style={{ color: fontColor.TitleColor, fontSize: 14, textAlign: 'right', fontWeight: '600', fontFamily: fontFamily.textFontFamily }}>{"طريقة الفحص المستخدمة"} </Text>
                                        </View>
                                    </View>

                                    <View style={{ height: HEIGHT * 0.03, width: '95%', justifyContent: 'center', alignItems: 'center' }}>

                                        <Text style={{ color: fontColor.TitleColor, fontSize: 14, fontWeight: 'bold' }}>{equipmentUsed}</Text>
                                    </View>


                                    <View style={{ marginVertical: 10, backgroundColor: fontColor.grey, height: HEIGHT * 0.002, width: '95%', justifyContent: 'center', alignItems: 'center', marginHorizontal: '2.5%' }}></View>



                                    <View style={{ height: HEIGHT * 0.03, flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center', }}>
                                        <View style={{ height: HEIGHT * 0.05, width: '45%', justifyContent: 'center', alignItems: 'flex-start' }}>

                                            <Text style={{ color: fontColor.TitleColor, fontSize: 14, textAlign: 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{"Inspection Results"} </Text>
                                        </View>

                                        <View style={{ height: HEIGHT * 0.05, width: '45%', justifyContent: 'center', alignItems: 'flex-end' }}>

                                            <Text style={{ color: fontColor.TitleColor, fontSize: 14, textAlign: 'right', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{"نتائج التفتيش"} </Text>
                                        </View>
                                    </View>


                                    {majorArray.length ?
                                    <View style={{
                                        margin: 10,
                                        height: HEIGHT * 0.05, flexDirection: 'row', width: '95%', marginHorizontal: '2.5%', justifyContent: 'center', alignItems: 'center', backgroundColor: fontColor.lightGrey, borderWidth: 1, borderColor: fontColor
                                            .greenShade, borderRadius: 5
                                    }}>
                                        <View style={{ height: HEIGHT * 0.05, width: '45%', justifyContent: 'center', alignItems: 'flex-start' }}>

                                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: 'left', fontWeight: '600', fontFamily: fontFamily.textFontFamily }}>{"Major Non conformance Parameters"} </Text>
                                        </View>

                                        <View style={{ height: HEIGHT * 0.05, width: '45%', justifyContent: 'center', alignItems: 'flex-end' }}>

                                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: 'right', fontWeight: '600', fontFamily: fontFamily.textFontFamily }}>{"نتائج التفتيش"} </Text>
                                        </View>
                                    </View>
                                    :null}

                                  
                                        {majorArray.length ?
                                          <View style={{
                                            height: 'auto', width: '95%', alignSelf: 'center', paddingVertical: 10,
                                            borderWidth: 1, borderColor: fontColor.greenShade,
                                            shadowRadius: 1, 
                                            // backgroundColor: fontColor.ButtonBoxColor,
                                            borderRadius: 5, shadowOpacity: 15, shadowColor: fontColor.grey, elevation: 0
                                        }} >
                                            <FlatList
                                                nestedScrollEnabled={true}
                                                data={majorArray}
                                                renderItem={({ item, index }) => {
                                                    return (
                                                        renderScorelist(item, index)
                                                    )
                                                }}
                                                ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
                                            /> 
                                           
                                    </View>:null}



                                    {moderateArray.length ?
                                    <View style={{
                                        margin: 10,
                                        height: HEIGHT * 0.05, flexDirection: 'row', width: '95%', marginHorizontal: '2.5%', justifyContent: 'center', alignItems: 'center', backgroundColor: fontColor.lightGrey, borderWidth: 1, borderColor: fontColor
                                            .greenShade, borderRadius: 5
                                    }}>
                                        <View style={{ height: HEIGHT * 0.05, width: '45%', justifyContent: 'center', alignItems: 'flex-start' }}>

                                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: 'left', fontWeight: '600', fontFamily: fontFamily.textFontFamily }}>{"Moderate Non conformance Parameters"} </Text>
                                        </View>

                                        <View style={{ height: HEIGHT * 0.05, width: '45%', justifyContent: 'center', alignItems: 'flex-end' }}>

                                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: 'right', fontWeight: '600', fontFamily: fontFamily.textFontFamily }}>{"نتائج التفتيش"} </Text>
                                        </View>
                                    </View>:null}



                                    {moderateArray.length ?
                                    <View style={{
                                        height: 'auto', width: '95%', alignSelf: 'center', paddingVertical: 10,
                                        borderWidth: 1, borderColor: fontColor.greenShade,
                                        shadowRadius: 1, backgroundColor: fontColor.white,
                                        borderRadius: 5, shadowOpacity: 15, shadowColor: fontColor.grey, elevation: 0
                                    }} >
                                       
                                            <FlatList
                                                nestedScrollEnabled={true}
                                                data={moderateArray}
                                                renderItem={({ item, index }) => {
                                                    return (
                                                        renderScorelist(item, index)
                                                    )
                                                }}
                                                ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
                                            /> 
                                           
                                    </View>:null}



                                    {minorArray.length ?
                                    <View style={{
                                        margin: 10,
                                        height: HEIGHT * 0.05, flexDirection: 'row', width: '95%', marginHorizontal: '2.5%',
                                        justifyContent: 'center', alignItems: 'center', backgroundColor: fontColor.lightGrey,
                                        borderWidth: 1, borderColor: fontColor.greenShade, borderRadius: 5,
                                    }}>
                                        <View style={{ height: HEIGHT * 0.05, width: '45%', justifyContent: 'center', alignItems: 'flex-start' }}>

                                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: 'left', fontWeight: '600', fontFamily: fontFamily.textFontFamily }}>{"Minor Non conformance Parameters"} </Text>
                                        </View>

                                        <View style={{ height: HEIGHT * 0.05, width: '45%', justifyContent: 'center', alignItems: 'flex-end' }}>

                                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: 'right', fontWeight: '600', fontFamily: fontFamily.textFontFamily }}>{"نتائج التفتيش"} </Text>



                                        </View>
                                    </View>:null}

                        

                                    {minorArray.length ?
                                    <View style={{
                                        height: 'auto', width: '95%', alignSelf: 'center', paddingVertical: 10,
                                        borderWidth: 1, borderColor: fontColor.greenShade,
                                        shadowRadius: 1, backgroundColor: fontColor.white,
                                        borderRadius: 5, shadowOpacity: 15, shadowColor: fontColor.grey, elevation: 0
                                    }} >
                                       
                                            <FlatList
                                                nestedScrollEnabled={true}
                                                data={minorArray}
                                                renderItem={({ item, index }) => {
                                                    return (
                                                        renderScorelist(item, index)
                                                    )
                                                }}
                                                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                                            /> 
                                           
                                    </View>:null}



                                    {omittedArray.length ?
                                    <View style={{
                                        margin: 10,
                                        height: HEIGHT * 0.05, flexDirection: 'row', width: '95%', marginHorizontal: '2.5%', justifyContent: 'center', alignItems: 'center', backgroundColor: fontColor.lightGrey, borderWidth: 1, borderColor: fontColor
                                            .greenShade, borderRadius: 5
                                    }}>
                                        <View style={{ height: HEIGHT * 0.05, width: '45%', justifyContent: 'center', alignItems: 'flex-start' }}>

                                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: 'left', fontWeight: '600', fontFamily: fontFamily.textFontFamily }}>{"Parameters omitted from thje scope of insspection "} </Text>
                                        </View>

                                        <View style={{ height: HEIGHT * 0.05, width: '45%', justifyContent: 'center', alignItems: 'flex-end' }}>

                                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: 'right', fontWeight: '600', fontFamily: fontFamily.textFontFamily }}>{"نتائج التفتيش"} </Text>
                                        </View>
                                    </View>:null}

                                    {/* <Text style={{ color: fontColor.TitleColor, fontSize: 14, textAlign: 'center', fontWeight: '600', fontFamily: fontFamily.textFontFamily }}>{"[List of all the NI questions]"} </Text> */}

                                    {omittedArray.length ?
                                    <View style={{
                                        height: 'auto', width: '95%', alignSelf: 'center', paddingVertical: 10,
                                        borderWidth: 1, borderColor: fontColor.greenShade,
                                        shadowRadius: 1, backgroundColor: fontColor.white,
                                        borderRadius: 5, shadowOpacity: 15, shadowColor: fontColor.grey, elevation: 0
                                    }} >
                                       
                                            <FlatList
                                                nestedScrollEnabled={true}
                                                data={omittedArray}
                                                renderItem={({ item, index }) => {
                                                    return (
                                                        renderScorelist(item, index)
                                                    )
                                                }}
                                                ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
                                            /> 
                                           
                                    </View>:null}



                                    <View style={{
                                        marginTop: 10, padding: 10,
                                        height: 'auto', width: '95%', alignSelf: 'center', justifyContent: 'flex-start', borderWidth: 1, borderColor: fontColor.greenShade,
                                        shadowRadius: 1, backgroundColor: fontColor.white, borderRadius: 10, shadowOpacity: 15, shadowColor: fontColor.grey, elevation: 0
                                    }}>


                                        <View style={{ height: 'auto', flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center', }}>
                                            <View style={{ height: 'auto', width: '45%', justifyContent: 'center', alignItems: 'flex-start' }}>

                                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: 'left', fontWeight: '600', fontFamily: fontFamily.textFontFamily }}>{"Inspection Comments"} </Text>
                                            </View>

                                            <View style={{ height: 'auto', width: '45%', justifyContent: 'center', alignItems: 'flex-end' }}>

                                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: 'right', fontWeight: '600', fontFamily: fontFamily.textFontFamily }}>{"طريقة الفحص المستخدمة"} </Text>
                                            </View>
                                        </View>

                                        <View style={{ marginTop: 10, height: 'auto', width: '95%', justifyContent: 'center', alignItems: 'center' }}>

                                            <Text style={{ color: fontColor.TitleColor, fontSize: 14, fontWeight: 'bold' }}>{mappingData.overallComments ? mappingData.overallComments :''}</Text>
                                        </View>

                                    </View>


                                    <View style={{
                                        marginTop: 10,
                                        height: HEIGHT * 0.3, width: '95%', alignSelf: 'center', justifyContent: 'flex-start', borderWidth: 2, borderColor: fontColor.greenShade,
                                        shadowRadius: 1, backgroundColor: fontColor.white, borderRadius: 10, shadowOpacity: 15, shadowColor: fontColor.grey, elevation: 0
                                    }}>


                                        <View style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10, backgroundColor: fontColor.lightGrey, height: 'auto', flex: 1, flexDirection: 'row', }}>
                                            <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"Final Inspection Result"} </Text>
                                            </View>

                                            <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ color: 'black', textAlign: 'center' }}>{mappingData.finalResult ? mappingData.finalResult :''}  </Text>
                                            </View>

                                            <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"نتيجة الفحص النهائية"}</Text>
                                            </View>

                                        </View>
                                        <View style={{ backgroundColor: 'white', height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey, borderRadius: 10 }}>
                                            <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"Score"} </Text>
                                            </View>

                                            <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ color: 'black', textAlign: 'center' }}>  {mappingData.grade_percentage ? mappingData.grade_percentage : ''} </Text>
                                            </View>

                                            <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"أحرز هدفا"}</Text>
                                            </View>

                                        </View>


                                        <View style={{ backgroundColor: fontColor.lightGrey, height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey }}>
                                            <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"Grace Period"} </Text>
                                            </View>

                                            <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ color: 'black', textAlign: 'center' }}> </Text>
                                            </View>

                                            <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"فترة السماح"}</Text>
                                            </View>

                                        </View>
                                        <View style={{ backgroundColor: 'white', height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey, borderRadius: 10 }}>
                                            <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"Adfca inspector sign"} </Text>
                                            </View>

                                            <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ color: 'black', textAlign: 'center' }}>  </Text>
                                            </View>

                                            <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"توقيع التفتيش"}  </Text>
                                            </View>

                                        </View>



                                        <View style={{ backgroundColor: fontColor.lightGrey, height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                                            <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"Establishment Client Sign"} </Text>
                                            </View>

                                            <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ color: 'black', textAlign: 'center' }}>  </Text>
                                            </View>

                                            <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"تسجيل العميل إنشاء"}</Text>
                                            </View>

                                        </View>

                                    </View>


                                    <View style={{ marginTop: 10, height: HEIGHT * 0.1, width: '100%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', backgroundColor: fontColor.greenShade }}>

                                        <Text style={{ color: "#58595b", fontSize: 14, textAlign: 'center', fontWeight: '600', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{"Note :To make any complaints(or) to appeal against the result of this inspection report,please call 800555"} </Text>

                                        <Text style={{ color: "#58595b", fontSize: 14, textAlign: 'center', fontWeight: '600', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{"ملاحظة: لتقديم أي شكوى (أو) للاستئناف على نتيجة تقرير التفتيش هذا ، يرجى الاتصال على 800555"} </Text>

                                    </View>


                                </View>
                            </ViewShot>

                        </View>
                    </ScrollView>

                </View>


                {isClick.pdfCreated ?
                    <View style={{ height: HEIGHT * 0.05, backgroundColor: 'white', flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: "space-evenly", alignItems: 'center' }}>

                        <TouchableOpacity
                            onPress={viewPDF}
                            style={{ backgroundColor: "#5c666f", justifyContent: 'center', alignItems: 'center', width: '40%', borderRadius: 9, padding: 6 }}>
                            <Text style={{ fontWeight: 'bold', color: 'white' }}>{"View PDF"}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={shareOptions}
                            style={{ backgroundColor: "#5c666f", justifyContent: 'center', alignItems: 'center', width: '40%', borderRadius: 9, padding: 6 }}>
                            <Text style={{ fontWeight: 'bold', color: 'white' }}>{"Share PDF"}</Text>
                        </TouchableOpacity>
                    </View> :
                    <View style={{ height: HEIGHT * 0.05, backgroundColor: 'white', flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={myAsyncPDFFunction}
                            style={{ backgroundColor: "#5c666f", justifyContent: 'center', alignItems: 'center', width: '40%', borderRadius: 9, padding: 6 }}>
                            <Text style={{ fontWeight: 'bold', color: 'white' }}>{"Create PDF"}</Text>
                        </TouchableOpacity>

                    </View>}



            </Animatable.View>

        </View>
    );
}

const styles = StyleSheet.create({
    textModal: {
        position: 'absolute',
        width: WIDTH * 0.9,
        backgroundColor: 'white',
        borderRadius: 5,
        alignSelf: 'center',
        top: HEIGHT * 0.02,
        zIndex: 8
    },
    alerttext: {
        fontSize: 18,
        paddingTop: '5%',
        paddingRight: '5%',
        paddingLeft: '5%',
        paddingBottom: '5%',
        // textAlign: 'justify',
        // marginBottom: '5%',
        fontWeight: 'bold',
        color: 'white'
    },
    confirmMsg: {
        paddingTop: '5%',
        paddingRight: '5%',
        paddingLeft: '5%',
        paddingBottom: '5%',
        fontSize: 15,
        color: 'black',
    },
    buttonOkText: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        fontSize: 17
    }
});

export default ModalComponent;