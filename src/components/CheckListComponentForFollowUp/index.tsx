import React, { Component, useState, useRef } from "react";
import {
    View,
    Image,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert
} from "react-native";
import TextComponent from "../TextComponent";
import FollowUpComponent from '../FollowUpComponent';
import PopoverTooltip from 'react-native-popover-tooltip';
import {
    Menu,
    MenuOption,
    MenuOptions,
    MenuTrigger,
    renderers,
} from 'react-native-popup-menu';
import { fontFamily, fontColor } from '../../config/config';
import { RootStoreModel } from '../../store/rootStore';
import useInject from "../../hooks/useInject";
const { Popover } = renderers
interface Props {
    onDashClick: (item: any, index: number) => void,
    onNAClick: (item: any, index: number) => void,
    onNIClick: (item: any, index: number) => void,
    onScoreImageClick: (item: any, index: number) => void,
    onGraceImageClick: (item: any, index: number) => void,
    onCommentImageClick: (item: any, index: number) => void,
    onAttachmentImageClick: (item: any, index: number) => void,
    onRegulationClick: (item: any, index: number) => void,
    onInfoImageClick: (item: any, index: number) => void,
    isArabic: boolean,
    index: number,
    item: any,
    currentGrace: boolean,
    currentScore: boolean
}




const CheckListComponentForFollowUp = (props: Props) => {
    const refrance = useRef(null);
    const [a, seta] = useState('');
    const [checkListBorderColor, setCheckListBorderColor] = useState('#abcfbf');
    const [touchableClick, setTouchableClick] = useState(false);
    const mapStore = (rootStore: RootStoreModel) => ({ myTasksDraft: rootStore.myTasksModel })
    const { myTasksDraft } = useInject(mapStore)


    return (

        <View>
            <View style={{ minHeight: 100, height: 'auto', alignItems: 'center', width: '95%', alignSelf: 'center', borderBottomColor: checkListBorderColor, borderBottomWidth: 1 }}>
                <View style={{ flex: 1, width: '100%', alignItems: 'center' }}>
                    <View style={{ flex: 1, width: '100%', flexDirection: props.isArabic ? 'row-reverse' : 'row' }}>
                        <View style={{ flex: 9, justifyContent: 'center' }}>

                            <TextComponent
                                textStyle={{ color: 'black', textAlign: props.isArabic ? 'right' : 'left', fontSize: 13, fontWeight: 'normal' }}
                                label={props.isArabic ? props.item.QuestionNameArabic + ' ( ' + (props.item.parameterno) : (props.item.parameterno) + ' ) ' + props.item.QuestionNameEnglish}

                            />

                        </View>

                    </View>
                    <View style={{ flex: 2, width: '100%', flexDirection: props.isArabic ? 'row-reverse' : 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>


                      
                            <TouchableOpacity
                              //  disabled={props.item.scoreDisable}
                                onPress={() =>
                                    props.onScoreImageClick(props.item, props.index)
                                }
                                style={[styles.circularView, { justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }]}>

                                {props.item.isScore ?
                                    <Text
                                        style={{ color: '#5c666f', textAlign: 'left', fontSize: 13, fontWeight: 'normal' }}
                                        numberOfLines={1}>
                                        {props.item.score}
                                    </Text> :
                                    <Image
                                        resizeMode="contain"
                                        source={require("./../../assets/images/startInspection/Icon.png")}
                                        style={{ height: '60%', width: '60%' }} />
                                }
                            </TouchableOpacity>

                        <Menu renderer={Popover} rendererProps={{ preferredPlacement: 'bottom' }}>

                            <MenuTrigger onPress={() => { }} style={styles.menuTrigger}>
                                <View
                                    style={{ width: 40, padding: 5, borderRadius: 15, backgroundColor: '#5c666f', justifyContent: 'center', alignItems: 'center' }}

                                >
                                    <TextComponent
                                        textStyle={{ color: '#ffffff', textAlign: 'left', fontSize: 11, fontWeight: 'normal' }}
                                        label={props.item.wasNI ? 'NI' : ' - '}
                                    />
                                </View>
                            </MenuTrigger>

                            <MenuOptions style={styles.menuOptions}>

                            <MenuOption onSelect={() => { setTouchableClick(true); setTouchableClick(false); props.onDashClick(props.item, props.index) }}>
                                    <TextComponent
                                        textStyle={{ color: '#5c666f', textAlign: 'left', fontSize: 11, fontWeight: 'normal' }}
                                        label={'-'}
                                    />
                                </MenuOption>

                                <MenuOption onSelect={() => { setTouchableClick(true); setTouchableClick(false); props.onNIClick(props.item, props.index) }}>
                                    <TextComponent
                                        textStyle={{ color: '#5c666f', textAlign: 'left', fontSize: 11, fontWeight: 'normal' }}
                                        label={'NI'}
                                    />
                                </MenuOption>

                            </MenuOptions>

                        </Menu>


                        <TouchableOpacity
                            onPress={() => props.onGraceImageClick(props.item, props.index)}
                            style={[styles.circularView, { justifyContent: 'center', alignItems: 'center' }]}>

                            {props.item.isScore ?
                                <Text
                                    style={{ color: '#5c666f', textAlign: 'left', fontSize: 13, fontWeight: 'normal' }}
                                    numberOfLines={1}>
                                    {props.item.GracePeriod}
                                </Text> :
                                <Image
                                    resizeMode="contain"
                                    source={require("./../../assets/images/startInspection/Calender.png")}
                                    style={{ height: '60%', width: '60%' }} />
                            }

                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => props.onAttachmentImageClick(props.item, props.index)}
                            style={[styles.circularView, { justifyContent: 'center', alignItems: 'center' }]}>
                            <Image
                                resizeMode="contain"
                                source={require("./../../assets/images/startInspection/Attachment.png")}
                                style={{ height: '60%', width: '60%' }} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => props.onCommentImageClick(props.item, props.index)}
                            style={[styles.circularView, { justifyContent: 'center', alignItems: 'center' }]}>
                            <Image
                                resizeMode="contain"
                                source={require("./../../assets/images/startInspection/Notes.png")}
                                style={{ height: '60%', width: '60%' }}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => props.onInfoImageClick(props.item, props.index)}

                            style={[styles.circularView, { justifyContent: 'center', alignItems: 'center' }]}>
                            <Image
                                source={require("./../../assets/images/startInspection/info.png")}
                                style={{ height: "60%", width: "60%" }}
                                resizeMode={'contain'}
                            />
                        </TouchableOpacity>

                    </View>
                </View>
            </View>
            <View style={{ height: 8 }} />
        </View >
    );
}

const styles = StyleSheet.create({
    imageStyle: {
        height: '100%',
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 1.5,
        marginBottom: '2%'
    },
    circularView: {
        width: 40,
        height: 40,
        borderRadius: 40 / 2,
    },
    menuOptions: {
        padding: 10,
    },
    menuTrigger: {
        padding: 10,
    }
});

export default CheckListComponentForFollowUp;