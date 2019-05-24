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

    state = {listProduct : [], cart:[], listCategory : [], search:""}
 
    componentDidMount(){
        var Obj = queryString.parse(this.props.location.search)
        this.getDataCategory()
        this.getDataUrl()
    }

    getDataCategory =()=> {
        Axios.get(urlAPI+"/authCategory/getallcategory")
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
            Axios.get(urlAPI+"/authCategory/getsearch/"+id)
            .then((res) =>{
                this.setState({cart : res.data})
            })
            .catch ((err)=> console.log(err))
        }
        this.pushurl()
    }

    pushurl=()=>{
        var newLink = `/category`
        newLink+='?' + 'category'+'='+this.refs.category.value
        this.props.history.push(newLink)
      }

    getDataUrl=()=>{
        if(this.props.location.search){
          var Obj = queryString.parse(this.props.location.search)
          Axios.get(urlAPI+"/authCategory/getsearch/"+Obj.category)
          .then((res) =>{
              this.setState({cart : res.data, search : Obj.category ? Obj.category :""})
          })
          .catch ((err)=> console.log(err))
        }
    }

    lastseen=(val)=>{
        var data = { username : this.props.username, 
                    product_name : val.product_name,
                    product_img : val.product_img}
        Axios.post(urlAPI+"/authSeen/lastseen",data)
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
                <div className="col-md-3 mt-5 aaa">
                    <Link to={'/detail-menu/'+val.id} onClick={()=>this.lastseen(val)}>
                        <center>
                            <img style={{width:"200px", height:"200px"}} src={urlAPI+"/"+val.product_img} className="card-img-top mt-2" alt="..." />
                        </center>
                    </Link>

                    <div className="card-body">
                        <h2 className="card-text" style={{fontSize:"14px",fontWeight:"bold"}}>{val.product_name}</h2>
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

    alert=()=>{
        alert(this.state.search)
    }

   
      
      
// ================================================== RENDER ===========================================
   

    render (){
        return (
            <div className="container" >
                <div className="row justify-content-center mt-5">
                    <div className="col-md-4">
                        <select className='form-control' ref='category' onChange={this.search}>
                            <option value="" >PILIH KATEGORI</option>
                            {this.renderListCategory()}
                        </select>
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