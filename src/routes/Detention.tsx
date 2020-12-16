import React, { useContext, useState, useEffect } from 'react';
import { Image, View, StyleSheet, TouchableOpacity, SafeAreaView, Text, ImageBackground, Dimensions, FlatList, ToastAndroid } from "react-native";
import Header from '../components/Header';
import BottomComponent from '../components/BottomComponent';
import ButtonComponent from '../components/ButtonComponent';
import TextComponent from '../components/TextComponent';
const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;
import { fontFamily, fontColor } from '../config/config';
import { RootStoreModel } from '../store/rootStore';
import useInject from "../hooks/useInject";
import Strings from '../config/strings';
import { observer } from 'mobx-react';
import { Context } from '../utils/Context';
import TableComponent from '../components/TableComponent';
import NavigationService from '../services/NavigationService';
import { useIsFocused } from '@react-navigation/native';
import TaskSchema from './../database/TaskSchema';
import { RealmController } from './../database/RealmController';
let realm = RealmController.getRealmInstance();
import Spinner from 'react-native-loading-spinner-overlay';
import {
    Menu,
    MenuProvider,
    MenuOptions,
    MenuTrigger,
    renderers,
} from 'react-native-popup-menu';
const { Popover } = renderers

const Detention = (props: any) => {
    const context = useContext(Context);
    const [CondemnationArray, setCondemnationArray] = useState(Array());
    const [serialNumber, setSerialNumber] = useState(0);
    const [taskDetails, setTaskDetails] = useState(Object());
    const [detentionFlag, setDetentionFlag] = useState(false);

    const isFocused = useIsFocused();

    const mapStore = (rootStore: RootStoreModel) => ({ myTasksDraft: rootStore.myTasksModel, detentionDraft: rootStore.detentionModel, establishmentDraft: rootStore.establishmentModel })
    const { myTasksDraft, detentionDraft, establishmentDraft } = useInject(mapStore)

    const setDetentionData = (taskData: any) => {
        // alert(JSON.stringify(taskData));
        let mappingData = taskData ? taskData.mappingData ? JSON.parse(taskData.mappingData)['0'].detentionReport && JSON.parse(taskData.mappingData)['0'].detentionReport.length > 0 ? (JSON.parse(taskData.mappingData)['0'].detentionReport) : [] : [] : [];

        let displayArr: any = [];
        let temp = mappingData != '' ? mappingData : [];

        detentionDraft.setDetentionArray(JSON.stringify(temp));

        if (temp.length) {
            for (let indexTemp = 0; indexTemp < temp.length; indexTemp++) {
                const elementTemp = temp[indexTemp];
                let Arr = [];
                Arr =
                    [{ keyName: Strings[context.isArabic ? 'ar' : 'en'].detention.serialNumber, value: elementTemp.serialNumber },
                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].foodAlert.type, value: elementTemp.type },
                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].detention.brandName, value: elementTemp.brandName }];
                displayArr.push(Arr);
            }
        }

        setSerialNumber(displayArr.length);
        setCondemnationArray(displayArr);
    }

    useEffect(() => {

        let data: any = {}, objArr: any = [], displayArr = [];

        if (myTasksDraft.selectedTask != '') {
            data = JSON.parse(myTasksDraft.selectedTask);
            debugger
            setTaskDetails(data);
        }
        if (props.route && props.route.params && props.route.params.DetentionData) {
            const detentionDetails = props.route && props.route.params && props.route.params.DetentionData ? props.route.params.DetentionData : {};
            // alert(JSON.stringify(detentionDetails))
            if (detentionDraft.detentionArray != '') {
                let array = JSON.parse(detentionDraft.detentionArray);
                let index = array.findIndex((x: any) => x.serialNumber === detentionDetails.serialNumber);
                debugger
                if (index == 0 || index > 0) {
                    array = [...array.slice(0, index), detentionDetails, ...array.slice(index + 1, array.length)]
                    debugger
                }
                else {
                    array.push(detentionDetails);
                    debugger
                }
                detentionDraft.setDetentionArray(JSON.stringify(array))
            }
            else {
                debugger
                if (detentionDetails.unit) {
                    let array = [];
                    array.push(detentionDetails);
                    detentionDraft.setDetentionArray(JSON.stringify(array))
                }
            }

            let temp = detentionDraft.detentionArray != '' ? JSON.parse(detentionDraft.detentionArray) : [];

            if (temp.length) {
                for (let indexTemp = 0; indexTemp < temp.length; indexTemp++) {
                    const elementTemp = temp[indexTemp];
                    let Arr = [];
                    Arr = [{ keyName: Strings[context.isArabic ? 'ar' : 'en'].detention.serialNumber, value: elementTemp.serialNumber },
                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].foodAlert.type, value: elementTemp.type },
                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].detention.brandName, value: elementTemp.brandName }]
                    displayArr.push(Arr);
                }
            }
            else {
                if (detentionDetails.unit) {
                    objArr =
                        [{ keyName: Strings[context.isArabic ? 'ar' : 'en'].detention.serialNumber, value: detentionDetails.serialNumber },
                        { keyName: Strings[context.isArabic ? 'ar' : 'en'].foodAlert.type, value: detentionDetails.type },
                        { keyName: Strings[context.isArabic ? 'ar' : 'en'].detention.brandName, value: detentionDetails.brandName }];
                    displayArr.push(objArr);
                }
            }
            setSerialNumber(displayArr.length);
            setCondemnationArray(displayArr);
        }
        else {

            let taskData = RealmController.getTaskDetails(realm, TaskSchema.name, data.TaskId);
            if (taskData && taskData['0']) {
                setDetentionFlag(taskData['0'].detentionFlag);
                setDetentionData(taskData['0']);
            }
            else {

                if (detentionDraft.detentionArray != '') {
                    let array = JSON.parse(detentionDraft.detentionArray);
                    detentionDraft.setDetentionArray(JSON.stringify(array))
                }

                let temp = detentionDraft.detentionArray != '' ? JSON.parse(detentionDraft.detentionArray) : [];

                if (temp.length) {
                    for (let indexTemp = 0; indexTemp < temp.length; indexTemp++) {
                        const elementTemp = temp[indexTemp];
                        let Arr = [];
                        Arr = [{ keyName: Strings[context.isArabic ? 'ar' : 'en'].detention.serialNumber, value: elementTemp.serialNumber },
                        { keyName: Strings[context.isArabic ? 'ar' : 'en'].foodAlert.type, value: elementTemp.type },
                        { keyName: Strings[context.isArabic ? 'ar' : 'en'].detention.brandName, value: elementTemp.brandName }]
                        displayArr.push(Arr);
                    }
                }

                setSerialNumber(displayArr.length);
                setCondemnationArray(displayArr);
            }
        }

    }, [isFocused])

    const renderData = (item: any, index: number) => {

        return (
            <View style={{ flex: 1, height: HEIGHT * 0.15, width: '100%', borderWidth: 1, borderColor: '#abcfbf', borderRadius: 10 }}>
                <TableComponent isHeader={true} editData={() => { editData(item) }} isEdit={true} isArabic={context.isArabic} HeaderName={Strings[context.isArabic ? 'ar' : 'en'].detention.recordNumber + ' ' + (index + 1)}
                    data={item}
                />
            </View>
        )
    }


    const goBack = (BusinessActivity: any) => {
        debugger;

        try {

            let temp: any = Array();

            let objct = RealmController.getTaskDetails(realm, TaskSchema.name, myTasksDraft.taskId);

            let inspectionDetails = objct['0'] ? objct['0'] : JSON.parse(myTasksDraft.selectedTask)
            // alert(JSON.stringify(inspection.mappingData))
            let mappingData = (inspectionDetails.mappingData && (inspectionDetails.mappingData != '') && (typeof (inspectionDetails.mappingData) == 'string')) ? JSON.parse(inspectionDetails.mappingData) : [{}];
            inspectionDetails.mappingData = mappingData;

            debugger;
            if (mappingData && inspectionDetails.mappingData.length) {
                inspectionDetails.mappingData[0].detentionReport = JSON.parse(detentionDraft.detentionArray)
                debugger;
            }
            else {

                if (inspectionDetails.TaskId) {
                    inspectionDetails.mappingData = [{
                        detentionReport: JSON.parse(detentionDraft.detentionArray)
                    }]
                }
                else {
                    inspectionDetails = JSON.parse(myTasksDraft.selectedTask)
                    inspectionDetails.mappingData = [{
                        detentionReport: JSON.parse(detentionDraft.detentionArray)
                    }]
                }
            }

            RealmController.addTaskDetails(realm, inspectionDetails, TaskSchema.name, () => {
                // ToastAndroid.show('Task updated successfully ', 1000);
                if (BusinessActivity && BusinessActivity != '') {
                    detentionDraft.callToSubmitDetentionService(taskDetails.TaskId, BusinessActivity);
                }
                else {
                    NavigationService.goBack();
                }
            });
        }
        catch (e) {
            if (BusinessActivity && BusinessActivity != '') {
                detentionDraft.callToSubmitDetentionService(taskDetails.TaskId, BusinessActivity);
            }
        }
    }


    const editData = (item: any) => {
        detentionDraft.setClearData()
        let fullObj = JSON.parse(detentionDraft.detentionArray), serialNO = 0;
        debugger
        // fullObj = fullObj.filter((x: any) => x.serialNumber == item[0].value)
        for (let index = 0; index < fullObj.length; index++) {
            const element = fullObj[index];
            debugger
            if (element.serialNumber == item[0].value) {
                detentionDraft.setSerialNumber(fullObj[index].serialNumber);
                detentionDraft.setType(fullObj[index].type);
                detentionDraft.setUnit(fullObj[index].unit);
                detentionDraft.setQuantity(fullObj[index].quantity);
                detentionDraft.setNeWeight(fullObj[index].netWeight);
                detentionDraft.setPackage(fullObj[index].package);
                detentionDraft.setBatchNumber(fullObj[index].batchNumber);
                detentionDraft.setBrandName(fullObj[index].brandName);
                detentionDraft.setProductionDate(fullObj[index].productionDate);
                detentionDraft.setDecisions(fullObj[index].decisions);
                detentionDraft.setAttachment1(fullObj[index].attachment1);
                detentionDraft.setAttachment2(fullObj[index].attachment2);
                serialNO = fullObj[index].serialNumber;
            }
        }
        NavigationService.navigate('DetentionForm', { serialNumber: serialNO });
    }

    return (

        <SafeAreaView style={{ flex: 1 }}>

            <ImageBackground style={{ height: HEIGHT, width: WIDTH }} source={context.isArabic ? require('./../assets/images/backgroundimgReverse.jpg') : require('./../assets/images/backgroundimg.jpg')}>

                <Spinner
                    visible={detentionDraft.state == 'pending' ? true : false}
                    overlayColor={'rgba(0,0,0,0.7)'}
                    color={'#b6a176'}
                    textStyle={{ fontSize: 14, color: 'white' }}
                />

                <View style={{ flex: 1.5 }}>
                    <Header
                        screenName={'detention'}
                        goBack={goBack}
                        isArabic={context.isArabic} />
                </View>
                <View style={{ flex: 0.8 }}>
                    <View style={{ flex: 1, flexDirection: 'row', width: '80%', alignSelf: 'center' }}>

                        <View style={{ flex: 1 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 16, fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily }}>{myTasksDraft.isMyTaskClick == 'adhoc' ? Strings[context.isArabic ? 'ar' : 'en'].violationDetails.adhoc : myTasksDraft.isMyTaskClick == 'case' ? Strings[context.isArabic ? 'ar' : 'en'].dashboard.cases : Strings[context.isArabic ? 'ar' : 'en'].myTask.myTask}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
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

                <View style={{ flex: 7, width: '85%', alignSelf: 'center', }}>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: detentionDraft.detentionArray === '' ? 'space-between' : JSON.parse(detentionDraft.detentionArray).length > 0 ? 'space-between' : 'center', alignItems: detentionDraft.detentionArray === '' ? 'flex-start' : JSON.parse(detentionDraft.detentionArray).length > 0 ? 'flex-start' : 'center' }}>

                        {detentionDraft.detentionArray === '' ? null : (JSON.parse(detentionDraft.detentionArray).length > 0) ?
                            <TouchableOpacity
                                disabled={detentionFlag ? true : false}
                                onPress={() => {
                                    if (detentionDraft.detentionArray != '') {
                                        let BusinessActivity = taskDetails.BusinessActivity ? taskDetails.BusinessActivity : ''
                                        debugger
                                        goBack(BusinessActivity);
                                    }
                                    //     NavigationService.navigate('DetentionForm');
                                }}
                                style={{ height: 40, top: 9, backgroundColor: '#abcfbf', borderColor: '#ffffff', borderWidth: 5, width: "35%", borderRadius: 10, justifyContent: 'center', alignSelf: "center" }}>
                                <Text style={{ fontSize: 11, textAlign: 'center', color: fontColor.white, fontWeight: 'bold', fontFamily: fontFamily.tittleFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].detention.finalSubmit)}</Text>
                            </TouchableOpacity>
                            :
                            null
                        }

                        <TouchableOpacity
                            disabled={detentionFlag ? true : false}
                            onPress={() => {
                                NavigationService.navigate('DetentionForm', { serialNumber: serialNumber + 1 });
                            }}
                            style={{ height: 40, top: 9, backgroundColor: '#abcfbf', borderColor: '#ffffff', borderWidth: 5, width: "35%", borderRadius: 10, justifyContent: 'center', alignSelf: "center" }}>
                            <Text style={{ fontSize: 11, textAlign: 'center', color: fontColor.white, fontWeight: 'bold', fontFamily: fontFamily.tittleFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].detention.addRecord)}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ flex: 0.2 }} />

                    <View style={{ flex: 8 }} >
                        <FlatList
                            data={CondemnationArray}
                            // contentContainerStyle={{ padding: 5, justifyContent: 'center' }}
                            // columnWrapperStyle={{ flexDirection: props.isArabic ? 'row-reverse' : 'row' }}
                            // initialNumToRender={5}
                            renderItem={({ item, index }) => {
                                return (
                                    renderData(item, index)
                                )
                            }}
                            ItemSeparatorComponent={() => (<View style={{ height: 10 }} />)}
                        // numColumns={4}
                        />

                    </View>

                </View>


                <View style={{ flex: 1 }}>
                    <BottomComponent isArabic={context.isArabic} />
                </View>
            </ImageBackground>
        </SafeAreaView >
    )
}
const styles = StyleSheet.create({
    TextInputContainer: {
        flex: 0.6,
        justifyContent: "center",
        alignSelf: 'center',

    },
    space: {
        flex: 0.0
    },
    textContainer: {
        flex: 0.4,
        justifyContent: 'center',
    },

});

export default observer(Detention);