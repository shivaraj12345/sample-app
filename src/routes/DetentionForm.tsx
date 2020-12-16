import React, { useState, useEffect, useContext, useRef } from 'react';
import { Image, View, ScrollView, FlatList, TextInput, StyleSheet, SafeAreaView, Alert, TouchableOpacity, Text, ImageBackground, Dimensions, ToastAndroid, PermissionsAndroid } from "react-native";
import BottomComponent from '../components/BottomComponent';
import Header from './../components/Header';
import ButtonComponent from '../components/ButtonComponent';
import TextInputComponent from '../components/TextInputComponent';
import DateComponent from '../components/DateComponent';
const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;
import { fontFamily, fontColor } from '../config/config';
import Strings from '../config/strings';
import { observer } from 'mobx-react';
import { Context } from '../utils/Context';
import NavigationService from '../services/NavigationService';
import Dropdown from '../components/dropdown';
import { RootStoreModel } from '../store/rootStore';
import ImagePicker from 'react-native-image-picker';
import useInject from "../hooks/useInject";
import { RealmController } from '../database/RealmController';
let realm = RealmController.getRealmInstance();
import LOVSchema from '../database/LOVSchema';
import AlertComponentForAttachment from './../components/AlertComponentForAttachment';
import {
    Menu,
    MenuProvider,
    MenuOptions,
    MenuTrigger,
    renderers,
} from 'react-native-popup-menu';
const { Popover } = renderers

