import Axios from "axios";
import {urlAPI } from "../support/url-API";

export const cartCount = (int) => {
    return (dispatch) => {
        Axios.get(urlAPI + '/auth/user?username='+ int)
            .then((res)=>{
                    Axios.get(urlAPI + '/authCart/cart?product_username='+ res.data[0].username)
                        .then((res) => {
                                dispatch({
                                    type : 'CART_COUNT',
                                    payload : res.data.length
                                    })
                                })
                        .catch((err)=>{
                            console.log((err))
                        })
            })
            .catch((err)=>{
                console.log(err)
            })
    }
}

export const resetCount = () => {
    return{
        type : 'RESET_COUNT'
    }
}