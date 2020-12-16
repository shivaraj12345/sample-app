import React, { createRef, useContext, useEffect, useRef, useState } from 'react';
import { View, SafeAreaView, TouchableOpacity, Text, Dimensions, Alert, StyleSheet, FlatList, ToastAndroid } from "react-native";
import { RealmController } from '../database/RealmController';
import { fontFamily, fontColor } from '../config/config';
import TextInputComponent from './TextInputComponent';
let realm = RealmController.getRealmInstance();

import { Context } from '../utils/Context';
import { observer } from 'mobx-react';
import { Image } from 'react-native-animatable';
import NavigationService from '../services/NavigationService';

import { RootStoreModel } from '../store/rootStore';
import useInject from "../hooks/useInject";
import ButtonComponent from './ButtonComponent';
import Strings from '../config/strings';
import SignatureCapture from 'react-native-signature-capture';

const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;

const DocumentationAndRecordComponent = (props: any) => {

    const context = useContext(Context);

    const mapStore = (rootStore: RootStoreModel) => ({ myTasksDraft: rootStore.myTasksModel, documantationDraft: rootStore.documentationAndReportModel, licenseDraft: rootStore.licenseMyTaskModel })
    const { myTasksDraft, documantationDraft, licenseDraft } = useInject(mapStore)
    const [taskId, setTaskId] = useState('');
    const sign = createRef();


    useEffect(() => {
        let taskId = JSON.parse(myTasksDraft.selectedTask).TaskId;
        setTaskId(taskId);
        documantationDraft.setTaskId(taskId);
    }, []);

    let saveImageFlag = false;

    const saveSign = () => {
        sign.current.saveImage();
        documantationDraft.setSaveImageFlag("true");
    };

    const resetSign = () => {
        if (documantationDraft.fileBuffer !== '') {
            documantationDraft.setFileBuffer('')
        }
        else{
            sign.current.resetImage();
        }
    };

    const onSaveEvent = (result: any) => {
        documantationDraft.setFileBuffer(result.encoded);
        documantationDraft.postToSignature();
    };

    const onDragEvent = () => {
        saveSign()
    };

    /*  const saveSign = () => {
          sign.current.saveImage();
      }; */

    const documentArray = [
        { image: require('./../assets/images/startInspection/documentation/Condemnation.png'), title: Strings[props.isArabic ? 'ar' : 'en'].startInspection.condemnation, code: 'condemnation', navigationScreenName: 'Condemnation' },
        { image: require('./../assets/images/startInspection/documentation/Sampling.png'), title: Strings[props.isArabic ? 'ar' : 'en'].startInspection.sampling, code: 'sampling', navigationScreenName: 'Sampling' },
        { image: require('./../assets/images/startInspection/documentation/Detention.png'), title: Strings[props.isArabic ? 'ar' : 'en'].startInspection.detention, code: 'detention', navigationScreenName: 'Detention' },
        { image: require('./../assets/images/startInspection/documentation/OnHold.png'), title: Strings[props.isArabic ? 'ar' : 'en'].startInspection.onHoldRequest, code: 'onHoldRequest', navigationScreenName: 'OnHoldRequest' },
        { image: require('./../assets/images/startInspection/documentation/Closure.png'), title: Strings[props.isArabic ? 'ar' : 'en'].startInspection.requestforClosure, code: 'request', navigationScreenName: 'RequestForClouser' }
    ]

    const documentCasesArray = [
        { image: require('./../assets/images/startInspection/documentation/Condemnation.png'), title: 'Condemnation', code: 'condemnation', navigationScreenName: 'Condemnation' },
        { image: require('./../assets/images/startInspection/documentation/Sampling.png'), title: 'Sampling', code: 'sampling', navigationScreenName: 'Sampling' },
        { image: require('./../assets/images/startInspection/documentation/Detention.png'), title: 'Detention', code: 'detention', navigationScreenName: 'Detention' }
    ]
    const renderData = (item: any, index: number) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    if (item.code == 'condemnation') {
                        NavigationService.navigate(item.navigationScreenName)
                    }
                    if (item.code == 'detention') {
                        NavigationService.navigate(item.navigationScreenName)
                    }
                    if (item.code == 'request') {
                        NavigationService.navigate(item.navigationScreenName)
                    }
                    if (item.code == 'onHoldRequest') {
                        NavigationService.navigate(item.navigationScreenName)
                    }
                    if (item.code == 'sampling') {
                        NavigationService.navigate(item.navigationScreenName)
                    }
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

                <View style={{ flex: 0.3 }} />

                <View style={{ flex: 0.2, width: '100%', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <Text style={[styles.text, { fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }]}>{item.title}</Text>
                </View>

            </TouchableOpacity>

        )
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>

            <View style={{ flex: 3.5, justifyContent: 'center' }}>

                <View style={{ flex: 8, justifyContent: 'center', backgroundColor: fontColor.TextInputBoxColor, borderTopLeftRadius: 6, borderTopRightRadius: 6 }}>

                    {/*  <TextInputComponent
                        placeholder={Strings[props.isArabic ? 'ar' : 'en'].documentAndRecord.signHere}
                        style={{
                            height: '100%', textAlign: 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                            fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderTopLeftRadius: 6, borderTopRightRadius: 6
                        }}
                        onChange={(val) => { }}
                        value={''}
                    /> */}
                    {
                        documantationDraft.fileBuffer !== '' ?
                            <Image
                                source={{ uri: `data:image/jpeg;base64,${documantationDraft.fileBuffer}` }}
                                style={{
                                    height: '100%',alignSelf: 'center', width: '100%', padding: 4, borderTopLeftRadius: 6, borderTopRightRadius: 6
                                }}
                            />
                            :
                            <SignatureCapture
                                style={{
                                    height: '100%', textAlign: 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderTopLeftRadius: 6, borderTopRightRadius: 6
                                }}
                                ref={sign}
                                onSaveEvent={onSaveEvent}
                                onDragEvent={onDragEvent}
                                saveImageFileInExtStorage={false}
                                showNativeButtons={false}
                                showTitleLabel={false}
                            />
                    }


                </View>

                <View style={{ backgroundColor: '#c0c0c0', flex: 2.5, justifyContent: 'center', borderBottomLeftRadius: 6, borderBottomRightRadius: 6, height: '100%' }}>

                    <View style={{ backgroundColor: '#c0c0c0', alignSelf: props.isArabic ? 'flex-start' : 'flex-end', width: '35%', flexDirection: props.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', height: '100%', paddingTop: 2, paddingBottom: 2 }}>

                        <View style={{ flex: .4 }} />

                        <View style={{ flex: .6, justifyContent: 'center', backgroundColor: '#5c666f', height: '100%' }}>

                            <TouchableOpacity
                                onPress={() => {
                                    resetSign();
                                }} >
                                <Image style={{ alignSelf: 'center' }} source={require('./../assets/images/startInspection/delete.png')} />
                            </TouchableOpacity>

                        </View>

                        <View style={{ flex: .2 }} />

                    </View>

                    <View style={{ flex: .2 }} />

                </View>

            </View>


            <View style={{ flex: 2.5, justifyContent: 'center' }}>

                <View style={styles.space} />

                {JSON.parse(myTasksDraft.selectedTask).TaskType.toLowerCase().includes('food') ? null :

                    <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                        <View style={styles.textContainer}>

                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{Strings[props.isArabic ? 'ar' : 'en'].startInspection.finalResult} </Text>


                        </View>

                        <View style={styles.space} />

                        <View style={styles.TextInputContainer}>
                            <TextInputComponent
                                placeholder={''}
                                style={{
                                    height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                editable={false}
                                value={myTasksDraft.result}
                                onChange={(val: string) => {
                                    myTasksDraft.setResult(val)
                                }}
                            />

                        </View>
                    </View>
                }
                <View style={styles.space} />

                <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                    <View style={styles.commentTextContainer}>
                        <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{Strings[props.isArabic ? 'ar' : 'en'].documentAndRecord.finalComment} </Text>
                    </View>

                    <View style={{ flex: 0.3, justifyContent: 'center', alignItems: props.isArabic ? 'flex-end' : 'flex-start' }}>
                        <Image style={{ transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }] }} source={require('./../assets/images/startInspection/commentCheck.png')} />
                    </View>

                    <View style={styles.TextInputContainer}>
                        <TextInputComponent
                            isMultiline={true}
                            placeholder={''}
                            maxLength={200}
                            style={{
                                height: '90%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                            }}
                            value={myTasksDraft.finalComment}
                            onChange={(val: string) => {
                                // myTasksDraft.setFinalComment(val);
                                myTasksDraft.setFinalComment(val);
                            }}
                        />

                    </View>
                </View>

            </View>

            {myTasksDraft.isMyTaskClick == 'license' ?
                <View style={{ flex: .8 }} />
                : <View style={{ flex: 0.3 }} />}

            {
                myTasksDraft.isMyTaskClick == 'myTask' || myTasksDraft.isMyTaskClick == 'case' || myTasksDraft.isMyTaskClick == 'campaign' ?

                    <View style={{ flex: myTasksDraft.isMyTaskClick == 'myTask' ? 3 : 1, justifyContent: 'center', borderRadius: 8, borderWidth: .5, borderColor: '#abcfbf', padding: 5 }}>

                        <FlatList
                            // nestedScrollEnabled={false}
                            data={myTasksDraft.isMyTaskClick == 'myTask' ? documentArray : myTasksDraft.isMyTaskClick == 'campaign' ? documentArray : documentCasesArray}
                            contentContainerStyle={{ padding: 5, justifyContent: 'center' }}
                            columnWrapperStyle={{ flexDirection: props.isArabic ? 'row-reverse' : 'row' }}
                            initialNumToRender={5}
                            renderItem={({ item, index }) => {
                                return (
                                    renderData(item, index)
                                )
                            }}
                            ItemSeparatorComponent={() => (<View style={{ height: WIDTH * 0.06, width: WIDTH * 0.03 }} />)}
                            numColumns={3}
                        />

                    </View>
                    : myTasksDraft.isMyTaskClick == 'license' ?
                        // <View style={{ flex: 2, justifyContent: 'center', flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                        //     {licenseDraft.isScoreN == 'N' ?
                        //         <ButtonComponent
                        //             style={{
                        //                 height: '40%', width: '35%', backgroundColor: fontColor.ButtonBoxColor,
                        //                 borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                        //                 textAlign: 'center'
                        //             }}
                        //             buttonClick={() => {
                        //                 licenseDraft.setIsRejectBtnClick(true);
                        //                 // ToastAndroid.show(Strings[context.isArabic ? 'ar' : 'en'].startInspection.checklistSubmittedSuccessfully, 1000);
                        //             }}
                        //             buttonText={Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.reject}
                        //         />
                        //         :
                        //         <ButtonComponent
                        //             style={{
                        //                 height: '40%', width: '35%', backgroundColor: fontColor.ButtonBoxColor,
                        //                 borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                        //                 textAlign: 'center'
                        //             }}
                        //             buttonClick={() => {
                        //                 ToastAndroid.show(Strings[context.isArabic ? 'ar' : 'en'].startInspection.checklistSubmittedSuccessfully, 1000);
                        //             }}
                        //             buttonText={Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.cancel}
                        //         />
                        //     }

                        //     <View style={{ flex: 0.1 }} />

                        //     <ButtonComponent
                        //         style={{
                        //             height: '40%', width: '35%', backgroundColor: fontColor.ButtonBoxColor,
                        //             alignSelf: 'center', borderRadius: 8, justifyContent: 'center', alignItems: 'center',
                        //             textAlign: 'center'
                        //         }}

                        //         buttonClick={() => {
                        //             props.submit()
                        //         }}
                        //         buttonText={(Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.submit)}
                        //     />

                        //     <View style={{ flex: 0.2 }} />
                        // </View>
                        null
                        :
                        <View style={{ flex: 1, justifyContent: 'center', flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <ButtonComponent
                                style={{
                                    height: '40%', width: '35%', backgroundColor: 'red',
                                    borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                    textAlign: 'center'
                                }}
                                onPress={() => {

                                }}
                                buttonText={Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.submit}
                            />

                            <View style={{ flex: 0.1 }} />

                            <ButtonComponent
                                style={{
                                    height: '40%', width: '35%', backgroundColor: 'red',
                                    alignSelf: 'center', borderRadius: 8, justifyContent: 'center', alignItems: 'center',
                                    textAlign: 'center'
                                }}

                                onPress={() => {
                                }}
                                buttonText={(Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.cancel)}
                            />

                            <View style={{ flex: 0.2 }} />
                        </View>

            }

            <View style={{ flex: 0.3 }} />

        </View>
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
    commentTextContainer: {
        flex: 0.2,
        justifyContent: 'center'
    },
    text: {
        fontSize: 12,
        textAlign: 'center',
        fontWeight: 'bold',
        color: fontColor.TitleColor,
        //fontFamily: fontFamily.textFontFamily
    },
});


export default observer(DocumentationAndRecordComponent);
