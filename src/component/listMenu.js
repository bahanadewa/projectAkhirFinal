import React from 'react'
import { urlAPI } from '../support/url-API';
import Axios from 'axios'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import swal from 'sweetalert'
import {cartCount} from '../1 action'



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

    addproduct = (obj)=> {
        var product_quantity = 1
        var product_idUser = this.props.id
        var product_username = this.props.username
        var product_name = obj.name
        var product_price = obj.price
        var product_category = obj.category
        var product_img = obj.img
        var product_id = obj.id
        var product_discount = obj.discount

        var newdata ={product_idUser,product_username,product_name,product_price,
                        product_category,product_img,product_id,product_quantity,product_discount}
                        
        Axios.get(urlAPI + '/cart?product_name=' + newdata.product_name + '&idUser=' + this.props.id).then((res) => {
            if(res.data.length > 0){
                Axios.put(urlAPI + '/cart/' + res.data[0].id, {...newdata, product_quantity: parseInt(res.data[0].product_quantity) + newdata.product_quantity })
                swal('Status Add' , 'Success Add to Cart' , 'success')
            }else{
                Axios.post(urlAPI + '/cart',newdata)
                .then((res) => {
                    swal('Status Add' , 'Success Add to Cart' , 'success')
                    this.props.cartCount(this.props.username)
                })
                .catch((err) => console.log(err))
            }
        })
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
                        <button className="d-block btn btn-info mt-2" onClick={()=> this.addproduct(val)}  style={{height:"34px", width:"100%"}}> <i class="fas fa-cart-arrow-down"></i> add to cart </button>
                        
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

const mapStateToProps = (state) => {
    return{
        id : state.user.id,
        username : state.user.user_name
    }
}

export default connect (mapStateToProps,{cartCount}) (Product)