import React, { useContext, useRef } from 'react';
import { View, SafeAreaView, TouchableOpacity, Text, Dimensions, Alert, StyleSheet, PermissionsAndroid, Platform, ToastAndroid } from "react-native";
import { RealmController } from '../database/RealmController';
import { fontFamily, fontColor } from '../config/config';
import TextInputComponent from './TextInputComponent';
let realm = RealmController.getRealmInstance();
import ImagePicker from 'react-native-image-picker';
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

const SubmissionComponent = (props: any) => {

    const context = useContext(Context);
    let dropdownRef1 = useRef();

    const mapStore = (rootStore: RootStoreModel) => ({ myTasksDraft: rootStore.myTasksModel,licenseDraft: rootStore.licenseMyTaskModel })
    const { myTasksDraft, licenseDraft } = useInject(mapStore)

    const attachedImageToAlertImageView = async (item: any) => {
        try {
            if (Platform.OS === 'ios') {
                selectImage(item);
            } else if (Platform.OS === 'android') {

                PermissionsAndroid.requestMultiple(
                    [
                        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                        PermissionsAndroid.PERMISSIONS.CAMERA
                    ]
                ).then((result) => {
                    debugger;
                    if (result['android.permission.READ_EXTERNAL_STORAGE'] && result['android.permission.CAMERA'] && result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted') {
                        selectImage(item);
                    } else if (result['android.permission.READ_EXTERNAL_STORAGE'] || result['android.permission.CAMERA'] || result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'never_ask_again') {
                        ToastAndroid.show('Please Go into Settings -> Applications -> APP_NAME -> Permissions and Allow permissions to continue', ToastAndroid.LONG);
                    }

                })

                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA, {
                    title: 'Smart control App',
                    message: 'You want to use the camera',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                })
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    selectImage(item);
                } else {
                }
            }
        } catch (err) {
            console.warn(err);
        }
    }

    const selectImage = (item: any) => {
        let options = {
            title: 'Select Image',
            noData: false,
            saveToPhotos: true,
            customButtons: [
                { name: 'Test', title: 'Cancel' },
            ],
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };
        try {
            ImagePicker.launchCamera(options, async(response) => {
                if (response.didCancel) {
                    // console.log('User cancelled image picker');
                } else if (response.error) {
                    // console.log('ImagePicker Error: ' + response.error);
                } else if (response.customButton) {
                    // console.log('User tapped custom button: ', response.customButton);
                } else {
                    // // console.log('ImageResponse: ', response);
                    debugger;
                    if (response.fileSize) {
                        if (item == 'evidance1') {
                            myTasksDraft.setEvidanceAttachment1(response.data)
                            myTasksDraft.setEvidanceAttachment1Url(response.uri)
                        } 
                        else if (item == 'evidance2') {
                            myTasksDraft.setEvidanceAttachment2(response.data)
                            myTasksDraft.setEvidanceAttachment2Url(response.uri) 
                        }
                        else if (item == 'licence1') {
                            myTasksDraft.setLicencesAttachment1(response.data)
                            myTasksDraft.setLicencesAttachment1Url(response.uri)
                        }
                        else if (item == 'licence2') {
                            myTasksDraft.setLicencesAttachment2(response.data)
                            myTasksDraft.setLicencesAttachment2Url(response.uri)
                        }
                        else if (item == 'emiratesId1') {
                            myTasksDraft.setEmiratesIdAttachment1(response.data)
                            myTasksDraft.setEmiratesIdAttachment1Url(response.uri)
                        }
                        else if (item == 'emiratesId2') {
                            myTasksDraft.setEmiratesIdAttachment2(response.data)
                            myTasksDraft.setEmiratesIdAttachment2Url(response.uri)
                        }
                    } else {
                        ToastAndroid.show("File grater than 2MB", ToastAndroid.LONG);
                    }
                }
            });

        } catch (error) {
            debugger
            // alert((error))

        }
    }

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
                            maxLength={10}
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
                                // dropdownRef1 && dropdownRef1.current.focus();
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

                <View style={{ flex: 1, height: 60, justifyContent: 'center', flexDirection: props.isArabic ? 'row-reverse' : 'row' }}>

                    <View style={{ flex: 2.5, width: '100%', justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>

                        <View style={{ flex: 1, height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#5c666f', borderRadius: 8, flexDirection: props.isArabic ? 'row-reverse' : 'row' }}>
                            <View style={{ flex: 2 }}>
                                <Text style={{ color: 'white', fontSize: 11, textAlign: 'center', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{Strings[context.isArabic ? 'ar' : 'en'].startInspection.evidence} </Text>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: props.isArabic ? 'flex-start' : 'flex-end' }}>
                                <Image
                                    source={require("./../assets/images/startInspection/White/Attach_Icon_24x24.png")}
                                    style={{ height: 16, width: 16, transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }] }}
                                    resizeMode={"contain"} />
                            </View>
                            <View style={{ flex: 0.2 }} />
                        </View>

                    </View>

                    <View style={{ flex: 0.5 }} />

                    <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>

                    <TouchableOpacity
                            onPress={() => {
                                attachedImageToAlertImageView('evidance1')
                            }}
                            style={{
                                flex: 1, justifyContent: 'center', backgroundColor: fontColor.TextInputBoxColor, padding: 5, borderRadius: 8
                            }}>

                            <Image
                                source={myTasksDraft.evidanceAttachment1Url != '' ? 
                                { uri: myTasksDraft.evidanceAttachment1Url} :require("./../assets/images/condemnation/attachmentImg.png")}
                                style={{ height: 35, width: WIDTH*0.2, transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }] }}
                                resizeMode={myTasksDraft.evidanceAttachment1Url != '' ?  "stretch":"contain"} />

                        </TouchableOpacity>

                    </View>

                    <View style={{ flex: 0.8 }} />

                    <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>

                        <TouchableOpacity
                            onPress={() => {
                                attachedImageToAlertImageView('evidance2')
                            }}
                            style={{
                                flex: 1, justifyContent: 'center', backgroundColor: fontColor.TextInputBoxColor, padding: 5, borderRadius: 8
                            }}>

                            <Image
                                source={myTasksDraft.evidanceAttachment2Url != '' ? 
                                { uri: myTasksDraft.evidanceAttachment2Url} :require("./../assets/images/condemnation/attachmentImg.png")}
                                style={{ height: 35, width: WIDTH*0.2, transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }] }}
                                resizeMode={myTasksDraft.evidanceAttachment2Url != '' ?  "stretch":"contain"} />

                        </TouchableOpacity>
                    </View>

                    <View style={{ flex: 0.3 }} />

                </View>

                <View style={{ flex: .4 }} />

                <View style={{ flex: 1, height: 60, justifyContent: 'center', flexDirection: props.isArabic ? 'row-reverse' : 'row' }}>

                    <View style={{ flex: 2.5, width: '100%', justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>

                        <View style={{ flex: 1, height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#5c666f', borderRadius: 8, flexDirection: props.isArabic ? 'row-reverse' : 'row' }}>
                            <View style={{ flex: 2 }}>
                                <Text style={{ color: 'white', fontSize: 11, textAlign: 'center', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{Strings[context.isArabic ? 'ar' : 'en'].startInspection.license} </Text>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: props.isArabic ? 'flex-start' : 'flex-end' }}>
                                <Image
                                    source={require("./../assets/images/startInspection/White/Attach_Icon_24x24.png")}
                                    style={{ height: 16, width: 16, transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }] }}
                                    resizeMode={"contain"} />
                            </View>
                            <View style={{ flex: 0.2 }} />
                        </View>

                    </View>

                    <View style={{ flex: 0.5 }} />

                    <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>

                        <TouchableOpacity
                            onPress={() => {
                                attachedImageToAlertImageView('licence1')
                            }}
                            style={{
                                flex: 1, justifyContent: 'center', backgroundColor: fontColor.TextInputBoxColor, padding: 5, borderRadius: 8
                            }}>

                            <Image
                                source={myTasksDraft.licencesAttachment1Url != '' ? 
                                { uri: myTasksDraft.licencesAttachment1Url } : require("./../assets/images/condemnation/attachmentImg.png")}
                                style={{ height: 35, width: WIDTH*0.2, transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }] }}
                                resizeMode={myTasksDraft.licencesAttachment1Url != '' ?  "stretch":"contain"} />

                        </TouchableOpacity>
                    </View>

                    <View style={{ flex: 0.8 }} />

                    <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={() => {
                                attachedImageToAlertImageView('licence2')
                            }}
                            style={{
                                flex: 1, justifyContent: 'center', backgroundColor: fontColor.TextInputBoxColor, padding: 5, borderRadius: 8
                            }}>

                            <Image
                                source={myTasksDraft.licencesAttachment2Url != '' ?
                                { uri: myTasksDraft.licencesAttachment2Url } : require("./../assets/images/condemnation/attachmentImg.png")}
                                style={{ height: 35, width: WIDTH*0.2, transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }] }}
                                resizeMode={myTasksDraft.licencesAttachment2Url != '' ?  "stretch":"contain"} />
                        </TouchableOpacity>

                    </View>

                    <View style={{ flex: 0.3 }} />

                </View>

                <View style={{ flex: .4 }} />


                <View style={{ flex: 1, height: 60, flexDirection: props.isArabic ? 'row-reverse' : 'row' }}>

                    <View style={{ flex: 2.5, width: '100%', justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>

                        <View style={{ flex: 1, height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#5c666f', borderRadius: 8, flexDirection: props.isArabic ? 'row-reverse' : 'row' }}>
                            <View style={{ flex: 2 }}>
                                <Text style={{ color: 'white', fontSize: 11, textAlign: 'center', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{Strings[context.isArabic ? 'ar' : 'en'].startInspection.emiratesId} </Text>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: props.isArabic ? 'flex-start' : 'flex-end' }}>
                                <Image
                                    source={require("./../assets/images/startInspection/White/Attach_Icon_24x24.png")}
                                    style={{ height: 16, width: 16, transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }] }}
                                    resizeMode={"contain"} />
                            </View>
                            <View style={{ flex: 0.2 }} />
                        </View>

                    </View>

                    <View style={{ flex: 0.5 }} />

                    <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>

                        <TouchableOpacity
                            onPress={() => {
                                attachedImageToAlertImageView('emiratesId1')
                            }}
                            style={{
                                flex: 1, justifyContent: 'center', backgroundColor: fontColor.TextInputBoxColor, padding: 5, borderRadius: 8
                            }}>

                            <Image
                                source={myTasksDraft.EmiratesIdAttachment1Url != '' ? 
                                { uri: myTasksDraft.EmiratesIdAttachment1Url } : require("./../assets/images/condemnation/attachmentImg.png")}
                                style={{ height: 35, width: WIDTH*0.2, transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }] }}
                                resizeMode={myTasksDraft.EmiratesIdAttachment1Url != '' ?  "stretch":"contain"} />

                        </TouchableOpacity>

                    </View>
                    <View style={{ flex: 0.8 }} />

                    <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>

                        <TouchableOpacity
                            onPress={() => {
                                attachedImageToAlertImageView('emiratesId2')
                            }}
                            style={{
                                flex: 1, justifyContent: 'center', backgroundColor: fontColor.TextInputBoxColor, padding: 5, borderRadius: 8
                            }}>

                            <Image
                                source={myTasksDraft.EmiratesIdAttachment2Url != '' ? 
                                { uri: myTasksDraft.EmiratesIdAttachment2Url } : require("./../assets/images/condemnation/attachmentImg.png")}
                                style={{ height: 35, width: WIDTH*0.2, transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }] }}
                                resizeMode={myTasksDraft.EmiratesIdAttachment2Url != '' ?  "stretch":"contain"} />

                        </TouchableOpacity>

                    </View>

                    <View style={{ flex: 0.3 }} />
                </View>

            </View>

            <View style={{ flex: 1, justifyContent: 'center', flexDirection: props.isArabic ? 'row-reverse' : 'row' }}>

                {/* <View style={{ flex: 0.2 }} /> */}
                {myTasksDraft.isMyTaskClick == 'license' ?
                    <View style={{ flex: 2, justifyContent: 'center', flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                        {licenseDraft.isScoreN == 'N' ?
                            <ButtonComponent
                                style={{
                                    height: '40%', width: '35%', backgroundColor: fontColor.ButtonBoxColor,
                                    borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                    textAlign: 'center'
                                }}
                                buttonClick={() => {
                                    licenseDraft.setIsRejectBtnClick(true);
                                    props.submitButtonPress()
                                }}
                                buttonText={Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.reject}
                            />
                            :
                            // <ButtonComponent
                            //     style={{
                            //         height: '40%', width: '35%', backgroundColor: fontColor.ButtonBoxColor,
                            //         borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                            //         textAlign: 'center'
                            //     }}
                            //     buttonClick={() => {
                            //         ToastAndroid.show(Strings[context.isArabic ? 'ar' : 'en'].startInspection.checklistSubmittedSuccessfully, 1000);
                            //     }}
                            //     buttonText={Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.cancel}
                            // />
                            null
                        }

                        <View style={{ flex: 0.1 }} />

                        <ButtonComponent
                            style={{
                                height: '40%', width: '35%', backgroundColor: fontColor.ButtonBoxColor,
                                alignSelf: 'center', borderRadius: 8, justifyContent: 'center', alignItems: 'center',
                                textAlign: 'center'
                            }}

                            buttonClick={() => {
                                props.submitButtonPress()
                            }}
                            buttonText={(Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.submit)}
                        />

                        <View style={{ flex: 0.2 }} />
                    </View>
                    :
                    <ButtonComponent
                        style={{
                            height: '40%', width: '35%', backgroundColor: fontColor.ButtonBoxColor,
                            borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                            textAlign: 'center'
                        }}
                        buttonClick={() => {
                            props.submitButtonPress();
                            // ToastAndroid.show(Strings[context.isArabic?'ar':'en'].startInspection.checklistSubmittedSuccessfully, 1000);
                        }}
                        buttonText={Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.submit}
                    />
                }
                {/* <View style={{ flex: 0.1 }} /> */}

                {/* <ButtonComponent
                    style={{
                        height: '40%', width: '35%', backgroundColor: fontColor.ButtonBoxColor,
                        alignSelf: 'center', borderRadius: 8, justifyContent: 'center', alignItems: 'center',
                        textAlign: 'center'
                    }}

                    buttonClick={() => {
                        myTasksDraft.setCount('1');
                    }}
                    buttonText={(Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.cancel)}
                /> */}

                {/* <View style={{ flex: 0.2 }} /> */}

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


export default observer(SubmissionComponent);
