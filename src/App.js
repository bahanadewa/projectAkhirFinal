import React, { Component } from 'react';
import {connect}  from 'react-redux'
import './App.css';
import { Route, withRouter, Switch } from 'react-router-dom'
import {keepLogIn} from './1 action'

import cookie from 'universal-cookie'
import Register from './component/register'
import Login from './component/login'
import Navbar from './component/Navbar'
import Home from './component/home'
import ListMenu from './component/listMenu'
import ListDetail from './component/listDetail'
import ManageMenu from './component/manageMenu'
import Cart from './component/cart'
import PageNotFound from './component/404'
import ScrollToTop from './component/scrollToTop'

const objCookie = new cookie () // objCookie dinamain terserah si penulis

class App extends Component {
  
  componentDidMount(){
    var getMemory =objCookie.get('memory-cookie')
    if (getMemory !== undefined){
      this.props.keepLogIn(getMemory)
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
                  <Route path='*' component={PageNotFound} exact />  
            </Switch>
        </ScrollToTop>
        

        
        
      </div>
    );
  }
}

export default withRouter (connect (null,{keepLogIn}) (App));
