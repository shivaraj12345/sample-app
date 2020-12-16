import React, { useContext, useEffect, useState } from 'react';
import { Image, View, StyleSheet, TouchableOpacity, SafeAreaView, Text, ImageBackground, Dimensions } from "react-native";
import Header from './Header';
import BottomComponent from './BottomComponent';
import ButtonComponent from './ButtonComponent';
import TextComponent from './TextComponent';
const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;
import { fontFamily, fontColor } from '../config/config';
import Strings from '../config/strings';
import { observer } from 'mobx-react';
import { Context } from '../utils/Context';
import TableComponent from './TableComponent';
import NavigationService from '../services/NavigationService';

const ProductListComponent = (props: any) => {
    const context = useContext(Context);
    const [productList, setProductList] = useState({});

    useEffect(() => {
        
        setProductList(props.data.ProductList);
     
    }, [props.data]);

    return (

        <View style={{ flex: 1, width: '100%', alignSelf: 'center', borderWidth: 1, borderColor: '#abcfbf', borderRadius: 12 }}>

            <TableComponent isHeader={false}
                isArabic={context.isArabic}
                data={[{ keyName: Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.productName, value: productList.ProductName },
                { keyName: Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.brand, value:  productList.Brand },
                { keyName: Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.type, value:  productList.PackageType },
                { keyName: Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.batch, value:  productList.Batch },
                { keyName: Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.quantity, value:  productList.Quantity },
                { keyName: Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.weight, value:  productList.Weight },
                { keyName: Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.unit, value:  productList.Unit },
                { keyName: Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.country, value:  productList.ManufCountry }
                ]} 
            />

        </View>
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

export default observer(ProductListComponent);

