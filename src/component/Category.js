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

    state = {listProduct : [], cart:[], listCategory : []}
 
    componentDidMount(){
        this.getDataCategory()
    }

    getDataCategory =()=> {
        Axios.get(urlAPI+"/getallcategory")
        .then((res) => this.setState({listCategory :res.data}))
        .catch ((err)=> console.log(err))
    }

    renderListCategory=()=>{
        var jsx = this.state.listCategory.map((val)=>{
            return(
                <option value={val.id}>{val.product_category}</option>
            )
        })
        return jsx
    }

    search=()=>{
        if(this.refs.category.value==""){
            this.setState({cart : null})
        }else{
            var id = this.refs.category.value
            Axios.get(urlAPI+"/getsearch/"+id)
            .then((res) =>{
                this.setState({cart : res.data})
            })
            .catch ((err)=> console.log(err))
        }
    }

    lastseen=(val)=>{
        var data = { username : this.props.username, 
                    product_name : val.product_name,
                    product_img : val.product_img}
        Axios.post(urlAPI+"/lastseen",data)
        .then((res)=>{
            console.log(res)
        })
        .catch((err)=>{
            console.log(err)
        })
    }

   
    renderProductJsx = ()=>{
        var jsx = this.state.cart.map((val)=>{
            return(
                <div className="card col-md-3 mr-3 mt-3 imglist" style={{width: '18rem'}}>
                    <Link to={'/detail-menu/'+val.id} onClick={()=>this.lastseen(val)}>
                        <img height="200px" width="200px" src={urlAPI+"/"+val.product_img} className="card-img-top mt-2" alt="..." />
                    </Link>

                    <div className="card-body">
                        <h2 className="card-text" style={{fontSize:"15px",fontWeight:"bold"}}>{val.product_name}</h2>
                        {/* <h5 className="card-text " style={{fontSize:"13px"}}> Nutrition Information </h5> */}

                        { val.product_discount > 0 ?
                        <p className="card-text" style={{textDecoration:"line-through", color:'red',display:"inline"}}> Rp {val.product_price}</p> 
                        : null
                        }
                        <p className="card-text" style={{display:"inline",fontWeight:'500'}}> Rp {val.product_price- (val.product_price*val.product_discount/100)} </p>

                    </div>
                </div>
            )
        })
        return jsx
    } 

   

    render (){
        return (
            <div className="container" >
                <div className="row justify-content-center mt-5">
                    <div className="col-md-4">
                        <select className='form-control form-control-sm' ref='category'>
                            <option value="">PILIH KATEGORI</option>
                            {this.renderListCategory()}
                        </select>
                    </div>
                    <div className="col-md-1">
                        <input type="button" className="btn btn-info" value="search" onClick={this.search} />
                    </div>
                </div>
                <div className="row justify-content-center">
                    {this.state.cart?
                        this.renderProductJsx():null
                    }
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