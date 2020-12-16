import React, { useContext, useState, useEffect } from 'react';
import { Image, View, StyleSheet, SafeAreaView, Text, ImageBackground, TouchableOpacity, Dimensions, FlatList, ToastAndroid, CheckBox, Alert } from "react-native";
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
import TaskSchema from '../database/TaskSchema';
import Spinner from 'react-native-loading-spinner-overlay';
import TableComponent from './../components/TableComponent';
let realm = RealmController.getRealmInstance();
import EstablishmentSchema from '../database/EstablishmentSchema';
import { useIsFocused } from '@react-navigation/native';

const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;

var count: any = 0;
var listOfEst: any = []

const CampaignDetail = (props: any) => {

    const context = useContext(Context);

    const [campaignDetails, setCampaignDetails] = useState(Object());
    const [licenseNum, setLicenseNum] = useState(Object());
    const [isAcknowledge, setIsAcknowledge] = useState(Boolean);
    const [listOfEstArray, setListOfEstArray] = useState(Array());
    const [actionSelected, setActionSelected] = useState(false);

    const isFocused = useIsFocused();

    const mapStore = (rootStore: RootStoreModel) => ({ establishmentDraft: rootStore.establishmentModel, myTasksDraft: rootStore.myTasksModel, licenseDraft: rootStore.licenseMyTaskModel, efstDraft: rootStore.eftstModel, adhocTaskEstablishmentDraft: rootStore.adhocTaskEstablishmentModel })
    const { establishmentDraft, myTasksDraft, licenseDraft, efstDraft, adhocTaskEstablishmentDraft } = useInject(mapStore)

    const [isClick, setIsClick] = useState({
        campaignClick: true,
        estListClick: false
    });



    useEffect(() => {
        const campaignDetailsTemp = props.route ? props.route.params ? props.route.params.inspectionDetails : {} : {};
        setCampaignDetails(campaignDetailsTemp);
        count = 0;
        listOfEst = [];
       
       // console.log("ListOfEstArray: ", listOfEstArray)
        if(myTasksDraft.state == 'navigate'){
            setListOfEstArray(listOfEst)
            callToAccountSync(0)

        }

        return () => {
            establishmentDraft.setEstablishmentDataBlank()
            adhocTaskEstablishmentDraft.setSelectedItem('')
        }
    }, [isFocused]);



    useEffect(() => {
        debugger;
        if (myTasksDraft.state == 'getChecklistSuccess') {
            NavigationService.navigate('StartInspection');
            myTasksDraft.setState('done');
        }
    }, [myTasksDraft.state == 'getChecklistSuccess']);

    useEffect(() => {
        debugger;
        if (myTasksDraft.state == 'getCampaignChecklistSuccess') {
            NavigationService.navigate('StartInspection');
        }
    }, [myTasksDraft.state == 'getCampaignChecklistSuccess']);
    
    useEffect(() => {
        debugger;
        if (myTasksDraft.state == 'acknowledgeSuccess') {
            setIsAcknowledge(true);
        }
    }, [myTasksDraft.state == 'acknowledgeSuccess']);


    useEffect(() => {
        debugger;
        if (establishmentDraft.state == 'AccountSyncSuccess') {
            count = count + 1
            // console.log("Count: ", count)

            if (establishmentDraft.response && establishmentDraft.response != "") {
                let res = JSON.parse(establishmentDraft.response)

                // for (let i = 0; i < res.length; i++) {
                    listOfEst.push(res[0])
               // }
            }

            if (campaignDetails.ListOfAdfcaAccountThinBc.Establishment.length - 1 >= count) {

                callToAccountSync(count)
            }
            else {

                setListOfEstArray(listOfEst)
                // console.log("est Response: ", listOfEst)
            }

        }
    }, [establishmentDraft.state == 'AccountSyncSuccess']);


    useEffect(() => {
        debugger;
        if (myTasksDraft.state == 'getChecklistSuccess') {
            NavigationService.navigate('StartInspection');
            myTasksDraft.setState('done');
        }
    }, [myTasksDraft.state == 'getChecklistSuccess']);


    


    const splitDate = (date: any) => {
        let tempDate1 = '';
        if (date && date != "") {
            let tempDate = date.split(" ")
            tempDate1 = tempDate[0].split("/")

        }
        return tempDate1;
    }

    const callToAccountSync = (i: any) => {



        if (listOfEstArray.length < 1 && campaignDetails.ListOfAdfcaAccountThinBc && campaignDetails.ListOfAdfcaAccountThinBc.Establishment && campaignDetails.ListOfAdfcaAccountThinBc.Establishment.length > 0) {

            let temp = RealmController.getEstablishmentById(realm, EstablishmentSchema.name, campaignDetails.ListOfAdfcaAccountThinBc.Establishment[i].Alias);
            if (temp && temp[0]) {
                listOfEst.push(temp[0])
            
                count = count + 1
                if (campaignDetails.ListOfAdfcaAccountThinBc.Establishment.length - 1 >= count) {
    
                    callToAccountSync(count)
                }else{
                    setListOfEstArray(listOfEst)
                   
                }
            } else {
                let licenseNumber = campaignDetails.ListOfAdfcaAccountThinBc.Establishment[i].Name
                if(licenseNumber ==null ){
                    let templicenseNo = campaignDetails.ListOfAdfcaAccountThinBc.Establishment[i].FinAcctCurrentBank
                    templicenseNo = templicenseNo.split('-')
                    licenseNumber = templicenseNo[1]
                }
                
                establishmentDraft.callToAccountSyncService(licenseNumber, context.isArabic);
            }


        }

    }

    const callToGetChecklist = () => {

        debugger;
               
        myTasksDraft.setTaskId(campaignDetails.TaskId);

        console.log("campaignDetails: ", campaignDetails)
        let campaignType = '';
        if (campaignDetails.CampaignType == null) {
            campaignType = '';
        }
        else {
            campaignType = campaignDetails.CampaignType;
        }
        myTasksDraft.setEstListArray(JSON.stringify(listOfEstArray));  
        myTasksDraft.callToGetCampaignChecklistApi(campaignType);

    }



    const renderListOfEst = (item: any, index: number) => {

        return (

            <TouchableOpacity
                onPress={() => {
                    
                    adhocTaskEstablishmentDraft.setSelectedItem(JSON.stringify(item))
                    NavigationService.navigate('AdhocEstablishmentDetails')
                }}
                key={item.inspectionId}
                style={{
                    height: HEIGHT * 0.16, width: '100%', alignSelf: 'center', justifyContent: 'space-evenly', borderRadius: 10, borderWidth: 1,
                    shadowRadius: 1, backgroundColor: fontColor.white, borderColor: '#abcfbf', shadowOpacity: 15, shadowColor: fontColor.grey, elevation: 0
                }}>
                <TableComponent
                    isHeader={false}
                    isArabic={context.isArabic}
                    data={[{ keyName: Strings[context.isArabic ? 'ar' : 'en'].adhocTask.tradeLicense, value: item.LicenseCode },
                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].adhocTask.licenseSource, value: item.LicenseSource },
                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].adhocTask.establishmentName, value: item.EnglishName },
                    {
                        keyName: Strings[context.isArabic ? 'ar' : 'en'].inspectionDetails.action, value:
                    <View style={{ flexDirection: 'row',height: '80%',flex:1 }}>
                               {item.isUploaded=="false" ?  
                               <CheckBox
                                    value={item.isSelected}
                                    onValueChange={() => {
                                        adhocTaskEstablishmentDraft.setSelectedItem(JSON.stringify(item))

                                        const updated = listOfEstArray.map((item,i) => {
                                           // item.isSelected = false;
                                            if (i === index) {
                                                if(item.isSelected){
                                                    item.isSelected = false
                                                    setActionSelected(item.isSelected)
                                                }else{
                                                    item.isSelected = true;
                                                    setActionSelected(item.isSelected)
                                                }
                                             
                                              setActionSelected( item.isSelected)
                                            }else{
                                                item.isSelected = false;
                                                setActionSelected( item.isSelected)
                                            }
                                            return item;
                                          });

                                        setListOfEstArray(updated)  
                                    }}
                                />
                                :
                               <View style={{
                                height: 200, width: 500, backgroundColor: 'red'
                            }}>
                                <ButtonComponent
                                
                                isArabic={context.isArabic}
                                buttonClick={() => {
                                    
                                }}
                                textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 10, fontWeight: 'bold', color: fontColor.white }}
                                buttonText={(Strings[context.isArabic ? 'ar' : 'en'].campaignDetails.view)}
                            />
                            </View>}
                            </View>
                              
                    },
                    ]}
                />

            </TouchableOpacity>
        )
    }

    return (

        <SafeAreaView style={{ flex: 1 }}>

            <ImageBackground style={{ height: HEIGHT, width: WIDTH }} source={context.isArabic ? require('./../assets/images/backgroundimgReverse.jpg') : require('./../assets/images/backgroundimg.jpg')}>
                <Spinner
                    visible={establishmentDraft.state == 'pending' ? true : false}
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

                        <View style={{ flex: myTasksDraft.isMyTaskClick == 'history' ? 0.8 : 0.5 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                        <View style={{ flex: myTasksDraft.isMyTaskClick == 'CompletedTask' ? 1.1 : myTasksDraft.isMyTaskClick == 'history' ? 0.5 : 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: fontColor.TitleColor, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily, fontSize: 14, fontWeight: 'bold' }}>{Strings[context.isArabic ? 'ar' : 'en'].campaignDetails.campaign}</Text>
                        </View>

                        <View style={{ flex: myTasksDraft.isMyTaskClick == 'history' ? 0.8 : 0.5 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                    </View>

                </View>

                <View style={{ flex: 0.5, flexDirection: 'row', width: '85%', justifyContent: 'center', alignSelf: 'center', borderWidth: 1, borderRadius: 18, borderColor: '#abcfbf' }}>

                    <View style={{ flex: 0.2 }} />

                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold' }}>{Strings[context.isArabic ? 'ar' : 'en'].inspectionDetails.inspectionNo + ":-"}</Text>
                    </View>

                    <View style={{ flex: 1.2, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold' }}>{campaignDetails.TaskId}</Text>
                    </View>

                    <View style={{ flex: 0.008, height: '50%', alignSelf: 'center', borderWidth: 0.2, borderColor: '#5C666F' }} />

                    <View style={{ flex: 0.7, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold', textAlign: context.isArabic ? 'right' : 'left' }}>{''}</Text>
                    </View>

                    <View style={{ flex: 0.3 }} />

                </View>

                <View style={{ flex: 0.2 }} />

                <View style={{ flex: 0.5, flexDirection: 'row', width: '86%', alignSelf: 'center', justifyContent: 'center', borderWidth: 1, borderRadius: 18, borderColor: '#abcfbf' }}>

                    <View style={{ flex: 1, height: '100%', backgroundColor: isClick.campaignClick ? '#abcfbe' : 'white', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderTopLeftRadius: 18, borderBottomLeftRadius: 18 }}>

                        <TouchableOpacity
                            onPress={() => {
                                setIsClick(prevState => {
                                    return { ...prevState, campaignClick: true, estListClick: false }
                                });
                            }}
                            style={{ width: '100%', height: '100%', backgroundColor: isClick.campaignClick ? '#abcfbe' : 'white', justifyContent: 'center', borderTopLeftRadius: 18, borderBottomLeftRadius: 18 }} >
                            <Text style={{ textAlign: 'center', fontSize: 12, fontWeight: 'bold' }}>{Strings[context.isArabic ? 'ar' : 'en'].campaignDetails.campaignPlanDetails}</Text>
                        </TouchableOpacity>

                    </View>

                    <View style={{ flex: 1, height: '100%', justifyContent: 'center', backgroundColor: isClick.estListClick ? '#abcfbe' : 'white', borderTopRightRadius: 16, borderBottomRightRadius: 16 }}>

                        <TouchableOpacity
                            onPress={() => {
                                setIsClick(prevState => {
                                    return { ...prevState, campaignClick: false, estListClick: true }
                                });

                                callToAccountSync(0)
                            }}
                            style={{ width: '100%', height: '100%', justifyContent: 'center', backgroundColor: isClick.estListClick ? '#abcfbe' : 'white', borderTopRightRadius: 16, borderBottomRightRadius: 16 }}>
                            <Text style={{ textAlign: 'center', fontSize: 12, fontWeight: 'bold' }}>{Strings[context.isArabic ? 'ar' : 'en'].campaignDetails.listOfEstablishment}</Text>
                        </TouchableOpacity>

                    </View>

                </View>

                <View style={{ flex: 0.2 }} />

                {isClick.campaignClick ?

                    <View style={{ flex: 5.4, width: '85%', alignSelf: 'center' }}>

                        <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].campaignDetails.planNumber)} </Text>
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
                                    value={campaignDetails.TaskId}
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
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].campaignDetails.comments)} </Text>
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
                                    value={campaignDetails.Comment}
                                    maxLength={props.maxLength}
                                    numberOfLines={props.numberOfLines}
                                    placeholder={''}
                                    keyboardType={props.keyboardType}
                                    onChange={props.onChange} />
                            </View>
                        </View>

                        <View style={{ flex: 0.2 }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].campaignDetails.planStartDate)} </Text>
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
                                        value={splitDate(campaignDetails.CreatedDate)[1]}
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
                                        value={splitDate(campaignDetails.CreatedDate)[0]}
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
                                        value={splitDate(campaignDetails.CreatedDate)[2]}
                                        onChange={(val: string) => { }}
                                    />
                                </View>
                            </View>

                        </View>
                        <View style={{ flex: 0.2 }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].campaignDetails.expectedCompletionDate)} </Text>
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
                                        value={splitDate(campaignDetails.CompletionDate)[1]}
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
                                        value={splitDate(campaignDetails.CompletionDate)[0]}
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
                                        value={splitDate(campaignDetails.CompletionDate)[2]}
                                        onChange={(val: string) => { }}
                                    />
                                </View>
                            </View>

                        </View>

                        <View style={{ flex: 0.2 }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].campaignDetails.CompletionDate)} </Text>
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
                                        value={splitDate(campaignDetails.CompletionDate)[1]}
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
                                        value={splitDate(campaignDetails.CompletionDate)[0]}
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
                                        value={splitDate(campaignDetails.CompletionDate)[2]}
                                        onChange={(val: string) => { }}
                                    />
                                </View>
                            </View>

                        </View>
                        <View style={{ flex: 0.2 }} />

                        <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].campaignDetails.priority)} </Text>
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
                                    value={campaignDetails.TaskPriority}
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
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].campaignDetails.Description)} </Text>
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
                                    value={campaignDetails.Description}
                                    maxLength={props.maxLength}
                                    numberOfLines={props.numberOfLines}
                                    placeholder={''}
                                    keyboardType={props.keyboardType}
                                    onChange={props.onChange}
                                />
                            </View>
                        </View>

                        <View style={{ flex: 0.2 }} />

                    </View>
                    :
                    <View style={{ flex: 5.4, width: '85%', alignSelf: 'center' }}>


                        <View style={{ height: 1 }} />
                        <FlatList
                            nestedScrollEnabled={true}
                            data={listOfEstArray}
                            renderItem={({ item, index }) => {
                                return (
                                    renderListOfEst(item, index)
                                )
                            }}
                            extraData={true}
                            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                        />
                    </View>

                }

                <View style={{ flex: 0.2 }} />

                {isClick.estListClick ?
                    <View style={{ flex: 0.7, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', width: '30%', alignSelf: 'center' }}>

                        <View style={{ flex: 2, flexDirection: 'row', height: '80%' }}>
                            <ButtonComponent
                                style={{
                                    height: '80%', width: '100%', backgroundColor: 'red',
                                    borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                    textAlign: 'center'
                                }}
                                isArabic={context.isArabic}
                                buttonClick={() => {
                                    let isSelected = listOfEstArray.some((item)=>item.isSelected === true)
                                    if(isSelected){
                                        callToGetChecklist()
                                    }else{
                                        Alert.alert("Please select establishment to proceed..")
                                    }

                                }}
                                textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                                buttonText={(Strings[context.isArabic ? 'ar' : 'en'].campaignDetails.startCampaign)}
                            />
                        </View>

                    </View>
                    : null}
                <View style={{ flex: 0.1 }} />

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

export default observer(CampaignDetail);

