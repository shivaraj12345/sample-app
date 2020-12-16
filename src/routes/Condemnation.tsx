import React, { useContext, useState, useEffect } from 'react';
import { ToastAndroid, View, StyleSheet, TouchableOpacity, SafeAreaView, Text, ImageBackground, Dimensions, FlatList } from "react-native";
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
import { RealmController } from './../database/RealmController';
import TaskSchema from './../database/TaskSchema';
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

const Condemnation = (props: any) => {

    const context = useContext(Context);
    const [CondemnationArray, setCondemnationArray] = useState(Array());
    const [serialNumber, setSerialNumber] = useState(0);
    const [condemnationFlag, setCondemnationFlag] = useState(false);
    const [taskDetails, setTaskDetails] = useState(Object());

    const isFocused = useIsFocused();

    const mapStore = (rootStore: RootStoreModel) => ({ myTasksDraft: rootStore.myTasksModel, condemnationDraft: rootStore.condemnationModel, establishmentDraft: rootStore.establishmentModel })
    const { myTasksDraft, condemnationDraft, establishmentDraft } = useInject(mapStore)


    const setCondemnationData = (taskData: any) => {
        // alert(JSON.stringify(taskData));
        let mappingData = taskData ? taskData.mappingData ? JSON.parse(taskData.mappingData)['0'].condemnationReport && JSON.parse(taskData.mappingData)['0'].condemnationReport.length > 0 ? (JSON.parse(taskData.mappingData)['0'].condemnationReport) : [] : [] : [];

        let displayArr: any = [];
        let temp = mappingData != '' ? mappingData : [];

        condemnationDraft.setCondemnationArray(JSON.stringify(temp));

        if (temp.length) {
            for (let indexTemp = 0; indexTemp < temp.length; indexTemp++) {
                const elementTemp = temp[indexTemp];
                let Arr = [];
                Arr = [{ keyName: Strings[context.isArabic ? 'ar' : 'en'].detention.serialNumber, value: elementTemp.serialNumber },
                { keyName: Strings[context.isArabic ? 'ar' : 'en'].detention.productName, value: elementTemp.productName },
                { keyName: Strings[context.isArabic ? 'ar' : 'en'].detention.brandName, value: elementTemp.brandName }]
                displayArr.push(Arr);
            }
        }

        setSerialNumber(displayArr.length);
        setCondemnationArray(displayArr);
    }

    useEffect(() => {

        debugger;

        // let objct = RealmController.getTaskDetails(realm, TaskSchema.name, myTasksDraft.taskId);

        // let inspectionDetails = objct['0'] ? objct['0'] : JSON.parse(myTasksDraft.selectedTask)
        // // alert(JSON.stringify(inspection.mappingData))
        // let mappingData = (inspectionDetails.mappingData && (inspectionDetails.mappingData != '') && (typeof (inspectionDetails.mappingData) == 'string')) ? JSON.parse(inspectionDetails.mappingData) : [{}];
        // inspectionDetails.mappingData = mappingData;

        // setTaskDetails(inspectionDetails);

        let data: any = {}, objArr: any = [], displayArr = [];
        if (myTasksDraft.selectedTask != '') {
            data = JSON.parse(myTasksDraft.selectedTask);
            setTaskDetails(data);
        }

        if (props.route && props.route.params && props.route.params.condemnationData) {

            const condemnationDetails = props.route && props.route.params && props.route.params.condemnationData ? props.route.params.condemnationData : {};
            debugger;
            if (condemnationDraft.condemnationArray != '') {
                let array = JSON.parse(condemnationDraft.condemnationArray);
                let index = array.findIndex((x: any) => x.serialNumber === condemnationDetails.serialNumber);
                debugger
                if (index == 0 || index > 0) {
                    array = [...array.slice(0, index), condemnationDetails, ...array.slice(index + 1, array.length)]
                    debugger
                }
                else {
                    array.push(condemnationDetails);
                    debugger;
                }
                condemnationDraft.setCondemnationArray(JSON.stringify(array))
            }
            else {
                debugger
                if (condemnationDetails.productName) {
                    let array = [];
                    array.push(condemnationDetails);
                    condemnationDraft.setCondemnationArray(JSON.stringify(array))
                }
            }

            let temp = condemnationDraft.condemnationArray != '' ? JSON.parse(condemnationDraft.condemnationArray) : [];

            if (temp.length) {
                for (let indexTemp = 0; indexTemp < temp.length; indexTemp++) {
                    const elementTemp = temp[indexTemp];
                    let Arr = [];
                    Arr = [{ keyName: Strings[context.isArabic ? 'ar' : 'en'].detention.serialNumber, value: elementTemp.serialNumber },
                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].detention.productName, value: elementTemp.productName },
                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].detention.brandName, value: elementTemp.brandName }]
                    displayArr.push(Arr);
                }
                // if (condemnationDetails.productName) {
                //     objArr =
                //         [{ keyName: Strings[context.isArabic ? 'ar' : 'en'].detention.serialNumber, value: condemnationDetails.serialNumber },
                //         { keyName: Strings[context.isArabic ? 'ar' : 'en'].detention.productName, value: condemnationDetails.productName },
                //         { keyName: Strings[context.isArabic ? 'ar' : 'en'].detention.brandName, value: condemnationDetails.brandName }];
                //     displayArr.push(objArr);
                // }
            }
            else {
                if (condemnationDetails.productName) {
                    objArr =
                        [{ keyName: Strings[context.isArabic ? 'ar' : 'en'].detention.serialNumber, value: condemnationDetails.serialNumber },
                        { keyName: Strings[context.isArabic ? 'ar' : 'en'].detention.productName, value: condemnationDetails.productName },
                        { keyName: Strings[context.isArabic ? 'ar' : 'en'].detention.brandName, value: condemnationDetails.brandName }];
                    displayArr.push(objArr);
                }
            }
            setSerialNumber(displayArr.length);
            setCondemnationArray(displayArr);
        }
        else {
            debugger;
            let taskData = RealmController.getTaskDetails(realm, TaskSchema.name, data.TaskId);
            if (taskData && taskData['0']) {
                setCondemnationFlag(taskData['0'].condemnationFlag);
                setCondemnationData(taskData['0']);
            }
            else {

                if (condemnationDraft.condemnationArray != '') {
                    let array = JSON.parse(condemnationDraft.condemnationArray);
                    condemnationDraft.setCondemnationArray(JSON.stringify(array))
                }

                let temp = condemnationDraft.condemnationArray != '' ? JSON.parse(condemnationDraft.condemnationArray) : [];

                if (temp.length) {
                    for (let indexTemp = 0; indexTemp < temp.length; indexTemp++) {
                        const elementTemp = temp[indexTemp];
                        let Arr = [];
                        Arr = [{ keyName: Strings[context.isArabic ? 'ar' : 'en'].detention.serialNumber, value: elementTemp.serialNumber },
                        { keyName: Strings[context.isArabic ? 'ar' : 'en'].detention.productName, value: elementTemp.productName },
                        { keyName: Strings[context.isArabic ? 'ar' : 'en'].detention.brandName, value: elementTemp.brandName }]
                        displayArr.push(Arr);
                    }
                }
                setSerialNumber(displayArr.length);
                setCondemnationArray(displayArr);
            }
        }


    }, [isFocused])

    if (condemnationDraft.state == 'done') {
        // condemnationDraft.callToGetQuestionarieApi(taskDetails.TaskId,)
    }

    const renderData = (item: any, index: number) => {

        return (
            <View style={{ flex: 1, height: HEIGHT * 0.15, width: '100%', borderWidth: 1, borderColor: '#abcfbf', borderRadius: 10 }}>
                <TableComponent isHeader={true} editData={() => { editData(item) }} isEdit={true} isArabic={context.isArabic} HeaderName={Strings[context.isArabic ? 'ar' : 'en'].detention.recordNumber + ' ' + (index + 1)}
                    data={item}
                />
            </View>
        )
    }

    const deletetData = (item: any) => {
        condemnationDraft.setClearData();
    }

    const editData = (item: any) => {
        condemnationDraft.setClearData();
        let fullObj = JSON.parse(condemnationDraft.condemnationArray), serialNO = 0;
        debugger;
        // alert('attachment' + JSON.stringify(condemnationDraft.condemnationArray));
        // fullObj = fullObj.filter((x: any) => x.serialNumber == item[0].value)
        for (let index = 0; index < fullObj.length; index++) {
            const element = fullObj[index];
            debugger;
            if (element.serialNumber == item[0].value) {
                condemnationDraft.setSerialNumber(fullObj[index].serialNumber);
                condemnationDraft.setProductName(fullObj[index].productName);
                condemnationDraft.setUnit(fullObj[index].unit);
                condemnationDraft.setQuantity(fullObj[index].quantity);
                condemnationDraft.setNeWeight(fullObj[index].netWeight);
                condemnationDraft.setPackage(fullObj[index].package);
                condemnationDraft.setBatchNumber(fullObj[index].batchNumber);
                condemnationDraft.setBrandName(fullObj[index].brandName);
                condemnationDraft.setremarks(fullObj[index].remarks);
                condemnationDraft.setPlace(fullObj[index].place);
                condemnationDraft.setReason(fullObj[index].reason);
                condemnationDraft.setAttachment1(fullObj[index].attachment1);
                condemnationDraft.setAttachment2(fullObj[index].attachment2);
                serialNO = fullObj[index].serialNumber;
            }
        }
        NavigationService.navigate('CondemnationForm', { serialNumber: serialNO });
    }

    const goBack = (BusinessActivity) => {
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
                inspectionDetails.mappingData[0].condemnationReport = JSON.parse(condemnationDraft.condemnationArray)
                debugger;
            }
            else {

                if (inspectionDetails.TaskId) {
                    inspectionDetails.mappingData = [{
                        condemnationReport: JSON.parse(condemnationDraft.condemnationArray)
                    }]
                }
                else {
                    inspectionDetails = JSON.parse(myTasksDraft.selectedTask)
                    inspectionDetails.mappingData = [{
                        condemnationReport: JSON.parse(condemnationDraft.condemnationArray)
                    }]
                }
            }

            RealmController.addTaskDetails(realm, inspectionDetails, TaskSchema.name, () => {
                // ToastAndroid.show('Task updated successfully ', 1000);
                if (BusinessActivity && BusinessActivity != '') {
                    condemnationDraft.callToSubmitCondemnationService(taskDetails, BusinessActivity);
                }
                else {
                    NavigationService.goBack();
                }
            });
        }
        catch (e) {
            if (BusinessActivity && BusinessActivity != '') {
                condemnationDraft.callToSubmitCondemnationService(taskDetails, BusinessActivity);
            }
        }
        // let objct = RealmController.getTaskDetails(realm, TaskSchema.name, myTasksDraft.taskId);

        // let inspectionDetails = objct['0'] ? objct['0'] : JSON.parse(myTasksDraft.selectedTask)
        // // alert(JSON.stringify(inspection.mappingData))
        // let mappingData = (inspectionDetails.mappingData && (inspectionDetails.mappingData != '') && (typeof (inspectionDetails.mappingData) == 'string')) ? JSON.parse(inspectionDetails.mappingData) : [{}];

        // if (inspectionDetails.mappingData && inspectionDetails.mappingData.length) {
        //     inspectionDetails.mappingData[0].condemnationReport = JSON.parse(condemnationDraft.condemnationArray)
        //     debugger;
        //     RealmController.addTaskDetails(realm, inspectionDetails, TaskSchema.name, () => {
        //         // ToastAndroid.show('Task updated successfully ', 1000);
        //         NavigationService.goBack();
        //     });
        // }
        // else {
        //     inspectionDetails.mappingData[0].condemnationReport = JSON.parse(condemnationDraft.condemnationArray)
        //     debugger;
        //     RealmController.addTaskDetails(realm, inspectionDetails, TaskSchema.name, () => {
        //         // ToastAndroid.show('Task updated successfully ', 1000);
        //         NavigationService.goBack();
        //     });
        // }

    }

    return (

        <SafeAreaView style={{ flex: 1 }}>

            <ImageBackground style={{ height: HEIGHT, width: WIDTH }} source={context.isArabic ? require('./../assets/images/backgroundimgReverse.jpg') : require('./../assets/images/backgroundimg.jpg')}>

                <Spinner
                    visible={condemnationDraft.state == 'pending' ? true : false}
                    overlayColor={'rgba(0,0,0,0.7)'}
                    color={'#b6a176'}
                    textStyle={{ fontSize: 14, color: 'white' }}
                />

                <View style={{ flex: 1.5 }}>
                    <Header
                        screenName={'condemnation'}
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

                {/* <View style={{ flex: 0.4, flexDirection: context.isArabic ? 'row-reverse' : 'row', width: '85%', justifyContent: 'center', alignSelf: 'center', borderWidth: 1, borderRadius: 18, borderColor: '#abcfbf' }}>

                    <View style={{ flex: 0.2 }} />

                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold' }}>{Strings[context.isArabic ? 'ar' : 'en'].inspectionDetails.inspectionNo + ":-"}</Text>
                    </View>

                    <View style={{ flex: 1.2, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold' }}>{taskDetails.TaskId}</Text>
                    </View>

                    <View style={{ flex: 0.008, height: '50%', alignSelf: 'center', borderWidth: 0.2, borderColor: '#5C666F' }} />

                    <View style={{ flex: 0.7, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold', textAlign: context.isArabic ? 'right' : 'left' }}>{'Lulu 01'}</Text>
                    </View>

                    <View style={{ flex: 0.3 }} />

                </View> */}

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
                                <Text numberOfLines={1} style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold', textAlign: context.isArabic ? 'right' : 'left' }}>{establishmentDraft.establishmentName ? establishmentDraft.establishmentName : '-'}</Text>
                            </MenuOptions>
                        </Menu>
                    </View>

                    <View style={{ flex: 0.3 }} />

                </View>

                <View style={{ flex: 7, width: '85%', alignSelf: 'center', }}>

                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: condemnationDraft.condemnationArray === '' ? 'space-between' : JSON.parse(condemnationDraft.condemnationArray).length > 0 ? 'space-between' : 'center', alignItems: condemnationDraft.condemnationArray === '' ? 'flex-start' : JSON.parse(condemnationDraft.condemnationArray).length > 0 ? 'flex-start' : 'center' }}>

                        {condemnationDraft.condemnationArray === '' ? null : (JSON.parse(condemnationDraft.condemnationArray).length > 0) ?
                            <TouchableOpacity
                                disabled={condemnationFlag ? true : false}
                                onPress={() => {
                                    if (condemnationDraft.condemnationArray != '') {
                                        let BusinessActivity = taskDetails.BusinessActivity ? taskDetails.BusinessActivity : ''
                                        debugger;
                                        goBack(BusinessActivity);
                                    }
                                    //     NavigationService.navigate('CondemnationForm');
                                }}
                                style={{ height: 40, top: 9, backgroundColor: '#abcfbf', borderColor: '#ffffff', borderWidth: 5, width: "35%", borderRadius: 10, justifyContent: 'center', alignSelf: "center" }}>
                                <Text style={{ fontSize: 11, textAlign: 'center', color: fontColor.white, fontWeight: 'bold', fontFamily: fontFamily.tittleFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].detention.finalSubmit)}</Text>
                            </TouchableOpacity>
                            : null}

                        <TouchableOpacity
                            disabled={condemnationFlag ? true : false}
                            onPress={() => {
                                NavigationService.navigate('CondemnationForm', { serialNumber: serialNumber + 1 });
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


                    {/* <View style={{flex:1}}>
                    <TouchableOpacity
                        onPress={() => {
                            NavigationService.navigate('CondemnationForm');
                        }}
                        style={{height: 30, top: 9, backgroundColor: '#abcfbf', borderColor: '#ffffff', borderWidth: 5, width: "35%", borderRadius: 10, justifyContent: 'center', alignSelf: "center" }}>
                        <Text style={{ fontSize: 11, textAlign: 'center', color: fontColor.white, fontWeight: 'bold', fontFamily: fontFamily.tittleFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].detention.addRecord)}</Text>
                    </TouchableOpacity>
                    </View> */}

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

export default observer(Condemnation);

