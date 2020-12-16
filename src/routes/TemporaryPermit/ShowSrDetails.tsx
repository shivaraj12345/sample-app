import React, { useContext, useState, useEffect } from 'react';
import { Image, View, StyleSheet, SafeAreaView, Text, ImageBackground, TouchableOpacity, Dimensions, FlatList } from "react-native";
import NavigationService from '../../services/NavigationService';
import Header from './../../components/Header';
import ButtonComponent from './../../components/ButtonComponent';
import TextInputComponent from './../../components/TextInputComponent';
import BottomComponent from './../../components/BottomComponent';
import { observer } from 'mobx-react';
import { Context } from '../../utils/Context';
import { fontFamily, fontColor } from '../../config/config';
import Strings from '../../config/strings';
import { RealmController } from '../../database/RealmController';
import { RootStoreModel } from '../../store/rootStore';
import useInject from "../../hooks/useInject";
let realm = RealmController.getRealmInstance();

const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;

const ShowSrDetails = (props: any) => {

    const context = useContext(Context);

    const [inspectionDetails, setInspectionDetails] = useState(Object());

    const mapStore = (rootStore: RootStoreModel) => ({ myTasksDraft: rootStore.myTasksModel })
    const { myTasksDraft } = useInject(mapStore)

    useEffect(() => {
        const inspectionDetails = props.route ? props.route.params ? props.route.params.inspectionDetails : {} : {};
        setInspectionDetails(inspectionDetails);
    }, []);


    return (

        <SafeAreaView style={{ flex: 1 }}>

            <ImageBackground style={{ height: HEIGHT, width: WIDTH }} source={context.isArabic ? require('./../../assets/images/backgroundimgReverse.jpg') : require('./../../assets/images/backgroundimg.jpg')}>

                <View style={{ flex: 1.5 }}>
                    <Header isArabic={context.isArabic} />
                </View>

                <View style={{ flex: 0.8 }}>

                    <View style={{ flex: 1, flexDirection: 'row', width: '80%', alignSelf: 'center' }}>

                        <View style={{ flex: 0.5 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: fontColor.TitleColor, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily, fontSize: 14, fontWeight: 'bold' }}>{Strings[context.isArabic ? 'ar' : 'en'].dashboard.temporaryPermits}</Text>
                        </View>

                        <View style={{ flex: 0.5 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                    </View>

                </View>

                <View style={{ flex: 0.5, flexDirection: 'row', width: '85%', justifyContent: 'center', alignSelf: 'center', borderWidth: 1, borderRadius: 18, borderColor: '#abcfbf' }}>

                    <View style={{ flex: 0.5 }} />

                    <View style={{ flex: 1.2, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold' }}>{Strings[context.isArabic ? 'ar' : 'en'].temporaryPermits.requestNo + ":-"}</Text>
                    </View>

                    <View style={{ flex: 0.8, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold' }}>{'0123432'}</Text>
                    </View>

                    <View style={{ flex: 0.008, height: '50%', alignSelf: 'center', borderWidth: 0.2, borderColor: '#5C666F' }} />

                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold', textAlign: context.isArabic ? 'right' : 'left' }}>{'Fujitsu India'}</Text>
                    </View>

                    <View style={{ flex: 0.5 }} />

                </View>

                <View style={{ flex: 0.2 }} />

                <View style={{ flex: 0.5, flexDirection: 'row', width: '86%', alignSelf: 'center', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderRadius: 18, borderColor: '#abcfbf', backgroundColor: '#abcfbe', }}>

                    <Text style={{ textAlign: 'center', fontSize: 12, fontWeight: 'bold' }}>{Strings[context.isArabic ? 'ar' : 'en'].temporaryPermits.serviceRequestList}</Text>

                </View>

                <View style={{ flex: 0.2 }} />

                <View style={{ flex: 5.4, width: '85%', alignSelf: 'center' }}>

                    <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].temporaryPermits.serviceReqNum)} </Text>
                        </View>

                        <View style={styles.space} />

                        <View style={styles.textInputContainer}>
                            <TextInputComponent
                                style={{
                                    height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                isArabic={context.isArabic}
                                value={props.value}
                                maxLength={props.maxLength}
                                multiline={props.isMultiline}
                                numberOfLines={props.numberOfLines}
                                placeholder={'Badr Restaurant'}
                                keyboardType={props.keyboardType}
                                onChangeText={props.onChange}
                            />
                        </View>
                    </View>

                    <View style={{ flex: 0.2 }} />

                    <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].temporaryPermits.city)} </Text>
                        </View>
                        <View style={styles.space} />
                        <View style={styles.textInputContainer}>
                            <TextInputComponent
                                style={{
                                    height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                isArabic={context.isArabic}
                                value={props.value}
                                maxLength={props.maxLength}
                                multiline={props.isMultiline}
                                numberOfLines={props.numberOfLines}
                                placeholder={'DED'}
                                keyboardType={props.keyboardType}
                                onChangeText={props.onChange} />
                        </View>
                    </View>

                    <View style={{ flex: 0.2 }} />

                    <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].temporaryPermits.application)} </Text>
                        </View>

                        <View style={styles.space} />

                        <View style={styles.textInputContainer}>
                            <TextInputComponent
                                style={{
                                    height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                isArabic={context.isArabic}
                                value={props.value}
                                maxLength={props.maxLength}
                                multiline={props.isMultiline}
                                numberOfLines={props.numberOfLines}
                                placeholder={'01/17/2017'}
                                keyboardType={props.keyboardType}
                                onChangeText={props.onChange}
                            />
                        </View>
                    </View>
                    <View style={{ flex: 0.2 }} />

                    <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].temporaryPermits.applicationType)} </Text>
                        </View>
                        <View style={styles.space} />
                        <View style={styles.textInputContainer}>
                            <TextInputComponent
                                style={{
                                    height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                isArabic={context.isArabic}
                                value={props.value}
                                maxLength={props.maxLength}
                                multiline={props.isMultiline}
                                numberOfLines={props.numberOfLines}
                                placeholder={'07/03/2019'}
                                keyboardType={props.keyboardType}
                                onChangeText={props.onChange}
                            />
                        </View>
                    </View>

                    <View style={{ flex: 0.2 }} />

                    <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.status)} </Text>
                        </View>
                        <View style={styles.space} />
                        <View style={styles.textInputContainer}>
                            <TextInputComponent
                                style={{
                                    height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                isArabic={context.isArabic}
                                value={props.value}
                                maxLength={props.maxLength}
                                multiline={props.isMultiline}
                                numberOfLines={props.numberOfLines}
                                placeholder={'CN-667145'}
                                keyboardType={props.keyboardType}
                                onChangeText={props.onChange}
                            />
                        </View>
                    </View>
                    <View style={{ flex: 0.2 }} />

                    <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].inspectionDetails.creationDate)} </Text>
                        </View>
                        <View style={styles.space} />
                        <View style={styles.textInputContainer}>
                            <TextInputComponent
                                style={{
                                    height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                isArabic={context.isArabic}
                                value={props.value}
                                maxLength={props.maxLength}
                                multiline={props.isMultiline}
                                numberOfLines={props.numberOfLines}
                                placeholder={'05521093661'}
                                keyboardType={props.keyboardType}
                                onChangeText={props.onChange}
                            />
                        </View>
                    </View>

                    <View style={{ flex: 0.2 }} />

                    <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].temporaryPermits.closedDate)} </Text>
                        </View>
                        <View style={styles.space} />
                        <View style={styles.textInputContainer}>
                            <TextInputComponent
                                style={{
                                    height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                isArabic={context.isArabic}
                                value={props.value}
                                maxLength={props.maxLength}
                                multiline={props.isMultiline}
                                numberOfLines={props.numberOfLines}
                                placeholder={'EB'}
                                keyboardType={props.keyboardType}
                                onChangeText={props.onChange}
                            />
                        </View>
                    </View>
                    <View style={{ flex: 0.2 }} />


                    <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].temporaryPermits.permitStartDate)} </Text>
                        </View>

                        <View style={styles.space} />

                        <View style={styles.textInputContainer}>
                            <TextInputComponent
                                style={{
                                    height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                isArabic={context.isArabic}
                                value={props.value}
                                maxLength={props.maxLength}
                                multiline={props.isMultiline}
                                numberOfLines={props.numberOfLines}
                                placeholder={'DED'}
                                keyboardType={props.keyboardType}
                                onChangeText={props.onChange}
                            />
                        </View>

                    </View>

                    <View style={{ flex: 0.2 }} />


                    <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].temporaryPermits.permitEndDate)} </Text>
                        </View>

                        <View style={styles.space} />

                        <View style={styles.textInputContainer}>
                            <TextInputComponent
                                style={{
                                    height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                isArabic={context.isArabic}
                                value={props.value}
                                maxLength={props.maxLength}
                                multiline={props.isMultiline}
                                numberOfLines={props.numberOfLines}
                                placeholder={'DED'}
                                keyboardType={props.keyboardType}
                                onChangeText={props.onChange}
                            />
                        </View>

                    </View>


                </View>



                <View style={{ flex: 0.2 }} />


                <View style={{ flex: 0.7, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', width: '70%', alignSelf: 'center' }}>

                    {/* <View style={{ flex: 0.5 }} /> */}

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
                            buttonText={(Strings[context.isArabic ? 'ar' : 'en'].action.submit)}
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
                                NavigationService.goBack();
                            }}
                            textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                            buttonText={(Strings[context.isArabic ? 'ar' : 'en'].action.cancel)}
                        />
                    </View>

                    <View style={{ flex: 0.2 }} />
                    {/* <View style={{ flex: 2, flexDirection: 'row', height: '80%' }}>
                            <ButtonComponent
                                style={{
                                    height: '70%', width: '100%', backgroundColor: 'red',
                                    borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                    textAlign: 'center'
                                }}

                                isArabic={context.isArabic}
                                buttonClick={() => {
                                    NavigationService.navigate('InspectionDetails', { 'inspectionDetails': props.route.params.inspectionDetails });
                                }}
                                textstyle={{ textAlign: 'left', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 8, color: fontColor.white }}
                                buttonText={
                                    (Strings[context.isArabic ? 'ar' : 'en'].inspectionDetails.inspectionDetailsbtn)}
                            />
                        </View> */}

                    {/* <View style={{ flex: 0.5 }} /> */}


                </View>


                <View style={{ flex: 0.5 }} />

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
    }
});

export default observer(ShowSrDetails);

