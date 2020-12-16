import React, { useState, useEffect, useContext, useRef } from 'react';
import { Image, View, ScrollView, FlatList, TextInput, StyleSheet, SafeAreaView, Alert, TouchableOpacity, Text, ImageBackground, Dimensions, ToastAndroid } from "react-native";
import BottomComponent from './../components/BottomComponent';
import Header from './../components/Header';
import ButtonComponent from './../components/ButtonComponent';
import TextInputComponent from './../components/TextInputComponent';
const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;
import { fontFamily, fontColor } from '../config/config';
import Strings from './../config/strings';
import { observer } from 'mobx-react';
import { Context } from '../utils/Context';
import NavigationService from '../services/NavigationService';
import Dropdown from './../components/dropdown';
import { RootStoreModel } from '../store/rootStore';
import useInject from "../hooks/useInject"

import Spinner from 'react-native-loading-spinner-overlay';

const AdhocEstablishmentDetails = (props: any) => {

    const context = useContext(Context);
    let dropdownRef2 = useRef();
    let dropdownRef3 = useRef();
    let dropdownRef4 = useRef();
    const mapStore = (rootStore: RootStoreModel) => ({
        myTasksDraft: rootStore.myTasksModel,
        adhocTaskEstablishmentDraft: rootStore.adhocTaskEstablishmentModel,
        adhocTaskEstablishmentDetailsDraft: rootStore.adhocTaskEstablishmentDetailsModel
    })
    const { myTasksDraft, adhocTaskEstablishmentDraft, adhocTaskEstablishmentDetailsDraft } = useInject(mapStore)

    const establishmentHistoryArray = [
        { image: require('./../assets/images/History/ServiceRequest.png'), title: Strings[props.isArabic ? 'ar' : 'en'].history.serviceRequest, code: 'serviceRequest' },
        { image: require('./../assets/images/History/Violation.png'), title: Strings[props.isArabic ? 'ar' : 'en'].history.violation, code: 'violation' },
        { image: require('./../assets/images/History/VehicleDetail.png'), title: Strings[props.isArabic ? 'ar' : 'en'].history.vehicleDetails, code: 'vehicleDetail' },
        { image: require('./../assets/images/History/Inspection.png'), title: Strings[props.isArabic ? 'ar' : 'en'].history.inspection, code: 'Inspection' },

    ]

    const [clickedItemArray, setClickedItemArray] = useState(Array());
    const [businessActivityArray, setBusinessActivityArray] = useState(Array());
    const [subBusinessActivityArray, setsubBusinessActivityArray] = useState(Array());
    const [address, setAddress] = useState("");
    const [isCampaign, setIsCampaign] = useState(false);
    const [isButtonClick, setIsButtonClick] = useState(false);





    useEffect(() => {
        debugger;

        let tempArray: any = [];


        if ((adhocTaskEstablishmentDraft.getSelectedItem() &&
            adhocTaskEstablishmentDraft.getSelectedItem() != "")) {

            tempArray.push(JSON.parse(adhocTaskEstablishmentDraft.getSelectedItem()))
            

            setClickedItemArray(tempArray[0])

            if(myTasksDraft.isMyTaskClick=='campaign'){

                setIsCampaign(true)
            }else{

                if (tempArray[0].ListOfCutAddress) {

                    let temp: any = tempArray[0].ListOfCutAddress
                    let tempAddress: any = temp.EstablishmentAddress[0]
                  
                    adhocTaskEstablishmentDetailsDraft.setAddress1(tempAddress.AddressLine1)
                    adhocTaskEstablishmentDetailsDraft.setAddress2(tempAddress.AddressLine2)
                    adhocTaskEstablishmentDetailsDraft.setCity(tempAddress.City)
                    setAddress(tempAddress.AddressLine1 + " " + tempAddress.AddressLine2 + " " + tempAddress.PostalCode + " " + tempAddress.City + " " + tempAddress.State + " " + tempAddress.Country)
                }
    
                adhocTaskEstablishmentDetailsDraft.setarabicEstablishmentName(tempArray[0].TradeArabicName || '')
                adhocTaskEstablishmentDetailsDraft.setEmailId(tempArray[0].EmailAddress || '')
                adhocTaskEstablishmentDetailsDraft.setContactDetails(tempArray[0].MobilePhoneNumber || '')
                adhocTaskEstablishmentDetailsDraft.setEstablishmentName(tempArray[0].TradeEngName || '')
                adhocTaskEstablishmentDetailsDraft.setLicenseNumber(tempArray[0].TradeLicense || '')
                bussinessactivivyData()
            }
        }
        myTasksDraft.setState('done')
    }, [])

    useEffect(() => {
        debugger;

        if (myTasksDraft.getState() == "getBASuccess" && isButtonClick) {

            bussinessactivivyData()
            adhocTaskEstablishmentDetailsDraft.callToAdhocInspection()

        }

    }, [myTasksDraft.state])

    useEffect(() => {
        debugger;

        if (adhocTaskEstablishmentDetailsDraft.getState() == "adhocSuccess") {

            adhocTaskEstablishmentDetailsDraft.callToScheduleTaskDetails()
        }

        if (adhocTaskEstablishmentDetailsDraft.getState() == "scheduleTaskSuccess") {

            // console.log("scheduleTaskSuccess")

            let obj = {
                Description:adhocTaskEstablishmentDetailsDraft.getBusinessActivity(),
                businessActivities : []
            }
            
            myTasksDraft.callToGetChecklistApi(obj,context.isArabic);
        }

    }, [adhocTaskEstablishmentDetailsDraft.state])


    useEffect(() => {
        if (myTasksDraft.state === 'getChecklistSuccess') {
            NavigationService.navigate('EstablishmentDetails');
            // myTasksDraft.callToGetChecklistApi(myTasksDraft.desc);
            // ToastAndroid.show('response' + myTasksDraft.getBusinessActivityResponse, 1000);            
        }

    }, [myTasksDraft.state === 'getChecklistSuccess']);

    // myTasksDraft.callToGetChecklistApi
    const bussinessactivivyData = () => {
        console.log("bussinessactivivyData: ", myTasksDraft.getBusinessActivityRes())

        if (myTasksDraft.getBusinessActivityRes() && myTasksDraft.getBusinessActivityRes() != "") {
            // setBusinessActivityArray(JSON.parse(myTasksDraft.getBusinessActivityRes()))

            let tempBusinessActivityArray: any = myTasksDraft.getBusinessActivityRes() != '' ? JSON.parse(myTasksDraft.getBusinessActivityRes()) : []
            let tempArray1: any = [];

            // console.log("businessActivityArray: ", tempBusinessActivityArray)
            let AdfcaActionAccount = tempBusinessActivityArray[0].AdfcaActionAccount
            let businessActivitiesArray:any = [];
            for (let i = 0; i < AdfcaActionAccount.length; i++) {

                let obj: any = {};
                obj.type = AdfcaActionAccount[i].BusinessActivity
                obj.value = AdfcaActionAccount[i].BusinessActivity
                tempArray1.push(obj)

                if(AdfcaActionAccount[i].SubActivityFlag=='Y'){
                    businessActivitiesArray.push(AdfcaActionAccount[i].BusinessActivity)
                }
            }
            setBusinessActivityArray(tempArray1)
            setsubBusinessActivityArray(businessActivitiesArray)
            // console.log("businessActivityArray1: ", businessActivityArray)
        }
    }

    const splitDate = (date: any) => {
        let tempDate1 = '';
        if (date && date != "") {
            let tempDate = date.split(" ")
            tempDate1 = tempDate[0].split("/")

        }
        return tempDate1;
    }

    const renderData = (item: any, index: number) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    if (item.code == 'serviceRequest') {
                        NavigationService.navigate('ServiceRequstList')
                    }
                    if (item.code == 'violation') {
                        NavigationService.navigate('ViolationList')
                    }
                    if (item.code == 'vehicleDetail') {
                        NavigationService.navigate('VehicleDetails')
                    }
                    if (item.code == 'Inspection') {
                        NavigationService.navigate('InspectionList')
                    }
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


    const placeArr = [
        { type: 'Burning Area', value: 'Burning Area' },
        { type: 'In Site', value: 'In Site' },
    ]

    const reasonsArr = [
        { type: 'Damaged', value: 'Damaged' },
        { type: 'Expired', value: 'Expired' },
        { type: 'Non-Compliant', value: 'Non-Compliant' },
    ]

    const unitArr = [
        { type: 'Direct Inspection', value: 'Direct Inspection' },
        { type: 'Bazar Inspection', value: 'Bazar Inspention' },
        { type: 'Sampling', value: 'sampling' },
        { type: 'Condemnation', value: 'Condemnation' },
        { type: 'Detention', value: 'Detention' },
    ]



    return (


        <SafeAreaView style={{ flex: 1 }}>

            <ImageBackground style={{ height: HEIGHT, width: WIDTH }} source={context.isArabic ? require('./../assets/images/backgroundimgReverse.jpg') : require('./../assets/images/backgroundimg.jpg')}>

                <Spinner
                    visible={myTasksDraft.state == 'pending' ? true : false}
                    // textContent={'Loading...'}
                    overlayColor={'rgba(0,0,0,0.7)'}
                    color={'#b6a176'}
                    textStyle={{ fontSize: 14, color: 'white' }}
                />

                <Spinner
                    visible={adhocTaskEstablishmentDetailsDraft.state == 'pending' ? true : false}
                    // textContent={'Loading...'}
                    overlayColor={'rgba(0,0,0,0.7)'}
                    color={'#b6a176'}
                    textStyle={{ fontSize: 14, color: 'white' }}
                />

                <View style={{ flex: 1.5 }}>
                    <Header isArabic={context.isArabic} />
                </View>

                <View style={{ flex: 0.6 }}>
                    <View style={{ flex: 1, flexDirection: 'row', width: '80%', alignSelf: 'center' }}>

                        <View style={{ flex: myTasksDraft.isMyTaskClick == 'History' ? 1.2 : 0.9 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                        <View style={{ flex: myTasksDraft.isMyTaskClick == 'History' ? 0.8 : 1.2, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 16, fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily }}>{(myTasksDraft.isMyTaskClick == 'History' ? Strings[context.isArabic ? 'ar' : 'en'].history.history : Strings[context.isArabic ? 'ar' : 'en'].adhocTask.adhocTask)}</Text>
                        </View>
                        <View style={{ flex: myTasksDraft.isMyTaskClick == 'History' ? 1.2 : 0.9 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>
                    </View>
                </View>

                <View style={{ flex: 0.4, flexDirection: 'row', width: '80%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderWidth: 1, borderRadius: 18, borderColor: '#abcfbf' }}>

    <Text style={{ color: '#5C666F', textAlign: 'center', fontSize: 13, fontWeight: 'bold' }}>{isCampaign?clickedItemArray.EnglishName:clickedItemArray.TradeEngName}</Text>

                </View>

                <View style={{ flex: 0.2 }} />

                <View style={{ flex: 0.4, backgroundColor: '#abcfbe', flexDirection: 'row', width: '80%', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', borderWidth: 1, borderRadius: 18, borderColor: '#abcfbf' }}>

                    <Text style={{ color: '#5C666F', textAlign: 'center', fontSize: 13, fontWeight: 'bold' }}>{Strings[context.isArabic ? 'ar' : 'en'].adhocTask.establishmentDetails}</Text>

                </View>

                <View style={{ flex: 0.2 }} />


                <View style={{ flex: myTasksDraft.isMyTaskClick == 'History' ? 4.6 : 5, width: '80%', alignSelf: 'center' }}>

                    <ScrollView style={{ flex: 1 }}>

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 11, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{( isCampaign?Strings[context.isArabic ? 'ar' : 'en'].temporaryPermits.custName:Strings[context.isArabic ? 'ar' : 'en'].adhocTask.establishmentName)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>
                                <TextInputComponent
                                    placeholder={''}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    value={isCampaign?clickedItemArray.EnglishName:clickedItemArray.TradeEngName}
                                    onChange={(val: string) => {
                                        adhocTaskEstablishmentDetailsDraft.setEstablishmentName(val)
                                    }}
                                />

                            </View>
                        </View>

                        <View style={{ flex: 0.2 }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].adhocTask.licenseNumber)} </Text>
                            </View>
                            <View style={styles.space} />
                            <View style={styles.TextInputContainer}>
                                <TextInputComponent
                                    placeholder={''}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    value={isCampaign?clickedItemArray.LicenseCode:clickedItemArray.TradeLicense}
                                    onChange={(val: string) => {
                                        adhocTaskEstablishmentDetailsDraft.setLicenseNumber(val)
                                    }}
                                />
                            </View>
                        </View>

                        <View style={{ flex: 0.2, }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].adhocTask.licenseStartDate)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={{ flex: 0.6, flexDirection: 'row', justifyContent: "center", alignSelf: 'center', }}>
                                <View style={{ flex: 0.25, height: "100%" }}>
                                    <TextInputComponent
                                        placeholder={''}
                                        style={{
                                            height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                            fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                        }}
                                        value={isCampaign?"":splitDate(clickedItemArray.TradeRegDate)[1]}
                                        onChange={(val: string) => {

                                        }}
                                    />
                                </View>
                                <View style={{ flex: 0.05 }} />
                                <View style={{ flex: 0.25, height: "100%" }}>
                                    <TextInputComponent
                                        placeholder={''}
                                        style={{
                                            height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                            fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                        }}
                                        value={isCampaign?"":splitDate(clickedItemArray.TradeRegDate)[0]}
                                        onChange={(val: string) => { }}
                                    />
                                </View>
                                <View style={{ flex: 0.05 }} />
                                <View style={{ flex: 0.4, height: "100%" }}>
                                    <TextInputComponent
                                        placeholder={''}
                                        style={{
                                            height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                            fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                        }}
                                        value={isCampaign?"":splitDate(clickedItemArray.TradeRegDate)[2]}
                                        onChange={(val: string) => { }}
                                    />
                                </View>
                            </View>

                        </View>

                        <View style={{ flex: 0.2, }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].adhocTask.licenseEndDate)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={{ flex: 0.6, flexDirection: 'row', justifyContent: "center", alignSelf: 'center', }}>
                                <View style={{ flex: 0.25, height: "100%" }}>
                                    <TextInputComponent
                                        placeholder={''}
                                        style={{
                                            height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                            fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                        }}
                                        value={isCampaign?"":splitDate(clickedItemArray.TradeExpDate)[1]}
                                        onChange={(val: string) => { }}
                                    />
                                </View>
                                <View style={{ flex: 0.05 }} />
                                <View style={{ flex: 0.25, height: "100%" }}>
                                    <TextInputComponent
                                        placeholder={''}
                                        style={{
                                            height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                            fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                        }}
                                        value={isCampaign?"":splitDate(clickedItemArray.TradeExpDate)[0]}
                                        onChange={(val: string) => { }}
                                    />
                                </View>
                                <View style={{ flex: 0.05 }} />
                                <View style={{ flex: 0.4, height: "100%" }}>
                                    <TextInputComponent
                                        placeholder={''}
                                        style={{
                                            height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                            fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                        }}
                                        value={isCampaign?"":splitDate(clickedItemArray.TradeExpDate)[2]}
                                        onChange={(val: string) => { }}
                                    />

                                </View>
                            </View>

                        </View>

                        <View style={{ flex: 0.2, }} />

                       {!isCampaign? <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].adhocTask.arabicEstablishmentName)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>
                                <TextInputComponent
                                    placeholder={''}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    value={clickedItemArray.TradeArabicName}
                                    onChange={(val: string) => {
                                        //adhocTaskEstablishmentDetailsDraft.setarabicEstablishmentName(val)
                                    }}
                                />
                            </View>
                           

                        </View>
                         : null}

                        <View style={{ flex: 0.2 }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].adhocTask.contactDetails)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>
                                <TextInputComponent
                                    placeholder={''}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    value={isCampaign?clickedItemArray.Mobile:clickedItemArray.MobilePhoneNumber}
                                    onChange={(val: string) => {
                                        //adhocTaskEstablishmentDetailsDraft.setContactDetails(val)
                                    }}
                                />
                            </View>

                        </View>


                        <View style={{ flex: 0.2, }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].adhocTask.address)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>
                                <TextInputComponent
                                    placeholder={''}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    value={address}
                                    onChange={(val: string) => {
                                       // adhocTaskEstablishmentDetailsDraft.setAddress(val)
                                    }}
                                />
                            </View>

                        </View>

                        <View style={{ flex: 0.2, }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].adhocTask.emailid)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>
                                <TextInputComponent
                                    placeholder={''}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    value={isCampaign?clickedItemArray.Email:clickedItemArray.EmailAddress}
                                    onChange={(val: string) => {
                                       // adhocTaskEstablishmentDetailsDraft.setEmailId(val)
                                    }}
                                />
                            </View>

                        </View>

                        <View style={{ flex: 0.2, }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].adhocTask.onHold)}</Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>
                                <TextInputComponent
                                    placeholder={''}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    value={clickedItemArray.OnHold}
                                    onChange={(val: string) => {
                                        //adhocTaskEstablishmentDetailsDraft.setOnHold(val)
                                    }}
                                />
                            </View>

                        </View>

                        <View style={{ flex: 0.2 }} />

                      {!isCampaign?  <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].adhocTask.businessActivity)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>
                                <TouchableOpacity
                                    onPress={() => {
                                        dropdownRef2 && dropdownRef2.current.focus();
                                    }}
                                    style={{
                                        height: '70%', width: '100%', flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', alignSelf: 'center', borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }} >
                                    <View style={{ width: '85%', justifyContent: 'center', alignItems: 'center' }}>
                                        <Dropdown
                                            ref={dropdownRef2}
                                            value={''}
                                            onChangeText={(val: string) => {
                                                adhocTaskEstablishmentDetailsDraft.setBusinessActivity(val)
                                            }}
                                            itemTextStyle={{ width: '100%', height: '100%', textAlign: context.isArabic ? 'center' : 'center', fontSize: 10, padding: 0, color: fontColor.TextBoxTitleColor }}
                                            containerStyle={{ width: '100%', height: '100%', alignSelf: 'flex-start' }}
                                            data={businessActivityArray}
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
                        :null}

                        <View style={{ flex: 0.2, }} />

                        {!isCampaign?   <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].adhocTask.selectVehicle)} </Text>
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
                                            value={''}
                                            onChangeText={(val: string) => {
                                                adhocTaskEstablishmentDetailsDraft.setSelectVehicle(val)
                                            }}
                                            itemTextStyle={{ width: '100%', height: '100%', textAlign: context.isArabic ? 'center' : 'center', fontSize: 10, padding: 0, color: fontColor.TextBoxTitleColor }}
                                            containerStyle={{ width: '100%', height: '100%', alignSelf: 'flex-start' }}
                                            data={reasonsArr}
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

                        </View> : null}

                        <View style={{ flex: 0.2, }} />

                        {!isCampaign? <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].adhocTask.taskType)} </Text>
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
                                            value={'Direct Inspection'}
                                            onChangeText={(val: string) => {
                                                adhocTaskEstablishmentDetailsDraft.setTaskType(val)
                                            }}
                                            itemTextStyle={{ width: '100%', height: '100%', textAlign: context.isArabic ? 'center' : 'center', fontSize: 10, padding: 0, color: fontColor.TextBoxTitleColor }}
                                            containerStyle={{ width: '100%', height: '100%', alignSelf: 'flex-start' }}
                                            data={unitArr}
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

                        </View> :null}

                    </ScrollView>

                </View>

                <View style={{ flex: 0.1 }} />

                {myTasksDraft.isMyTaskClick == 'History' ?

                    <View style={{ flex: 0.8, alignSelf: 'center', width: "80%", justifyContent: 'center', borderRadius: 8, borderWidth: .5, borderColor: '#abcfbf', padding: 5 }}>

                        <FlatList
                            // nestedScrollEnabled={false}
                            data={establishmentHistoryArray}
                            contentContainerStyle={{ padding: 5, justifyContent: 'center' }}
                            columnWrapperStyle={{ flexDirection: context.isArabic ? 'row-reverse' : 'row' }}
                            initialNumToRender={3}
                            renderItem={({ item, index }) => {
                                return (
                                    renderData(item, index)
                                )
                            }}
                            ItemSeparatorComponent={() => (<View style={{ width: 5 }} />)}
                            numColumns={4}
                        />

                    </View>
                    : null}
                {myTasksDraft.isMyTaskClick == 'History' ? <View style={{ flex: 0.1 }} /> : null}
                {true ? //myTasksDraft.isMyTaskClick == 'History' ?
                    <View style={{ flex: 0.6, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', width: '70%', alignSelf: 'center' }}>
                        <View style={{ flex: 0.5 }} />
                        {!isCampaign?  <View style={{ flex: 2, flexDirection: 'row', height: '80%' }}>
                            <ButtonComponent
                                style={{
                                    height: '70%', width: '100%', backgroundColor: fontColor.ButtonBoxColor, borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', textAlign: 'center'
                                }}
                                isArabic={context.isArabic}
                                buttonClick={() => {

                                     let obj :any = {};
                                     obj.LicenseCode = adhocTaskEstablishmentDetailsDraft.getLicenseNumber()
                                     obj.Description = adhocTaskEstablishmentDetailsDraft.getBusinessActivity()
                                     setIsButtonClick(true)
                                     if (adhocTaskEstablishmentDetailsDraft.getBusinessActivity() == null || adhocTaskEstablishmentDetailsDraft.getBusinessActivity()=="") {
                                        Alert.alert((Strings[context.isArabic ? 'ar' : 'en'].adhocTask.bussinessActivitynotfound));
                                    }else{
                                        myTasksDraft.callToGetBAApi(obj)
                                    }
                                    
                                    // NavigationService.navigate('AdhocCreateNewEstablishment')
                                }}
                                textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                                buttonText={(Strings[context.isArabic ? 'ar' : 'en'].adhocTask.createNewTask)}
                            />
                        </View> :null}
                        
                        <View style={{ flex: 0.2 }} />
                        <View style={{ flex: 2, flexDirection: 'row', height: '80%' }}>
                            <ButtonComponent
                                style={{
                                    height: '70%', width: '100%', backgroundColor: fontColor.ButtonBoxColor, borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', textAlign: 'center'
                                }}
                                isArabic={context.isArabic}
                                buttonClick={() => {
                                    NavigationService.navigate('efstDetails');
                                }}
                                textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                                buttonText={(Strings[context.isArabic ? 'ar' : 'en'].history.efst)}
                            />
                        </View>
                        <View style={{ flex: 0.5 }} />
                    </View> :

                    <View style={{ flex: 0.7, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', width: '80%', alignSelf: 'center' }}>

                        <View style={{ flex: 1.2 }} />

                        <ButtonComponent
                            style={{ height: '55%', width: '35%', backgroundColor: fontColor.ButtonBoxColor, borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
                            buttonClick={() => {
                                // NavigationService.navigate('AdhocCreateNewEstablishment')

                                adhocTaskEstablishmentDetailsDraft.callToAdhocInspection()
                            
                            }}
                            textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                            buttonText={Strings[context.isArabic ? 'ar' : 'en'].adhocTask.createNewTask}
                        />

                        <View style={{ flex: 1.2 }} />

                    </View>
                }


                <View style={{ flex: 0.1 }} />


                <View style={{ flex: 1 }}>
                    <BottomComponent isArabic={context.isArabic} />
                </View>

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
        flex: 0.0,

    },

    textContainer: {
        flex: 0.4,
        justifyContent: 'center'
    },
    text: {
        fontSize: 12,
        textAlign: 'center',
        fontWeight: 'bold',
        color: fontColor.TitleColor,
        //fontFamily: fontFamily.textFontFamily
    }

});

export default observer(AdhocEstablishmentDetails);

