import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, ImageBackground, Dimensions, Switch, TextInput, TouchableOpacity, SafeAreaView, StyleSheet, ToastAndroid, Alert, Modal } from "react-native";
import { observer } from 'mobx-react';
import { RootStoreModel } from "../store/rootStore"
import useInject from "../hooks/useInject"
import NavigationService from '../services/NavigationService';
import { fontFamily, fontColor } from '../config/config';
// import data from '../config/data';
import { RealmController } from '../database/RealmController';
let realm = RealmController.getRealmInstance();
import LanguageSchema from '../database/LanguageSchema';
import TaskSchema from '../database/TaskSchema';
import AllEstablishmentSchema from '../database/AllEstablishmentSchema';
import Strings from '../config/strings';
import { Context } from '../utils/Context';
import Spinner from 'react-native-loading-spinner-overlay';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import ProgressCircle from 'react-native-progress-circle'
const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;
import XLSX from 'xlsx';
import { writeFile, readFile, readFileAssets, DownloadDirectoryPath } from 'react-native-fs';
const input = (res: any) => res;
const output = (str: any) => str;
const make_cols = (refstr: any) => Array.from({ length: XLSX.utils.decode_range(refstr).e.c + 1 }, (x, i) => XLSX.utils.encode_col(i));
const make_width = (refstr: any) => Array.from({ length: XLSX.utils.decode_range(refstr).e.c + 1 }, () => 60);

import TouchID from 'react-native-touch-id';
import LoginSchema from '../database/LoginSchema';
let currentIndex = 0;

function useAsyncState(initialValue: any) {
    const [value, setValue] = useState(initialValue);
    const setter = (x: any) =>
        new Promise(resolve => {
            setValue(x);
            resolve(x);
        });
    return [value, setter];
}

