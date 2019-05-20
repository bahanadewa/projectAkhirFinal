import React from 'react'
import { Link,Redirect,withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import Loader from 'react-loader-spinner'
import {register_signup} from '../1 action'
import '../support/css/CSS.css'




class Register extends React.Component{

state = {error : ''}

componentWillReceiveProps(newProps){
    if(newProps.error !== ""){
        this.setState({error : newProps.error})
    }
}

renderLoading =()=>{
    if (this.props.loading===true){
        return <Loader
        type="Ball-Triangle" 
        color="#00BFFF" 
        height="50" 
        width="50"
        />
    }else {
        return  <button type="button" onClick={this.SignUp}  style={{width:"300px",height:"34px",borderRadius:"20px",backgroundColor:"#a2af75"}} ><i className="fas fa-sign-in-alt" /> Sign Up!</button>
    }
}

renderErrorMessage=()=>{
    if(this.props.error !==""){
        return <div class="alert alert-danger mt-5" role="alert">
                    {this.props.error}
                </div>
    }
}

SignUp =()=>{
    var username = this.refs.username.value
    var password = this.refs.password.value
    var email = this.refs.email.value
    var phone = this.refs.phone.value
   
    if (username ==="" || password ==="" || email === "" ||phone===""){
        this.setState({error : 'harus di isi semua'})
    } else {
        if(email.includes("@") && email.includes(".com")){
            this.props.register_signup(username,password,email,phone)
            this.props.history.push('/login')
        }else{
            alert('email tidak sesuai')
        }
    }
}



    render(){
        if(this.props.user !== ""){
            return<Redirect to ='/'/>
        }
        return(
            <div className="img" >
                <div className="container myBody" >
                <div className="row justify-content-center ml-auto mr-auto">
                
                <form className="border mb-3 justify-content-center background" style={{padding:"20px", borderRadius:"5%",marginTop:"20%"}} ref="formLogin">
                    <fieldset style={{fontSize:"14px"}}>
                        <div className="form-group row">
                            <label className="col-sm-3 col-form-label">Username</label>
                            <div className="col-sm-9">
                            <input type="text" ref="username" className="form-control" id="inputUsername" placeholder="Username" required autoFocus style={{borderRadius:"20px"}}/>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-sm-3 col-form-label">Password</label>
                            <div className="col-sm-9">
                            <input type="password" ref="password" className="form-control" id="inputPassword" placeholder="Password" required style={{borderRadius:"20px"}}/>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-sm-3 col-form-label">Email</label>
                            <div className="col-sm-9">
                            <input type="email" ref="email" className="form-control" id="inputEmail" placeholder="Email@mail.com" required style={{borderRadius:"20px"}}/>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-sm-3 col-form-label">Phone</label>
                            <div className="col-sm-9">
                            <input type="phone" ref="phone" className="form-control" id="inputPhone" placeholder="Ex: +6x xxxxxxxxx" required style={{borderRadius:"20px"}}/>
                            </div>
                        </div>
                        
                        <div className="form-group row">
                            <div className="col-12">
                            {this.renderLoading()}
                            {this.renderErrorMessage()}
                            
                           
                            </div>
                                
                        </div>
                        <div className="btn my-auto"><p>Already have an Account? <Link to="/login" className="border-bottom">Login</Link></p></div>
                        
                    </fieldset>
                </form>
                
            </div>                
        </div>
            </div>
            
        )
    }
}
const mapStateToProps = (state) => {
    return {
        user : state.user.user_name,
        loading : state.user.loading,
        error : state.user.error
    }
}

export default withRouter(connect(mapStateToProps,{register_signup}) (Register))