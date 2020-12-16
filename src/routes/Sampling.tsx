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
import { useIsFocused } from '@react-navigation/native';
import { Context } from '../utils/Context';
import TableComponent from './../components/TableComponent';
import NavigationService from '../services/NavigationService';
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

const Sampling = (props: any) => {
    const context = useContext(Context);
    const [serialNumber, setSerialNumber] = useState(0);
    const [taskDetails, setTaskDetails] = useState(Object());
    const [samplingArray, setSamplingArray] = useState(Array());
    const isFocused = useIsFocused();
    const [samplingFlag, setSamplingFlag] = useState(false);

    const mapStore = (rootStore: RootStoreModel) => ({ myTasksDraft: rootStore.myTasksModel, samplingDraft: rootStore.samplingModel, establishmentDraft: rootStore.establishmentModel })
    const { myTasksDraft, samplingDraft,establishmentDraft } = useInject(mapStore)

    const setSamplingData = (taskData: any) => {
        // alert(JSON.stringify(taskData));
        let mappingData = taskData ? taskData.mappingData ? JSON.parse(taskData.mappingData)['0'].samplingReport && JSON.parse(taskData.mappingData)['0'].samplingReport.length > 0 ? (JSON.parse(taskData.mappingData)['0'].samplingReport) : [] : [] : [];

        let displayArr: any = [];
        let temp = mappingData != '' ? mappingData : [];

        samplingDraft.setSamplingArray(JSON.stringify(temp));

        if (temp.length) {
            for (let indexTemp = 0; indexTemp < temp.length; indexTemp++) {
                const elementTemp = temp[indexTemp];
                let Arr = [];
                Arr =
                    [{ keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.serialNumber, value: elementTemp.serialNumber },
                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.sampleName, value: elementTemp.sampleName },
                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.type, value: elementTemp.type }]
                displayArr.push(Arr);
            }
        }

        setSerialNumber(displayArr.length);
        setSamplingArray(displayArr);
    }

    useEffect(() => {
        let data: any = {}, objArr: any = [], displayArr = [];
        if (myTasksDraft.selectedTask != '') {
            data = JSON.parse(myTasksDraft.selectedTask);
            // debugger
            setTaskDetails(data);
        }
        if (props.route && props.route.params && props.route.params.SamplingData) {

            const condemnationDetails = props.route && props.route.params && props.route.params.SamplingData ? props.route.params.SamplingData : {};

            if (samplingDraft.samplingArray != '') {
                let array = JSON.parse(samplingDraft.samplingArray);
                let index = array.findIndex((x: any) => x.serialNumber === condemnationDetails.serialNumber);
                if (index == 0 || index > 0) {
                    array = [...array.slice(0, index), condemnationDetails, ...array.slice(index + 1, array.length)]
                }
                else {
                    array.push(condemnationDetails);
                }
                samplingDraft.setSamplingArray(JSON.stringify(array))
            }
            else {
                // if (condemnationDetails.productName) {
                let array = [];
                array.push(condemnationDetails);
                samplingDraft.setSamplingArray(JSON.stringify(array))
                // }
            }

            let temp = samplingDraft.samplingArray != '' ? JSON.parse(samplingDraft.samplingArray) : [];

            if (temp.length) {

                for (let indexTemp = 0; indexTemp < temp.length; indexTemp++) {
                    const elementTemp = temp[indexTemp];
                    let Arr = [];
                    Arr = [{ keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.serialNumber, value: elementTemp.serialNumber },
                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.sampleName, value: elementTemp.sampleName },
                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.type, value: elementTemp.type }]
                    displayArr.push(Arr);
                }
                // if (condemnationDetails.productName) {
                //     objArr =
                //         [{ keyName: Strings[context.isArabic ? 'ar' : 'en'].detention.serialNumber, value: condemnationDetails.serialNumber },
                //         { keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.sampleName, value: condemnationDetails.productName },
                //         { keyName: Strings[context.isArabic ? 'ar' : 'en'].detention.brandName, value: condemnationDetails.brandName }];
                //     displayArr.push(objArr);
                // }
            }
            else {
                // if (condemnationDetails.productName) {
                objArr =
                    [{ keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.serialNumber, value: condemnationDetails.serialNumber },
                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.sampleName, value: condemnationDetails.sampleName },
                    {
                        keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.type, value: condemnationDetails.type
                    }];
                displayArr.push(objArr);
                // }
            }
            setSerialNumber(displayArr.length);
            setSamplingArray(displayArr);
        }
        else {

            let taskData = RealmController.getTaskDetails(realm, TaskSchema.name, data.TaskId);
            if (taskData && taskData['0']) {
                setSamplingData(taskData['0']);
                setSamplingFlag(taskData['0'].samplingFlag);
            }
            else {

                if (samplingDraft.samplingArray != '') {
                    let array = JSON.parse(samplingDraft.samplingArray);
                    samplingDraft.setSamplingArray(JSON.stringify(array))
                }

                let temp = samplingDraft.samplingArray != '' ? JSON.parse(samplingDraft.samplingArray) : [];

                if (temp.length) {
                    for (let indexTemp = 0; indexTemp < temp.length; indexTemp++) {
                        const elementTemp = temp[indexTemp];
                        let Arr = [];
                        Arr = [{ keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.serialNumber, value: elementTemp.serialNumber },
                        { keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.sampleName, value: elementTemp.sampleName },
                        { keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.type, value: elementTemp.type }]
                        displayArr.push(Arr);
                    }
                }

                setSerialNumber(displayArr.length);
                setSamplingArray(displayArr);
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
                inspectionDetails.mappingData[0].samplingReport = JSON.parse(samplingDraft.samplingArray)
                debugger;
            }
            else {

                if (inspectionDetails.TaskId) {
                    inspectionDetails.mappingData = [{
                        samplingReport: JSON.parse(samplingDraft.samplingArray)
                    }]
                }
                else {
                    inspectionDetails = JSON.parse(myTasksDraft.selectedTask)
                    inspectionDetails.mappingData = [{
                        samplingReport: JSON.parse(samplingDraft.samplingArray)
                    }]
                }
            }

            RealmController.addTaskDetails(realm, inspectionDetails, TaskSchema.name, () => {
                // ToastAndroid.show('Task updated successfully ', 1000);
                if (BusinessActivity && BusinessActivity != '') {
                    samplingDraft.callToSubmitSamplingService(taskDetails.TaskId, BusinessActivity);
                }
                else {
                    NavigationService.goBack();
                }
            });
        }
        catch (e) {
            // samplingDraft.callToSubmitSamplingService(taskDetails.TaskId, BusinessActivity);
        }
    }

    const editData = (item: any) => {
        samplingDraft.setClearData()
        let fullObj = JSON.parse(samplingDraft.samplingArray), serialNO = 0;
        debugger
        fullObj = fullObj.filter((x: any) => x.serialNumber == item[0].value)
        for (let index = 0; index < fullObj.length; index++) {
            const element = fullObj[index];
            debugger
            if (element.serialNumber == item[0].value) {
                samplingDraft.setSerialNumber(fullObj[index].serialNumber);
                samplingDraft.setSampleCollectionReason(fullObj[index].sampleCollectionReason);
                samplingDraft.setSampleName(fullObj[index].sampleName);
                samplingDraft.setDateofSample(fullObj[index].dateofSample);
                samplingDraft.setSampleState(fullObj[index].sampleState);
                samplingDraft.setSampleTemperature(fullObj[index].sampleTemperature);
                samplingDraft.setRemainingQuantity(fullObj[index].remainingQuantity);
                samplingDraft.setType(fullObj[index].type);
                samplingDraft.setUnit(fullObj[index].unit);
                samplingDraft.setquantity(fullObj[index].quantity);
                samplingDraft.setnetWeight(fullObj[index].netWeight);
                samplingDraft.setpackage(fullObj[index].package);
                samplingDraft.setbatchNumber(fullObj[index].batchNumber);
                samplingDraft.setbrandName(fullObj[index].brandName);
                samplingDraft.setproductionDate(fullObj[index].productionDate);
                samplingDraft.setExpiryDate(fullObj[index].expiryDate);
                samplingDraft.setCountryOfOrigin(fullObj[index].countryOfOrigin);
                samplingDraft.setremarks(fullObj[index].remarks);
                samplingDraft.setAttachment1(fullObj[index].attachment1);
                samplingDraft.setAttachment2(fullObj[index].attachment2);
                serialNO = fullObj[index].serialNumber;
            }
        }
        NavigationService.navigate('SamplingForm', { serialNumber: serialNO });
    }

    return (

        <SafeAreaView style={{ flex: 1 }}>

            <ImageBackground style={{ height: HEIGHT, width: WIDTH }} source={context.isArabic ? require('./../assets/images/backgroundimgReverse.jpg') : require('./../assets/images/backgroundimg.jpg')}>

                <Spinner
                    visible={samplingDraft.state == 'pending' ? true : false}
                    overlayColor={'rgba(0,0,0,0.7)'}
                    color={'#b6a176'}
                    textStyle={{ fontSize: 14, color: 'white' }}
                />

                <View style={{ flex: 1.5 }}>
                    <Header
                        screenName={'sampling'}
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

                <View style={{ flex: 7, width: '85%', alignSelf: 'center', }}>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: samplingDraft.samplingArray === '' ? 'space-between' : JSON.parse(samplingDraft.samplingArray).length > 0 ? 'space-between' : 'center', alignItems: samplingDraft.samplingArray === '' ? 'flex-start' : JSON.parse(samplingDraft.samplingArray).length > 0 ? 'flex-start' : 'center' }}>

                        {samplingDraft.samplingArray === '' ? null : (JSON.parse(samplingDraft.samplingArray).length > 0) ?
                            <TouchableOpacity
                                disabled={samplingFlag ? true : false}
                                onPress={() => {
                                    if (samplingDraft.samplingArray != '') {
                                        let BusinessActivity = taskDetails.BusinessActivity ? taskDetails.BusinessActivity : ''
                                        debugger
                                        goBack(BusinessActivity);

                                    }
                                    // NavigationService.navigate('SamplingForm');
                                }}
                                style={{ height: 40, top: 9, backgroundColor: '#abcfbf', borderColor: '#ffffff', borderWidth: 5, width: "35%", borderRadius: 10, justifyContent: 'center', alignSelf: "center" }}>
                                <Text style={{ fontSize: 11, textAlign: 'center', color: fontColor.white, fontWeight: 'bold', fontFamily: fontFamily.tittleFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].detention.finalSubmit)}</Text>
                            </TouchableOpacity>
                            : null}

                        <TouchableOpacity
                            disabled={samplingFlag ? true : false}
                            onPress={() => {
                                NavigationService.navigate('SamplingForm', { serialNumber: serialNumber + 1 });
                            }}
                            style={{ height: 40, top: 9, backgroundColor: '#abcfbf', borderColor: '#ffffff', borderWidth: 5, width: "35%", borderRadius: 10, justifyContent: 'center', alignSelf: "center" }}>
                            <Text style={{ fontSize: 11, textAlign: 'center', color: fontColor.white, fontWeight: 'bold', fontFamily: fontFamily.tittleFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].detention.addRecord)}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 0.2 }} />

                    <View style={{ flex: 8 }} >
                        <FlatList
                            data={samplingArray}
                            contentContainerStyle={{ padding: 5, justifyContent: 'center' }}
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
    menuOptions: {
        padding: 10,
    },
    menuTrigger: {
        padding: 5,
    }
});

export default observer(Sampling);

