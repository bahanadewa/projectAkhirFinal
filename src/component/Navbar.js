import React, {Component} from 'react';
import '../support/css/CSS.css'
import { Link } from 'react-router-dom';
import {connect} from 'react-redux'
import cookie from 'universal-cookie'
import {resetuser,resetCount} from '../1 action'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem } from 'reactstrap';
;

const objCookie = new cookie ()

class MyNavbar extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  LogOut = ()=>{
    objCookie.remove('memory-cookie')
    this.props.resetuser()

}

  render() {
    if (this.props.username ===""){
      return (
        <div>
          <Navbar light expand="md">
            <NavbarBrand  className="font1"> 
                   <Link to="/"> <img src ="https://image.flaticon.com/icons/png/512/129/129356.png" width="30px" height="30px" /> </Link>  F O O D Q O M A
            </NavbarBrand>
  
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
  
              <Nav className="ml-auto" style={{marginRight:"20px" , fontWeight:"500"}} navbar>
                      <NavItem className="hover" style={{marginRight:"20px", marginLeft:"20px"}}>
                              <Link to="/about"><NavLink  style={{fontSize:"14px"}}>About </NavLink></Link>
                      </NavItem>
                      <NavItem className="hover" style={{marginRight:"20px", marginLeft:"20px"}}>
                              <Link to="/our-menu"><NavLink  style={{fontSize:"14px"}}>Our Menu </NavLink></Link>
                      </NavItem> 
              </Nav>
  
              <Nav className="ml-auto" navbar>
                      {/* <NavItem>
                              <div className="input-group border-right " style={{width:"300px"}}>
                                  <input type="text" ref="searchBook" className="form-control" placeholder="Search" style={{fontSize:"14px"}}/>
                                  <div className="input-group-append mr-2">
                                      <button className="btn border-secondary" type="button"><i className="fas fa-search" style={{color:"#A0B830"}} /></button>
                                  </div>
                              </div> 
                      </NavItem> */}
                      <NavItem>
                              <Link to="/register"><NavLink className="btn btn-default border-secondary mr-1" style={{fontSize:"14px"}}><i className="fas fa-user-plus" /> Sign Up </NavLink></Link>
                      </NavItem>
  
                      <NavItem>
                              <Link to="/login"><NavLink className="btn btn-default border-secondary" style={{fontSize:"14px"}}><i className="fas fa-sign-in-alt" /> Log In </NavLink></Link>
                      </NavItem>
              </Nav>
            </Collapse>
          </Navbar>
        </div>
      );
    }else{
      return (
        <div>
          <Navbar light expand="md">
            <NavbarBrand className="font1" > <Link to="/"> <img src ="https://image.flaticon.com/icons/png/512/129/129356.png" width="30px" height="30px" /> </Link>  F o o d Q o m a</NavbarBrand>
  
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
  
              <Nav className="ml-auto" style={{marginRight:"15px" , fontWeight:"500"}} navbar>
                      <NavItem className="hover" style={{marginRight:"15px", marginLeft:"20px"}}>
                              <Link to="/about"><NavLink  style={{fontSize:"14px"}}>About </NavLink></Link>
                      </NavItem>
                      <NavItem className="hover" style={{marginRight:"15px", marginLeft:"20px"}}>
                              <Link to="/our-menu"><NavLink  style={{fontSize:"14px"}}>Our Menu </NavLink></Link>
                      </NavItem> 
                      <NavItem className="hover" style={{marginRight:"15px", marginLeft:"20px"}}>
                              <Link to="/category"><NavLink  style={{fontSize:"14px"}}> Category </NavLink></Link>
                      </NavItem> 
              </Nav>
  
              <Nav className="ml-auto" navbar>
                      {/* <NavItem>
                              <div className="input-group border-right" style={{width:"300px"}}>
                                  <input type="text" ref="searchBook" className="form-control" placeholder="Search" style={{fontSize:"14px"}}/>
                                  <div className="input-group-append mr-2">
                                      <button className="btn border-secondary" type="button"><i className="fas fa-search" style={{color:"#A0B830"}} /></button>
                                  </div>
                              </div> 
                      </NavItem> */}

                      <NavItem>
                              <NavLink>Hi !  {this.props.username} ({this.props.role})</NavLink>
                      </NavItem>
                      <NavItem>
                              <Link to="/cart"><NavLink className="btn btn-default " style={{fontSize:"14px"}}><i class="fas fa-cart-arrow-down"></i >{this.props.cart} Cart </NavLink></Link>
                      </NavItem>
                      <UncontrolledDropdown nav inNavbar style={{fontSize:"14px", fontWeight:"500"}} >
                                                <DropdownToggle nav caret >
                                                Options
                                                </DropdownToggle>

                                                <DropdownMenu right style={{fontSize:"14px", fontWeight:"500", color:"#7F7F7F"}}>
                                                {this.props.role === "admin"?
                                                     <Link to ="/manage-menu" style={{textDecoration:"none"}}>
                                                     <DropdownItem style={{color:"#7F7F7F"}}> Manage Product</DropdownItem>
                                                     </Link>
                                                      : null}
                                                 {this.props.role === "admin"?
                                                     <Link to ="manage-category" style={{textDecoration:"none"}}>
                                                     <DropdownItem style={{color:"#7F7F7F"}}> Manage Category </DropdownItem>
                                                     </Link>
                                                      : null}
                                                  {this.props.role === "admin"?
                                                     <Link to ="Manage-transaction" style={{textDecoration:"none"}}>
                                                     <DropdownItem style={{color:"#7F7F7F"}}> Manage Transaction </DropdownItem>
                                                     </Link>
                                                      : null}

                                                    <Link to="/transaction-history" style={{textDecoration:"none"}} >
                                                    <DropdownItem style={{color:"#7F7F7F"}}>
                                                        History
                                                    </DropdownItem>
                                                    </Link>
                                                    
                                                    <DropdownItem style={{color:"#7F7F7F"}}>
                                                        Edit Profile
                                                    </DropdownItem>

                                                    
                                                     
                                                <DropdownItem divider />
                                                    <DropdownItem onClick={this.LogOut} style={{color:"#7F7F7F"}}>
                                                        Log Out
                                                    </DropdownItem>
                                                </DropdownMenu>
                        </UncontrolledDropdown>
              </Nav>
            </Collapse>
          </Navbar>
        </div>
      );

    }
    
  }
}

const mapStateToProps =(state)=>{
  return {
        username : state.user.user_name,
        role : state.user.role,
        cart : state.cart.count
  }
}

export default connect (mapStateToProps,{resetuser,resetCount})(MyNavbar);