
import React, { useContext } from 'react';
import { Image, View, FlatList, TextInput, StyleSheet, Dimensions, TouchableOpacity, Text } from "react-native";
import { fontFamily, fontColor } from '../config/config';

const ButtonComponent = (props: any) => {

    return (
        <TouchableOpacity
            onPress={props.buttonClick}
            style={[props.style, { backgroundColor: fontColor.ButtonBoxColor, justifyContent: 'center', alignItems: 'center' }]}>
            {/* <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}> */}
            {props.image ?
                <Image style={[props.imageStyle,{alignSelf:'center'}]} source={props.image} />
                :
                <Text style={{ textAlign: 'left', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}>
                    {props.buttonText}
                </Text>
            }
            {/* </View> */}
        </TouchableOpacity>
    )
}

export default ButtonComponent


