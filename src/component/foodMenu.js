import React from "react"
import axios from 'axios'
import {Link} from 'react-router-dom'
import {urlAPI} from '../support/urlAPI'
import '../support/product.css'

class Product extends React.Component {
    state = {foodMenu : []}
 
    componentDidMount(){
        this.getDataProduct()
    }

    getDataProduct =()=> {
        axios.get(urlAPI+"/products")
        .then((res) => this.setState({foodMenu :res.data}))
        .catch ((err)=> console.log(err))
    }

    renderProductJsx = ()=>{
        var jsx = this.state.listProduct.map((val)=>{
            

            return(
                <div className="card col-md-3 mr-3 mt-3" style={{width: '18rem'}}>
                    <Link to={'/product-detail/'+val.id}><img width="200px" src={val.img} className="card-img-top img" alt="..." /></Link>

                    {/* pake if tennary  karena melakukan pengkodisian di dalam return */}

                    {   val.discount > 0 ? 
                        <div className="discount">{val.discount} % </div>
                        : null
                    }

                    <div className="card-body">
                    <h2 className="card-text">{val.nama}</h2>

                    { val.discount > 0 ?
                      <p className="card-text" style={{textDecoration:"line-through", color:'red',display:"inline"}}> Rp {val.harga}</p> 
                      : null
                    }
                    

                    <p className="card-text" style={{display:"inline",marginLeft:"20px",fontWeight:'500'}}> Rp {val.harga- (val.harga*val.discount/100)} </p>

                    <input type='button' className="d-block btn btn-primary" value="add to cart" />
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