const DetentionForm = (props: any) => {

    const context = useContext(Context);
    const [inspectionDetails, setInspectionDetails] = useState(Object());
    const [unit, setUnit] = useState(Array());
    const [packageArr, setPackageArr] = useState(Array());
    const [places, setPlaces] = useState(Array());
    const [reason, setReason] = useState(Array());
    const [serialNumber, setSerialNumber] = useState(0);
    const mapStore = (rootStore: RootStoreModel) => ({ detentionDraft: rootStore.detentionModel, myTasksDraft: rootStore.myTasksModel, establishmentDraft: rootStore.establishmentModel })
    const { detentionDraft, myTasksDraft, establishmentDraft } = useInject(mapStore);

    const [attachmentClick, setAttachmentClick] = useState('one');
    const [showAttachmentAlert, setShowAttachmentAlert] = useState(false);

    let dropdownRef1 = useRef(null);
    let dropdownRef2 = useRef();
    let dropdownRef3 = useRef();
    let dropdownRef4 = useRef(null);
    let temp = [
        { type: 'Organization', value: "" },
        { type: 'Person' },
        { type: 'Person' },
    ]

    const unitArr = [
        { type: 'Cneti Meter', value: 'Cneti Meter' },
        { type: 'FLOZ', value: 'FLOZ' },
        { type: 'Gallon', value: 'Gallon' },
        { type: 'Gram', value: 'Gram' },
        { type: 'Inch', value: 'Inch' },
    ]

    // const packageArr = [
    //     { type: 'Package1', value: 'Package1' },
    //     { type: 'Package2', value: 'Package2' },
    //     { type: 'Package3', value: 'Package3' },
    //     { type: 'Package4', value: 'Package4' },
    // ]

    useEffect(() => {
        const inspectionDetails = props.route ? props.route.params ? props.route.params.inspectionDetails : {} : {};
        setInspectionDetails(inspectionDetails);
    }, []);

    useEffect(() => {
        const inspectionDetails = props.route ? props.route.params ? props.route.params.inspectionDetails : {} : {};
        setSerialNumber(props.route ? props.route.params ? props.route.params.serialNumber : props.route.params.serialNumber : 0);
        if (props.route.params && props.route.params.serialNumber) {
            let getType = typeof (props.route.params.serialNumber);
            if (getType == 'string') {
                detentionDraft.setSerialNumber(props.route.params.serialNumber);
            }
            else {
                detentionDraft.setSerialNumber(props.route && props.route.params ? ''.concat(props.route.params && props.route.params.serialNumber) : '0');
            }
        }
        // console.log("SerialNO:" + detentionDraft.serialNumber)
        debugger
        setInspectionDetails(inspectionDetails);

        let placesData = RealmController.getLovDataByKey(realm, LOVSchema.name, 'ADFCA_CONDEMNATION_PLACE'), placesArr = [];
        let packageData = RealmController.getLovDataByKey(realm, LOVSchema.name, 'FINCORP_DEAL_APPROVAL_AUTH'), packageArrData = [];
        let reasonData = RealmController.getLovDataByKey(realm, LOVSchema.name, 'ADFCA_CONDEMNATION_REASON'), reasonsArr = [];
        // let productNameData = RealmController.getLovDataByKey(realm,LOVSchema.name,'ADFCA_CONDEMNATION_PLACE');
        let unitData = RealmController.getLovDataByKey(realm, LOVSchema.name, 'WEB_COLLAB_TYPE'), unitArr = [];

        // for (let indexPlaces = 0; indexPlaces < placesData.length; indexPlaces++) {
        //     const element = placesData[indexPlaces];
        //     placesArr.push({ type: element.Value, value: element.Value })
        // }
        for (let indexpackage = 0; indexpackage < packageData.length; indexpackage++) {
            const element = packageData[indexpackage];
            packageArrData.push({ type: element.Value, value: element.Value })
        }
        // for (let indexreason = 0; indexreason < reasonData.length; indexreason++) {
        //     const element = reasonData[indexreason];
        //     reasonsArr.push({ type: element.Value, value: element.Value })
        // }
        for (let indexunit = 0; indexunit < unitData.length; indexunit++) {
            const element = unitData[indexunit];
            unitArr.push({ type: element.Value, value: element.Value })
        }

        // setPlaces(placesArr);
        setPackageArr(packageArrData);
        setUnit(unitArr);
        // setReason(reasonsArr);

        return () => {
            detentionDraft.setClearData();
        }
    }, [])

    // const callToAttachment = (item) => {
    //     let options = {
    //         title: 'Select Image',
    //         noData: false,
    //         customButtons: [
    //             { name: 'Test', title: 'Cancel' },
    //         ],
    //         storageOptions: {
    //             skipBackup: true,
    //             path: 'images'
    //         }
    //     };
    //     try {
    //         ImagePicker.launchCamera(options, (response) => {
    //             if (response.didCancel) {
    //                 // console.log('User cancelled image picker');
    //             } else if (response.error) {
    //                 // console.log('ImagePicker Error: '+ response.error);
    //             } else if (response.customButton) {
    //                 // console.log('User tapped custom button: ', response.customButton);
    //             } else {
    //                 // console.log('ImageResponse: ', response);
    //                 debugger;
    //                 if (response.fileSize) {
    //                     if (item == 'one') {
    //                         detentionDraft.setAttachment1(response.data);
    //                     }
    //                     else {
    //                         detentionDraft.setAttachment2(response.data);
    //                     }

    //                 } else {
    //                     ToastAndroid.show("File grater than 2MB", ToastAndroid.LONG);
    //                 }
    //             }
    //         });

    //     } catch (error) {
    //     // alert(JSON.stringify(error))

    //     }
    // }

    // const selectImage = async (item) => {

    //     let imageData: any = {};
    //     let options = {
    //         title: 'Select Image',
    //         noData: false,
    //         customButtons: [
    //             { name: 'Test', title: 'Cancel' },
    //         ],
    //         storageOptions: {
    //             skipBackup: true,
    //             path: 'images'
    //         }
    //     };
    //     try {
    //         ImagePicker.launchCamera(options, (response) => {
    //             if (response.didCancel) {
    //                 // console.log('User cancelled image picker');
    //             } else if (response.error) {
    //                 // console.log('ImagePicker Error: '+ response.error);
    //             } else if (response.customButton) {
    //                 // console.log('User tapped custom button: ', response.customButton);
    //             } else {
    //                 // console.log('ImageResponse: ', response);
    //                 debugger;
    //                 if (response.fileSize) {

    //                     if (item == 'one') {

    //                         imageData.image1 = response.fileName;
    //                         imageData.image1Base64 = response.data;
    //                         imageData.image1Uri = response.uri;

    //                         detentionDraft.setAttachment1(JSON.stringify(imageData));
    //                     }
    //                     else {
    //                         imageData.image1 = response.fileName;
    //                         imageData.image1Base64 = response.data;
    //                         imageData.image1Uri = response.uri;
    //                         detentionDraft.setAttachment2(JSON.stringify(imageData));
    //                     }

    //                 }
    //                 else {
    //                     ToastAndroid.show("File grater than 2MB", ToastAndroid.LONG);
    //                 }
    //             }
    //         });

    //     } catch (error) {
    //         // alert(JSON.stringify(error))

    //     }
    // }

    // const callToAttachment = async (item) => {

    //     try {
    //         // if (condemnationDraft.attachment1 && condemnationDraft.attachment1 != '') {
    //         //     setShowAttachmentAlert(true);
    //         // }
    //         // else {

    //         const granted = await PermissionsAndroid.request(

    //             PermissionsAndroid.PERMISSIONS.CAMERA, {
    //             title: 'Smart Control',
    //             message: 'You want to use the camera',
    //             buttonNeutral: 'Ask Me Later',
    //             buttonNegative: 'Cancel',
    //             buttonPositive: 'OK',
    //         }
    //         )

    //         if (granted === PermissionsAndroid.RESULTS.GRANTED) {

    //             console.log("You can use the camera")
    //             selectImage(item);

    //         } else {

    //             console.log("Camera permission denied")

    //         }
    //         // }
    //     }
    //     catch (e) {
    //         alert('Exception' + e);
    //     }
    // }


    const selectImage = async (item: any) => {

        let imageData: any = {};
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
                    // console.log('ImagePicker Error: '+ response.error);
                } else if (response.customButton) {
                    // console.log('User tapped custom button: ', response.customButton);
                } else {
                    // console.log('ImageResponse: ', response);
                    debugger;
                    if (response.fileSize) {

                        if (item == 'one') {
                            imageData.image1 = response.fileName;
                            imageData.image1Base64 = response.data;
                            imageData.image1Uri = response.uri;
                            detentionDraft.setAttachment1(JSON.stringify(imageData));
                        }
                        else {
                            imageData.image2 = response.fileName;
                            imageData.image2Base64 = response.data;
                            imageData.image2Uri = response.uri;
                            detentionDraft.setAttachment2(JSON.stringify(imageData));
                        }
                    }
                    else {
                        ToastAndroid.show("File grater than 2MB", ToastAndroid.LONG);
                    }
                }
            });

        } catch (error) {
            // alert(JSON.stringify(error))

        }
    }

    const attachmentAlert = async (item: any) => {

        const granted = await PermissionsAndroid.request(

            PermissionsAndroid.PERMISSIONS.CAMERA, {
            title: 'Smart Control',
            message: 'You want to use the camera',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
        }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {

            console.log("You can use the camera")
            selectImage(item);

        }
        else {

            console.log("Camera permission denied")

        }
    }


    const callToAttachment = async (item: string) => {

        try {

            if (item == 'one') {

                if (detentionDraft.attachment1 && detentionDraft.attachment1 != '') {
                    setShowAttachmentAlert(true);
                }
                else {
                    attachmentAlert(item);
                }

            }
            else {

                if (detentionDraft.attachment2 && detentionDraft.attachment2 != '') {
                    setShowAttachmentAlert(true);
                }
                else {
                    attachmentAlert(item);
                }

            }
        }
        catch (e) {
            alert('Exception' + e);
        }
    }

    const submit = () => {
        debugger;

        if (detentionDraft.unit != '' && detentionDraft.quantity != '' && detentionDraft.netWeight != '' &&
            detentionDraft.package != '' && detentionDraft.batchNumber != '' && detentionDraft.brandName != '') {
            NavigationService.navigate('Detention', {
                DetentionData: {
                    serialNumber: detentionDraft.serialNumber,
                    type: detentionDraft.type,
                    unit: detentionDraft.unit,
                    quantity: detentionDraft.quantity,
                    netWeight: detentionDraft.netWeight,
                    package: detentionDraft.package,
                    batchNumber: detentionDraft.batchNumber,
                    brandName: detentionDraft.brandName,
                    productionDate: detentionDraft.productionDate,
                    decisions: detentionDraft.decisions,
                    attachment1: detentionDraft.attachment1,
                    attachment2: detentionDraft.attachment2
                }
            })

        }
        else {
            ToastAndroid.show('All fields are mandatory', 1000);
        }

    }

    return (

        <SafeAreaView style={{ flex: 1 }}>

            <ImageBackground style={{ height: HEIGHT, width: WIDTH }} source={context.isArabic ? require('./../assets/images/backgroundimgReverse.jpg') : require('./../assets/images/backgroundimg.jpg')}>

                {
                    showAttachmentAlert
                        ?
                        <AlertComponentForAttachment
                            title={'Attachment'}
                            attachmentOne={async () => {
                                await attachmentAlert('one');
                            }}
                            attachmentTwo={async () => {
                                await attachmentAlert('two');
                            }}
                            image1Uri={
                                (attachmentClick == 'one') ?
                                    JSON.parse(detentionDraft.attachment1).image1Uri
                                    : JSON.parse(detentionDraft.attachment2).image2Uri
                            }
                            base64One={
                                (attachmentClick == 'one') ?
                                    JSON.parse(detentionDraft.attachment1).image1Base64
                                    : JSON.parse(detentionDraft.attachment2).image2Base64
                            }
                            closeAlert={() => {
                                setShowAttachmentAlert(false);
                            }}
                            attachmentClick={attachmentClick}
                            fromScreen={'detention'}
                        />
                        :
                        null
                }
                {/* <View style={{ flex: 1.5, flexDirection: context.isArabic ? 'row-reverse' : 'row', width: '90%', alignSelf: 'flex-end' }}>
                    <View style={{ flex: 0.3 }}>

                        <View style={{ flex: 0.8 }} />

                        <TouchableOpacity
                            onPress={() => {
                                NavigationService.goBack();
                            }}
                            style={{ flex: 0.5, justifyContent: 'center', alignSelf: 'flex-start', alignItems: 'center' }}>
                            <Image style={{ transform: [{ rotate: context.isArabic ? '180deg' : '0deg' }] }} source={require('./../assets/images/login/back.png')} />
                        </TouchableOpacity>

                    </View>

                    <View style={{ flex: 1.7, justifyContent: 'flex-end', alignItems: 'center', alignSelf: 'flex-end' }}>
                        <Image source={require('./../assets/images/logo-size/SmartControlLogo64.png')} />
                    </View>

                    <View style={{ flex: 0.5 }}>

                        <View style={{ flex: 1.5, justifyContent: 'flex-end', alignItems: 'flex-end', alignSelf: 'center' }}>
                            <Image source={require('./../assets/images/login/ProfileIcon.png')} />
                        </View>

                        <View style={{ flex: 0.5, justifyContent: 'flex-end', alignItems: 'center', alignSelf: 'center' }}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 10, textAlign: 'center', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].header.welcome)} </Text>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 10, textAlign: 'center', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].header.guest)} </Text>
                        </View>

                        <View style={{ flex: 0.2 }} />

                    </View>

                </View> */}

                <View style={{ flex: 1.5 }}>
                    <Header isArabic={context.isArabic} />
                </View>

                <View style={{ flex: 0.8 }}>

                    <View style={{ flex: 1, flexDirection: 'row', width: '80%', alignSelf: 'center' }}>

                        <View style={{ flex: 0.5 }}>
                            <View style={{ flex: 0.5, borderBottomColor: '#5C666F', borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: '#5C666F', fontSize: 14, fontWeight: 'bold' }}>{Strings[context.isArabic ? 'ar' : 'en'].taskList.routineInspection}</Text>
                        </View>

                        <View style={{ flex: 0.5 }}>
                            <View style={{ flex: 0.5, borderBottomColor: '#5C666F', borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                    </View>

                </View>

                <View style={{ flex: 0.5, flexDirection: context.isArabic ? 'row-reverse' : 'row', width: '85%', justifyContent: 'center', alignSelf: 'center', borderWidth: 1, borderRadius: 18, borderColor: '#abcfbf' }}>

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

                <View style={{ flex: 0.5, backgroundColor: '#abcfbe', flexDirection: 'row', width: '85%', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', borderWidth: 1, borderRadius: 18, borderColor: '#abcfbf' }}>

                    <Text style={{ color: '#5C666F', textAlign: 'center', fontSize: 13, fontWeight: 'bold' }}>{Strings[context.isArabic ? 'ar' : 'en'].detentionForm.title}</Text>

                </View>

                <View style={{ flex: 0.2 }} />

                <View style={{ flex: 5.4, width: '80%', alignSelf: 'center' }}>

                    <ScrollView style={{ flex: 1 }}>

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 11, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.serialNumber)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>
                                <TextInputComponent
                                    placeholder={''}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    value={detentionDraft.serialNumber}
                                    onChange={(val: string) => {
                                        detentionDraft.setSerialNumber(val);
                                    }}
                                />

                            </View>

                        </View>

                        <View style={{ flex: 0.2 }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].detentionForm.type)} </Text>
                            </View>
                            <View style={styles.space} />
                            <View style={styles.TextInputContainer}>
                                <TextInputComponent
                                    placeholder={''}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    value={detentionDraft.type}
                                    onChange={(val: string) => {
                                        detentionDraft.setType(val);
                                    }}
                                />
                            </View>
                        </View>

                        <View style={{ flex: 0.2, }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.unit)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>
                                <TouchableOpacity
                                    onPress={() => {
                                        dropdownRef4 && dropdownRef4.current.focus();
                                    }}
                                    style={{
                                        height: '70%', width: '100%', flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', alignSelf: 'center', borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }} >
                                    <View style={{ width: '85%', justifyContent: 'center', alignItems: 'center' }}>
                                        <Dropdown
                                            ref={dropdownRef4}
                                            value={detentionDraft.unit}
                                            onChangeText={(val: string) => {
                                                detentionDraft.setUnit(val);
                                            }}
                                            itemTextStyle={{ width: '100%', height: '100%', textAlign: context.isArabic ? 'center' : 'center', fontSize: 10, padding: 0, color: fontColor.TextBoxTitleColor }}
                                            containerStyle={{ width: '100%', height: '100%', alignSelf: 'flex-start' }}
                                            data={unit}
                                        />
                                    </View>

                                    <View style={{ width: '15%', justifyContent: 'center', alignItems: 'center' }}>
                                        <Image
                                            source={require("./../assets/images/condemnation/dropdownArrow.png")}
                                            style={{ height: 16, width: 16, transform: [{ rotate: '90deg' }] }}
                                            resizeMode={"contain"} />
                                    </View>

                                </TouchableOpacity>

                            </View>

                        </View>

                        <View style={{ flex: 0.2, }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.quantity)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>
                                <TextInputComponent
                                    placeholder={detentionDraft.quantity}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    keyboardType="number-pad"
                                    value={detentionDraft.quantity}
                                    onChange={(val: string) => {
                                        detentionDraft.setQuantity(val);
                                    }}
                                />
                            </View>

                        </View>

                        <View style={{ flex: 0.2, }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.netWeight)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>
                                <TextInputComponent
                                    placeholder={''}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    keyboardType="number-pad"
                                    value={detentionDraft.netWeight}
                                    onChange={(val: string) => {
                                        detentionDraft.setNeWeight(val);
                                    }}
                                />
                            </View>

                        </View>

                        <View style={{ flex: 0.2 }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.package)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>
                                <TouchableOpacity
                                    onPress={() => {
                                        dropdownRef1 && dropdownRef1.current.focus();
                                    }}
                                    style={{
                                        height: '70%', width: '100%', flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', alignSelf: 'center', borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }} >
                                    <View style={{ width: '85%', justifyContent: 'center', alignItems: 'center' }}>
                                        <Dropdown
                                            ref={dropdownRef1}
                                            value={detentionDraft.package}
                                            onChangeText={(val: string) => {
                                                detentionDraft.setPackage(val);
                                            }}
                                            itemTextStyle={{ width: '100%', height: '100%', textAlign: context.isArabic ? 'center' : 'center', fontSize: 10, padding: 0, color: fontColor.TextBoxTitleColor }}
                                            containerStyle={{ width: '100%', height: '100%', alignSelf: 'flex-start' }}
                                            data={packageArr}
                                        />
                                    </View>
                                    <View style={{ width: '15%', justifyContent: 'center', alignItems: 'center' }}>
                                        <Image
                                            source={require("./../assets/images/condemnation/dropdownArrow.png")}
                                            style={{ height: 16, width: 16, transform: [{ rotate: '90deg' }] }}
                                            resizeMode={"contain"} />
                                    </View>
                                </TouchableOpacity>
                            </View>

                        </View>

                        <View style={{ flex: 0.2, }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.batchNumber)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>
                                <TextInputComponent
                                    placeholder={detentionDraft.batchNumber}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    keyboardType="number-pad"
                                    onChange={(val: string) => {
                                        detentionDraft.setBatchNumber(val);
                                    }}
                                    value={detentionDraft.batchNumber}

                                />
                            </View>

                        </View>

                        <View style={{ flex: 0.2, }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.brandName)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>
                                <TextInputComponent
                                    placeholder={''}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    onChange={(val: string) => {
                                        detentionDraft.setBrandName(val);
                                    }}
                                    value={detentionDraft.brandName}

                                />
                            </View>

                        </View>

                        <View style={{ flex: 0.2, }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].detentionForm.productionDate)}</Text>
                            </View>

                            <View style={styles.space} />

                            <View style={[styles.TextInputContainer, { flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'space-between' }]}>

                                <DateComponent value={detentionDraft.productionDate} updateDate={(val: any) => detentionDraft.setProductionDate(val)} />

                            </View>

                        </View>

                        <View style={{ flex: 0.2 }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].detentionForm.decisions)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>
                                <TextInputComponent
                                    placeholder={''}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    onChange={(val: string) => { detentionDraft.setDecisions(val) }}
                                    value={detentionDraft.decisions}
                                />
                            </View>

                        </View>

                        {/* <View style={{ flex: 0.2, }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.reason)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>
                                <TouchableOpacity
                                    onPress={() => {
                                        dropdownRef3 && dropdownRef3.current.focus();
                                    }}
                                    style={{
                                        height: '70%', width: '100%', flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', alignSelf: 'center', borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }} >
                                    <View style={{ width: '85%', justifyContent: 'center', alignItems: 'center' }}>
                                        <Dropdown
                                            ref={dropdownRef3}
                                            value={'Customer Unavailable'}
                                            onChangeText={() => { }}
                                            itemTextStyle={{ width: '100%', height: '100%', textAlign: context.isArabic ? 'center' : 'center', fontSize: 10, padding: 0, color: fontColor.TextBoxTitleColor }}
                                            containerStyle={{ width: '100%', height: '100%', alignSelf: 'flex-start' }}
                                            data={temp}
                                        />
                                    </View>
                                    <View style={{ width: '15%', justifyContent: 'center', alignItems: 'center' }}>
                                        <Image
                                            source={require("./../assets/images/condemnation/dropdownArrow.png")}
                                            style={{ height: 16, width: 16, transform: [{ rotate: '90deg' }] }}
                                            resizeMode={"contain"} />
                                    </View>
                                </TouchableOpacity>
                            </View>

                        </View> */}

                        <View style={{ flex: 0.4, height: HEIGHT * 0.01, }} />

                        <View style={{ flex: 2, height: HEIGHT * 0.08, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.attachments)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={{ flex: 1, justifyContent: 'center', flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                                <View style={{ flex: 0.7 }} />

                                <TouchableOpacity
                                    onPress={() => {
                                        setAttachmentClick('one');
                                        callToAttachment('one')
                                    }}
                                    style={{
                                        flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: fontColor.TextInputBoxColor, padding: 12, borderRadius: 8
                                    }}>

                                    <Image
                                        source={detentionDraft.attachment1 && detentionDraft.attachment1 != '' ? { uri: JSON.parse(detentionDraft.attachment1).image1Uri } : require("./../assets/images/condemnation/attachmentImg.png")}
                                        style={{ height: 40, width: 40 }}
                                        resizeMode={"contain"} />

                                </TouchableOpacity>

                                <View style={styles.space} />

                                <TouchableOpacity
                                    onPress={() => {
                                        setAttachmentClick('two');
                                        callToAttachment('two')
                                    }}
                                    style={{
                                        flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: fontColor.TextInputBoxColor, padding: 12, borderRadius: 8
                                    }}>

                                    <Image
                                        source={detentionDraft.attachment2 && detentionDraft.attachment2 != '' ? { uri: JSON.parse(detentionDraft.attachment2).image1Uri } : require("./../assets/images/condemnation/attachmentImg.png")}
                                        style={{ height: 40, width: 40 }}
                                        resizeMode={"contain"} />

                                </TouchableOpacity>

                            </View>

                        </View>


                    </ScrollView>

                </View>

                <View style={{ flex: 0.15 }} />


                <View style={{ flex: 0.2 }} >
                    <TouchableOpacity
                        style={{ height: HEIGHT * 0.05, width: '60%', alignSelf: 'center', flexDirection: props.isArabic ? 'row-reverse' : 'row', justifyContent: 'center' }}
                        onPress={props.toggleRememberMeState}>

                        <View style={{ width: WIDTH * 0.03, height: WIDTH * 0.03, borderWidth: 1, alignSelf: 'center', borderRadius: 12, borderColor: '#ee3e43' }} />
                        <View style={{ width: WIDTH * 0.02 }} />
                        <Text style={[{ color: 'black', fontSize: 12, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, textAlign: 'center', alignSelf: 'center' }]}>{Strings[context.isArabic ? 'ar' : 'en'].detentionForm.termsAndCondition} </Text>
                        <Text style={[{ color: '#ee3e43', fontSize: 12, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, textAlign: 'center', alignSelf: 'center' }]}>{Strings[context.isArabic ? 'ar' : 'en'].detentionForm.clickToView}</Text>

                    </TouchableOpacity >

                </View>


                <View style={{ flex: 0.2 }} />

                <View style={{ flex: 0.9, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', width: '80%', alignSelf: 'center' }}>

                    <View style={{ flex: 0.2 }} />

                    <ButtonComponent
                        style={{ height: '55%', width: '40%', backgroundColor: fontColor.ButtonBoxColor, borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
                        buttonClick={() => {
                            // NavigationService.navigate('Detention');
                            submit()
                        }}
                        textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                        buttonText={Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.submit}
                    />

                    <View style={{ flex: 0.5 }} />

                    <ButtonComponent
                        style={{ height: '55%', width: '40%', backgroundColor: fontColor.ButtonBoxColor, alignSelf: 'center', borderRadius: 8, justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
                        buttonClick={() => {
                            NavigationService.navigate('Detention');
                        }}
                        textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                        buttonText={(Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.cancel)}
                    />

                    <View style={{ flex: 0.2 }} />


                </View>

                <View style={{ flex: 0.2 }} />

                <BottomComponent isArabic={context.isArabic} />

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
    menuOptions: {
        padding: 10,
    },
    menuTrigger: {
        padding: 5,
    }
});

export default observer(DetentionForm);