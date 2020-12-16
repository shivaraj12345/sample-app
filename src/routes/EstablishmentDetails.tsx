import React, { useContext, useState, useEffect, useRef } from 'react';
import { Image, View, StyleSheet, SafeAreaView, Text, ImageBackground, TouchableOpacity, Alert, Dimensions, FlatList, ToastAndroid } from "react-native";
import NavigationService from '../services/NavigationService';
import Header from './../components/Header';
import ButtonComponent from './../components/ButtonComponent';
import TextInputComponent from './../components/TextInputComponent';
import BottomComponent from './../components/BottomComponent';
import { observer } from 'mobx-react';
import { Context } from '../utils/Context';
import { fontFamily, fontColor } from '../config/config';
import Strings from '../config/strings';
import { RealmController } from '../database/RealmController';
import { RootStoreModel } from '../store/rootStore';
import useInject from "../hooks/useInject";
import {
    Menu,
    MenuProvider,
    MenuOptions,
    MenuTrigger,
    renderers,
} from 'react-native-popup-menu';
import Spinner from 'react-native-loading-spinner-overlay';
import ModalComponent from './../components/ModalComponent/ModalComponent';
import TaskSchema from '../database/TaskSchema';

const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;
const { Popover } = renderers
let moment = require('moment');
let realm = RealmController.getRealmInstance();

