import React from 'react'
import { urlAPI } from '../support/url-API';
import Axios from 'axios'
import cookie from 'universal-cookie'
import '../support/css/CSS.css'

const objCookie = new cookie ()


class Product extends React.Component {

    state = {data : []}

    componentDidMount=()=>{
        this.getdata()
    }

    getdata=()=>{
        var getcookie = objCookie.get('memory-cookie')
        Axios.get(urlAPI+'/showlastseen/'+getcookie)
        .then((res)=>{
            this.setState({data : res.data})
        })
        .catch((err)=>{
            console.log(err)
        })
    }



    
    renderProductJsx =()=>{
        var jsx = this.state.data.map((val)=>{
            return(
                    <div className="card" style={{width:'200px', margin:"10px"}}>
                        <img src={urlAPI+"/"+val.product_img} height="200px" width="200px"className="card-img-top" alt="..." />
                        <div className="card-body">
                            <p className="card-text">{val.product_name}</p>
                        </div>
                    </div>
            )
        })
        return jsx
    } 

   

    render (){
        return (
            <div className="container">
                <div className="font3" style={{textAlign:"center", fontSize:"38px"}}>
                    Last View
                </div>
                <div className="row justify-content-center">
                    {this.renderProductJsx()}
                </div>
                   
            </div>
        )
    }
}



export default Product