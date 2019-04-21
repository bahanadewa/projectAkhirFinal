import React, { Component } from 'react';
import {connect}  from 'react-redux'
import './App.css';
import { Route, withRouter, Switch } from 'react-router-dom'
import {keepLogIn,cartCount,cookieChecked} from './1 action'

import cookie from 'universal-cookie'
import Register from './component/register'
import Login from './component/login'
import Navbar from './component/Navbar'
import Home from './component/home'
import ListMenu from './component/listMenu'
import ListDetail from './component/listDetail'
import ManageMenu from './component/manageMenu'
import Cart from './component/cart'
import About from './component/about'
import PageNotFound from './component/404'
import History from './component/transactionHistory'
import ScrollToTop from './component/scrollToTop'
import Footer from './component/footer'
import Addproduct from './component/addproductadmin'
import ManageCategory from './component/managecategory'


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
                  <Route path='*' component={PageNotFound} exact />      
            </Switch>
           
        </ScrollToTop>
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
