import React from 'react'
import Axios from 'axios'
import { urlAPI } from '../support/url-API'
import {connect} from 'react-redux';
import swal from "sweetalert";

class ProductDetail extends React.Component{
    state = {productname : {} }
    componentDidMount(){
        this.getDataApi()
        
    }

    getDataApi = ()=>{
        
        var idUrl = this.props.match.params.id
    
        Axios.get(urlAPI+'/product-menu/'+idUrl)
        .then((res)=>{
            this.setState({productname : res.data})
            
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    onChange =()=>{
        if (this.refs.quantity.value <0  ){
            swal({
                title: "Try again",
                text: "Minimum order quantity must be 0",
                icon: "warning",
              });
           this.refs.quantity.value = 0
        } 
    }

    addcart =()=>{
        var product_quantity = parseInt (this.refs.quantity.value)
        var product_idUser = this.props.id
        var product_username = this.props.user
        var product_name = this.state.productname.name
        var product_price = this.state.productname.price
        var product_category = this.state.productname.category
        var product_img = this.state.productname.img
        var product_id = this.state.productname.id
        var newdata = {product_idUser , product_username, product_name,product_price, product_category,product_img,product_id,product_quantity}

        Axios.get(urlAPI+'/cart?product_idUser='+this.props.id+"&product_id="+newdata.product_id)
        .then((res)=>{
            if (res.data.length>0){
                product_quantity = res.data[0].product_quantity+product_quantity
                Axios.put(urlAPI+'/cart/'+res.data[0].id,{...newdata,product_quantity })
                swal({

                    title: "Add to cart success",
                    text: "Add to cart success",
                    icon: "success",
                  });
            }else{
                Axios.post(urlAPI+'/cart',newdata)
                swal({

                    title: "Add to cart success",
                    text: "Add to cart success",
                    icon: "success",
                  });
            }
        })
        .catch((err)=>{
                console.log(err)
        })
    }

    //json-server -p 2000 db.json
    render(){
        var {name, img, serving,calories,fat,protein,carb,fiber,category,price,discount} = this.state.productname

        return(
            <div className="container">
                    <div className="row">
                        <div className="col-md-4">
                                <div className="card" style={{width: '100%'}}>
                                    <img src={img} className="card-img-top" alt="..." />
                                </div>
                        </div>
                        <div className="col-md-8">
                                <h1 style={{color:"#4C4C4C"}}> {name} </h1>

                                <div style={{backgroundColor:'#D63E2A', 
                                            width:"50px", 
                                            height:"22px",
                                            color:"white", 
                                            textAlign:"center",
                                            display:"inline-block",
                                            borderRadius:"15px"}}> {discount} % </div>

                                <span style={{fontSize:"12px",
                                            fontWeight:"600px",
                                            color:"#606060",
                                            marginLeft:"10px",
                                            textDecoration:"line-through"}}> Rp {price}  </span>

                                <div style={{fontWeight:'700',
                                            fontSize :'24px',
                                            color:"#FF5722",
                                            marginTop:'20px'}}> Rp {price- (price*(discount/100))} </div>
                                
                                <div className="row">
                                        <div className="col-md-2">
                                                <div style={{marginTop:'10px',
                                                    color:'#606060',
                                                    fontWeight:'700'}}> Quantity </div>
                                                <input type="number" min={0} className="form-control" style={{width:"60px",marginTop:'13px'}} onChange={this.onChange} ref="quantity" />
                                        </div>
                                        <div className="col-md-6">
                                                <div style={{marginTop:'10px',
                                                            color:'#606060',
                                                            fontWeight:'700'}}> Note for seller (Optional)</div>
                                                <input type="text" className="form-control" style={{marginTop:'13px'}} placeholder="Ex : no MSG" />
                                        </div>
                                </div>

                                <div className="row mt-4">
                                    <div className="col-md-8" style={{color:'#606060', fontStyle:'italic'}}>
                                        <p> serving {serving} gr | calories {calories} kcal | fat {fat} gr| protein {protein} gr | carb {carb} gr | fiber {fiber} gr  </p>
                                    </div>    
                                </div>


                                { this.props.user ===""?
                                <div className="row mt-4">
                                        <button type="button" className="btn border-primary col-md-3" disabled> <i class="fas fa-archive"></i> wishlist </button>
                                        <button type="button" className="btn btn-info col-md-3" disabled> <i class="fas fa-archive"></i> Buy now </button>
                                        <button type="button" className="btn btn-success col-md-3" disabled> <i class="fas fa-cart-plus"></i> Add to cart </button>
                                </div>
                                :
                                <div className="row mt-4">
                                        <button type="button" className="btn border-primary col-md-3" style={{margin:"5px"}} > <i class="fas fa-archive"></i> wishlist </button>

                                        <button type="button" className="btn btn-info col-md-3" style={{margin:"5px"}}> <i class="fas fa-archive"></i> Buy now </button>

                                        <button type="button" className="btn btn-success col-md-3" onClick={this.addcart} ref="addcart" style={{margin:"5px"}}> <i class="fas fa-cart-plus"></i>Add to cart </button>
                                </div>
                                }
                                
                        </div>
                    </div>
                    




            </div>
        )
    }
}
const  mapStateToProps =(state)=>{
    return {
        user : state.user.user_name,
        role : state.user.role,
        id : state.user.id
    }
}

export default connect (mapStateToProps)(ProductDetail);