import React from 'react'
import Carousel1 from './Carousel-1'
import Carousel2 from './Carousel-2'
import Carousel3 from './Carousel-3'

class Home extends React.Component{
    render(){
        return(
            <div>
                    <div className="row" >
                        <div className="col-md-4"> 
                             <Carousel1/>
                        </div>

                        <div className="col-md-4"> 
                            <Carousel2/>
                        </div>
                        
                        <div className="col-md-4"> 
                            <Carousel3/>
                        </div>
                    </div>
            </div>
        )
    }
}
export default Home