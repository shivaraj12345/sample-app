import React, { useContext, useEffect, useState } from 'react';
import { Image, View, FlatList, SafeAreaView, Text, TouchableOpacity, ImageBackground, Dimensions } from "react-native";
import Header from './../components/Header';
import KeyValueComponent from './../components/KeyValueComponent';
import TableComponent from './../components/TableComponent';
import BottomComponent from './../components/BottomComponent';
import { observer } from 'mobx-react';
import { Context } from '../utils/Context';
import Strings from '../config/strings';
import { RealmController } from '../database/RealmController';
import { fontColor, fontFamily } from '../config/config';
let realm = RealmController.getRealmInstance();
import { RootStoreModel } from '../store/rootStore';
import useInject from "../hooks/useInject";
import NavigationService from '../services/NavigationService';

import ButtonComponent from './../components/ButtonComponent';

const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;

const VehicleDetails = (props: any) => {

    const context = useContext(Context);
    const mapStore = (rootStore: RootStoreModel) => ({ myTasksDraft: rootStore.myTasksModel, 
        AdhocTaskVehicleDraft: rootStore.adhocTaskVehicleModel,
        adhocTaskEstablishmentDraft: rootStore.adhocTaskEstablishmentModel,adhocTaskEstablishmentDetailsDraft: rootStore.adhocTaskEstablishmentDetailsModel  })
    const { myTasksDraft, AdhocTaskVehicleDraft,adhocTaskEstablishmentDraft,adhocTaskEstablishmentDetailsDraft } = useInject(mapStore)

    const [vehicleArray, setVehicleArray] = useState(Array());

    let temp: any = [
        { plateNumber: "159159", plateCode: 'AD8888', plateofIssue: '' },
        { plateNumber: "159159", plateCode: 'AD8888', plateofIssue: '' },
        { plateNumber: "159159", plateCode: 'AD8888', plateofIssue: '' },
    ]


    let tempArray:any = []
    useEffect(() => {
        debugger;
        if (adhocTaskEstablishmentDraft.getSelectedItem() && 
        adhocTaskEstablishmentDraft.getSelectedItem()!="" ) {
            
            tempArray.push(JSON.parse(adhocTaskEstablishmentDraft.getSelectedItem()))

            if(tempArray[0].ListOfAutoVehicle){
                let temp:any = tempArray[0].ListOfAutoVehicle
                let tempTradeVehicles:any = temp.TradeVehicles
              
                setVehicleArray(tempTradeVehicles)
            }
            
        }
      else if (AdhocTaskVehicleDraft.getSearchVehicleResponse() &&
            AdhocTaskVehicleDraft.getSearchVehicleResponse() != "") {

            setVehicleArray(JSON.parse(AdhocTaskVehicleDraft.getSearchVehicleResponse()))
           
        }
    }, [])

    const renderRecentNews = (item: any, index: number) => {

        return (

            <TouchableOpacity
                onPress={() => {

                    if(!adhocTaskEstablishmentDraft.getSelectedItem()){
                    adhocTaskEstablishmentDraft.setLicenseNo(item.TradeLicenseNumber )
                   adhocTaskEstablishmentDraft.callToSearchByEstablishmentService()
                    }
                }}
                key={item.inspectionId}
                style={{
                    height: HEIGHT * 0.12, width: '100%', alignSelf: 'center', justifyContent: 'space-evenly', borderRadius: 10, borderWidth: 1,
                    shadowRadius: 1, backgroundColor: fontColor.white, borderColor: '#abcfbf', shadowOpacity: 15, shadowColor: fontColor.grey, elevation: 0
                }}>
                <TableComponent
                    isHeader={false}
                    isArabic={context.isArabic}
                  data={adhocTaskEstablishmentDraft.getSelectedItem() ? [{ keyName: Strings[context.isArabic ? 'ar' : 'en'].vehicleDetails.plateNumber, value: item.PlateNumber},
                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].vehicleDetails.plateCode, value: item.VehiclePlateCode },
                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].vehicleDetails.placeOfIssue, value: item.PermissionIssuePlace }

                    ]: [{ keyName: Strings[context.isArabic ? 'ar' : 'en'].vehicleDetails.plateNumber, value: item.PlateNumber},
                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].vehicleDetails.plateCode, value: item.PlateCode },
                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].vehicleDetails.placeOfIssue, value: item.PlaceofIssue }

                    ]}
                />
            </TouchableOpacity>
        )
    }


    return (
        <SafeAreaView style={{ flex: 1 }}>

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
                <View style={{ flex: 0.4, flexDirection: 'row', width: '80%', justifyContent: 'center', alignSelf: 'center', alignItems: 'center', borderWidth: 1, borderRadius: 18, borderColor: '#abcfbf' }}>
                    <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{context.isArabic ?adhocTaskEstablishmentDetailsDraft.getarabicEstablishmentName() :adhocTaskEstablishmentDetailsDraft.getEstablishmentName()}</Text>
                </View>
                <View style={{ flex: 0.2 }} />
                <View style={{ flex: 0.4, flexDirection: 'row', width: '80%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderRadius: 18, backgroundColor: '#c4ddd2' }}>
                    <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].vehicleDetails.vehicleDetails)} </Text>
                </View>
                <View style={{ flex: 0.2 }} />

                <View style={{ flex: 5.2, width: '80%', alignSelf: 'center' }}>
                    <View style={{ height: 1 }} />
                    <FlatList
                        nestedScrollEnabled={true}
                        data={vehicleArray}
                        renderItem={({ item, index }) => {
                            return (
                                renderRecentNews(item, index)
                            )
                        }}
                        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                    />
                </View>
                <View style={{ flex: 0.6 }} />

                <View style={{ flex: 1, flexDirection: 'row', height: '80%',justifyContent: 'center', alignItems:'center' }}>
                    <ButtonComponent
                        style={{
                            height: '40%', width: '25%', backgroundColor: fontColor.ButtonBoxColor, borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', textAlign: 'center'
                        }}
                        isArabic={props.isArabic}
                        buttonClick={() => { 
                            NavigationService.navigate('AdhocCreateNewEstablishment')
                         }}
                        textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                        buttonText={(Strings[props.isArabic ? 'ar' : 'en'].adhocTask.createNew)}
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <BottomComponent isArabic={context.isArabic} />
                </View>
            </ImageBackground>
        </SafeAreaView>
    )
}


export default observer(VehicleDetails);