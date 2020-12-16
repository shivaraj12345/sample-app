import axios from 'axios';
import { Alert, ToastAndroid } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import Base64 from './Base64';

let APICallingService = {

    sendRequestForPostWithXML: (url: string, payload: any, CB: any) => {

        let options = {
            method: 'POST',
            url: url,
            timeout: 10000 * 3,
            headers: {
                "Accept": "/",
                // 'Authorization': auth,
                'Content-Type': 'text/xml; charset=utf-8'
            },
            data: payload
        };

        try {
            return NetInfo.fetch().then((state: any) => {
                if (state.isConnected) {
                    return axios(options).then(response => {
                        let responseOK = response && response.status == 200;
                        if (responseOK) {
                            return response.data;
                        }
                        else {
                            return {
                                status: 'Failed',
                                error: response.data
                            }
                        }
                    })
                }
                else {
                    ToastAndroid.show('No internet connection', 1000)
                    return {
                        status: 'Failed',
                        message: 'NoInternet'
                    }
                }
            });

        } catch (e) {
            return {
                status: 'Failed',
                error: e
            }
        }
    },

    sendRequestForWSDLAPI: (url: string, payload: any, CB: any) => {

        let options = {
            method: 'POST',
            url: url,
            timeout: 10000 * 3,
            headers: {
                'Content-Type': 'text/xml; charset=utf-8'
            },
            data: payload
        };

        try {
            return NetInfo.fetch().then((state: any) => {
                if (state.isConnected) {
                    return axios(options).then(response => {
                        let responseOK = response && response.status == 200;
                        if (responseOK) {
                            return response.data;
                        }
                        else {
                            return {
                                status: 'Failed',
                                error: response.data
                            }
                        }
                    })
                }
                else {
                    ToastAndroid.show('No internet connection', 1000)
                    return {
                        status: 'Failed',
                        message: 'NoInternet'
                    }
                }
            });

        } catch (e) {
            return {
                status: 'Failed',
                error: e
            }
        }
    },

    sendRequestForPostWithAuthJson: (url: string, payload: any, auth: string, CB: any) => {

        let options = {};
        var params = payload;

        // let autherization = 'Basic ' + base64.encode(username + ":" + password);
        //  let autherization = 'Basic bGlmZXJheV9hY2Nlc3NAc2NvLmFlOkluZGlhQDEyMzQ=';

        if (auth != null && auth != '') {
            options = {
                method: 'POST',
                url: url,
                timeout: 10000 * 3,
                headers: {
                    'Authorization': auth,
                    'Content-Type': 'application/json'
                },
                data: params
            };
        }
        else {
            options = {
                method: 'POST',
                url: url,
                timeout: 10000 * 3,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: params
            };
        }
        try {
            return NetInfo.fetch().then((state: any) => {
                if (state.isConnected) {
                    return axios(options).then(response => {
                        let responseOK = response && response.status == 200;
                        if (responseOK) {
                            return response.data;
                        }
                        else {
                            return {
                                status: 'Failed',
                                error: response.data
                            }
                        }
                    })
                }
                else {
                    ToastAndroid.show('No internet connection', 1000)
                    return {
                        status: 'Failed',
                        message: 'NoInternet'
                    }
                }
            });

        } catch (e) {
            return {
                status: 'Failed',
                error: e
            }
        }
    },

    sendRequestForPutWithAuthJSON: (url: string, param: any, payload: any, CB: any) => {
        let username = param.username;
        let password = param.password;

        let options = {};

        // let autherization = 'Basic ' + base64.encode(username + ":" + password);
        let autherization = 'Basic bGlmZXJheV9hY2Nlc3NAc2NvLmFlOkluZGlhQDEyMzQ=';

        if (payload != null && payload != '') {
            options = {
                method: 'PUT',
                url: url,
                timeout: 10000 * 3,
                headers: {
                    'Authorization': autherization,
                    'Content-Type': 'application/json'
                },
                data: payload
            };
        }
        else {
            options = {
                method: 'PUT',
                url: url,
                timeout: 10000 * 3,
                headers: {
                    'Authorization': autherization
                },
            };
        }
        try {

            return NetInfo.fetch().then((state: any) => {
                if (state.isConnected) {
                    return axios(options).then(response => {
                        let responseOK = response && response.status == 200;
                        if (responseOK) {
                            return response.data;
                        }
                        else return {
                            status: 'Failed',
                            error: response.data
                        }
                    })
                }
                else {
                    ToastAndroid.show('No internet connection', 1000)
                    return {
                        status: 'Failed',
                        message: 'NoInternet'
                    }
                }
            });

        } catch (e) {
            return {
                status: 'Failed',
                error: e
            }
        }
    },

    sendRequestForPutWithAuth: (url: any, payload: any, auth: any, CB: any) => {
        let options = {};
        var params = payload;

        // let autherization = 'Basic ' + base64.encode(username + ":" + password);
        //  let autherization = 'Basic bGlmZXJheV9hY2Nlc3NAc2NvLmFlOkluZGlhQDEyMzQ=';

        if (auth != null && auth != '') {
            options = {
                method: 'PATCH',
                url: url,
                timeout: 10000 * 5,
                headers: {
                    'Authorization': auth
                },
                data: params
            };
        }
        else {
            options = {
                method: 'PATCH',
                url: url,
                timeout: 10000 * 5,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: params
            };
        }
        try {
            return NetInfo.fetch().then((state: any) => {
                if (state.isConnected) {
                    return axios(options).then(response => {
                        let responseOK = response && response.status == 200;
                        if (responseOK) {
                            return response.data;
                        }
                        else return {
                            status: 'Failed',
                            error: response.data
                        }
                    })
                }
                else {
                    ToastAndroid.show('No internet connection', 1000)
                    return {
                        status: 'Failed',
                        message: 'NoInternet'
                    }
                }
            });

        } catch (e) {
            return {
                status: 'Failed',
                error: e
            }
        }
    },

    sendRequestForGet: async(url: string, CB: any) => {
        let options = {
            method: 'GET',
            url,
            timeout: 1000 * 5 * 60,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Accept": "application/json",
                "Authorization": 'Basic ' + 'c29hdXNlcjpzb2F1c2VyMTIz'
            }
        };

        try {

            return await NetInfo.fetch().then(async(state: any) => {
                if (state.isConnected) {
                    return await axios(options).then(response => {
                        let responseOK = response && response.status == 200;
                        if (responseOK) {
                            return response.data;
                        }
                        else return {
                            status: 'Failed',
                            error: response.data
                        }
                    })
                }
                else {
                    ToastAndroid.show('No internet connection', 1000)
                    return {
                        status: 'Failed',
                        message: 'NoInternet'
                    }
                }
            });

        } catch (e) {
            return {
                status: 'Failed',
                error: e
            }
        }
    },

    sendRequestForGetWithAuth: (url: any, auth: string, CB: any) => {
        // let autherization = 'Basic ' + base64.encode(username + ":" + password);

        let options = {};

        if (auth != '') {
            options = {
                method: 'GET',
                url: url,
                timeout: 10000 * 3,
                headers: {
                    'Authorization': auth
                },
            };
        }
        else {
            options = {
                method: 'GET',
                url: url,
                timeout: 10000 * 3
            };
        }

        try {
            return NetInfo.fetch().then((state: any) => {
                if (state.isConnected) {
                    return axios(options).then(response => {
                        let responseOK = response && response.status == 200;
                        if (responseOK) {
                            return response.data;
                        }
                        else return {
                            status: 'Failed',
                            error: response.data
                        }
                    })
                }
                else {
                    ToastAndroid.show('No internet connection', 1000)
                    return {
                        status: 'Failed',
                        message: 'NoInternet'
                    }
                }
            });

        } catch (e) {
            return {
                status: 'Failed',
                error: e
            }
        }
    },


    sendRequestForDeleteWithAuth: (url: string, param: any, auth: any, CB: any) => {

        let options = {};

        options = {
            method: 'DELETE',
            url: url,
            timeout: 10000 * 3,
            headers: {
                'Authorization': auth
            },
            data: param
        };
        try {

            return NetInfo.fetch().then((state: any) => {
                if (state.isConnected) {
                    return axios(options).then(response => {
                        let responseOK = response && response.status == 200;
                        if (responseOK) {
                            return response.data;
                        }
                        else return {
                            status: 'Failed',
                            error: response.data
                        }
                    });
                }
                else {
                    ToastAndroid.show('No internet connection', 1000)
                    return {
                        status: 'Failed',
                        message: 'NoInternet'
                    }
                }
            });

        } catch (e) {
            return {
                status: 'Failed',
                error: e
            }
        }
    },

    sendGetRequest: async (url: string, CB: any) => {

        debugger;

        var username = "soauser";
        var password = "soauser123";
        var base64 = Base64.btoa(username + ":" + password);

        let options = {
            method: 'GET',
            url,
            timeout: 1000 * 5 * 60,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Accept": "application/json",
                "Authorization": 'Basic ' + base64
            }
        };
        // console.log("options", JSON.stringify(options));
        debugger;
        try {

            return NetInfo.fetch().then((state: any) => {
                if (state.isConnected) {
                    return axios(options).then(response => {
                        let responseOK = response && response.status == 200;
                        if (responseOK) {
                            return response.data;
                        }
                        else {
                            return {
                                status: 'Failed',
                                error: response.data ? response.data : ''
                            }
                        }
                    })
                }
                else {
                    ToastAndroid.show('No internet connection', 1000)
                    return {
                        status: 'Failed',
                        message: 'NoInternet'
                    }
                }
            });

        } catch (e) {
            return {
                status: 'Failed',
                error: e
            }
        }

    },
    // sendRequestForWSDLAPI: (url: string, payload: any, CB: any) => {

    //     let options = {
    //         method: 'POST',
    //         url: url,
    //         timeout: 10000 * 3,
    //         headers: {
    //             'Content-Type': 'text/xml; charset=utf-8'
    //         },
    //         data: payload
    //     };

    //     try {
    //         return NetInfo.fetch().then((state: any) => {
    //             if (state.isConnected) {
    //                 return axios(options).then(response => {
    //                     let responseOK = response && response.status == 200;
    //                     if (responseOK) {
    //                         return response.data;
    //                     }
    //                     else {
    //                         return {
    //                             status: 'Failed',
    //                             error: response.data
    //                         }
    //                     }
    //                 })
    //             }
    //             else {
    //                 ToastAndroid.show('No internet connection', 1000)
    //                 return {
    //                     status: 'Failed',
    //                     message: 'NoInternet'
    //                 }
    //             }
    //         });

    //     } catch (e) {
    //         return {
    //             status: 'Failed',
    //             error: e
    //         }
    //     }
    // },
    sendPostRequest: async (url: string, payload: any, CB: any) => {
        let options = {
            method: 'POST',
            url,
            timeout: 1000 * 5 * 60,
            headers: {
                'Content-Type': 'text/xml; charset=utf-8',
                // 'Content-Type': 'application/json;charset=UTF-8',
                // "Content-Type": "application/json",
                // "Authorization": 'Basic ' + 'c29hdXNlcjpzb2F1c2VyMTIz'
            },
            data: payload
        };
        // console.log("options", JSON.stringify(options));
        try {

            return await NetInfo.fetch().then(async (state: any) => {
                if (state.isConnected) {
                    return await axios(options).then(response => {
                        let responseOK = response && response.status == 200;
                        if (responseOK) {
                            return response.data;
                        }
                        else {
                            return {
                                status: 'Failed',
                                error: response.data ? response.data : ''
                            }
                        }
                    })
                }
                else {
                    ToastAndroid.show('No internet connection', 1000)
                    return {
                        status: 'Failed',
                        message: 'NoInternet'
                    }
                }
            });

        } catch (e) {
            return {
                status: 'Failed',
                error: e
            }
        }
    },
    sendPostRequestJson: async (url: string, payload: any, CB: any) => {
        let options = {
            method: 'POST',
            url,
            timeout: 1000 * 5 * 60,
            headers: {

                // 'Content-Type': 'application/json;charset=UTF-8',
                "Accept": "application/json",
                // "Content-Type": "application/json",
                // "Authorization": 'Basic ' + 'c29hdXNlcjpzb2F1c2VyMTIz'
            },
            data: payload
        };
        
        try {
            debugger
            return await NetInfo.fetch().then(async (state: any) => {
                if (state.isConnected) {
                    return await axios(options).then(response => {
                        let responseOK = response && response.status == 200;
                        console.log("responseOK", JSON.stringify(response));
                        if (responseOK) {
                            return response.data;
                        }
                        else {
                            return {
                                status: 'Failed',
                                error: response.data ? response.data : ''
                            }
                        }
                    })
                }
                else {
                    ToastAndroid.show('No internet connection', 1000)
                    return {
                        status: 'Failed',
                        message: 'NoInternet'
                    }
                }
            });

        } catch (e) {
             console.log('checklist exceptiom'+e)
            debugger
            return {
                status: 'Failed',
                error: e
            }
        }
    },

    sendSoapPostRequest: async (url: string, payload: any, CB: any) => {
        let options = {
            method: 'POST',
            url,
            timeout: 1000 * 5 * 60,
            headers: {
                'Content-Type': 'text/xml; charset=utf-8',
                "Authorization": 'Basic ' + 'c29hdXNlcjpzb2F1c2VyMTIz'
            },
            data: payload
        };
        // console.log("options", JSON.stringify(options));
        try {
            return await NetInfo.fetch().then(async (state) => {
                if (state.isConnected) {
                    return await axios(options).then(response => {
                        let responseOK = response && response.status == 200;
                        debugger;
                        if (responseOK) {
                            // console.log("response.data", response.data)
                            return response.data
                        }
                        else {
                            if (response.status === 401) {
                                // TODO
                            }
                        }
                        // return {
                        //     success: false,
                        //     status: 'Failed',
                        //     error: response.data
                        // }
                    }).catch(e => {
                        // console.log('InsideCatch: ', JSON.stringify(e));
                        debugger;
                        CB({
                            success: false,
                            status: 'Failed',
                            error: e
                        })
                    })
                } else {

                    CB({
                        success: false,
                        status: 'Failed',
                        message: 'NoInternet'
                    })
                    // Toast.show('noInternetConnection', Toast.LONG, Toast.CENTER);
                }
            })
        } catch (e) {
            // console.log('InsideCatch: ', JSON.stringify(e));
            debugger;
            CB({
                success: false,
                status: 'Failed',
                error: e
            })
        }
    },

    sendNewPostRequest: async (url: string, payload: any, CB: any) => {
        let options = {
            method: 'POST',
            url,
            timeout: 1000 * 5 * 60,
            headers: {
                'Content-Type': 'application/json',
            },
            data: payload
        };
        // console.log("options", JSON.stringify(options));
        try {
            return await NetInfo.fetch().then(async (state) => {
                if (state.isConnected) {
                    return await axios(options).then(response => {
                        let responseOK = response && response.status == 200;
                        // console.log('contact list response---', response.data);
                        debugger;
                        if (responseOK) {
                            // parse the response.data
                            // console.log("parsed data", response.data.TradelicenseHistory.Establishment[0].ListOfPartyRelationshipTo);
                            return response.data
                        }
                        else {
                            if (response.status === 401) {
                                // TODO
                            }
                        }
                        // return {
                        //     success: false,
                        //     status: 'Failed',
                        //     error: response.data
                        // }
                    }).catch(e => {
                        // console.log('InsideCatch: ', JSON.stringify(e));
                        debugger;
                        CB({
                            success: false,
                            status: 'Failed',
                            error: e
                        })
                    })
                } else {

                    CB({
                        success: false,
                        status: 'Failed',
                        message: 'NoInternet'
                    })
                    // Toast.show('noInternetConnection', Toast.LONG, Toast.CENTER);
                }
            })
        } catch (e) {
            // console.log('InsideCatch: ', JSON.stringify(e));
            debugger;
            CB({
                success: false,
                status: 'Failed',
                error: e
            })
        }
    },

};


export default APICallingService;

