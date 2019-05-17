import React, { Component } from 'react';
import {connect}  from 'react-redux'
import './App.css';
import { Route, withRouter, Switch } from 'react-router-dom'
import {keepLogIn,cartCount,cookieChecked} from './1 action'

import cookie from 'universal-cookie'
import Register from './component/Register'
import Login from './component/Login'
import Navbar from './component/Navbar'
import Home from './component/Home'
import ListMenu from './component/ListMenu'
import ListDetail from './component/ListDetail'
import ManageMenu from './component/ManageMenu'
import Cart from './component/Cart'
import About from './component/About'
import PageNotFound from './component/404'
import History from './component/TransactionHistory'
import ScrollToTop from './component/ScrollToTop'
import Footer from './component/Footer'
import Addproduct from './component/AddProductAdmin'
import ManageCategory from './component/ManageCategory'
import VerivyPayment from './component/VerifyPayment'
import ManageTransaction from './component/ManageTrasaction'
import Category from './component/Category'


const objCookie = new cookie () // objCookie dinamain terserah si penulis

class App extends Component {
  
  componentDidMount(){
    var getMemory =objCookie.get('memory-cookie')
    if (getMemory !== undefined){
      this.props.keepLogIn(getMemory)
      this.props.cartCount(getMemory)
    } else{
      this.props.cookieChecked()
    }
  }

  render() {
    return (
      <div style={{position:"relative", minHeight:"100vh"}}>
        <div>
            <Navbar/>
            <ScrollToTop>
                <Switch>
                      <Route path="/" component={Home} exact/>
                      <Route path="/login" component={Login} exact/>
                      <Route path="/register" component={Register} exact/>
                      <Route path="/our-menu" component={ListMenu} exact/>
                      <Route path="/detail-menu/:id" component ={ListDetail} exact/>
                      <Route path="/cart" component ={Cart} exact/>
                      <Route path="/manage-menu" component ={ManageMenu} exact/>
                      <Route path="/add-product" component ={Addproduct} exact/>
                      <Route path="/manage-category" component ={ManageCategory} exact/>
                      <Route path="/about" component ={About} exact/>
                      <Route path="/transaction-history" component ={History} exact/>
                      <Route path="/Verify-payment" component ={VerivyPayment} exact/>
                      <Route path="/Manage-transaction" component ={ManageTransaction} exact/>
                      <Route path="/category" component ={Category} exact/>
                      <Route path='*' component={PageNotFound} exact />      
                </Switch>
            </ScrollToTop>
        </div>
         <Footer/>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cookie : state.user.cookie,
    id : state.user.id
  }
}

export default withRouter (connect (mapStateToProps,{keepLogIn,cartCount,cookieChecked}) (App));
