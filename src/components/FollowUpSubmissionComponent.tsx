import React, { useContext, useRef } from 'react';
import { View, SafeAreaView, TouchableOpacity, Text, Dimensions, Alert, StyleSheet, FlatList, ToastAndroid } from "react-native";
import { RealmController } from '../database/RealmController';
import { fontFamily, fontColor } from '../config/config';
import TextInputComponent from './TextInputComponent';
let realm = RealmController.getRealmInstance();

import { Context } from '../utils/Context';
import { observer } from 'mobx-react';
import { Image } from 'react-native-animatable';

const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;
import Dropdown from './../components/dropdown';
import ButtonComponent from './ButtonComponent';
import Strings from '../config/strings';

import { RootStoreModel } from '../store/rootStore';
import useInject from "../hooks/useInject";

const FollowUpSubmissionComponent = (props: any) => {

    const context = useContext(Context);
    let dropdownRef1 = useRef();

    const mapStore = (rootStore: RootStoreModel) => ({ myTasksDraft: rootStore.myTasksModel })
    const { myTasksDraft } = useInject(mapStore)

    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>

            <View style={{ flex: 2, justifyContent: 'center' }}>

                <View style={styles.space} />

                <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                    <View style={styles.textContainer}>
                        <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{Strings[context.isArabic ? 'ar' : 'en'].startInspection.contactName} </Text>
                    </View>

                    <View style={styles.space} />

                    <View style={styles.TextInputContainer}>

                        <TextInputComponent
                            placeholder={''}
                            style={{
                                height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                            }}
                            value={myTasksDraft.contactName}
                            onChange={(val: string) => {
                                myTasksDraft.setContactName(val);
                            }}
                        />

                    </View>
                </View>

                <View style={styles.space} />

                <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                    <View style={styles.textContainer}>
                        <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{Strings[context.isArabic ? 'ar' : 'en'].startInspection.mobileNumber} </Text>
                    </View>

                    <View style={styles.space} />

                    <View style={styles.TextInputContainer}>

                        <TextInputComponent
                            placeholder={''}
                            style={{
                                height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                            }}
                            keyboardType={'number-pad'}
                            value={myTasksDraft.mobileNumber}
                            onChange={(val: string) => {
                                myTasksDraft.setMobileNumber(val);
                            }}
                        />

                    </View>

                </View>

                <View style={styles.space} />

                <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                    <View style={styles.textContainer}>

                        <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{Strings[context.isArabic ? 'ar' : 'en'].startInspection.emiratesId} </Text>

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
                                {/* <Dropdown
                                    ref={dropdownRef1}
                                    value={''}
                                    onChangeText={(val: string) => {
                                        myTasksDraft.setEmiratesId(val)
                                    }}
                                    itemTextStyle={{ width: '100%', height: '100%', textAlign: context.isArabic ? 'center' : 'center', fontSize: 10, padding: 0, color: fontColor.TextBoxTitleColor }}
                                    containerStyle={{ width: '100%', height: '100%', alignSelf: 'flex-start' }}
                                    data={[]}
                                /> */}
                                <TextInputComponent
                                    placeholder={''}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    keyboardType={'number-pad'}
                                    value={myTasksDraft.emiratesId}
                                    onChange={(val: string) => {
                                        myTasksDraft.setEmiratesId(val);
                                    }}
                                />
                            </View>
                            {/* <View style={{ width: '15%', justifyContent: 'center', alignItems: 'center' }}>
                                <Image
                                    source={require("./../assets/images/condemnation/dropdownArrow.png")}
                                    style={{ height: 16, width: 16, transform: [{ rotate: '90deg' }] }}
                                    resizeMode={"contain"} />
                            </View> */}
                        </TouchableOpacity>
                    </View>

                </View>

            </View>

            <View style={{ flex: .2 }} />

            <View style={{ flex: 2, justifyContent: 'center' }}>

                <View style={{ flex: 1, justifyContent: 'center', flexDirection:props.isArabic?'row-reverse':'row' }}>

                    <View style={{ flex: 2.5, width: '100%', justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>

                        <View style={{ flex: 1, height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#5c666f', borderRadius: 8, flexDirection:props.isArabic?'row-reverse':'row' }}>
                            <View style={{ flex: 2 }}>
                                <Text style={{ color: 'white', fontSize: 11, textAlign: 'center', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{Strings[context.isArabic ? 'ar' : 'en'].startInspection.evidence} </Text>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: props.isArabic ?'flex-start': 'flex-end' }}>
                                <Image
                                    source={require("./../assets/images/startInspection/White/Attach_Icon_24x24.png")}
                                    style={{ height: 16, width: 16,transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }]}}
                                    resizeMode={"contain"} />
                            </View>
                            <View style={{ flex: 0.2 }} />
                        </View>

                    </View>

                    <View style={{ flex: 0.5 }} />

                    <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>

                        <TouchableOpacity
                            onPress={() => {
                            }}
                            style={{
                                flex: 1, justifyContent: 'center', backgroundColor: fontColor.TextInputBoxColor, padding: 20, borderRadius: 8
                            }}>

                            <Image
                                source={require("./../assets/images/condemnation/attachmentImg.png")}
                                style={{ height: 24, width: 24,transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }] }}
                                resizeMode={"contain"} />

                        </TouchableOpacity>

                    </View>

                    <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>

                        <TouchableOpacity
                            onPress={() => {
                            }}
                            style={{
                                flex: 1, justifyContent: 'center', backgroundColor: fontColor.TextInputBoxColor, padding: 20, borderRadius: 8
                            }}>

                            <Image
                                source={require("./../assets/images/condemnation/attachmentImg.png")}
                                style={{ height: 24, width: 24,transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }] }}
                                resizeMode={"contain"} />

                        </TouchableOpacity>
                    </View>

                    <View style={{ flex: 0.3 }} />

                </View>

                <View style={{ flex: .4 }} />

                <View style={{ flex: 1, justifyContent: 'center', flexDirection:props.isArabic?'row-reverse':'row' }}>

                    <View style={{ flex: 2.5, width: '100%', justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>

                        <View style={{ flex: 1, height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#5c666f', borderRadius: 8, flexDirection:props.isArabic?'row-reverse':'row' }}>
                            <View style={{ flex: 2 }}>
                                <Text style={{ color: 'white', fontSize: 11, textAlign: 'center', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{Strings[context.isArabic ? 'ar' : 'en'].startInspection.license} </Text>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems:props.isArabic?'flex-start': 'flex-end' }}>
                                <Image
                                    source={require("./../assets/images/startInspection/White/Attach_Icon_24x24.png")}
                                    style={{ height: 16, width: 16,transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }]}}
                                    resizeMode={"contain"} />
                            </View>
                            <View style={{ flex: 0.2 }} />
                        </View>

                    </View>

                    <View style={{ flex: 0.5 }} />

                    <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>

                        <TouchableOpacity
                            onPress={() => {
                            }}
                            style={{
                                flex: 1, justifyContent: 'center', backgroundColor: fontColor.TextInputBoxColor, padding: 20, borderRadius: 8
                            }}>

                            <Image
                                source={require("./../assets/images/condemnation/attachmentImg.png")}
                                style={{ height: 24, width: 24,transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }] }}
                                resizeMode={"contain"} />

                        </TouchableOpacity>
                    </View>

                    <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={() => {
                            }}
                            style={{
                                flex: 1, justifyContent: 'center', backgroundColor: fontColor.TextInputBoxColor, padding: 20, borderRadius: 8
                            }}>

                            <Image
                                source={require("./../assets/images/condemnation/attachmentImg.png")}
                                style={{ height: 24, width: 24,transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }]}}
                                resizeMode={"contain"} />
                        </TouchableOpacity>

                    </View>

                    <View style={{ flex: 0.3 }} />

                </View>

                <View style={{ flex: .4 }} />


                <View style={{ flex: 1, justifyContent: 'center', flexDirection:props.isArabic?'row-reverse':'row' }}>
                    <View style={{ flex: 2.5, width: '100%', justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>

                        <View style={{ flex: 1, height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#5c666f', borderRadius: 8, flexDirection: props.isArabic?'row-reverse':'row' }}>
                            <View style={{ flex: 2 }}>
                                <Text style={{ color: 'white', fontSize: 11, textAlign: 'center', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{Strings[context.isArabic ? 'ar' : 'en'].startInspection.emiratesId} </Text>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems:props.isArabic?'flex-start':'flex-end' }}>
                                <Image
                                  source={require("./../assets/images/startInspection/White/Attach_Icon_24x24.png")}
                                    style={{ height: 16, width: 16 ,transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }]}}
                                    resizeMode={"contain"} />
                            </View>
                            <View style={{ flex: 0.2 }} />
                        </View>

                    </View>

                    <View style={{ flex: 0.5 }} />

                    <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>

                        <TouchableOpacity
                            onPress={() => {
                            }}
                            style={{
                                flex: 1, justifyContent: 'center', backgroundColor: fontColor.TextInputBoxColor, padding: 20, borderRadius: 8
                            }}>

                            <Image
                                source={require("./../assets/images/condemnation/attachmentImg.png")}
                                style={{ height: 24, width: 24,transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }] }}
                                resizeMode={"contain"} />

                        </TouchableOpacity>

                    </View>

                    <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>

                        <TouchableOpacity
                            onPress={() => {
                            }}
                            style={{
                                flex: 1, justifyContent: 'center', backgroundColor: fontColor.TextInputBoxColor, padding: 20, borderRadius: 8
                            }}>

                            <Image
                                source={require("./../assets/images/condemnation/attachmentImg.png")}
                                style={{ height: 24, width: 24,transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }] }}
                                resizeMode={"contain"} />

                        </TouchableOpacity>

                    </View>

                    <View style={{ flex: 0.3 }} />
                </View>

            </View>

            <View style={{ flex: 1, justifyContent: 'center', flexDirection:props.isArabic?'row-reverse':'row' }}>

                <View style={{ flex: 0.2 }} />

                <ButtonComponent
                    style={{
                        height: '40%', width: '35%', backgroundColor: fontColor.ButtonBoxColor,
                        borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                        textAlign: 'center'
                    }}
                    buttonClick={() => {
                       props.submitButtonPress()
                     //   ToastAndroid.show(Strings[context.isArabic?'ar':'en'].startInspection.checklistSubmittedSuccessfully, 1000);
                    }}
                    buttonText={Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.submit}
                />

                <View style={{ flex: 0.1 }} />

                <ButtonComponent
                    style={{
                        height: '40%', width: '35%', backgroundColor: fontColor.ButtonBoxColor,
                        alignSelf: 'center', borderRadius: 8, justifyContent: 'center', alignItems: 'center',
                        textAlign: 'center'
                    }}

                    buttonClick={() => {
                        myTasksDraft.setCount('1');
                    }}
                    buttonText={(Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.cancel)}
                />

                <View style={{ flex: 0.2 }} />

            </View>

            <View style={{ flex: .5 }} />


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


export default observer(FollowUpSubmissionComponent);
