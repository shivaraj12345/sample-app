import React, { useContext, useState, useEffect } from 'react';
import { Image, View, FlatList, Linking, SafeAreaView, TouchableOpacity, Text, ImageBackground, Dimensions, ScrollView, Alert, PermissionsAndroid, ToastAndroid, BackHandler, Platform, TextInput } from "react-native";
import { useIsFocused } from '@react-navigation/native';
import NavigationService from '../services/NavigationService';
import KeyValueComponent from './../components/KeyValueComponent';
import BottomComponent from './../components/BottomComponent';
import { observer } from 'mobx-react';
import Header from './../components/Header';
import { Context } from '../utils/Context';
import { RootStoreModel } from '../store/rootStore';
import Strings from '../config/strings';
import useInject from "../hooks/useInject";
import { RealmController } from '../database/RealmController';
let realm = RealmController.getRealmInstance();
import { fontFamily, fontColor } from '../config/config';
import SearchComponent from '../components/SearchComponent';

const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;

const SearchScreen = (props: any) => {

    const context = useContext(Context);
    const [searchArray, setSearchArray] = useState(Array());
    const [searchText, setSearchText] = useState('');
    const mapStore = (rootStore: RootStoreModel) => ({ loginDraft: rootStore.loginModel })
    const { loginDraft } = useInject(mapStore)

    useEffect(() => {
        // let temp = myTasksDraft.myTaskResponse;
        // if (temp != '') {
        //     setTaskList(JSON.parse(temp))
        // }
        const searchText = props.route ? props.route.params ? props.route.params.searchText : '' : '';
        setSearchText(searchText);
        loginDraft.setSearchText(searchText);

        const searchArray = [
            { place: 'Lulu 01', address: 'XYZ Abu dhabi', distance: '2 KM', image: './../searchScreen/home.png' },
            { place: 'Lulu 02', address: 'XYZ Abu dhabi', distance: '3 KM', image: './../searchScreen/home.png' },
            { place: 'Lulu 03', address: 'XYZ Abu dhabi', distance: '4 KM', image: './../searchScreen/home.png' },
            { place: 'Lulu 04', address: 'XYZ Abu dhabi', distance: '5 KM', image: './../searchScreen/home.png' }
        ]
        setSearchArray(searchArray);

    }, []);

    const onChangeSearchText = (searchText: string) => {
        if (searchText != '') {
            let temp = searchArray.filter((item: any) => {
                if ((item.place.toString().toLowerCase().indexOf(searchText) > -1) || (item.distance.toString().indexOf(searchText) > -1) || (item.address.toLowerCase().toString().indexOf(searchText) > -1)) {
                    return item;
                }
            });
            setSearchArray(temp);
            // ToastAndroid.show(JSON.stringify(temp), 1000);
        }
      
    }

    const renderSearchRow = (item: any, index: number) => {

        return (

            <TouchableOpacity
                onPress={() => {
                    NavigationService.navigate('TaskList', { searchText: item.place });
                    // NavigationService.navigate('EstablishmentDetails', { 'inspectionDetails': item });
                }}
                // key={item.inspectionId}
                style={{
                    height: 65, width: '100%', alignSelf: 'center', justifyContent: 'space-evenly', borderTopRightRadius: 10, borderBottomRightRadius: 10, borderWidth: 1,
                    shadowRadius: 1, backgroundColor: 'white', borderLeftWidth: 5, borderRightColor: '#5C666F', borderTopColor: '#5C666F', borderBottomColor: '#5C666F', borderLeftColor: '#d51e17'
                    , shadowOpacity: 15, shadowColor: 'grey', elevation: 0
                }}>

                <View style={{
                    flex: 1, height: '100%', flexDirection: context.isArabic ? 'row-reverse' : 'row', padding: 5
                }}>


                    <View style={{ flex: 6.5, paddingTop: 2, paddingBottom: 12, justifyContent: 'center', }}>

                        <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <Text style={{ fontSize: 13, textAlign: 'left', color: '#565758', fontWeight: 'bold', fontFamily:context.isArabic?fontFamily.arabicTextFontFamily: fontFamily.textFontFamily }}>{item.place}</Text>
                        </View>

                        <View style={{ flex: 1.2, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', alignItems: 'center' }}>

                            <View style={{ flex: 1.1, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'flex-start' }}>

                                <View style={{ flex: 0.2, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center' }}>
                                    <Image resizeMode={'contain'} source={require('./../assets/images/searchScreen/locationSmall.png')} />
                                </View>

                                <View style={{ flex: 1.7, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                    <Text numberOfLines={2} style={{ fontSize: 11, fontWeight: 'bold', textAlign: context.isArabic ? 'right' : 'left', color: '#8b8a8a', fontFamily:context.isArabic?fontFamily.arabicTextFontFamily: fontFamily.textFontFamily }}>{item.address}</Text>
                                </View>

                            </View>

                            <Image resizeMode={'contain'} source={require('./../assets/images/searchScreen/locationSmall.png')} />

                            <View style={{ flex: 0.2, borderBottomColor: 'red', borderBottomWidth: 1 }} >
                                <Text
                                    style={{ fontSize: 11, fontWeight: 'bold', textAlign: 'center', color: '#8b8a8a', fontFamily: fontFamily.textFontFamily }}>{}</Text>
                            </View>

                            <View style={{ flex: 0.4, backgroundColor: 'white', flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'space-around', borderLeftColor: 'red', borderBottomColor: 'red', borderBottomWidth: 1 }}>
                                {/* <View style={{ flex: 0.4, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center' }}> */}
                                <Text style={{ fontSize: 11, fontWeight: 'bold', textAlign: 'center', color: '#8b8a8a', fontFamily:context.isArabic?fontFamily.arabicTextFontFamily: fontFamily.textFontFamily }}>{item.distance}</Text>
                                {/* </View> */}
                            </View>

                            <View style={{ flex: 0.2, borderBottomColor: 'red', borderBottomWidth: 1 }} >
                                <Text
                                    style={{ fontSize: 11, fontWeight: 'bold', textAlign: 'center', color: '#8b8a8a', fontFamily:context.isArabic?fontFamily.arabicTextFontFamily:fontFamily.textFontFamily }}>{}</Text>
                            </View>

                            <Image resizeMode={'contain'} source={require('./../assets/images/searchScreen/locationSmall.png')} />

                        </View>

                    </View>

                    <View style={{ flex: 0.3 }} />

                    <View style={{ flex: 2, justifyContent: 'center', backgroundColor: 'white', borderColor: '#d51617', alignItems: 'center' }}>
                        <Image style={{ height: 45, width: 45, borderRadius: 8, transform: [{ rotateY: context.isArabic ? '180deg' : '0deg' }] }} source={require('./../assets/images/searchScreen/home.png')} />
                    </View>

                </View>

            </TouchableOpacity >
        )
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>

            <ImageBackground style={{ height: HEIGHT, width: WIDTH }} source={context.isArabic ? require('./../assets/images/backgroundimgReverse.jpg') : require('./../assets/images/backgroundimg.jpg')}>

                {/* <View style={{ flex: 0.7, alignItems: 'flex-end', justifyContent: 'flex-end', alignSelf: 'center', width: '90%' }}>
                    <Image style={{ alignSelf: context.isArabic ? 'flex-start' : 'flex-end' }} source={require('./../assets/images/login/ProfileIcon.png')} />
                </View>


                <View style={{ flex: 0.8 }} />

                <View style={{
                    flex: 0.8, flexDirection: context.isArabic ? 'row-reverse' : 'row', width: '100%'
                }}>
                    <TouchableOpacity
                        onPress={() => {
                            NavigationService.goBack();
                        }}
                        style={{ flex: 1.5, alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                        <Image style={{ alignSelf: 'center', transform: [{ rotate: context.isArabic ? '180deg' : '0deg' }] }} source={require('./../assets/images/login/back.png')} />
                    </TouchableOpacity>

                    <View style={{ flex: 1.5 }} />

                    <View style={{ flex: 5.5, alignItems: context.isArabic ? 'flex-end' : 'flex-start', justifyContent: 'center' }}>
                        <Image resizeMode="contain" source={require("./../assets/images/logo-size/SmartControlLogo128.png")}
                        />
                    </View>

                </View> */}
                 <View style={{ flex: 1.5 }}>
                    <Header isArabic={context.isArabic} />
                </View>

                <View style={{ flex: 0.5 }} />

                <View style={{ flex: 0.6, width: '93%', alignSelf: 'center' }}>
                    <SearchComponent isArabic={context.isArabic} searchText={searchText} onChangeSearch={onChangeSearchText} />
                </View>

                <View style={{ flex: 6, width: '85%', alignSelf: 'center' }}>

                    <View style={{ height: 30 }} />

                    <FlatList
                        nestedScrollEnabled={true}
                        data={searchArray}
                        renderItem={({ item, index }) => {
                            return (
                                renderSearchRow(item, index)
                            )
                        }}
                        ItemSeparatorComponent={() => <View style={{ height: 18 }} />}
                    />

                </View>

                <View style={{ flex: 0.2 }} />

                {/* <BottomComponent isArabic={context.isArabic} /> */}

            </ImageBackground>

        </SafeAreaView>
    )
}


export default observer(SearchScreen);