import React, { useState, useEffect, useContext, useRef } from 'react';
import { Image, View, ScrollView, FlatList, TextInput, StyleSheet, SafeAreaView, Alert, TouchableOpacity, Text, ImageBackground, Dimensions, ToastAndroid } from "react-native";
import BottomComponent from './../components/BottomComponent';
import Header from './../components/Header';
import TableComponent from './../components/TableComponent';
const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;
import { fontFamily, fontColor } from '../config/config';
import Strings from './../config/strings';
import { observer } from 'mobx-react';
import { Context } from '../utils/Context';
import NavigationService from '../services/NavigationService';
import { RootStoreModel } from '../store/rootStore';
import useInject from "../hooks/useInject"
import Spinner from 'react-native-loading-spinner-overlay';



const ContactList = (props: any) => {

    const context = useContext(Context);
    const mapStore = (rootStore: RootStoreModel) => ({ myTasksDraft: rootStore.myTasksModel, adhocTaskEstablishmentDraft: rootStore.adhocTaskEstablishmentModel })
    const { myTasksDraft, adhocTaskEstablishmentDraft } = useInject(mapStore)


    const [estHistoryArray, setEstHistoryArray] = useState(Array());

    useEffect(() => {
        debugger;
        if (adhocTaskEstablishmentDraft.getTradeLicenseHistory() &&
            adhocTaskEstablishmentDraft.getTradeLicenseHistory() != "") {
            // console.log("getTradeLicenseHistory: ", adhocTaskEstablishmentDraft.getTradeLicenseHistory())
            setEstHistoryArray(JSON.parse(adhocTaskEstablishmentDraft.getTradeLicenseHistory()))
        }
    }, [])

    
    useEffect(() => {
    

        if (myTasksDraft.getState() == "getBASuccess") {

            NavigationService.navigate('AdhocEstablishmentDetails')
        }
    }, [myTasksDraft.getState()])

    const renderRecentNews = (item: any, index: number) => {

        let address = item.ListOfCutAddress;
        if (address && address.EstablishmentAddress && address.EstablishmentAddress != "" && address.EstablishmentAddress[0]) {
            address = item.ListOfCutAddress.EstablishmentAddress[0].AddressLine1 + " " + item.ListOfCutAddress.EstablishmentAddress[0].AddressLine2 + " " + item.ListOfCutAddress.EstablishmentAddress[0].city
        } else {
            address = ""
        }

        return (

            <TouchableOpacity
                onPress={() => {
                    // myTasksDraft.setIsMyTaskClick('EstSearch');   
                    adhocTaskEstablishmentDraft.setSelectedItem(JSON.stringify(item))
                    item.LicenseCode = item.TradeLicense
                    item.Description = ''

                    console.log("ba Item: ", JSON.stringify(item))
                    myTasksDraft.callToGetBAApi(item);
                    // NavigationService.navigate('AdhocEstablishmentDetails')
                }}
                key={item.inspectionId}
                style={{
                    height: HEIGHT * 0.16, width: '100%', alignSelf: 'center', justifyContent: 'space-evenly', borderRadius: 10, borderWidth: 1,
                    shadowRadius: 1, backgroundColor: fontColor.white, borderColor: '#abcfbf', shadowOpacity: 15, shadowColor: fontColor.grey, elevation: 0
                }}>
                <TableComponent
                    isHeader={false}
                    isArabic={context.isArabic}
                    data={[{ keyName: Strings[context.isArabic ? 'ar' : 'en'].adhocTask.establishmentName, value: item.TradeEngName },
                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].adhocTask.tradeLicense, value: item.TradeLicense },
                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].adhocTask.licenseSource, value: item.LicenseSource },
                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].adhocTask.address, value: address },
                    ]}
                />
            </TouchableOpacity>
        )
    }


    return (
        <SafeAreaView style={{ flex: 1 }}>


            <Spinner
                visible={adhocTaskEstablishmentDraft.state == 'pending' ? true : false}
                // textContent={'Loading...'}
                overlayColor={'rgba(0,0,0,0.7)'}
                color={'#b6a176'}
                textStyle={{ fontSize: 14, color: 'white' }}
            />

            <ImageBackground style={{ height: HEIGHT, width: WIDTH }} source={context.isArabic ? require('./../assets/images/backgroundimgReverse.jpg') : require('./../assets/images/backgroundimg.jpg')}>
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
                {myTasksDraft.isMyTaskClick == 'History' ?
                    <View style={{ flex: 0.4, flexDirection: 'row', width: '80%', justifyContent: 'center', alignSelf: 'center', alignItems: 'center', borderWidth: 1, borderRadius: 18, borderColor: '#abcfbf' }}>
                        <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{'Fujitsu India Old'}</Text>
                    </View>
                    :
                    null

                }
                <View style={{ flex: myTasksDraft.isMyTaskClick == 'History' ? 0.2 : 0 }} />

                <View style={{ flex: 0.4, flexDirection: 'row', width: '80%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderRadius: 18, backgroundColor: '#c4ddd2' }}>
                    <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].adhocTask.establishment)} </Text>
                </View>
                <View style={{ flex: 0.2 }} />

                <View style={{ flex: 5.2, width: '80%', alignSelf: 'center' }}>
                    <View style={{ height: 1 }} />
                    <FlatList
                        nestedScrollEnabled={true}
                        data={estHistoryArray}
                        renderItem={({ item, index }) => {
                            return (
                                renderRecentNews(item, index)
                            )
                        }}
                        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                    />
                </View>
                <View style={{ flex: myTasksDraft.isMyTaskClick == 'History' ? 0.5 : 1.1 }} />
                <View style={{ flex: 1 }}>
                    <BottomComponent isArabic={context.isArabic} />
                </View>
            </ImageBackground>
        </SafeAreaView>
    )
}


export default observer(ContactList);