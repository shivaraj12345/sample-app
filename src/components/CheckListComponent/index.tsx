import React, { Component, useState, useRef, useEffect } from "react";
import {
    View,
    Image,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert
} from "react-native";
import TextComponent from "../TextComponent";
// import PopoverTooltip from 'react-native-popover-tooltip';
import {
    Menu,
    MenuOption,
    MenuOptions,
    MenuTrigger,
    renderers,
} from 'react-native-popup-menu';
import { fontFamily, fontColor } from '../../config/config';
import { RootStoreModel } from "../../store/rootStore";
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
    onDescImageClick: (item: any, index: number) => void,
    isArabic: boolean,
    index: number,
    selectedTaskType?: string,
    item: any
}

const CheckListComponent = (props: Props) => {
    const refrance = useRef(null);
    const [checkListBorderColor, setCheckListBorderColor] = useState('#abcfbf');
    const [touchableClick, setTouchableClick] = useState(false);
    const [isCheck, setIsCheck] = useState(false);

    const mapStore = (rootStore: RootStoreModel) => ({ establishmentDraft: rootStore.establishmentModel, myTasksDraft: rootStore.myTasksModel, licenseDraft: rootStore.licenseMyTaskModel, efstDraft: rootStore.eftstModel, bottomBarDraft: rootStore.bottomBarModel })
    const { establishmentDraft, myTasksDraft, licenseDraft, efstDraft, bottomBarDraft } = useInject(mapStore)


    useEffect(() => {
        debugger
        let taskType: string = JSON.parse(myTasksDraft.selectedTask).TaskType.toLowerCase();
        console.log('taskType' + taskType);
    }, []);

    return (
        <View>
            <View style={{ minHeight: 100, height: 'auto', alignItems: 'center', width: '95%', alignSelf: 'center', borderBottomColor: checkListBorderColor, borderBottomWidth: 1, paddingBottom:15 }}>
                <View style={{ flex: 1, width: '100%', alignItems: 'center' }}>

                    <View style={{ flex: 1, width: '100%', flexDirection: props.isArabic ? 'row-reverse' : 'row' }}>
                        <View style={{ flex: 9, justifyContent: 'center' }}>
                            <TextComponent
                                textStyle={{ color: 'black', textAlign: props.isArabic ? 'right' : 'left', fontSize: 13, fontWeight: 'normal' }}
                                label={props.isArabic ? props.item.parameter + ' ( ' + (props.index + 1) : (props.index + 1) + ' ) ' + props.item.parameter}
                            // label={ props.index + 1 + ') ' + props.item.parameter}
                            />
                        </View>
                    </View>

                    <View style={{ flex: 2, width: '100%', flexDirection: props.isArabic ? 'row-reverse' : 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>

                        {((JSON.parse(myTasksDraft.selectedTask).TaskType.toLowerCase() == "food poisoning") || (JSON.parse(myTasksDraft.selectedTask).TaskType.toLowerCase() == "food poison")) ?

                            <TouchableOpacity
                                disabled={props.item.scoreDisable || bottomBarDraft.profileClick}
                                onPress={() => props.onDescImageClick(props.item, props.index)}
                                style={[styles.circularView, { justifyContent: 'center', alignItems: 'center' }]}
                            >

                                <Image
                                    resizeMode="contain"
                                    source={require("./../../assets/images/startInspection/Check.png")}
                                    style={{ height: '60%', width: '60%' }} />

                            </TouchableOpacity>
                            :
                            <TouchableOpacity
                                disabled={props.item.scoreDisable || bottomBarDraft.profileClick}
                                onPress={() => props.onScoreImageClick(props.item, props.index)}
                                style={[styles.circularView, { justifyContent: 'center', alignItems: 'center' }]}>
                                {
                                    props.item.Answers === ''
                                        ?
                                        <Image
                                            resizeMode="contain"
                                            source={require("./../../assets/images/startInspection/Icon.png")}
                                            style={{ height: '60%', width: '60%' }} />
                                        :
                                        <View style={{ height: '60%', width: '60%', justifyContent: 'center' }}>
                                            <Text
                                                style={{ color: '#5c666f', textAlign: 'left', fontSize: 13, fontWeight: 'normal' }}
                                                numberOfLines={1}>
                                                {props.item.Answers}
                                            </Text>
                                        </View>
                                }
                            </TouchableOpacity>
                        }

                        <Menu renderer={Popover} rendererProps={{ preferredPlacement: 'bottom' }}>
                            <MenuTrigger onPress={() => { }} disabled={props.item.naNiDisableForEHS || bottomBarDraft.profileClick} style={styles.menuTrigger}>
                                <View
                                    style={{ width: 40, padding: 5, borderRadius: 15, backgroundColor: '#5c666f', justifyContent: 'center', alignItems: 'center' }}
                                >
                                    <TextComponent
                                        textStyle={{ color: '#ffffff', textAlign: 'left', fontSize: 11, fontWeight: 'normal' }}
                                        label={props.item.NAValue ? 'N/A' : props.item.NIValue ? 'NI' : ' - '}
                                    />
                                </View>
                            </MenuTrigger>
                            {
                                JSON.parse(myTasksDraft.selectedTask).TaskType.toLowerCase() == 'food-poision' ?
                                    <MenuOptions style={styles.menuOptions}>
                                        <MenuOption onSelect={() => { setTouchableClick(true); setTouchableClick(false); props.onDashClick(props.item, props.index) }}>
                                            <TextComponent
                                                textStyle={{ color: '#5c666f', textAlign: 'left', fontSize: 11, fontWeight: 'normal' }}
                                                label={' - '}
                                            />
                                        </MenuOption>
                                        <MenuOption onSelect={() => { setTouchableClick(true); setTouchableClick(false); props.onNAClick(props.item, props.index) }}>
                                            <TextComponent
                                                textStyle={{ color: '#5c666f', textAlign: 'left', fontSize: 11, fontWeight: 'normal' }}
                                                label={'N/A'}
                                            />
                                        </MenuOption>
                                        <MenuOption onSelect={() => { setTouchableClick(true); setTouchableClick(false); props.onNIClick(props.item, props.index) }}>
                                            <TextComponent
                                                textStyle={{ color: '#5c666f', textAlign: 'left', fontSize: 11, fontWeight: 'normal' }}
                                                label={'NI'}
                                            />
                                        </MenuOption>

                                    </MenuOptions>
                                    :
                                    <MenuOptions style={styles.menuOptions}>
                                        <MenuOption onSelect={() => { setTouchableClick(true); setTouchableClick(false); props.onDashClick(props.item, props.index) }}>
                                            <TextComponent
                                                textStyle={{ color: '#5c666f', textAlign: 'left', fontSize: 11, fontWeight: 'normal' }}
                                                label={' - '}
                                            />
                                        </MenuOption>
                                        <MenuOption onSelect={() => { setTouchableClick(true); setTouchableClick(false); props.onNAClick(props.item, props.index) }}>
                                            <TextComponent
                                                textStyle={{ color: '#5c666f', textAlign: 'left', fontSize: 11, fontWeight: 'normal' }}
                                                label={'N/A'}
                                            />
                                        </MenuOption>
                                        <MenuOption onSelect={() => { setTouchableClick(true); props.onNIClick(props.item, props.index) }}>
                                            <TextComponent
                                                textStyle={{ color: '#5c666f', textAlign: 'left', fontSize: 11, fontWeight: 'normal' }}
                                                label={'NI'}
                                            />
                                        </MenuOption>
                                    </MenuOptions>
                            }
                        </Menu>

                        {
                            ((JSON.parse(myTasksDraft.selectedTask).TaskType.toLowerCase() == "food poisoning") || (JSON.parse(myTasksDraft.selectedTask).TaskType.toLowerCase() == "food poison") || (JSON.parse(myTasksDraft.selectedTask).TaskType.toLowerCase() == 'complaints')) ?
                                null
                                :
                                <TouchableOpacity
                                    onPress={() => props.onGraceImageClick(props.item, props.index)}
                                    style={[styles.circularView, { justifyContent: 'center', alignItems: 'center' }]}
                                    // disabled={bottomBarDraft.profileClick}
                                >

                                    {
                                        props.item.grace == ''
                                            ?
                                            <Image
                                                resizeMode="contain"
                                                source={require("./../../assets/images/startInspection/Calender.png")}
                                                style={{ height: '60%', width: '60%' }} />
                                            :
                                            <Text
                                                style={{ color: '#5c666f', textAlign: 'left', fontSize: 13, fontWeight: 'normal' }}
                                                numberOfLines={1}>
                                                {props.item.grace}
                                            </Text>
                                    }
                                </TouchableOpacity>

                        }

                        <TouchableOpacity
                            onPress={() => props.onAttachmentImageClick(props.item, props.index)}
                            style={[styles.circularView, { justifyContent: 'center', alignItems: 'center' }]}
                            // disabled={bottomBarDraft.profileClick}
                        >
                            <Image
                                resizeMode="contain"
                                source={require("./../../assets/images/startInspection/Attachment.png")}
                                style={{ height: '60%', width: '60%', borderWidth: (props.item.image1Uri || props.item.image2Uri) ? 2 : 0, borderColor: 'green' }} />
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


                        {(JSON.parse(myTasksDraft.selectedTask).TaskType.toLowerCase() == "food poisoning" || JSON.parse(myTasksDraft.selectedTask).TaskType.toLowerCase() == 'food-poision' || JSON.parse(myTasksDraft.selectedTask).TaskType.toLowerCase() == 'complaints') ?

                            <TouchableOpacity
                                disabled={props.item.informationDisableForEHS}
                                onPress={() => props.onInfoImageClick(props.item, props.index)}
                                style={[styles.circularView, { justifyContent: 'center', alignItems: 'center' }]}>
                                <Image
                                    source={require("./../../assets/images/startInspection/Description.png")}
                                    style={{ height: "60%", width: "60%" }}
                                    resizeMode={'contain'}
                                />
                            </TouchableOpacity>
                            :
                            <TouchableOpacity
                                disabled={props.item.informationDisableForEHS}
                                onPress={() => props.onInfoImageClick(props.item, props.index)}
                                style={[styles.circularView, { justifyContent: 'center', alignItems: 'center' }]}>
                                <Image
                                    source={require("./../../assets/images/startInspection/info.png")}
                                    style={{ height: "60%", width: "60%" }}
                                    resizeMode={'contain'}
                                />
                            </TouchableOpacity>

                        }
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
    container: {
        padding: 10,
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },
    menuOptions: {
        padding: 10,
    },
    menuTrigger: {
     
    }
});

export default CheckListComponent;