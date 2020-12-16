import React, { useState, useContext, useEffect } from 'react'
import {
    FlatList,
    View,
    Image,
    TouchableOpacity,
    Text,
    Dimensions,
    ScrollView,
    SectionList
} from 'react-native';

// get hight and width
const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;

// imports
import Accordion from 'react-native-collapsible/Accordion';
import TextComponent from '../TextComponent';
import CheckListComponent from './../CheckListComponent';
import { fontFamily, fontColor } from '../../config/config';
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
    data: any
}
const AccordionComponent = (props: Props) => {
    const [activeSections, setSection] = useState([0]);

    const renderAccordionHeader = (content: any, index: any, isActive: any) => {
        return (
            <View style={{ minHeight: HEIGHT * 0.04, height: 'auto', backgroundColor: '#abcfbf', flexDirection: props.isArabic ? 'row-reverse' : 'row', width: '90%', padding: 5, alignSelf: 'center', marginBottom: 5, borderRadius: 22 }}>
                <View style={{ flex: 8.4, justifyContent: 'center', alignItems: 'flex-start' }}>
                    <TextComponent
                        textStyle={{ color: '#5c666f', textAlign: 'left', fontSize: 12, fontFamily:fontFamily.tittleFontFamily, fontWeight: 'normal' }}
                        label={content.title}
                    />
                </View>
                <View style={{ flex: 0.1 }} />
                <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center', height: 40, }}>
                    {
                        isActive ?
                            <Image
                                source={require("./../../assets/images/startInspection/Grey/Arrow.png")}
                                style={{ height: 22, width: 22, alignItems: 'flex-end', transform: props.isArabic ? [{ rotate: '90deg' }] : [{ rotate: '90deg' }] }}
                                resizeMode={'contain'}
                            />
                            :
                            <Image
                                source={require("./../../assets/images/startInspection/Grey/Arrow.png")}
                                style={{ height: 22, width: 22, alignItems: 'flex-end', transform: props.isArabic ? [{ rotate: '-180deg' }] : [{ rotate: '0deg' }] }}
                                resizeMode={'contain'}
                            />
                    }
                </View>
            </View>
        );
    };

    // const renderCheckListForEachHeadeSection = ({ index, item }) => {
    //     return (
    //         <CheckListComponent
    //             onNAClick={props.onNAClick}
    //             onNIClick={props.onNIClick}
    //             onScoreImageClick={props.onScoreImageClick}
    //             onGraceImageClick={props.onGraceImageClick}
    //             onCommentImageClick={props.onCommentImageClick}
    //             onInfoImageClick={props.onInfoImageClick}
    //             onAttachmentImageClick={props.onAttachmentImageClick}
    //             onRegulationClick={props.onRegulationClick}
    //             item={item}
    //             index={index} />
    //     );
    // }

    const renderAccordionContent = (content: any, index: number, isActive: boolean) => {
        if (isActive) {
            return (
                <View style={{ height: 'auto', width: '100%', padding: '2%' }}>
                    {
                        content.data.map((item: any, index: number) => {
                            return (
                                <CheckListComponent
                                    key={index}
                                    onDashClick={props.onDashClick}
                                    onNAClick={props.onNAClick}
                                    onNIClick={props.onNIClick}
                                    onScoreImageClick={props.onScoreImageClick}
                                    onGraceImageClick={props.onGraceImageClick}
                                    onCommentImageClick={props.onCommentImageClick}
                                    onInfoImageClick={props.onInfoImageClick}
                                    onAttachmentImageClick={props.onAttachmentImageClick}
                                    onRegulationClick={props.onRegulationClick}
                                    onDescImageClick={props.onDescImageClick}
                                    item={item}
                                    isArabic={props.isArabic}
                                    index={index} />
                            );
                        })
                    }
                    {/* <FlatList
                        style={{ width: '100%' }}
                        contentContainerStyle={{ padding: '2%' }}
                        data={content.data}
                        // initialNumToRender={4}
                        // renderItem={({ index, item }) =>

                        // }
                        renderItem={renderCheckListForEachHeadeSection}
                    /> */}
                </View>
            );
        }
    }

    const updateSections = (activeSections: any) => {
        setSection(activeSections.includes(undefined) ? [] : activeSections);
    };

    return (
        <View style={{ width: '100%' }}>
            <Accordion
                activeSections={activeSections}
                sections={props.data}
                touchableComponent={TouchableOpacity}
                expandMultiple={false}
                renderHeader={renderAccordionHeader}
                renderContent={renderAccordionContent}
                duration={0}
                onChange={updateSections}
            />
        </View>
    );

}

export default AccordionComponent