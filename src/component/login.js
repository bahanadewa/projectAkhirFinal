import React from 'react'
import {connect} from "react-redux"
import { Link,Redirect } from 'react-router-dom';
import {login,loginWithGoogle} from '../1 action'
import Loader from 'react-loader-spinner'
import cookie from 'universal-cookie' //penamaan cookie tersserah
import '../support/css/CSS.css'

import firebase from 'firebase'
var config = {
    apiKey: "AIzaSyBcR9H4mkhq3NCpDK-qlpZk7DJ_53jpoFo",
    authDomain: "login-with-ggle.firebaseapp.com",
    databaseURL: "https://login-with-ggle.firebaseio.com",
    projectId: "login-with-ggle",
    storageBucket: "",
    messagingSenderId: "413811540321"
  };
  firebase.initializeApp(config)

  export const ref = firebase.database().ref();
  export const auth = firebase.auth;
  export const provider = new firebase.auth.GoogleAuthProvider();

const Cookie = new cookie ()
class Login extends React.Component{

    componentWillReceiveProps(newProps){
        Cookie.set('memory-cookie',newProps.username,{path : '/'}) //memory-cookie dinamakan sesuai penulis scrib (terserah)
    }

    Login=()=>{
        var name = this.refs.username.value
        var password = this.refs.password.value
        this.props.login(name,password)
    }

    renderErrorMessage=()=>{
        if(this.props.error !==""){
            return <div class="alert alert-danger mt-5" role="alert">
                        {this.props.error}
                    </div>
        }
    }

    renderLoading = () =>{
        if (this.props.loading === true){
            return <Loader
            type="Ball-Triangle" 
            color="#00BFFF" 
            height="50" 
            width="50"
            />

        }else{
            return <button type="button" className="btn btn-primary" onClick={this.Login} style={{width:"300px"}} ><i className="fas fa-sign-in-alt" /> Login</button>
        }
    }

    loginWithGoogle = ()=>{
        firebase.auth().signInWithPopup(provider)
    
        .then((res)=> {
            this.props.loginWithGoogle(res.user.email)
        })
        .then((err)=> console.log(err))
    }


    render(){
        if(this.props.username !==""){
            return<Redirect to = '/'/>
        }
        return(
            <div className="img"> 
                <div className="container myBody " style={{minHeight:"600px"}}>
                <div className="row justify-content-center " >
                            <form className="border background" style={{padding:"20px", borderRadius:"5%",marginTop:"20%"}} ref="formLogin">
                                <fieldset style={{fontSize:"14px"}} >
                                    <div className="form-group row">
                                        <label className="col-sm-3 col-form-label">Username</label>
                                        <div className="col-sm-9">
                                        <input type="text" ref="username" className="form-control" id="inputEmail" placeholder="Username" required autoFocus/>
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <label className="col-sm-3 col-form-label">Password</label>
                                        <div className="col-sm-9">
                                        <input type="password" ref="password" className="form-control" id="inputPassword" placeholder="Password" onKeyPress={this.renderOnKeyPress} required />
                                        </div>
                                    </div>
                                    
                                    <div className="form-group row">
                                        <div className="col-12" style={{textAlign:"center"}}>
                                            {this.renderLoading()}
                                        <div className="mt-2" style={{fontWeight:"500",fontSize:"14px"}}> Log In with </div>
                                            <div>
                                                <button  className="btn mt-1" onClick={this.loginWithGoogle}><img src="https://cdn0.iconfinder.com/data/icons/social-network-7/50/2-256.png" width="40px"/> </button>
                                            </div>
                                            {this.renderErrorMessage()}
                                        </div>
                                         
                                    </div>
                                    <div className="btn my-auto"><p>Don't have Account? <Link to="/register" className="border-bottom">Sign Up!</Link></p></div>
                                </fieldset>
                            </form>   
                    </div>
                </div>
            </div>
            
        )
    }
}

const mapStateToProps =(state)=>{
    return {
        username : state.user.user_name,
        error : state.user.error,
        loading : state.user.loading
    }    
}

export default connect(mapStateToProps,{login,loginWithGoogle}) (Login)