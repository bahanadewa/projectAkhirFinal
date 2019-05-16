import React from 'react'
import { urlAPI } from '../support/url-API';
import Axios from 'axios'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import swal from 'sweetalert'
import {cartCount} from '../1 action'
import '../support/css/CSS.css'
import queryString from 'query-string'



class Product extends React.Component {

    state = {listProduct : [], cart:[],searchDataname : ""}
 
    componentDidMount(){
        this.getDataProduct()
        this.getDataUrl()
    }

    getDataProduct =()=> {
        Axios.get(urlAPI+"/getallproduct")
        .then((res) => this.setState({listProduct :res.data}))
        .catch ((err)=> console.log(err))
    }

    getDataUrl=()=>{
        // console.log(this.props.location.search)
        // console.log(queryString.parse(this.props.location.search))
        if(this.props.location.search){
          var Obj = queryString.parse(this.props.location.search)
          this.setState({searchDataname  : Obj.ourmenu ? Obj.ourmenu :""})
        }
    }
    

    addproduct = (obj)=> {
        var product_quantity = 1
        var product_username = this.props.username
        var product_id = obj.id
 

        var newdata ={product_quantity,product_username,product_id}
                        
        Axios.get(urlAPI + '/allcart?product_id=' + newdata.product_id + '&product_username=' + this.props.username).then((res) => {
            if(res.data.length > 0){
                Axios.put(urlAPI + '/cart/' + res.data[0].id, {...newdata, product_quantity: parseInt(res.data[0].product_quantity) + newdata.product_quantity })
                swal('Status Add' , 'Success Add to Cart' , 'success')
            }else{
                Axios.post(urlAPI + '/addcart',newdata)
                .then((res) => {
                    swal('Status Add' , 'Success Add to Cart' , 'success')
                    this.props.cartCount(this.props.username)
                })
                .catch((err) => console.log(err))
            }
        })
    }

    getdatasearch=()=>{
        var inputname = this.refs.searchbyname.value
        this.setState({searchDataname : inputname})
        this.pushurl()
      }

    pushurl=()=>{
        var newLink = `/our-menu`
       
        newLink+='?' + 'ourmenu'+'='+this.refs.searchbyname.value
        this.props.history.push(newLink)
    }
    
    renderProductJsx = ()=>{
        var arrSearchandFilter = this.state.listProduct.filter((val)=>{
            return (val.product_name.toLowerCase().startsWith(this.state.searchDataname)) 
        })
        var jsx = arrSearchandFilter.map((val)=>{
            return(
                <div className="card col-md-3 mr-3 mt-3 imglist" style={{width: '18rem'}}>
                    <Link to={'/detail-menu/'+val.id}>
                        <img height="250px" width="100%" src={urlAPI+"/"+val.product_img} className="card-img-top mt-2" alt="..." />
                    </Link>

                    <div className="card-body">
                        <h2 className="card-text" style={{fontSize:"15px",fontWeight:"bold"}}>{val.product_name}</h2>
                        {/* <h5 className="card-text " style={{fontSize:"13px"}}> Nutrition Information </h5> */}

                        { val.product_discount > 0 ?
                        <p className="card-text" style={{textDecoration:"line-through", color:'red',display:"inline"}}> Rp {val.product_price}</p> 
                        : null
                        }
                        <p className="card-text" style={{display:"inline",fontWeight:'500'}}> Rp {val.product_price- (val.product_price*val.product_discount/100)} </p>



                        { this.props.username ===""?
                               <button className="d-block btn btn-info mt-2" disabled style={{height:"34px", width:"100%"}}> <i class="fas fa-cart-arrow-down"></i> add to cart </button>
                        :
                            <button className="d-block btn btn-info mt-2" onClick={()=> this.addproduct(val)}  style={{height:"34px", width:"100%"}}> <i class="fas fa-cart-arrow-down"></i> add to cart </button>
                        }

                        
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
                    <div className="col-md-8 ">
                        <input type='text' placeholder='SEARCH BY NAME' ref="searchbyname" style={{marginBottom:'10px'}} className='form-control' onChange={this.getdatasearch}/>
                    </div>

                </div>
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