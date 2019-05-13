import React from 'react'
import top from '../support/img/photo-1553263622-1158612afed3.jpg'
import pasta from '../support/img/photo-1551462147-ff29053bfc14.jpeg'
import meat from '../support/img/photo-1547050605-2f268cd5daf0.jpeg'
import flour from '../support/img/photo-1549590143-d5855148a9d5.jpeg'
import herbs from '../support/img/photo-1518994603110-1912b3272afd.jpeg'
import '../support/css/CSS.css'



class About extends React.Component{
    render(){
        return(
            <div className="font1">
                <div className="row">
                        <div className="col-md col-sm col-xs">
                            <img src ={top} width="100%" height="100%" />
                        </div> 
                  </div>
                  <div className="row">
                        <div className="col-md-3 col-sm-3 col-xs-3">
                            <img src={pasta} width="100%" /> 
                        </div> 
                        <div className="col-md-3 col-sm-3 col-xs-3">
                            <h2 style={{textAlign:"center", paddingTop:"40%"}}> 
                                Best Pasta In ITALY
                            </h2>
                        </div> 
                  
                  
                        <div className="col-md-3 col-sm-3 col-xs-3" >
                            <img src={meat} width="100%" /> 
                        </div> 
                        <div className="col-md-3 col-sm-3 col-xs-3">
                            <h2 style={{textAlign:"center", paddingTop:"40%"}}> 
                                High Quality
                            </h2>
                        </div> 
                  
                  
                        <div className="col-md-3 col-sm-3 col-xs-3">
                            <img src={flour} width="100%" /> 
                        </div> 
                        <div className="col-md-3 col-sm-3 col-xs-3">
                            <h2 style={{textAlign:"center", paddingTop:"40%"}}> 
                                Fresh Everyday
                            </h2>
                        </div> 
                 
                  
                        <div className="col-md-3 col-sm-3 col-xs-3" >
                            <img src={herbs} width="100%" /> 
                        </div> 
                        <div className="col-md-3 col-sm-3 col-xs-3">
                            <h2 style={{textAlign:"center", paddingTop:"40%"}}> 
                                Organic Ingredients
                            </h2>
                        </div> 
                  </div>
            </div>
        )
    }   
}

export default About
