import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux'
import cookie from 'universal-cookie'
import {resetuser} from '../1 action'
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
            <NavbarBrand > <Link to="/"><img src="https://cdn0.iconfinder.com/data/icons/cartoon-food/512/Food_512-07.png" style={{marginRight:'10px'}} alt="brand" width="70px"/> </Link>  F O O D Q O M A</NavbarBrand>
  
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
  
              <Nav className="ml-auto" style={{marginRight:"20px" , fontWeight:"500"}} navbar>
                      <NavItem style={{marginRight:"20px", marginLeft:"20px"}}>
                              <Link to="/about"><NavLink  style={{fontSize:"14px"}}>About </NavLink></Link>
                      </NavItem>
                      <NavItem style={{marginRight:"20px", marginLeft:"20px"}}>
                              <Link to="/our-menu"><NavLink  style={{fontSize:"14px"}}>Our Menu </NavLink></Link>
                      </NavItem>
                      <NavItem style={{marginRight:"20px", marginLeft:"20px"}}>
                              <Link to="/menu"><NavLink  style={{fontSize:"14px"}}>Discount </NavLink></Link>
                      </NavItem>
                      <NavItem style={{marginRight:"20px", marginLeft:"20px"}}>
                              <Link to="/menu"><NavLink  style={{fontSize:"14px"}}> Category </NavLink></Link>
                      </NavItem>   
              </Nav>
  
              <Nav className="ml-auto" navbar>
                      <NavItem>
                              <div className="input-group border-right " style={{width:"300px"}}>
                                  <input type="text" ref="searchBook" className="form-control" placeholder="Search" style={{fontSize:"14px"}}/>
                                  <div className="input-group-append mr-2">
                                      <button className="btn border-secondary" type="button"><i className="fas fa-search" style={{color:"#A0B830"}} /></button>
                                  </div>
                              </div> 
                      </NavItem>
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
            <NavbarBrand > <Link to="/"><img src="https://cdn0.iconfinder.com/data/icons/cartoon-food/512/Food_512-07.png" style={{marginRight:'10px'}} alt="brand" width="70px"/> </Link>  F O O D Q O M A</NavbarBrand>
  
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
  
              <Nav className="ml-auto" style={{marginRight:"20px" , fontWeight:"500"}} navbar>
                      <NavItem style={{marginRight:"20px", marginLeft:"20px"}}>
                              <Link to="/about"><NavLink  style={{fontSize:"14px"}}>About </NavLink></Link>
                      </NavItem>
                      <NavItem style={{marginRight:"20px", marginLeft:"20px"}}>
                              <Link to="/our-menu"><NavLink  style={{fontSize:"14px"}}>Our Menu </NavLink></Link>
                      </NavItem>
                      <NavItem style={{marginRight:"20px", marginLeft:"20px"}}>
                              <Link to="/menu"><NavLink  style={{fontSize:"14px"}}>Discount </NavLink></Link>
                      </NavItem>
                      <NavItem style={{marginRight:"20px", marginLeft:"20px"}}>
                              <Link to="/menu"><NavLink  style={{fontSize:"14px"}}> Category </NavLink></Link>
                      </NavItem>   
              </Nav>
  
              <Nav className="ml-auto" navbar>
                      <NavItem>
                              <div className="input-group border-right" style={{width:"300px"}}>
                                  <input type="text" ref="searchBook" className="form-control" placeholder="Search" style={{fontSize:"14px"}}/>
                                  <div className="input-group-append mr-2">
                                      <button className="btn border-secondary" type="button"><i className="fas fa-search" style={{color:"#A0B830"}} /></button>
                                  </div>
                              </div> 
                      </NavItem>

                      <NavItem>
                              <NavLink>Hi !  {this.props.username} ({this.props.role})</NavLink>
                      </NavItem>
                      <NavItem>
                              <Link to="/cart"><NavLink className="btn btn-default " style={{fontSize:"14px"}}><i class="fas fa-cart-arrow-down"></i > Cart </NavLink></Link>
                      </NavItem>
                      <UncontrolledDropdown nav inNavbar style={{fontSize:"14px", fontWeight:"500"}} >
                                                <DropdownToggle nav caret >
                                                Options
                                                </DropdownToggle>

                                                <DropdownMenu right style={{fontSize:"14px", fontWeight:"500", color:"#7F7F7F"}}>
                                                {this.props.role === "admin"?
                                                     <Link to ="/manage-menu">
                                                     <DropdownItem style={{color:"#7F7F7F"}}> Manage product</DropdownItem>
                                                     </Link> : null}

                                                    <DropdownItem style={{color:"#7F7F7F"}}>
                                                        Transaction History
                                                    </DropdownItem>
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
        role : state.user.role
  }
}

export default connect (mapStateToProps,{resetuser})(MyNavbar);