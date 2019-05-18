import React from 'react'
import { Link } from 'react-router-dom';
import Carousel1 from './Carousel-1'
import LastSeen from './LastSeen'
import {connect} from 'react-redux'


import '../support/css/cssfooter.css'

class Home extends React.Component{
    render(){
        return(
            <div className="container">
                    <div className="row"style={{padding:"20px"}} >

                        <div className="col-md-6">
                            <div  style={{marginTop:"100px", marginBottom:"150px",marginLeft:"50px", marginRight:"50px"}}>
                                <div className="font4 i1"> 
                                    <text style={{fontSize:"100px"}} className="knockout"> Feed</text>
                                </div>
                                <div className="font4 i1"> 
                                    <text style={{fontSize:"70px"}} className="knockout"> Your Good </text>
                                </div>
                                <div class="ui inverted segment" style={{width:"152px"}}>
                                    <Link to="/our-menu">
                                        <button class="ui inverted basic teal button"> Shop NOW !</button>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6" > 
                            <div style={{margin:"20px"}}>
                                <Carousel1/>
                            </div>
                        </div>
                    </div>

                    <div>
                        {
                            this.props.username !=="" ?
                            <LastSeen/> : null
                        }
                    </div>
            </div>
        )
    }
}

const mapStateToProps =(state)=>{
    return {
          username : state.user.user_name,
    }
  }
export default connect(mapStateToProps) (Home)