import React, { useContext, useEffect, useState } from 'react';
import { Image, View, StyleSheet, TouchableOpacity, SafeAreaView, Text, ImageBackground, Dimensions, ToastAndroid } from "react-native";
import Header from '../components/Header';
import BottomComponent from '../components/BottomComponent';
import ButtonComponent from '../components/ButtonComponent';
import TextComponent from '../components/TextComponent';
const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;
import { fontFamily, fontColor } from '../config/config';
import Strings from '../config/strings';
import { observer } from 'mobx-react';
import { Context } from '../utils/Context';
import TableComponent from '../components/TableComponent';
import NavigationService from '../services/NavigationService';
import SearchComponent from '../../src/components/SearchComponent';
import { FlatList } from 'react-native-gesture-handler';
import KeyValueComponent from '../components/KeyValueComponent';
import { RootStoreModel } from '../store/rootStore';
import useInject from "../hooks/useInject";

const InspectionList = (props: any) => {
    const context = useContext(Context);
    const [taskList, setTaskList] = useState(Array());
    const [isClick, setIsClick] = useState({
        allTaks: true,
        failedTask: false
    })

    const mapStore = (rootStore: RootStoreModel) => ({ myTasksDraft: rootStore.myTasksModel,
         adhocTaskEstablishmentDraft: rootStore.adhocTaskEstablishmentModel })
    const { myTasksDraft,adhocTaskEstablishmentDraft } = useInject(mapStore)
    const [tradeName, setTradeName] = useState("");
   

    let tempArray:any = []
    useEffect(() => {
        let temp = myTasksDraft.myTaskResponse;
        if ((temp != '') || (adhocTaskEstablishmentDraft.getSelectedItem() && 
        adhocTaskEstablishmentDraft.getSelectedItem()!="" )) {
	
	if (adhocTaskEstablishmentDraft.getSelectedItem() && 
        adhocTaskEstablishmentDraft.getSelectedItem()!="" ) {
            
            tempArray.push(JSON.parse(adhocTaskEstablishmentDraft.getSelectedItem()))
            setTradeName(tempArray[0].TradeEngName)
            if(tempArray[0].ListOfAction){
                let temp:any = tempArray[0].ListOfAction
                let tempInspectionDetails:any = temp.InspectionDetails
              
                setTaskList(tempInspectionDetails)
            }
            
        }
	else {
            setTaskList(JSON.parse(temp))
	}
        }
	
    }, []);

    const renderCompletedTask = (item: any, index: number) => {

        return (

            <TouchableOpacity
                onPress={() => {
                    NavigationService.navigate('HistoryInspectionDetails',{ 'HistoryInspectionDetails': item })
                }}
                key={item.inspectionId}
                style={[context.isArabic ? { borderTopLeftRadius: 10, borderBottomLeftRadius: 10, borderRightColor: '#d51e17', borderRightWidth: 5, borderLeftColor: '#5C666F' } : { borderTopRightRadius: 10, borderBottomRightRadius: 10, borderLeftColor: '#d51e17', borderLeftWidth: 5, borderRightColor: '#5C666F' }, {
                    height: 65, width: '100%', alignSelf: 'center', justifyContent: 'center', borderWidth: 1, shadowRadius: 1, backgroundColor: 'white', borderTopColor: '#5C666F', borderBottomColor: '#5C666F', shadowOpacity: 15, shadowColor: 'grey', elevation: 0
                }]}>

                <View style={[{
                    flex: 1, width: '100%', justifyContent: 'center', flexDirection: context.isArabic ? 'row-reverse' : 'row'
                }]}>
                   {/* <KeyValueComponent isArabic={context.isArabic} keyName={(Strings[context.isArabic ? 'ar' : 'en'].myTask.inspectionId)} value={item.TaskId} />
                    <KeyValueComponent flex1={0.3} flex2={0.7} isArabic={context.isArabic} keyName={(Strings[context.isArabic ? 'ar' : 'en'].myTask.type)} value={item.TaskType} />  */}
                    <KeyValueComponent isArabic={context.isArabic} keyName={(Strings[context.isArabic ? 'ar' : 'en'].myTask.inspectionId)} value={item.InspectionNumber} /> 
                    <KeyValueComponent flex1={0.3} flex2={0.7} isArabic={context.isArabic} keyName={(Strings[context.isArabic ? 'ar' : 'en'].myTask.type)} value={item.InspectionType} />
		</View>

                <View style={[{
                    flex: 1, width: '100%', justifyContent: 'center', flexDirection: context.isArabic ? 'row-reverse' : 'row'
                }]}>
                    <KeyValueComponent isArabic={context.isArabic} keyName={(Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.status)} value={item.Status} />
                    <KeyValueComponent flex1={0.3} flex2={0.7} isArabic={context.isArabic} keyName={(Strings[context.isArabic ? 'ar' : 'en'].completedTasks.date)} value={item.CompletionDate ? item.CompletionDate : ""} />
                </View>

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
                    <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{tradeName}</Text>
                </View>
                <View style={{ flex: 0.2 }} />
                <View style={{ flex: 0.4, flexDirection: 'row', width: '80%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderRadius: 18, backgroundColor: '#c4ddd2' }}>
                    <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].historyInspectionDetails.inspectionDetails)} </Text>
                </View>
                <View style={{ flex: 0.2 }} />              

                <View style={{ flex: 5.7, width: '85%', alignSelf: 'center' }} >
                    <View style={{ height: 5 }} />
                   
                                <FlatList
                                    nestedScrollEnabled={true}
                                    data={taskList}
                                    renderItem={({ item, index }) => {
                                        return (
                                            renderCompletedTask(item, index)
                                        )
                                    }}
                                    ItemSeparatorComponent={() => <View style={{ height: 18 }} />}
                                />                           
                 
                </View>               

                <View style={{ flex: 1 }}>
                    <BottomComponent isArabic={context.isArabic} />
                </View>

            </ImageBackground>

        </SafeAreaView >
    )
}
const styles = StyleSheet.create({
    TextInputContainer: {
        flex: 0.6,
        justifyContent: "center",
        alignSelf: 'center',

    },
    space: {
        flex: 0.0
    },
    textContainer: {
        flex: 0.4,
        justifyContent: 'center',
    },

});

export default observer(InspectionList);