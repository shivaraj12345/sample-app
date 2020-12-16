import React, { useContext, useState, useEffect, useRef } from 'react';
import { Image, View, FlatList, Linking, SafeAreaView, TouchableOpacity, Text, ImageBackground, Dimensions, ScrollView, Alert, PermissionsAndroid, ToastAndroid, BackHandler, Platform, TextInput, StyleSheet } from "react-native";
import { useIsFocused } from '@react-navigation/native';
import NavigationService from '../../services/NavigationService';
import Header from './../../components/Header';
import KeyValueComponent from './../../components/KeyValueComponent';
import BottomComponent from './../../components/BottomComponent';
import { observer } from 'mobx-react';
import { Context } from '../../utils/Context';
import Strings from '../../config/strings';
import { fontFamily, fontColor } from '../../config/config';
import { RootStoreModel } from '../../store/rootStore';
import useInject from "../../hooks/useInject";
import { RealmController } from '../../database/RealmController';
import SearchComponent from '../../../src/components/SearchComponent';
let realm = RealmController.getRealmInstance();
// import WebView from "react-native-webview";
import html_script from './html_script'

const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;

const AboutDirections = (props: any) => {

    const context = useContext(Context);
    const [taskList, setTaskList] = useState(Array());
    const mapStore = (rootStore: RootStoreModel) => ({ myTasksDraft: rootStore.myTasksModel })
    const { myTasksDraft } = useInject(mapStore)

    // let webViewRef = useRef(null);

    useEffect(() => {
      goToMyPosition(73.862296,18.475676);
    }, [])

    const goToMyPosition = (lat: any, lon: any) => {
        // webViewRef.current.injectJavaScript(`
        //   mymap.setView([${lat}, ${lon}], 10)
        //   L.marker([${lat}, ${lon}]).addTo(mymap)
        // `)
    }

    useEffect(() => {

        const searchArray = [
            { place: 'Lulu 01', address: 'XYZ Abu dhabi', distance: '2 KM', image: './../../searchScreen/home.png' },
            { place: 'Lulu 02', address: 'XYZ Abu dhabi', distance: '3 KM', image: './../../searchScreen/home.png' },
            { place: 'Lulu 03', address: 'XYZ Abu dhabi', distance: '4 KM', image: './../../searchScreen/home.png' },
            { place: 'Lulu 04', address: 'XYZ Abu dhabi', distance: '5 KM', image: './../../searchScreen/home.png' }
        ]
        setTaskList(searchArray);

    }, []);


    const renderDirections = (item: any, index: number) => {

        return (

            <TouchableOpacity
                onPress={() => {
                    // NavigationService.navigate('TaskList', { searchText: item.place });
                    // NavigationService.navigate('EstablishmentDetails', { 'inspectionDetails': item });
                }}
                // key={item.inspectionId}
                style={{
                    height: 65, width: '100%', alignSelf: 'center', justifyContent: 'space-evenly', borderTopRightRadius: 10, borderBottomRightRadius: 10, borderWidth: 1,
                    shadowRadius: 1, backgroundColor: 'white', borderLeftWidth: 6, borderRightColor: '#5C666F', borderTopColor: '#5C666F', borderBottomColor: '#5C666F', borderLeftColor: '#5C666F'
                    , shadowOpacity: 15, shadowColor: 'grey', elevation: 0
                }}>

                <View style={{
                    flex: 1, height: '100%', flexDirection: context.isArabic ? 'row-reverse' : 'row', padding: 5
                }}>

                    <View style={{ flex: 6.5, paddingTop: 2, paddingBottom: 12, justifyContent: 'center', }}>

                        <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <Text style={{ fontSize: 13, textAlign: 'left', color: '#565758', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{item.place}</Text>
                        </View>

                        <View style={{ flex: 1.2, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', alignItems: 'center' }}>

                            <View style={{ flex: 1.1, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'flex-start' }}>

                                <View style={{ flex: 0.2, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center' }}>
                                    <Image resizeMode={'contain'} source={require('./../../assets/images/searchScreen/locationSmall.png')} />
                                </View>

                                <View style={{ flex: 1.7, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                    <Text numberOfLines={2} style={{ fontSize: 11, fontWeight: 'bold', textAlign: context.isArabic ? 'right' : 'left', color: '#8b8a8a', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{item.address}</Text>
                                </View>

                            </View>

                            <Image resizeMode={'contain'} source={require('./../../assets/images/searchScreen/locationSmall.png')} />

                            <View style={{ flex: 0.2, borderBottomColor: 'red', borderBottomWidth: 1 }} >
                                <Text
                                    style={{ fontSize: 11, fontWeight: 'bold', textAlign: 'center', color: '#8b8a8a', fontFamily: fontFamily.textFontFamily }}>{}</Text>
                            </View>

                            <View style={{ flex: 0.4, backgroundColor: 'white', flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'space-around', borderLeftColor: 'red', borderBottomColor: 'red', borderBottomWidth: 1 }}>
                                {/* <View style={{ flex: 0.4, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center' }}> */}
                                <Text style={{ fontSize: 11, fontWeight: 'bold', textAlign: 'center', color: '#8b8a8a', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{item.distance}</Text>
                                {/* </View> */}
                            </View>

                            <View style={{ flex: 0.2, borderBottomColor: 'red', borderBottomWidth: 1 }} >
                                <Text
                                    style={{ fontSize: 11, fontWeight: 'bold', textAlign: 'center', color: '#8b8a8a', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{}</Text>
                            </View>

                            <Image resizeMode={'contain'} source={require('./../../assets/images/searchScreen/locationSmall.png')} />

                        </View>

                    </View>

                    <View style={{ flex: 0.3 }} />

                    <View style={{ flex: 2, justifyContent: 'center', backgroundColor: 'white', borderColor: '#d51617', alignItems: 'center' }}>
                        <Image style={{ height: 45, width: 45, borderRadius: 8, transform: [{ rotateY: context.isArabic ? '180deg' : '0deg' }] }} source={require('./../../assets/images/searchScreen/home.png')} />
                    </View>

                </View>

            </TouchableOpacity >
        )
    }

    return (

        <SafeAreaView style={{ flex: 1 }}>

            <ImageBackground style={{ height: HEIGHT, width: WIDTH }} source={context.isArabic ? require('./../../assets/images/backgroundimgReverse.jpg') : require('./../../assets/images/backgroundimg.jpg')}>

                <View style={{ flex: 1.5 }}>
                    <Header isArabic={context.isArabic} />
                </View>

                <View style={{ flex: 1.5 }}>

                    <View style={{ flex: 1, flexDirection: 'row', width: '80%', alignSelf: 'center' }}>

                        <View style={{ flex: 1 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: fontColor.TitleColor, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily, fontSize: 18, fontWeight: 'bold' }}>{myTasksDraft.isMyTaskClick == 'CompletedTask' ? Strings[context.isArabic ? 'ar' : 'en'].dashboard.completedTesk : myTasksDraft.isMyTaskClick == 'case' ? Strings[context.isArabic ? 'ar' : 'en'].dashboard.cases : myTasksDraft.isMyTaskClick == 'license' ? Strings[context.isArabic ? 'ar' : 'en'].dashboard.licenses : Strings[context.isArabic ? 'ar' : 'en'].myTask.myTask}</Text>
                        </View>

                        <View style={{ flex: 1 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>
                    </View>

                    <View style={{ flex: 0.6, width: '85%', alignSelf: 'center' }}>
                        <SearchComponent isArabic={context.isArabic} />
                    </View>

                </View>

                <View style={{ flex: 3, width: '80%', alignSelf: 'center', borderRadius: 6, borderWidth: 1 }}>
                    {/* <WebView ref={webViewRef} source={{ html: html_script }} style={styles.Webview} /> */}
                </View>

                <View style={{ flex: 3, width: '80%', alignSelf: 'center' }}>

                    <View style={{ height: 30 }} />

                    <FlatList
                        nestedScrollEnabled={true}
                        data={taskList}
                        renderItem={({ item, index }) => {
                            return (
                                renderDirections(item, index)
                            )
                        }}
                        ItemSeparatorComponent={() => <View style={{ height: 18 }} />}
                    />

                </View>

                <View style={{ flex: 0.5 }} />

                <View style={{ flex: 1 }}>
                    <BottomComponent isArabic={context.isArabic} />
                </View>

            </ImageBackground>

        </SafeAreaView>

    )
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        padding: 10,
        backgroundColor: 'grey'

    },
    Webview: {
        flex: 2,

    }
})
export default observer(AboutDirections);