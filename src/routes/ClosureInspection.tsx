import React, { useState, useEffect, useContext, useRef, createRef, } from 'react';
import { Image, View, ScrollView, FlatList, TextInput, StyleSheet, SafeAreaView, Alert, TouchableOpacity, Text, ImageBackground, Dimensions, ToastAndroid } from "react-native";
import BottomComponent from '../components/BottomComponent';
import Header from './../components/Header';
import ButtonComponent from '../components/ButtonComponent';
import TextInputComponent from '../components/TextInputComponent';
const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;
import { fontFamily, fontColor } from '../config/config';
import Strings from '../config/strings';
import { observer } from 'mobx-react';
import { Context } from '../utils/Context';
import NavigationService from '../services/NavigationService';
import Dropdown from '../components/dropdown';
import { RootStoreModel } from '../store/rootStore';
import useInject from "../hooks/useInject";
import { RealmController } from '../database/RealmController';
import LOVSchema from '../database/LOVSchema';
import LoginSchema from '../database/LoginSchema';
import { values } from 'mobx';
import SignatureCapture from 'react-native-signature-capture';
let realm = RealmController.getRealmInstance();
import ImagePicker from 'react-native-image-picker';



const ClosureInspection = (props: any) => {

    const context = useContext(Context);
    const [flexDirections, setflexDirection] = useState('row');
   const [taskId1, setTaskId1] = useState('');
    const [onReason, setOnReason] = useState(Array());
    const [inspectionDetails, setInspectionDetails] = useState(Object());
    const [licenseNum, setLicenseNum] = useState('');
    const [isAcknowledge, setIsAcknowledge] = useState(Boolean);
    const mapStore = (rootStore: RootStoreModel) => ({ establishmentDraft: rootStore.establishmentModel, myTasksDraft: rootStore.myTasksModel, licenseDraft: rootStore.licenseMyTaskModel, closureInspectionDraft: rootStore.closureInspectionModel, documantationDraft:rootStore.documentationAndReportModel})
    const { establishmentDraft, myTasksDraft,closureInspectionDraft ,documantationDraft} = useInject(mapStore)
    const sign = createRef();
    const [taskId, setTaskId] = useState('');
    const [taskList, setTaskList] = useState('');
    const [inspectorName, setInspectorName] = useState('');
    const [licensesCode, setLicenseCode] = useState(Object());    
    const [address, setAddress] = useState(Object()); 


    useEffect(() => {
        const licensesCode = props.route ? props.route.params ? props.route.params.licenseNum : {} : {};
        
        let license = licensesCode;
        // console.log("licenseNumber is closure ", license);
        setLicenseCode(licensesCode);
        closureInspectionDraft.setLicenseNumber(license);

        return () => {
            establishmentDraft.setEstablishmentDataBlank()
        }
    }, []);

    useEffect(() => {
        let licnseNumber = JSON.parse(myTasksDraft.selectedTask).LicenseNumber;
        setLicenseCode(licnseNumber);
        let addressIs =JSON.parse(myTasksDraft.selectedTask);
       
    }, []); 


    useEffect(() => {
        let loginInfo = RealmController.getLoginData(realm, LoginSchema.name);
        // console.log("loginInfo", loginInfo[0].loginResponse);
        let inspectorName = JSON.parse(loginInfo[0].loginResponse).InspectorName;
        setInspectorName(inspectorName);
       

        let taskId = JSON.parse(myTasksDraft.selectedTask).TaskId;
        setTaskId(taskId);
    }, []); 

    useEffect(() => {
      
        if (myTasksDraft.isMyTaskClick == 'license') {
            if (myTasksDraft.NOCList != '')
                setTaskList(JSON.parse(myTasksDraft.NOCList));
        }
    }, []); 

    

    const [error, setError] = useState({
        inspectionIdError: '',
        commentError: ''
    });

   

    

    let saveImageFlag = false;

    const saveSign = () => {
        //sign.current.saveImage();
        documantationDraft.setSaveImageFlag("true");
       

    };

    const resetSign = () => {

       
    };

    const onSaveEvent = (result: any) => {

      
        closureInspectionDraft.setFileBuffer(result.encoded);
        closureInspectionDraft.postToSignature();

    };

    const onDragEvent = () => {

        
    };


   /* const onClickImage =() =>{
        Alert.alert('Hiii I am in image');

    }*/

    const onImageClick =() =>{
        var options = {
            title: 'Select Image',
            customButtons: [
                { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
            ],
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        ImagePicker.showImagePicker(options, response => {
            // console.log('Response = ', response);

            if (response.didCancel) {
                // console.log('User cancelled image picker');
            } else if (response.error) {
                // console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                // console.log('User tapped custom button: ', response.customButton);
                Alert.alert(response.customButton);
            } else {
                let source = response;
             
            }
        });
    };    
    

    const onSubmit = () => {
        let flag = true;

        if (closureInspectionDraft.comment == '') {
            Alert.alert('please enter the comment');
            flag = false;
        }
        if (flag) {

            closureInspectionDraft.callToClosureInspectionChecklist();
        }
      
    }
    const onClickYes = () => {
         
        let s = 'Inspection Approved';
    }
    const onClickNo= () =>{
    let s = 'Inspection Rejected';
    
    }
    return (

 <SafeAreaView style={{ flex: 1 }}>

         <ImageBackground style={{ height: HEIGHT, width: WIDTH }} source={context.isArabic ? require('./../assets/images/backgroundimgReverse.jpg') : require('./../assets/images/backgroundimg.jpg')}>

                <View style={{ flex: 2.5}}>
                    <Header isArabic={context.isArabic} />
                </View>

                <View style={{ flex: 1}}>

                    <View style={{ flex: 1, flexDirection: 'row', width: '80%', alignSelf: 'center' }}>

                        <View style={{ flex: 1 }}>
                            <View style={{ flex: 0.5, borderBottomColor: '#5C666F', borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                        <View style={{ flex: 1.5, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: '#5C666F', fontSize: 14, fontWeight: 'bold' }}>{Strings[context.isArabic ? 'ar' : 'en'].closureInspection.title}</Text>
                        </View>

                        <View style={{ flex: 1}}>
                            <View style={{ flex: 0.9, borderBottomColor: '#5C666F', borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                    </View>

                </View>

                <View style={{ flex: 0.7, flexDirection: 'row', width: '85%', justifyContent: 'center', alignSelf: 'center', borderWidth: 1, borderRadius: 18, borderColor: '#abcfbf' }}>

                    <View style={{ flex: 0.5 }} />

                    <View style={{ flex: 2.2, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold' }}>{Strings[context.isArabic ? 'ar' : 'en'].inspectionDetails.inspectionNo + ":-"}</Text>
                    </View>

                    <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#5C666F', fontSize: 11, fontWeight: 'bold' }}>{taskId}</Text>
                    </View>

                    <View style={{ flex: 0.008, height: '50%', alignSelf: 'center', borderWidth: 0.2, borderColor: '#5C666F' }} />

                    <View style={{ flex: 1.8, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold', textAlign: context.isArabic ? 'right' : 'left' }}>{'Fujitsu India'}</Text>
                    </View>

                    <View style={{ flex: 0.8 }} />

                </View>



                <View style={{ flex: 0.9 }} />

                <View style={{ flex: 6.5, width: '80%', alignSelf: 'center' }}>

                    <View style={{ flex: 2.5, height: HEIGHT * 0.05, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 11, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].closureInspection.tradeName)} </Text>
                        </View>

                        <View style={styles.space} />

                        <View style={styles.TextInputContainer}>

                            <TextInputComponent
                                style={{
                                    height: '100%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 5, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                isArabic={context.isArabic}
                                value={''}
                                maxLength={props.maxLength ? props.maxLength : 50}
                                numberOfLines={props.numberOfLines}
                                placeholder={props.placeholder}
                                editable={props.editable}
                                isMultiline={props.isMultiline ? props.isMultiline : false}
                                keyboardType={'numeric'}
                                placeholderTextColor={fontColor.TextBoxTitleColor}
                                onChange={(val: string) => {
                                    // onHoldRequestDraft.setInspectionId(val);
                                    setError(prevState => {
                                        return { ...prevState, trainedError: '' }
                                    });
                                }}
                            />
                            

                        </View>

                    </View>

                    <View style={{ flex: 0.9 }} />

                    <View style={{ flex: 2.5, height: HEIGHT * 0.5, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].closureInspection.address)} </Text>
                        </View>

                        <View style={styles.space} />

                        <View style={styles.TextInputContainer}>

                            <TextInputComponent
                                style={{
                                    height: '100%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                isArabic={context.isArabic}
                                value={''}
                                maxLength={props.maxLength ? props.maxLength : 50}
                                numberOfLines={props.numberOfLines}
                                placeholder={props.placeholder}
                                editable={props.editable}
                                isMultiline={props.isMultiline ? props.isMultiline : false}
                                keyboardType={'numeric'}
                                placeholderTextColor={fontColor.TextBoxTitleColor}
                                onChange={(val: string) => {
                                   // onHoldRequestDraft.setType(val);
                                    setError(prevState => {
                                        return { ...prevState, trainedError: '' }
                                    });
                                }}
                            />
                           


                        </View>

                    </View>

                    <View style={{ flex: 0.9, }} />

                    <View style={{ flex: 2.5, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].closureInspection.licenseNo)} </Text>
                        </View>

                        <View style={styles.space} />
                        <View style={styles.TextInputContainer}>
                            <TextInputComponent
                                style={{
                                    height: '100%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                isArabic={context.isArabic}
                                maxLength={props.maxLength ? props.maxLength : 50}
                                numberOfLines={props.numberOfLines}
                                placeholder={props.placeholder}
                                editable={props.editable}
                                isMultiline={props.isMultiline ? props.isMultiline : false}
                                keyboardType={'numeric'}
                                placeholderTextColor={fontColor.TextBoxTitleColor}
                                value={licensesCode}
                                onChange={(val: string) => {
                                   closureInspectionDraft.setLicenseNumber(val)
                                    //onHoldRequestDraft.setCreatedBy(val);
                                    setError(prevState => {
                                        return { ...prevState, trainedError: '' }
                                    });
                                }}
                            />

                            {/* {error.createdByError == 'required' || error.createdByError == 'invalid' ?
                                error.createdByError == 'required' ? <Text style={{ fontSize: 10, bottom: 0, color: 'red', paddingLeft: 4 }}>{('This Field Is Requied')}</Text>
                                    :
                                    error.createdByError == 'invalid' ? <Text style={{ fontSize: 10, bottom: 0, color: 'red', paddingLeft: 4 }}>{('Invalid')}</Text>
                                        : null : null} */}

                        </View>

                    </View>


                    <View style={{ flex: 0.9, }} />

                    <View style={{ flex: 2.5, height: HEIGHT * 0.05, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].closureInspection.comment)} </Text>
                        </View>

                        <View style={styles.space} />

                        <View style={styles.TextInputContainer}>
                            <TextInputComponent
                                style={{
                                    height: '100%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                isArabic={context.isArabic}
                                value={closureInspectionDraft.taskId}
                                maxLength={props.maxLength ? props.maxLength : 50}
                                numberOfLines={props.numberOfLines}
                                placeholder={props.placeholder}
                                editable={props.editable}
                                isMultiline={props.isMultiline ? props.isMultiline : false}
                                keyboardType={'numeric'}
                                placeholderTextColor={fontColor.TextBoxTitleColor}
                                onChange={(val: string) => {
                                    closureInspectionDraft.setComment(val);
                                    setError(prevState => {
                                        return { ...prevState, commentError: '' }
                                    });
                                }}
                            />
                           
                        </View>

                    </View>
                    <View style={{ flex: 0.9, }} />

                    <View style={{ flex: 2.5, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].closureInspection.nameoffoodbusinessoperator)} </Text>
                        </View>

                        <View style={styles.space} />

                        <View style={styles.TextInputContainer}>
                            <TextInputComponent
                                style={{
                                    height: '100%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                isArabic={context.isArabic}
                                value={closureInspectionDraft.taskId}
                                maxLength={props.maxLength ? props.maxLength : 50}
                                numberOfLines={props.numberOfLines}
                                placeholder={props.placeholder}
                                editable={props.editable}
                                isMultiline={props.isMultiline ? props.isMultiline : false}
                                keyboardType={'numeric'}
                                placeholderTextColor={fontColor.TextBoxTitleColor}
                                onChange={(val: string) => {
                                    closureInspectionDraft.setTaskId(val);
                                    setError(prevState => {
                                        return { ...prevState, trainedError: '' }
                                    });
                                }}
                            />
                        </View>

                    </View>
                    <View style={{ flex: 0.9, }} />

                    <View style={{ flex: 2.5, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].closureInspection.inspectorName)} </Text>
                        </View>

                        <View style={styles.space} />

                        <View style={styles.TextInputContainer}>
                            <TextInputComponent
                                style={{
                                    height: '100%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                isArabic={context.isArabic}
                                value={inspectorName}
                                maxLength={props.maxLength ? props.maxLength : 50}
                                numberOfLines={props.numberOfLines}
                                placeholder={props.placeholder}
                                editable={props.editable}
                                isMultiline={props.isMultiline ? props.isMultiline : false}
                                keyboardType={'numeric'}
                                placeholderTextColor={fontColor.TextBoxTitleColor}
                                onChange={(val: string) => {
                                    closureInspectionDraft.setTaskId(val);
                                    setError(prevState => {
                                        return { ...prevState, trainedError: '' }
                                    });
                                }}
                            />
                           

                        </View>

                    </View>
                </View>

                <View style={{flex:0.2}} />
                <View style={{ flex: 3, justifyContent: 'center', margin: 30 }}>

                    <View style={{ flex: 5, justifyContent: 'center', backgroundColor: fontColor.TextInputBoxColor, borderTopLeftRadius: 6, borderTopRightRadius: 6 }}>

                    {/*    <TextInputComponent
                            placeholder={Strings[props.isArabic ? 'ar' : 'en'].closureInspection.signatureOfFood}
                            style={{
                                height: '100%', textAlign: 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderTopLeftRadius: 8, borderTopRightRadius: 8
                            }}
                            onChange={(val) => { }}
                            value={''}
                        /> */}
                        
                        <SignatureCapture
                            style={{
                                height: '80%', textAlign: 'center', alignSelf: 'center', width: '80%', color: fontColor.TextBoxTitleColor,
                                fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 3, borderTopLeftRadius: 6, borderTopRightRadius: 6
                            }}
                            ref={sign}
                            onSaveEvent={onSaveEvent}
                            onDragEvent={onDragEvent}
                            saveImageFileInExtStorage={false}
                            showNativeButtons={false}
                            showTitleLabel={false}
                        />  
                    </View>


                    <View style={{ backgroundColor: '#c0c0c0', flex: 2, justifyContent: 'center', borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}>

                        <View style={{ backgroundColor: '#c0c0c0', alignSelf: props.isArabic ? 'flex-start' : 'flex-end', width: '35%', flexDirection: props.isArabic ? 'row-reverse' : 'row', flex: 1, justifyContent: 'center' }}>

                            <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#5c666f', height: '100%' }}>

                                <TouchableOpacity
                                    onPress={() => {

                                    }}>
                                    <Image style={{ alignSelf: 'center', transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }] }} source={require('./../assets/images/startInspection/edit.png')} />
                                </TouchableOpacity>
                            </View>

                            <View style={{ flex: .2 }} />

                            <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#5c666f', height: '100%' }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        resetSign();
                                    }} >
                                    <Image style={{ alignSelf: 'center' }} source={require('./../assets/images/startInspection/delete.png')}
                                    />
                                </TouchableOpacity>
                            </View>

                            <View style={{ flex: .2 }} />

                            <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#5c666f', height: '100%' }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        saveSign();
                                    }}>
                                    <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold', textAlign: 'center' }}>{Strings[props.isArabic ? 'ar' : 'en'].documentAndRecord.save}</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{ flex: .2 }} />

                        </View>

                        <View style={{ flex: .2 }} />

                    </View>

                </View>

                <View style={styles.space} />
                


                <View style={{ flex: 2, justifyContent: 'center' }}>

                    <View style={{ flex: 1, justifyContent: 'center', flexDirection: props.isArabic ? 'row-reverse' : 'row' }}>

                        <View style={{ flex: 2, width: '100%', justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>

                            <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>

                                <TouchableOpacity
                                    onPress={() => {
                                        onImageClick();
                                        
                                    }}
                                    style={{
                                        flex: 1, justifyContent: 'center', backgroundColor: fontColor.TextInputBoxColor, padding: 20, borderRadius: 8
                                    }}>

                                    <Image
                                        source={require("./../assets/images/condemnation/attachmentImg.png")}
                                        style={{ height: 24, width: 24, transform: [{ rotateY: props.isArabic ? '180deg' : '1deg' }] }}
                                        resizeMode={"contain"} />

                                </TouchableOpacity>

                            </View>

                            <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>

                                <TouchableOpacity
                                    onPress={() => {
                                        onClickImage();
                                       
                                    }}
                                    style={{
                                        flex: 1, justifyContent: 'center', backgroundColor: fontColor.TextInputBoxColor, padding: 20, borderRadius: 8
                                    }}>

                                    <Image
                                        source={require("./../assets/images/condemnation/attachmentImg.png")}
                                        style={{ height: 24, width: 24, transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }] }}
                                        resizeMode={"contain"} />

                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>

                                <TouchableOpacity
                                    onPress={() => {
                                        onImageClick();
                                        // console.log('here is 3 st image');
                                    }}
                                    style={{
                                        flex: 1, justifyContent: 'center', backgroundColor: fontColor.TextInputBoxColor, padding: 20, borderRadius: 8
                                    }}>

                                    <Image
                                        source={require("./../assets/images/condemnation/attachmentImg.png")}
                                        style={{ height: 24, width: 24, transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }] }}
                                        resizeMode={"contain"} />

                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>

                                <TouchableOpacity
                                    onPress={() => {
                                        onImageClick();
                                        // console.log('here is 4 st image');
                                    }}
                                    style={{
                                        flex: 1, justifyContent: 'center', backgroundColor: fontColor.TextInputBoxColor, padding: 20, borderRadius: 8
                                    }}>

                                    <Image
                                        source={require("./../assets/images/condemnation/attachmentImg.png")}
                                        style={{ height: 24, width: 24, transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }] }}
                                        resizeMode={"contain"} />

                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>

                                <TouchableOpacity
                                    onPress={() => {
                                        // console.log('here is 5 st image');
                                        onImageClick();
                                    }}
                                    style={{
                                        flex: 1, justifyContent: 'center', backgroundColor: fontColor.TextInputBoxColor, padding: 20, borderRadius: 8
                                    }}>

                                    <Image
                                        source={require("./../assets/images/condemnation/attachmentImg.png")}
                                        style={{ height: 24, width: 24, transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }] }}
                                        resizeMode={"contain"} />

                                </TouchableOpacity>
                            </View>

                            <View style={{ flex: 0.3 }} />

                        </View>

                    </View>

                    <View style={{ flex: 0.5 }} />
                    <View style={styles.space} />
                    <View style= {{flexDirection:'row'}}/>
                    <View style={{ flex: 0.8, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                        <View style={{ flex: 2, justifyContent: 'center', height: '100%', margin: 3.5,alignItems:'center' }}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].closureInspection.msg)} </Text>
                        </View>

                        <View style={{ flex: 0.9, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', width: '70%', alignSelf: 'center' }}>
                            <View style={{ flex: .2 }} />

                            <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#5c666f', height: '100%', alignItems: 'center', borderRadius: 5 }}>
                                <TouchableOpacity
                                
                                    onPress={() => {
                                       
                                        onClickYes();
                                        

                                 }}>
                                    <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold', textAlign: 'center', margin: 1 ,alignItems:'center'}}>{Strings[props.isArabic ? 'ar' : 'en'].closureInspection.yes}</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{ flex: .2 }} />

                            <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#5c666f', height: '100%', alignItems: 'center', borderRadius: 5 }}>
                                <TouchableOpacity
                                    onPress={() => {
                                
                                     onClickNo();
                                       
                                    }}>
                                    <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold', textAlign: 'center', margin: 1 }}>{Strings[props.isArabic ? 'ar' : 'en'].closureInspection.no}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: .2 }} />
                        </View>
                    </View>
                    <View style={styles.space} />
                    <View style={{ flex: 0.8 }} />
                </View>

                <View style={{ flex: 0.1 }} />
                <View style={{ flex: 0.9, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', width: '80%', alignSelf: 'center' }}>

                    <View style={{ flex: 0.2 }} />

                    <ButtonComponent
                        style={{ height: '100%', width: '40%', backgroundColor: fontColor.ButtonBoxColor, borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}
                         buttonClick={() => {
                            onSubmit();
                        }}
                        // buttonClick={() => }
                        textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                        buttonText={Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.submit}
                    />

                    <View style={{ flex: 0.2 }} />

                    <ButtonComponent
                        style={{ height: '100%', width: '40%', backgroundColor: fontColor.ButtonBoxColor, alignSelf: 'center', borderRadius: 8, justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
                        buttonClick={() => {
                            onClickYes()
                            // Alert.alert('you clicked YES....');
                           // NavigationService.navigate('StartInspection');
                        }}
                        textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                        buttonText={(Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.cancel)}
                    />

                    <View style={{ flex: 0.2 }} />

                </View>

                <View style={{ flex: 1.9 }} />
                <View style={{ flex: 1.8 }}>
                    <BottomComponent isArabic={context.isArabic} />
                </View>


            </ImageBackground>

        </SafeAreaView >
    )
}

const styles = StyleSheet.create({

    containter: {
        flex: 1
    },
    fixed: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    TextInputContainer: {
        flex: 0.6,
        justifyContent: "center",
        alignSelf: 'center',
    },
    space: {
        flex: 0.1,
    },

    textContainer: {
        flex: 0.4,
        justifyContent: 'center'
    },

});

export default observer(ClosureInspection);