const EstablishmentDetails = (props: any) => {

    const context = useContext(Context);
    const refrance = useRef();

    const [inspectionDetails, setInspectionDetails] = useState(Object());
    const [licenseNum, setLicenseNum] = useState(Object());
    const [isAcknowledge, setIsAcknowledge] = useState(Boolean);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [touchableClick, setTouchableClick] = useState(false);
    const mapStore = (rootStore: RootStoreModel) => ({
        establishmentDraft: rootStore.establishmentModel, myTasksDraft: rootStore.myTasksModel,
        licenseDraft: rootStore.licenseMyTaskModel, efstDraft: rootStore.eftstModel, bottomBarDraft: rootStore.bottomBarModel
    })
    const { establishmentDraft, myTasksDraft, licenseDraft, efstDraft, bottomBarDraft } = useInject(mapStore)

    const [isClick, setIsClick] = useState({
        estClick: false,
        inspClick: true
    });

    useEffect(() => {
        // let arr = RealmController.getTaskDetails(realm, TaskSchema.name, myTasksDraft.taskId);
        // alert( JSON.stringify(myTasksDraft.selectedTask));
        // const inspectionDetails = props.route ? props.route.params ? props.route.params.inspectionDetails : {} : {};
        // setInspectionDetails(JSON.parse(myTasksDraft.selectedTask));
        let objct = RealmController.getTaskIsAck(realm, TaskSchema.name, myTasksDraft.taskId);

        let inspectionDetails = objct['0'] ? objct['0'] : JSON.parse(myTasksDraft.selectedTask)
        debugger
        // alert(JSON.stringify(inspection.mappingData))
        let mappingData = (inspectionDetails.mappingData && (inspectionDetails.mappingData != '') && (typeof (inspectionDetails.mappingData) == 'string')) ? JSON.parse(inspectionDetails.mappingData) : [{}];
        inspectionDetails.mappingData = mappingData;

        setInspectionDetails(inspectionDetails);
        myTasksDraft.setSelectedTask(JSON.stringify(inspectionDetails));
        // alert(JSON.stringify(inspectionDetails))
        debugger;
        // let task = RealmController.getTaskDetails(realm, TaskSchema.name, myTasksDraft.taskId);
        // let isAcknowledge = RealmController.getTaskIsAck(realm, TaskSchema.name, myTasksDraft.taskId);
        debugger;
        if ((JSON.parse(myTasksDraft.selectedTask).isAcknowledge) || (JSON.parse(myTasksDraft.selectedTask).TaskStatus.toLowerCase() == 'acknowledged')) {
            setIsAcknowledge(true);
        }
        else {
            setIsAcknowledge(false)
        }
        // Alert.alert('isAcknowledge task' + isAcknowledge);

        const licenseNum = props.route && props.route.params && props.route.params.inspectionDetails ? props.route.params.inspectionDetails.LicenseCode : '';
        // console.log("licemseNumber", licenseNum);
        setLicenseNum(licenseNum);

        return () => {
            establishmentDraft.setEstablishmentDataBlank()
            myTasksDraft.setCheckListArray('');
        }
    }, []);

    const closeAlert = () => {
        setIsModalVisible(false);
    }

    const exportPDF = () => {
        setIsModalVisible(false);
    }

    const inspectionHistoryArray = [
        { image: require('./../assets/images/startInspection/documentation/Condemnation.png'), title: Strings[props.isArabic ? 'ar' : 'en'].history.stopSync, code: 'stopSync' },
        { image: require('./../assets/images/startInspection/documentation/Sampling.png'), title: Strings[props.isArabic ? 'ar' : 'en'].history.reportTask, code: 'reportTask' },
        { image: require('./../assets/images/startInspection/documentation/Detention.png'), title: Strings[props.isArabic ? 'ar' : 'en'].history.printReport, code: 'printReport' },
        { image: require('./../assets/images/startInspection/documentation/OnHold.png'), title: Strings[props.isArabic ? 'ar' : 'en'].history.viewChecklist, code: 'viewChecklist' },
    ];

    // useEffect(() => {

    //     if (myTasksDraft.state === 'getBASuccess') {
    //         debugger;
    //         // myTasksDraft.callToGetChecklistApi(myTasksDraft.desc);
    //         // myTasksDraft.callToGetChecklistApi(inspectionDetails, context.isArabic);
    //         myTasksDraft.setState('done');
    //         // NavigationService.navigate('StartInspection')
    //     }

    // }, [myTasksDraft.state === 'getBASuccess']);

    // useEffect(() => {
    //     debugger;
    //     if (myTasksDraft.state == 'getChecklistSuccess') {
    //         // NavigationService.navigate('StartInspection');
    //         myTasksDraft.setState('done');
    //     }
    // }, [myTasksDraft.state == 'getChecklistSuccess']);

    // useEffect(() => {
    //     if (licenseDraft.state == 'getChecklistSuccess') {
    //         // NavigationService.navigate('StartInspection');
    //         licenseDraft.setState('done');
    //     }
    // }, [licenseDraft.state == 'getChecklistSuccess']);

    useEffect(() => {
        debugger;
        if (myTasksDraft.state == 'acknowledgeSuccess') {
            setIsAcknowledge(true);
        }
    }, [myTasksDraft.state == 'acknowledgeSuccess']);


    // useEffect(() => {

    //    if (myTasksDraft.state == 'getQuestionarieSuccess') {
    //         NavigationService.navigate('FollowUpStartInspection');          
    //         myTasksDraft.setState('done');
    //     }
    // }, [myTasksDraft.state]);

    const fetchEfstData = () => {
        let licenseCode = licenseNum;
        // console.log("licenseCode", licenseCode);
        efstDraft.callToFetchEfstDataService(licenseCode);
        NavigationService.navigate('efstDetails', { 'licenseNum': licenseCode });
    }


    const renderData = (item: any, index: number) => {

        return (

            <TouchableOpacity
                onPress={() => {
                    // NavigationService.navigate(item.navigationScreenName)
                }}
                style={{
                    flex: 1, justifyContent: 'center', alignItems: 'flex-end',
                    width: '100%', borderColor: 'transparent'
                }}>

                <View style={{ flex: 0.5, width: '100%', alignItems: 'center' }}>
                    <Image style={{ transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }] }}
                        resizeMode={'contain'}
                        source={item.image} />
                </View>

                <View style={{ flex: 0.3, height: 5 }} />

                <View style={{ flex: 0.2, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={[styles.text, { fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }]}>{item.title}</Text>
                </View>

            </TouchableOpacity>

        )
    }

    return (

        <SafeAreaView style={{ flex: 1 }}>

            <ImageBackground style={{ height: HEIGHT, width: WIDTH }} source={context.isArabic ? require('./../assets/images/backgroundimgReverse.jpg') : require('./../assets/images/backgroundimg.jpg')}>
                <Spinner
                    visible={establishmentDraft.state == 'pending' ? true : false}
                    // textContent={'Loading...'}
                    overlayColor={'rgba(0,0,0,0.5)'}
                    color={'#b6a176'}
                    textStyle={{ fontSize: 14, color: 'white' }}
                />

                <Spinner
                    visible={licenseDraft.state == 'pending' ? true : false}
                    // textContent={'Loading...'}
                    overlayColor={'rgba(0,0,0,0.7)'}
                    color={'#b6a176'}
                    textStyle={{ fontSize: 14, color: 'white' }}
                />

                <View style={{ flex: 1.5 }}>
                    <Header isArabic={context.isArabic} />
                </View>

                <View style={{ flex: 0.8 }}>

                    <View style={{ flex: 1, flexDirection: 'row', width: '80%', alignSelf: 'center' }}>

                        {/* <View style={{ flex: myTasksDraft.isMyTaskClick == 'history' ? 0.8 : 0.5 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                        <View style={{ flex: myTasksDraft.isMyTaskClick == 'CompletedTask' ? 1.1 : myTasksDraft.isMyTaskClick == 'history' ? 0.5 : 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: fontColor.TitleColor, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily, fontSize: 14, fontWeight: 'bold' }}>{myTasksDraft.isMyTaskClick == 'CompletedTask' ? Strings[context.isArabic ? 'ar' : 'en'].dashboard.completedTesk : myTasksDraft.isMyTaskClick == 'case' ? Strings[context.isArabic ? 'ar' : 'en'].dashboard.cases : myTasksDraft.isMyTaskClick == 'license' ? Strings[context.isArabic ? 'ar' : 'en'].dashboard.licenses : myTasksDraft.isMyTaskClick == 'history' ? Strings[context.isArabic ? 'ar' : 'en'].taskList.history : myTasksDraft.isMyTaskClick == 'tempPermit' ? Strings[context.isArabic ? 'ar' : 'en'].dashboard.temporaryPermits : Strings[context.isArabic ? 'ar' : 'en'].myTask.myTask}</Text>
                        </View>

                        <View style={{ flex: myTasksDraft.isMyTaskClick == 'history' ? 0.8 : 0.5 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View> */}

                        <View style={{ flex: 0.5 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: fontColor.TitleColor, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily, fontSize: JSON.parse(myTasksDraft.selectedTask).TaskType.toString().length > 10 ? 12 : 14, fontWeight: 'bold' }}>{myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask).TaskType.toString().toUpperCase() : ' - '}</Text>
                        </View>

                        <View style={{ flex: 0.5 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                    </View>

                </View>

                <View style={{ flex: 0.5, flexDirection: 'row', width: '85%', justifyContent: 'center', alignSelf: 'center', borderWidth: 1, borderRadius: 18, borderColor: '#abcfbf' }}>

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

                <View style={{ flex: 0.5, flexDirection: 'row', width: '86%', alignSelf: 'center', justifyContent: 'center', borderWidth: 1, borderRadius: 18, borderColor: '#abcfbf' }}>

                    <View style={{ flex: 1, height: '100%', backgroundColor: isClick.inspClick ? '#abcfbe' : 'white', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderTopLeftRadius: 18, borderBottomLeftRadius: 18 }}>

                        <TouchableOpacity
                            onPress={() => {
                                setIsClick(prevState => {
                                    return { ...prevState, estClick: false, inspClick: true }
                                });
                            }}
                            style={{ width: '100%', height: '100%', backgroundColor: isClick.inspClick ? '#abcfbe' : 'white', justifyContent: 'center', borderTopLeftRadius: 18, borderBottomLeftRadius: 18 }} >
                            <Text style={{ textAlign: 'center', fontSize: 12, fontWeight: 'bold' }}>{Strings[context.isArabic ? 'ar' : 'en'].inspectionDetails.inspectionDetails}</Text>
                        </TouchableOpacity>

                    </View>

                    <View style={{ flex: 1, height: '100%', justifyContent: 'center', backgroundColor: isClick.estClick ? '#abcfbe' : 'white', borderTopRightRadius: 16, borderBottomRightRadius: 16 }}>

                        <TouchableOpacity
                            onPress={() => {
                                setIsClick(prevState => {
                                    return { ...prevState, estClick: true, inspClick: false }
                                });
                            }}
                            style={{ width: '100%', height: '100%', justifyContent: 'center', backgroundColor: isClick.estClick ? '#abcfbe' : 'white', borderTopRightRadius: 16, borderBottomRightRadius: 16 }}>
                            <Text style={{ textAlign: 'center', fontSize: 12, fontWeight: 'bold' }}>{Strings[context.isArabic ? 'ar' : 'en'].establishmentDetails.establishmentDetails}</Text>
                        </TouchableOpacity>

                    </View>

                </View>

                <View style={{ flex: 0.2 }} />

                {
                    isModalVisible ?
                        <ModalComponent
                            data={inspectionDetails}
                            createPdfMsg={Strings[context.isArabic ? 'ar' : 'en'].establishmentDetails.createPdfMsg}
                            closeAlert={closeAlert}
                            exportPDF={exportPDF}

                        />
                        : null
                }

                {isClick.estClick ?

                    <View style={{ flex: 5.4, width: '85%', alignSelf: 'center' }}>

                        <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].establishmentDetails.establishmentName)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.textInputContainer}>
                                <TextInputComponent
                                    style={{
                                        height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    isArabic={context.isArabic}
                                    editable={false}
                                    value={establishmentDraft.establishmentName}
                                    maxLength={props.maxLength}
                                    numberOfLines={props.numberOfLines}
                                    placeholder={''}
                                    keyboardType={props.keyboardType}
                                    onChange={props.onChange}
                                />
                            </View>
                        </View>

                        <View style={{ flex: 0.2 }} />

                        <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].establishmentDetails.licenseSource)} </Text>
                            </View>
                            <View style={styles.space} />
                            <View style={styles.textInputContainer}>
                                <TextInputComponent
                                    style={{
                                        height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    editable={false}
                                    isArabic={context.isArabic}
                                    value={establishmentDraft.licenseSource}
                                    maxLength={props.maxLength}
                                    numberOfLines={props.numberOfLines}
                                    placeholder={''}
                                    keyboardType={props.keyboardType}
                                    onChange={props.onChange} />
                            </View>
                        </View>

                        <View style={{ flex: 0.2 }} />

                        <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].establishmentDetails.licenseStartDate)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.textInputContainer}>
                                <TextInputComponent
                                    style={{
                                        height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    isArabic={context.isArabic}
                                    editable={false}
                                    value={establishmentDraft.licensestartDate}
                                    maxLength={props.maxLength}
                                    numberOfLines={props.numberOfLines}
                                    placeholder={''}
                                    keyboardType={props.keyboardType}
                                    onChange={props.onChange}
                                />
                            </View>
                        </View>
                        <View style={{ flex: 0.2 }} />

                        <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].establishmentDetails.licenseEndDate)} </Text>
                            </View>
                            <View style={styles.space} />
                            <View style={styles.textInputContainer}>
                                <TextInputComponent
                                    style={{
                                        height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    isArabic={context.isArabic}
                                    editable={false}
                                    value={establishmentDraft.licenseEndDate}
                                    maxLength={props.maxLength}
                                    numberOfLines={props.numberOfLines}
                                    placeholder={''}
                                    keyboardType={props.keyboardType}
                                    onChange={props.onChange}
                                />
                            </View>
                        </View>

                        <View style={{ flex: 0.2 }} />

                        <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].establishmentDetails.licenseNumber)} </Text>
                            </View>
                            <View style={styles.space} />
                            <View style={styles.textInputContainer}>
                                <TextInputComponent
                                    style={{
                                        height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    isArabic={context.isArabic}
                                    editable={false}
                                    value={establishmentDraft.licenseNumber}
                                    maxLength={props.maxLength}
                                    numberOfLines={props.numberOfLines}
                                    placeholder={''}
                                    keyboardType={props.keyboardType}
                                    onChange={props.onChange}
                                />
                            </View>
                        </View>
                        <View style={{ flex: 0.2 }} />

                        {/* <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].establishmentDetails.contactDetails)} </Text>
                            </View>
                            <View style={styles.space} />
                            <View style={styles.textInputContainer}>
                                <TextInputComponent
                                    style={{
                                        height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    isArabic={context.isArabic}
                                    editable={false}
                                    value={establishmentDraft.contactDetails}
                                    maxLength={props.maxLength}
                                    numberOfLines={props.numberOfLines}
                                    placeholder={''}
                                    keyboardType={props.keyboardType}
                                    onChange={props.onChange}
                                />
                            </View>
                        </View>

                        <View style={{ flex: 0.2 }} /> */}

                        <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].establishmentDetails.address)} </Text>
                            </View>
                            <View style={styles.space} />
                            <View style={styles.textInputContainer}>
                                <TextInputComponent
                                    style={{
                                        height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    isArabic={context.isArabic}
                                    editable={false}
                                    value={establishmentDraft.address}
                                    maxLength={props.maxLength}
                                    numberOfLines={props.numberOfLines}
                                    placeholder={''}
                                    keyboardType={props.keyboardType}
                                    onChange={props.onChange}
                                />
                            </View>
                        </View>
                        <View style={{ flex: 0.2 }} />

                        {myTasksDraft.isMyTaskClick == 'tempPermit' ? null :

                            <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                                <View style={styles.textContainer}>
                                    <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].establishmentDetails.area)} </Text>
                                </View>

                                <View style={styles.space} />

                                <View style={styles.textInputContainer}>
                                    <TextInputComponent
                                        style={{
                                            height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                            fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                        }}
                                        isArabic={context.isArabic}
                                        editable={false}
                                        value={establishmentDraft.area}
                                        maxLength={props.maxLength}
                                        numberOfLines={props.numberOfLines}
                                        placeholder={''}
                                        keyboardType={props.keyboardType}
                                        onChange={props.onChange}
                                    />
                                </View>
                            </View>
                        }
                        <View style={{ flex: 0.2 }} />

                        <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].establishmentDetails.sector)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.textInputContainer}>
                                <TextInputComponent
                                    style={{
                                        height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    isArabic={context.isArabic}
                                    editable={false}
                                    value={establishmentDraft.sector}
                                    maxLength={props.maxLength}
                                    numberOfLines={props.numberOfLines}
                                    placeholder={''}
                                    keyboardType={props.keyboardType}
                                    onChange={props.onChange}
                                />
                            </View>

                        </View>

                    </View>
                    :
                    <View style={{ flex: 5.4, width: '85%', alignSelf: 'center' }}>

                        <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 11, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].inspectionDetails.taskId)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.textInputContainer}>
                                <TextInputComponent
                                    placeholder={''}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    editable={false}
                                    value={inspectionDetails.TaskId}
                                    onChange={(val) => { }}
                                />

                            </View>
                        </View>

                        <View style={{ flex: 0.2 }} />

                        <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].inspectionDetails.taskType)} </Text>
                            </View>
                            <View style={styles.space} />
                            <View style={styles.textInputContainer}>
                                <TextInputComponent
                                    placeholder={''}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    editable={false}
                                    value={inspectionDetails.TaskType}
                                    onChange={(val) => { }}
                                />
                            </View>
                        </View>

                        <View style={{ flex: 0.2, }} />

                        <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].inspectionDetails.creationDate)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.textInputContainer}>
                                <TextInputComponent
                                    placeholder={''}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    editable={false}
                                    value={inspectionDetails.CreatedDate}
                                    onChange={(val) => { }}
                                />
                            </View>

                        </View>

                        <View style={{ flex: 0.2 }} />

                        <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].inspectionDetails.businessActivity)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.textInputContainer}>
                                <TextInputComponent
                                    placeholder={''}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    value={inspectionDetails.BusinessActivity != 'null' ? inspectionDetails.BusinessActivity : '-'}
                                    editable={false}
                                    onChange={(val) => { }}
                                />
                            </View>

                        </View>

                        <View style={{ flex: 0.2, }} />

                        <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].inspectionDetails.subbusinessActivity)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.textInputContainer}>
                                <TextInputComponent
                                    placeholder={''}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    editable={false}
                                    value={inspectionDetails.BusinessActivity}
                                    onChange={(val) => { }}
                                />
                            </View>

                        </View>

                        <View style={{ flex: 0.2 }} />

                        <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].inspectionDetails.description)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.textInputContainer}>
                                <TextInputComponent
                                    placeholder={''}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    onChange={(val) => { }}
                                    editable={false}
                                    value={inspectionDetails.Description}
                                />
                            </View>

                        </View>

                        <View style={{ flex: 0.2, }} />

                        <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].inspectionDetails.risk)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.textInputContainer}>
                                <TextInputComponent
                                    placeholder={''}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    onChange={(val) => { }}
                                    editable={false}
                                    value={inspectionDetails.RiskCategory}

                                />
                            </View>

                        </View>

                        <View style={{ flex: 0.2, }} />

                        <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].inspectionDetails.sheduledDate)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.textInputContainer}>
                                <TextInputComponent
                                    placeholder={''}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    onChange={(val) => { }}
                                    editable={false}
                                    value={inspectionDetails.CompletionDate ? moment(inspectionDetails.CompletionDate).format('L') : '-'}

                                />
                            </View>

                        </View>

                    </View>

                }

                <View style={{ flex: 0.2 }} />

                {isClick.estClick ?
                    bottomBarDraft.profileClick ?
                        null
                        :
                        <View style={{ flex: 0.7, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', width: '70%', alignSelf: 'center' }}>

                            <View style={{ flex: 2, flexDirection: 'row', height: '80%' }}>
                                <ButtonComponent
                                    style={{
                                        height: '80%', width: '100%', backgroundColor: 'red',
                                        borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                        textAlign: 'center'
                                    }}
                                    isArabic={context.isArabic}
                                    buttonClick={() => {
                                        NavigationService.navigate('ContactList')
                                    }}
                                    textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                                    buttonText={(Strings[context.isArabic ? 'ar' : 'en'].establishmentDetails.contact)}
                                />
                            </View>

                            <View style={{ flex: 0.2 }} />

                            <View style={{ flex: 2, flexDirection: 'row', height: '80%' }}>
                                <ButtonComponent
                                    style={{
                                        height: '80%', width: '100%', backgroundColor: fontColor.ButtonBoxColor,
                                        borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                        textAlign: 'center'
                                    }}
                                    isArabic={context.isArabic}
                                    buttonClick={() => {
                                        fetchEfstData()
                                    }}
                                    textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                                    buttonText={(Strings[context.isArabic ? 'ar' : 'en'].establishmentDetails.efst)}
                                />
                            </View>

                            <View style={{ flex: 0.2 }} />

                        </View>
                    :
                    <View style={{ flex: myTasksDraft.isMyTaskClick == 'history' ? 1.1 : 0.9, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', alignItems: 'center', width: '85%', alignSelf: 'center' }}>

                        {myTasksDraft.isMyTaskClick == 'history' ?

                            <View style={{ flex: 1, justifyContent: 'center', borderRadius: 8, borderWidth: 0.5, borderColor: '#abcfbf', padding: 5 }}>

                                <FlatList
                                    data={inspectionHistoryArray}
                                    contentContainerStyle={{ padding: 5, justifyContent: 'center' }}
                                    columnWrapperStyle={{ flexDirection: props.isArabic ? 'row-reverse' : 'row' }}
                                    initialNumToRender={5}
                                    renderItem={({ item, index }) => {
                                        return (
                                            renderData(item, index)
                                        )
                                    }}
                                    ItemSeparatorComponent={() => (<View style={{ width: 8 }} />)}
                                    numColumns={4}
                                />

                            </View>
                            :
                            <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', alignItems: 'center', width: '80%', alignSelf: 'center' }}>

                                {
                                    bottomBarDraft.profileClick ?
                                        null
                                        :
                                        isAcknowledge ?

                                            <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center' }}>
                                                <View style={{ flex: 0.1 }} />

                                                <View style={{ flex: 3, height: '50%', alignItems: 'center', justifyContent: 'center' }}>

                                                    <ButtonComponent
                                                        style={{
                                                            height: '100%', width: '100%', backgroundColor: fontColor.ButtonBoxColor,
                                                            borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                                            textAlign: 'center'
                                                        }}
                                                        isArabic={context.isArabic}
                                                        buttonClick={() => {
                                                            NavigationService.navigate('Action')
                                                        }}
                                                        textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                                                        buttonText={(Strings[context.isArabic ? 'ar' : 'en'].inspectionDetails.action)}
                                                    />

                                                </View>

                                                <View style={{ flex: 0.1 }} />

                                                <View style={{ flex: 3, height: '50%', alignItems: 'center', justifyContent: 'center' }}>

                                                    <ButtonComponent
                                                        style={{
                                                            height: '100%', width: '100%', backgroundColor: fontColor.ButtonBoxColor,
                                                            borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                                            textAlign: 'center'
                                                        }}
                                                        isArabic={context.isArabic}
                                                        buttonClick={() => {
                                                            // callToGetBA();
                                                            if (inspectionDetails.TaskType == 'Follow-Up') {
                                                                NavigationService.navigate('FollowUpStartInspection');
                                                            }
                                                            else {
                                                                if ((((inspectionDetails.TaskType.toString().toLowerCase() == 'routine inspection') || (inspectionDetails.TaskType.toString().toLowerCase() == 'direct inspection')) && (inspectionDetails.Description == '' || inspectionDetails.Description == null))) {
                                                                    ToastAndroid.show('No Checklist Available', 1000);
                                                                }
                                                                else if (myTasksDraft.noCheckList === 'NocheckListAvailable') {
                                                                    ToastAndroid.show('No Checklist Available', 1000);
                                                                }
                                                                else {
                                                                    debugger
                                                                    if ((((inspectionDetails.TaskType.toString().toLowerCase() == 'routine inspection') || (inspectionDetails.TaskType.toString().toLowerCase() == 'direct inspection')))) {
                                                                        let tempInspectionDetail = myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask) : {};
                                                                        if (tempInspectionDetail.mappingData && tempInspectionDetail.mappingData[0] && tempInspectionDetail.mappingData[0].EFSTFlag) {
                                                                            NavigationService.navigate('StartInspection')
                                                                        }
                                                                        else {
                                                                            setIsClick(prevState => {
                                                                                return { ...prevState, estClick: true, inspClick: false }
                                                                            });
                                                                            Alert.alert("", "Please update EFST")
                                                                        }
                                                                    }
                                                                    else{
                                                                        NavigationService.navigate('StartInspection')
                                                                    }
                                                                }
                                                            }

                                                        }}
                                                        textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                                                        buttonText={(Strings[context.isArabic ? 'ar' : 'en'].inspectionDetails.startInpection)}
                                                    />

                                                </View>


                                                <View style={{ flex: 0.1 }} />

                                                {/* <View style={{ flex: 3, height: '50%', alignItems: 'center', justifyContent: 'center' }}>

                                        <ButtonComponent
                                            style={{
                                                height: '100%', width: '100%', backgroundColor: fontColor.ButtonBoxColor,
                                                borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                                textAlign: 'center'
                                            }}
                                            isArabic={context.isArabic}
                                            buttonClick={() => {
                                                myTasksDraft.callToGetAcknowlege(myTasksDraft.taskId);
                                            }}
                                            textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                                            buttonText={(Strings[context.isArabic ? 'ar' : 'en'].inspectionDetails.acknowledge)}
                                        />

                                    </View> */}

                                            </View>

                                            :
                                            <View style={{ flex: 2, height: '50%', alignItems: 'center', justifyContent: 'center' }}>

                                                <ButtonComponent
                                                    style={{
                                                        height: '100%', width: '100%', backgroundColor: fontColor.ButtonBoxColor,
                                                        borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                                        textAlign: 'center'
                                                    }}
                                                    isArabic={context.isArabic}
                                                    buttonClick={() => {
                                                        myTasksDraft.callToGetAcknowlege(myTasksDraft.taskId);
                                                    }}
                                                    textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                                                    buttonText={(Strings[context.isArabic ? 'ar' : 'en'].inspectionDetails.acknowledge)}
                                                />

                                            </View>
                                }
                            </View>

                        }
                    </View>

                }

                {
                    bottomBarDraft.profileClick ?

                        <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center' }}>
                            <View style={{ flex: 0.1 }} />

                            <View style={{ flex: 3, height: '50%', alignItems: 'center', justifyContent: 'center' }}>

                                <ButtonComponent
                                    style={{
                                        height: '80%', width: '100%', backgroundColor: 'red',
                                        borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                        textAlign: 'center'
                                    }}
                                    isArabic={context.isArabic}
                                    buttonClick={() => {
                                        setIsModalVisible(true);
                                    }}
                                    textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                                    buttonText={(Strings[context.isArabic ? 'ar' : 'en'].establishmentDetails.print)}
                                />

                            </View>

                            <View style={{ flex: 0.1 }} />

                            <View style={{ flex: 3, height: '50%', alignItems: 'center', justifyContent: 'center' }}>

                                <ButtonComponent
                                    style={{
                                        height: '80%', width: '100%', backgroundColor: 'red',
                                        borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                        textAlign: 'center'
                                    }}
                                    isArabic={context.isArabic}
                                    buttonClick={() => {
                                        NavigationService.navigate('StartInspection')

                                        // setIsModalVisible(true);
                                    }}
                                    textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                                    buttonText={(Strings[context.isArabic ? 'ar' : 'en'].establishmentDetails.viewChecklist)}
                                />

                            </View>


                            <View style={{ flex: 0.1 }} />



                        </View>


                        :
                        null
                }

                <BottomComponent isArabic={context.isArabic} />

            </ImageBackground>

        </SafeAreaView >

    )
}

const styles = StyleSheet.create({
    textContainer: {
        flex: 0.4,
        justifyContent: 'center'
    },
    space: {
        flex: 0.0,
    },
    textInputContainer: {
        flex: 0.6,
        justifyContent: "center"
    },
    text: {
        fontSize: 12,
        textAlign: 'center',
        fontWeight: 'bold',
        color: fontColor.TitleColor,
        //fontFamily: fontFamily.textFontFamily
    },
    container: {
        padding: 10,
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },
    menuOptions: {
        padding: 10,
    },
    menuTrigger: {
        padding: 5,
    }
});

export default observer(EstablishmentDetails);

