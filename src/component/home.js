import React from 'react'
import Carousel1 from './carousel-1'
import Carousel2 from './carousel-2'
import Carousel3 from './carousel-3'

class Home extends React.Component{
    render(){
        return(
            <div className="container">
                    <div className="row mt-2" >
                        <div className="col-md-4 mt-3"> 
                             <Carousel1/>
                        </div>
                        <div className="col-md-4 mt-3"> 
                             <Carousel2/>
                        </div>
                        <div className="col-md-4 mt-3"> 
                             <Carousel3/>
                        </div>

                    </div>

            </div>
        )
    }
}
export default Home