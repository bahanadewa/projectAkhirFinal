import React from 'react'
import Axios from 'axios'
import { urlAPI } from '../support/url-API'
import {connect} from 'react-redux';
import swal from "sweetalert";
import {cartCount} from '../1 action'

class ProductDetail extends React.Component{
    state = {productname : [] }
    componentDidMount(){
        this.getDataApi()
        
    }

    getDataApi = ()=>{
        var id = this.props.match.params.id
    
        Axios.get(urlAPI+'/getallproduct/'+id)
        .then((res)=>{
            this.setState({productname : res.data[0]})
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
        var product_username = this.props.user
        var product_id = this.state.productname.id
 
        
        var newdata ={product_quantity,product_username,product_id}

        Axios.get(urlAPI+'/allcart?product_username='+this.props.user+"&product_id="+newdata.product_id)
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
                Axios.post(urlAPI+'/addcart',newdata)
                swal({

                    title: "Add to cart success",
                    text: "Add to cart success",
                    icon: "success",
                  })
                  this.props.cartCount(this.props.user)
            }
        })
        .catch((err)=>{
                console.log(err)
        })
    }

    render(){
        var {product_name, product_img,product_serving,product_calories,product_fat,product_protein,product_carb,product_fiber,product_category,product_price,product_discount,product_description,id_product} = this.state.productname
        return(
            <div className="container">
                    <div className="row">
                        <div className="col-md-4">
                                <div className="card" style={{width: '100%'}}>
                                    <img height="370px" width="100%" src={urlAPI+"/"+product_img} className="card-img-top" alt="..." />
                                </div>
                        </div>
                        <div className="col-md-8">
                                <h1 style={{color:"#4C4C4C"}}> {product_name} </h1>

                                <div style={{backgroundColor:'#D63E2A', 
                                            width:"50px", 
                                            height:"22px",
                                            color:"white", 
                                            textAlign:"center",
                                            display:"inline-block",
                                            borderRadius:"15px"}}> {product_discount} % </div>

                                <span style={{fontSize:"12px",
                                            fontWeight:"600px",
                                            color:"#606060",
                                            marginLeft:"10px",
                                            textDecoration:"line-through"}}> Rp {product_price}  </span>

                                <div style={{fontWeight:'700',
                                            fontSize :'24px',
                                            color:"#FF5722",
                                            marginTop:'20px'}}> Rp {product_price- (product_price*(product_discount/100))} </div>
                                
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
                                                            fontWeight:'700'}}> Description </div>
                                                <p style={{marginTop:'13px',
                                                            color:'#606060'}}> {product_description}</p>     
                                        </div>
                                </div>

                                <div className="row mt-4">
                                    <div className="col-md-8" style={{color:'#606060', fontStyle:'italic'}}>
                                        <p> serving {product_serving} gr | calories {product_calories} kcal | fat {product_fat} gr| protein {product_protein} gr | carb {product_carb} gr | fiber {product_fiber} gr  </p>
                                    </div>    
                                </div>
                                

                                { this.props.user ===""?
                                <div className="row mt-4">
                                        <div className="col-md-8"> 
                                            <button type="button" className="btn btn-success form-control" disabled> <i class="fas fa-cart-plus"></i> Add to cart </button>
                                        </div>
                                        
                                </div>
                                :
                                <div className="row mt-4">
                                        <div className="col-md-8"> 
                                            <button type="button" className="btn btn-success form-control" onClick={this.addcart} ref="addcart" style={{margin:"5px"}}> <i class="fas fa-cart-plus"></i>Add to cart </button>
                                        </div>
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

export default connect (mapStateToProps,{cartCount})(ProductDetail);