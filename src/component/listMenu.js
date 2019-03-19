import React from 'react'
import { urlAPI } from '../support/url-API';
import Axios from 'axios'
import {Link} from 'react-router-dom'


class Product extends React.Component {

    state = {listProduct : [], cart:[]}
 
    componentDidMount(){
        this.getDataProduct()
    }

    getDataProduct =()=> {
        Axios.get(urlAPI+"/product-menu")
        .then((res) => this.setState({listProduct :res.data}))
        .catch ((err)=> console.log(err))
    }


    renderProductJsx = ()=>{
        var jsx = this.state.listProduct.map((val)=>{
            return(
                <div className="card col-md-3 mr-3 mt-3" style={{width: '18rem'}}>
                    <Link to={'/detail-menu/'+val.id}>
                        <img height="280px" width="100%" src={val.img} className="card-img-top" alt="..." />
                    </Link>

                    {/* pake if tennary  karena melakukan pengkodisian di dalam return */}

                    {/* {   val.discount > 0 ? 
                        <div className="discount">{val.discount} % </div>
                        : null
                    } */}

                    <div className="card-body">
                        <h2 className="card-text" style={{fontSize:"15px",fontWeight:"bold"}}>{val.name}</h2>
                        <h5 className="card-text " style={{fontSize:"13px"}}> Nutrition Information </h5>

                    <table className="ml-3 mt-0" >
                        <tr style={{fontSize:"10px", color:'#7F7F7F'}}> 
                            <td>serving  </td>
                            <td> : {val.serving} gr</td>
                        </tr>
                        <tr style={{fontSize:"10px", color:'#7F7F7F'}}>
                            <td>calories </td>
                            <td> : {val.calories} gr</td>
                        </tr>
                        <tr style={{fontSize:"10px", color:'#7F7F7F'}}>
                            <td>fat </td>
                            <td> : {val.fat} gr</td>
                        </tr>
                        <tr style={{fontSize:"10px", color:'#7F7F7F'}}>
                            <td>protein </td>
                            <td> : {val.protein} gr</td>
                        </tr>
                        <tr style={{fontSize:"10px", color:'#7F7F7F'}}>
                            <td>carb </td>
                            <td> : {val.carb} gr</td>
                        </tr>
                        <tr style={{fontSize:"10px", color:'#7F7F7F'}}>
                            <td>fiber </td>
                            <td> : {val.fiber} gr</td>
                        </tr>
                    </table>

                        { val.discount > 0 ?
                        <p className="card-text" style={{textDecoration:"line-through", color:'red',display:"inline"}}> Rp {val.price}</p> 
                        : null
                        }
                        <p className="card-text" style={{display:"inline",fontWeight:'500'}}> Rp {val.price- (val.price*val.discount/100)} </p>
                        <Link to={'/detail-menu/'+val.id}>
                            <button className="d-block btn btn-info mt-2"  style={{height:"34px", width:"100%"}}> <i class="fas fa-cart-arrow-down"></i> add to cart </button>
                        </Link>
                    </div>
                </div>
            )
        })
        return jsx
    } 

    render (){
        return (
            <div className="container">
                <div className="row justify-content-center">
                    {this.renderProductJsx()}
                </div>
                   
            </div>
        )
    }
}

export default Product