const Login = (props: any) => {
    const context = useContext(Context);

    const mapStore = (rootStore: RootStoreModel) => ({ loginDraft: rootStore.loginModel, establishmentDraft: rootStore.establishmentModel })
    const { loginDraft, establishmentDraft } = useInject(mapStore)
    let num = 0;
    const [isVisible, setIsVisible] = useState(false);
    const [establishmentCurrentIndex, setEstablishmentCurrentIndex] = useAsyncState(0);
    const [establishmentLength, setEstablishmentLength] = useAsyncState(0);
    const [errormsg, setError] = useState({
        userNameErr: '',
        passwordErr: ''
    });

    const [isVisibleBiometric, setIsVisibleBiometric] = useState(false);

    var loginInfo: any;

    async function increment(count: number) {
        setEstablishmentCurrentIndex(count + 1)
    }


    // useEffect(() => {
    //     // setEstablishmentCurrentIndex(currentIndex)
    //     if (isVisible) {
    //         // let currentIndex = 0;
    //         let interval = setInterval(() => {
    //             // currentIndex = currentIndex + 1;
    //             setEstablishmentCurrentIndex(establishmentCurrentIndex + 1)
    //         }, 10)

    //         if (establishmentCurrentIndex == 21000) {
    //             clearInterval(interval);
    //         }
    //     } else {
    //     }
    // }, [isVisible])

    useEffect(() => {

        // async function EstData() {
        try {
            // const mapStore = (rootStore: RootStoreModel) => ({ myTasksDraft: rootStore.myTasksModel, completedTaskDraft: rootStore.completdMyTaskModel })
            // const { myTasksDraft, completedTaskDraft } = useInject(mapStore)
            let EstFlag = false;
            let est = RealmController.getAllEstablishments(realm, AllEstablishmentSchema.name);

            if (!est['0']) {
                loginDraft.setState('pending')
                // setIsVisible(true)
                // setEstablishmentLength(21023)
                // let interval = setInterval(() => {
                //     currentIndex = currentIndex + 1;
                //     setEstablishmentCurrentIndex(currentIndex)
                // }, 1)
                readFileAssets('file6.xlsx', 'ascii').then((res) => {
                    /* parse file */
                    const wb = XLSX.read(input(res), { type: 'binary' });
                    debugger
                    /* convert first worksheet to AOA */
                    const wsname = wb.SheetNames[0];
                    const ws = wb.Sheets[wsname];
                    const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
                    debugger
                    let tempCustArray = [];
                    // setEstablishmentLength(data.length)
                    for (let index = 0; index < data.length; index++) {
                        const element: any = data[index];
                        if (element.length) {
                            let obj = {
                                PREMISE_ID: element[0] ? element[0].toString() : '',// primary key
                                ACCOUNT_NUMBER: element[1] ? element[1].toString() : '',
                                TL_NUMBER: element[2] ? element[2].toString() : '',
                                PREMISE_NAME: element[3] ? element[3].toString() : '',
                                PREMISE_NAME_AR: element[4] ? element[4].toString() : '',
                                STATUS: element[5] ? element[5].toString() : '',
                                PREMISE_CATEGORY: element[6] ? element[6].toString() : '',
                                ADDRESS: element[7] ? element[7].toString() : '',
                                CITY: element[8] ? element[8].toString() : '',
                                AREA: element[9] ? element[9].toString() : '',
                                PREMISE_TYPE: element[10] ? element[10].toString() : '',
                                MOBILE_NUMBER: element[11] ? element[11].toString() : '',
                                INSPECTOR: element[12] ? element[12].toString() : '',
                                SOURCE: element[13] ? element[13].toString() : '',
                                ON_HOLD: element[14] ? element[14].toString() : '',
                                ON_HOLD_REASON: element[15] ? element[15].toString() : '',
                                LATITUDE: element[16] ? element[16].toString() : '',
                                LONGITUDE: element[17] ? element[17].toString() : '',
                                LAND_LINE: element[18] ? element[18].toString() : '',
                                EMAIL: element[19] ? element[19].toString() : ''
                            };

                            RealmController.addAllEstablishments(realm, obj, AllEstablishmentSchema.name, () => {

                            });
                            console.log(index)
                            // increment(index)
                            // tempCustArray.push(obj);
                            if (index == (data.length - 1)) {
                                // clearInterval(interval);
                                loginDraft.setState('done')
                                // setIsVisible(false)
                            }
                        }
                    }
                    
                }).catch((err) => { 
                    loginDraft.setState('done')
                    console.log("importFile Error", "Error " + err.message); });
            }
            else {
                EstFlag = true;
            }

            if (EstFlag) {

                debugger
                loginDraft.callToLovDataByKeyService();
                loginDraft.setUsername('');
                loginDraft.setPassword('');
                // loginDraft.setisArabic(true);
                let lan = false;
                // let langData = RealmController.getLanguage(realm, LanguageSchema.name, '1');

                loginInfo = RealmController.getLoginData(realm, LoginSchema.name);

                if (loginInfo && loginInfo['0'] && loginInfo['0'].username && loginInfo['0'].password &&
                    loginInfo['0'].username != "" && loginInfo['0'].password != "") {
                    bioAuthenticate()
                    loginDraft.setUsername(loginInfo['0'].username);
                    loginDraft.setPassword(loginInfo['0'].password);
                    setIsVisibleBiometric(true);

                }
                else {

                    setIsVisibleBiometric(false);

                }
            }

        } catch (error) {
            console.log(error)
        }
        
    }, []);

    useEffect(() => {
        debugger;
        if (loginDraft.getState() == "loginSuccess") {
            // setIsVisible(false);
            NavigationService.navigate('Dashboard');
        }

    }, [loginDraft.state])

    const submit = () => {
        let flag = true;
        if (loginDraft.username === '') {
            flag = false;
            setError(prevState => {
                return { ...prevState, userNameErr: 'required' }
            });
            ToastAndroid.show(Strings[context.isArabic ? 'ar' : 'en'].login.invalidUserName, 1000);
        }
        if (loginDraft.password === '') {
            flag = false;
            setError(prevState => {
                return { ...prevState, passwordErr: 'required' }
            });
            ToastAndroid.show((Strings[context.isArabic ? 'ar' : 'en'].login.invalidPassword), 1000);
        }

        if (flag) {
            loginDraft.callToLoginService(false);
            // NavigationService.navigate('Dashboard');
        }
    }

    // const bioAuthenticate = () => {

    //     const optionalConfigObject = {
    //         title: 'Sign in', // Android
    //         imageColor: '#e00606', // Android
    //         imageErrorColor: '#ff0000', // Android
    //         sensorDescription: 'Touch sensor', // Android
    //         sensorErrorDescription: 'Failed', // Android
    //         cancelText: 'Cancel', // Android
    //         fallbackLabel: 'Show Passcode', // iOS (if empty, then label is hidden)
    //         unifiedErrors: false, // use unified error messages (default false)
    //         passcodeFallback: false, // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
    //     };

    //     TouchID.authenticate('', optionalConfigObject)
    //         .then((success: any) => {
    //             loginInfo = RealmController.getLoginData(realm, LoginSchema.name);
    //             if (loginInfo && loginInfo[0] && loginInfo[0].username && loginInfo[0].password &&
    //                 loginInfo[0].username != "" && loginInfo[0].password != "") {
    //                 loginDraft.setUsername(loginInfo[0].username);
    //                 loginDraft.setPassword(loginInfo[0].password);
    //                 NavigationService.navigate('Dashboard');
    //             }
    //             // loginDraft.callToLoginService(true);
    //         })
    //         .catch((error: any) => {
    //             Alert.alert('Authentication Failed');
    //         });
    // }

    const bioAuthenticate = () => {

        FingerprintScanner
            .authenticate({ description: 'Log in with Biometrics' })
            .then((res: any) => {
                FingerprintScanner.release();
                loginInfo = RealmController.getLoginData(realm, LoginSchema.name);
                if (loginInfo && loginInfo[0] && loginInfo[0].username && loginInfo[0].password &&
                    loginInfo[0].username != "" && loginInfo[0].password != "") {
                    loginDraft.setUsername(loginInfo[0].username);
                    loginDraft.setPassword(loginInfo[0].password);
                    NavigationService.navigate('Dashboard');
                }
            })
            .catch((error: any) => {
                // console.log("error: ", error.name)
                if (error.name != "UserCancel" && error.name != "UserFallback") {
                    Alert.alert(error.message);
                }
                FingerprintScanner.release();
            });
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>

            <ImageBackground
                style={[styles.fixed, styles.containter]}
                source={context.isArabic ? require('./../assets/images/backgroundImageAr.jpg') : require('./../assets/images/backgroundImage.jpg')}
            >
                {/* <ProgressCircle
                    percent={establishmentCurrentIndex}
                    radius={50}
                    borderWidth={8}
                    color="#3399FF"
                    shadowColor="#999"
                    bgColor="#fff"
                >
                    <Text style={{ fontSize: 18 }}>{establishmentCurrentIndex}</Text>
                </ProgressCircle> */}

                <Modal
                    visible={isVisible}
                    transparent={true}
                >
                    <View style={{ height: HEIGHT * 1, width: WIDTH * 1, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20, justifyContent: 'center', zIndex: 8, alignItems: 'center', }}>
                        <View style={{ width: WIDTH * 0.9, height: HEIGHT * 0.2, position: 'absolute', alignSelf: 'center', padding: 20, borderRadius: 10, top: '30%', backgroundColor: 'white' }} >
                            <Text style={{ color: fontColor.TitleColor, fontSize: 24, fontWeight: 'bold', textAlign: 'center', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily }}>{`${establishmentCurrentIndex} / ${establishmentLength}`}  </Text>
                        </View>
                    </View>
                </Modal>

                <Spinner
                    visible={loginDraft.state == 'pending' ? true : false}
                    textContent={'Loading...'}
                    overlayColor={'rgba(0,0,0,0.7)'}
                    color={'#b6a176'}
                    textStyle={{ fontSize: 14, color: 'white' }}
                />

                <View style={{ flex: 1.3, width: '100%' }} />

                <View style={{
                    flex: 8.5, width: '100%', justifyContent: 'center', alignItems: 'center', borderColor: 'transparent', borderRadius: 10, borderWidth: 0.5,
                }} >

                    <View style={{
                        flex: 1, width: '100%', alignSelf: 'center', justifyContent: 'center', alignItems: context.isArabic ? 'flex-end' : 'flex-start',
                    }}>
                        <Image resizeMode="contain" source={require("./../assets/images/logo-size/smartControlLogosmall.png")}
                            style={{ height: '100%', width: '70%' }} />
                    </View>

                    <View style={{
                        flex: 0.6, width: '80%', justifyContent: 'center', alignItems: context.isArabic ? 'flex-end' : 'flex-start', alignSelf: 'center'
                    }}>
                        <Text style={{ color: fontColor.TitleColor, fontSize: 24, fontWeight: 'bold', textAlign: 'center', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].header.smartControl)}  </Text>
                    </View>

                    <View style={{ flex: 3, width: '90%', alignSelf: 'center' }} >

                        <View style={{ flex: 2.5, width: '90%', alignSelf: 'center', justifyContent: 'center' }}>

                            <View style={{ flex: 1.5, width: '90%', alignSelf: 'flex-start', justifyContent: 'center' }}>
                                <View style={{ flex: 0.6, width: '100%' }}>
                                    <Text style={{ color: fontColor.TitleColor, fontSize: 16, textAlign: context.isArabic ? 'right' : 'left', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].login.userName)}  </Text>
                                </View>
                                <View style={{ flex: 2, width: '100%' }}>
                                    <TextInput
                                        style={{
                                            height: 40, textAlign: context.isArabic ? 'right' : 'left', width: '100%', color: fontColor.TitleColor,
                                            fontSize: 14, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1,

                                        }}
                                        value={loginDraft.username}
                                        maxLength={50}
                                        placeholderTextColor={fontColor.TitleColor}
                                        keyboardType='default'
                                        placeholder={(Strings[context.isArabic ? 'ar' : 'en'].login.enterUserName)}
                                        onChangeText={(val) => {
                                            loginDraft.setUsername("SALEH.BALKHAIR")
                                            setError(prevState => {
                                                return { ...prevState, userNameErr: '' }
                                            });
                                        }} />
                                </View>

                                {errormsg.userNameErr == 'required' || errormsg.userNameErr == 'invalid' ?
                                    <View style={{ flex: 1, alignItems: context.isArabic ? 'flex-end' : 'flex-start' }} >
                                        {errormsg.userNameErr == 'required' && <Text style={{ color: 'red', paddingLeft: 4, paddingRight: context.isArabic ? 2 : 0, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, }}>{(Strings[context.isArabic ? 'ar' : 'en'].login.thisFieldIsRequired)}</Text>}
                                        {/* {errormsg.userNameErr == 'invalid' && <Text style={{ color: 'red', paddingLeft: 4, paddingRight: context.isArabic ? 2 : 0 }}>{strings('login.invalidEmailId')}</Text>} */}
                                    </View>
                                    : <View style={{ height: HEIGHT * 0.02, padding: 10 }} />}
                            </View>

                            <View style={{ flex: 1.5, width: '90%', alignSelf: 'flex-start', }}>
                                <View style={{ flex: 0.6, width: '100%' }}>
                                    <Text style={{ color: fontColor.TitleColor, fontSize: 16, textAlign: context.isArabic ? 'right' : 'left', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].login.password)}  </Text>
                                </View>
                                <View style={{ flex: 2, width: '100%' }}>
                                    <TextInput
                                        style={{
                                            height: 40, textAlign: context.isArabic ? 'right' : 'left', width: '100%', color: fontColor.TitleColor,
                                            fontSize: 14, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1,

                                        }}
                                        value={loginDraft.password}
                                        maxLength={50}
                                        keyboardType={'default'}
                                        placeholderTextColor={fontColor.TitleColor}
                                        secureTextEntry={true}
                                        placeholder={(Strings[context.isArabic ? 'ar' : 'en'].login.enterPassword)}
                                        onChangeText={(val) => {
                                            loginDraft.setPassword("FISIns#221");
                                            setError(prevState => {
                                                return { ...prevState, passwordErr: '' }
                                            });
                                        }} />
                                </View>

                                {errormsg.passwordErr == 'required' ?
                                    <View style={{ height: HEIGHT * 0.02, alignItems: context.isArabic ? 'flex-end' : 'flex-start' }} >
                                        {errormsg.passwordErr == 'required' && <Text style={{ color: 'red', paddingLeft: 4, paddingRight: context.isArabic ? 2 : 0, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].login.thisFieldIsRequired)}</Text>}
                                    </View>

                                    : <View style={{ height: HEIGHT * 0.02, padding: 10 }} />}
                            </View>


                        </View>



                        <View style={{ flex: 0.5, flexDirection: context.isArabic ? 'row-reverse' : 'row', width: "100%", alignItems: 'center', justifyContent: context.isArabic ? 'flex-end' : 'flex-start' }}>
                            {isVisibleBiometric ? <TouchableOpacity onPress={bioAuthenticate}
                                style={{
                                    flex: 1, width: '100%', justifyContent: 'center', alignItems: "center",
                                }}>
                                <Text style={{
                                    color: fontColor.TitleColor, textDecorationLine: 'underline', fontStyle: 'italic',
                                    fontSize: 12, textAlign: 'center', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily
                                }}>{'Login Using Face Recognition'}</Text>


                            </TouchableOpacity>
                                :
                                <TouchableOpacity
                                    //onPress={bioAuthenticate}
                                    style={{
                                        flex: 1, width: '100%', justifyContent: 'center', alignItems: "center",
                                    }}>
                                    <Text style={{
                                        color: fontColor.TitleColor, textDecorationLine: 'underline', fontStyle: 'italic',
                                        fontSize: 12, textAlign: 'center', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily
                                    }}>{'Login Using Face Recognition'}</Text>


                                </TouchableOpacity>

                            }

                            <View style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: "row" }}>

                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: 'center', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].login.english)}</Text>

                                <Switch
                                    thumbColor={fontColor.TitleColor}
                                    // trackColor={{ true: EStyleSheet.value('$lightGoldenColr'), false: null }}
                                    onValueChange={(val) => {
                                        context.toggleLanguage()
                                    }}
                                    value={context.isArabic} />
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: 'center', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].login.arabic)}</Text>

                            </View>
                        </View>

                        <View style={{ flex: 0.1, flexDirection: 'row', width: "100%", justifyContent: 'center', alignItems: 'center' }}>
                        </View>


                        <View style={{ flex: 2.2, flexDirection: context.isArabic ? 'row-reverse' : 'row', width: "90%", alignSelf: 'flex-start' }}>
                            {
                                isVisibleBiometric ?
                                    <View style={{ flex: 0.7 }}>
                                        <TouchableOpacity
                                            onPress={bioAuthenticate}
                                            style={{
                                                flex: 1, width: '100%', justifyContent: 'center', alignItems: "center"
                                            }}>
                                            <Image resizeMode="contain" source={require("./../assets/images/login/face_icon.png")}
                                                style={{ height: '100%', width: '70%' }} />
                                        </TouchableOpacity>
                                        <View style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: "row" }}>
                                        </View>
                                    </View>

                                    :

                                    <View style={{ flex: 0.7 }}>
                                        <TouchableOpacity
                                            //onPress={bioAuthenticate}
                                            style={{
                                                flex: 1, width: '100%', justifyContent: 'center', alignItems: "center"
                                            }}>
                                            <Image resizeMode="contain" source={require("./../assets/images/login/face_icon.png")}
                                                style={{ height: '100%', width: '70%' }} />
                                        </TouchableOpacity>
                                        <View style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: "row" }}>
                                        </View>
                                    </View>

                            }

                            <View style={{ flex: 0.2 }} />

                            <View style={{ width: '60%', alignSelf: 'center', flex: 0.5 }}>
                                {/* <View style={{ flex: 0.3, borderTopWidth: 0.7, borderTopColor: fontColor.TitleColor, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 0.7, flexDirection: 'row' }}>
                                    <View style={{ flex: 0.6, justifyContent: 'center' }}>
                                        <Text numberOfLines={2} style={{ color: fontColor.TitleColor, fontSize: 10, textAlign: 'left', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{'This Device is not Rooted'}</Text>
                                    </View>
                                    <View style={{ flex: 0.1 }} />
                                    <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                        <Image resizeMode="contain" source={require("./../assets/images/login/Rooted.png")}
                                            style={{ height: '80%', width: '100%' }} />
                                    </View>

                                </View>

                                <View style={{ flex: 0.1 }} />
                                <View style={{ flex: 0.5 }}>
                                    <View style={{ flex: 0.3, alignSelf: 'flex-start' }}>
                                        <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: 'center', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{'Protected BY'}</Text>
                                    </View>
                                    <View style={{ flex: 0.15 }} />
                                    <View style={{ flex: 0.4 }}>
                                        <Image resizeMode="contain" source={require("./../assets/images/login/Kaspersk.png")}
                                            style={{ height: '100%', width: '80%', }} />
                                    </View>
                                   
                                </View>

                                <View style={{ flex: 0.55, width: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: "row" }}>
                                </View> */}
                            </View>
                        </View>
                        <View style={{ flex: 2.3, width: '100%' }} >
                            <TouchableOpacity onPress={submit}
                                style={[
                                    {
                                        borderRadius: WIDTH * 0.2, backgroundColor: '#ee3d43', width: WIDTH * 0.4, height: WIDTH * 0.4,
                                        position: 'absolute', bottom: HEIGHT * 0.03, borderWidth: WIDTH * 0.05, borderColor: '#ffffff', justifyContent: 'center'
                                    }, context.isArabic ? { left: WIDTH * 0.06 } : { right: WIDTH * 0.06 }
                                ]}
                            >
                                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', textAlign: 'center', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].header.login)}  </Text>

                            </TouchableOpacity>
                        </View>

                    </View>

                </View>

            </ImageBackground>

        </SafeAreaView >

    );
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
    circles: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    progress: {
        margin: 10,
    },
    scrollview: {
        backgroundColor: 'transparent'
    }
});
export default observer(Login);