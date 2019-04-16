import axios from "axios"
import cookies from 'universal-cookie';
import {urlAPI} from '../support/url-API'

const objCookie = new cookies()

export const login =(paramsUserName,paramsPassword)=>{
    return (dispatch)=>{

        dispatch({
            type: "LOADING", 
        })

        axios.get(urlAPI+'/getuserlogin?username='+paramsUserName+'&password='+paramsPassword)
        //ketika berhasil terhubung kem daabase makan lanjut ke then
        .then((res) => {
            console.log(res)

        // IF USERNAME DAN PASSWORD SESUAI MAKA RES.DATA ADA ISINYA
            if(res.data.length > 0){
                if(res.data[0].verified===0){
                    dispatch(
                        {
                            type : 'LOGIN_VERIFY'
                        }
                    )
                }else{
                     console.log(res)
                        dispatch(
                        {
                            type : 'LOGIN_SUCCESS',
                            payload : res.data
                        }
                    ) 
                }
            }else{
                dispatch({
                    type : 'USER_NOT_FOUND',
                    payload : ['','Username not Found']
                })
            }
            
        })
        .catch((err) => {
            dispatch({
                type : 'SYSTEM_ERROR'
            })
        })
    }
}


export const cookieChecked = () => {
    return {
        type : 'COOKIE_CHECKED'
    }
}

export const keepLogIn = (cookie)=>{
    return(dispatch) => {
        axios.get(urlAPI + '/getalluserbyusername/'+cookie)
        .then((res) => {
            if(res.data.length > 0){
                dispatch({
                    type : 'LOGIN_SUCCESS',
                    payload : res.data
                })
            }
        })
        .catch((err) => console.log(err))
    }
} 

export const resetuser = () =>{
    return{
        type : "RESET_USER"
    }
}


export const register_signup = (a,b,c,d) =>{
    return(dispatch)=>{
        dispatch({
            type : 'LOADING'
        })
        var newData = {username : a, password : b, email : c, phone : d}
        // Mengecek Username availablity

        axios.get(urlAPI +'/getalluserbyusername/'+ a)
        .then((res) => {
            if(res.data.length > 0){
                dispatch({
                    type : 'USERNAME_NOT_AVAILABLE'
                })
            }
            else{
                axios.post(urlAPI +'/addnewuser',newData)
                .then((res) => {
                        dispatch({
                            type : 'LOGIN_SUCCESS-1',
                            //Mengirim Payload dalam bentuk Object
                            //payload : { username : newData.username, id : res.data.id, email : c} 
                            payload : a
                            },
                            // Parameter Ketiga agar cookie bisa diakses di semua komponen
                            // objCookie.set('userData',a,{path : '/'}),
                        ) 
                    } 
                )
                .catch((err) => console.log(err))
            }
        })
        .catch((err) => {
            dispatch({
                type : 'SYSTEM_ERROR'
            })
        })
    }
}

export const loginWithGoogle= (email)=>{
    return (dispatch)=>{
        axios.get(urlAPI+'/user??username='+email)
        .then((res)=> {
            if (res.data.length >0){
                dispatch({
                    type :'LOGIN_SUCCESS',
                    payload : res.data[0]
                },
                    objCookie.set('memory-cookie',email,{path :'/'})
                )
            }else {
                axios.post(urlAPI+'/db_user',{username : email, role : "user"})
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