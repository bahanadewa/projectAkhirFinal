import axios from "axios"
import cookies from 'universal-cookie';
import {urlAPI} from '../support/url-API'

const objCookie = new cookies()

export const login =(paramsUserName,paramsPassword)=>{
    return (dispatch)=>{

        dispatch({
            type: "LOADING", 
        })

        axios.get(urlAPI+'/user',{params:{username : paramsUserName, password :paramsPassword}}) //untuk ngeCheck apakah user ada apa engga
        //ketika berhasil terhubung kem daabase makan lanjut ke then
        .then((res)=>{
                if (res.data.length >0){
                    dispatch({
                        type : 'LOGIN_SUCCESS', // untuk menentukan bagian bana yang akan dirubah di global state
                        payload : { //payload bahan untuk merubah global state
                                username :res.data[0].username,
                                role : res.data[0].role,
                                id : res.data[0].id
                            }
                    })
                }else {
                    dispatch({
                        type: 'USER_NAME_NOT_FOUND'
                    })
                }
            })
        
        .catch((err)=>{
            dispatch ({
                type : 'SISTEM_ERROR'
            })
        })

    }
}

export const keepLogIn = (cookie)=>{
    return(dispatch) => {
        axios.get(urlAPI + '/user',{params :{username : cookie}})
        .then ((res)=> {
            if (res.data.length >0){
                dispatch({
                    type : 'LOGIN_SUCCESS',
                    payload : {
                        username : res.data[0].username,
                        role : res.data[0].role,
                        id : res.data[0].id
                    }
                })
            }
        })

        .catch((err)=> console.log(err))
    }
}

export const resetuser = () =>{
    return{
        type : "RESET_USER"
    }
}


export const register_signup = (a,b,c,d) =>{
    return (dispatch)=>{
        dispatch ({
            type : 'LOADING'
        })
        var newdata = {username : a, password :b , email : c, phone : d, role :"user"}

        axios.get( urlAPI + '/user?username='+ newdata.username)
        .then ((res) => {
            if (res.data.length > 0){
                dispatch ({
                    type : 'USERNAME_NOT_AVAILABLE'
                })
            } else {
                axios.post(urlAPI + '/user', newdata)
                .then ((res)=> dispatch({
                    type : 'LOGIN_SUCCESS',
                    payload : {
                        username :res.data.username,
                        role : res.data.role,
                    }
                },
                    objCookie.set('memory-cookie',a,{path :'/'})
                ))
                .catch ((err)=> console.log(err))
            }
        })

        .catch ((err) => {
            dispatch ({
                type : 'SISTEM_ERROR'
            })
        })

    }
}

export const loginWithGoogle= (email)=>{
    return (dispatch)=>{
        axios.get(urlAPI+'/user?username='+email)
        .then((res)=> {
            if (res.data.length >0){
                dispatch({
                    type :'LOGIN_SUCCESS',
                    payload : res.data[0]
                },
                    objCookie.set('memory-cookie',email,{path :'/'})
                )
            }else {
                axios.post(urlAPI+'/user',{username : email, role : "user"})
                .then((res)=>{
                    dispatch({
                        type : 'LOGIN_SUCCESS',
                        payload : res.data
                    })
                },
                    objCookie.set('memory-cookie',email,{path :'/'})
                )
                .catch((err)=>{
                    console.log(err)
                })
            }
        })
        .catch((err)=> { 
            dispatch ({
            type : 'SISTEM_ERROR'
        })
        })
    }
}