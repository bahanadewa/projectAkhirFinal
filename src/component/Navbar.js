import React, {Component} from 'react';
import '../support/css/CSS.css'
import { Link,Redirect,withRouter } from 'react-router-dom';
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
  DropdownItem ,
  Badge} from 'reactstrap';
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
    this.props.history.push('/')
}
  

  render() {
    if (this.props.username ===""){
      return (
        <div>
          <Navbar light expand="md">
            <NavbarBrand  className="font3"> 
                   <Link to="/"> <img src ="https://image.flaticon.com/icons/png/512/129/129356.png" width="30px" height="30px" /> </Link>  F O O D Q O M A
            </NavbarBrand>
  
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
  
              <Nav className="ml-auto" style={{marginRight:"20px" , fontWeight:"500"}} navbar>
                      <NavItem className="hover" style={{marginRight:"20px", marginLeft:"20px"}}>
                              <Link to="/about"><NavLink  style={{fontSize:"14px"}}>About </NavLink></Link>
                      </NavItem>

                      <NavItem className="hover" style={{marginRight:"15px", marginLeft:"20px"}}>
                              <Link to="/category"><NavLink  style={{fontSize:"14px"}}> Category </NavLink></Link>
                      </NavItem> 
              </Nav>
  
              <Nav className="ml-auto" navbar>
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
            <NavbarBrand className="font3" > <Link to="/"> <img src ="https://image.flaticon.com/icons/png/512/129/129356.png" width="30px" height="30px" /> </Link>  F o o d Q o m a</NavbarBrand>
  
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
  
              <Nav className="ml-auto" style={{marginRight:"15px" , fontWeight:"500"}} navbar>
                      <NavItem className="hover" style={{marginRight:"15px", marginLeft:"20px"}}>
                              <Link to="/about"><NavLink  style={{fontSize:"14px"}}>About </NavLink></Link>
                      </NavItem>
                      <NavItem className="hover" style={{marginRight:"15px", marginLeft:"20px"}}>
                              <Link to="/category"><NavLink  style={{fontSize:"14px"}}> Category </NavLink></Link>
                      </NavItem> 
                   
              </Nav>
  
              <Nav className="ml-auto" navbar>
                      <NavItem>
                              <NavLink>Hi !  {this.props.username} ({this.props.role})</NavLink>
                      </NavItem>
                      <NavItem>
                              <Link to="/cart">
                                    <NavLink className="btn btn-default " style={{fontSize:"14px"}}>
                                        {this.props.cart !== 0 ?
                                                <i class="fas fa-cart-arrow-down" style={{marginRight:"10px"}}>
                                                      <Badge color="danger" style={{position:"absolute",top:"2px", height:"20px", width:"25px", borderRadius:"20px"}} > <center>{this.props.cart}</center>  </Badge>
                                                </i >
                                                :
                                                <i class="fas fa-cart-arrow-down" style={{marginRight:"10px"}}>
                                                      <Badge  style={{position:"absolute",top:"2px", height:"20px", width:"25px", borderRadius:"20px", backgroundColor:"transparent"}} > <center>{this.props.cart}</center>  </Badge>
                                                </i >
                                        }
                                    </NavLink>
                              </Link>
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

export default withRouter( connect (mapStateToProps,{resetuser,resetCount})(MyNavbar));