import React from 'react'
import Axios from 'axios'
import { urlAPI } from '../support/url-API'
import swal from "sweetalert";

class Addproduct extends React.Component {
    state={error:'',iscategory : [], selecctedFile : null}
componentDidMount() {
this.getDataCategory()
}
getDataCategory = () => {
    Axios.get(urlAPI+'/getAllCategory')
    .then((res)=>{
        this.setState({iscategory:res.data})
    })
}

valueHandler = () => {
    var value = this.state.selecctedFile ? this.state.selecctedFile.name : 'Pick a Picture'
    return value
}
onChangeHendler = (event) => {
    //untuk mendapatkan file image
    this.setState({selecctedFile : event.target.files[0]})
}

addData = () => {
        var product_name = this.refs.product_name.value;
        var product_serving = this.refs.product_Serving.value;
        var product_calories = this.refs.product_calories.value;
        var product_fat = this.refs.product_fat .value;
        var  product_protein = this.refs.product_protein.value;
        var product_carb = this.refs.product_carb.value;
        var product_fiber =  this.refs.product_fiber.value;
        var product_price = this.refs.product_price.value;
        var product_discount = this.refs.product_discount.value;
        var product_description = this.refs.product_description.value;
        var id_category = this.refs.category.value
    var data = {
        product_name, product_serving, product_calories,
        product_fat, product_protein, product_carb, product_fiber ,
        product_price , product_discount, product_description,id_category
    }
    if(product_name=="" || product_serving == "" ||  product_calories == ""  
        ||  product_fat == ""  ||  product_protein == "" || product_carb == "" 
        || product_fiber == ""  ||  product_price == ""  || product_discount == "" 
        || product_description == "" || id_category=="" || this.state.selecctedFile === null){
            swal('Tidak Boleh Kosong','Harap Di Isi Lengkap','warning')
    }else{
        var fd = new FormData()
        fd.append('image', this.state.selecctedFile, this.state.selecctedFile.name)    
        fd.append('data',JSON.stringify(data))
        Axios.post(urlAPI+'/addProduct', fd)
        .then ((res)=> {
            if(res.data.error){
                // this.setState({error : res.data.msg})
                alert(res.data.msg)
            }else{
                swal('ADDED','SUCCESS','success')
            }
        }) 
        .catch((err)=>{
            console.log(err)
        })
    }
   
}


printDataCategory=()=>{
    var data = this.state.iscategory.map((val)=>{
    return (
    <option value={val.id}>{val.product_category}</option>
    )
    })
    return data
}








render() {

        return(
                <div className='container'>
                <center><h1> ADD PRODUCT </h1></center>
                    <div className = 'row  justify-content-center'>
                        <div className = "col-md-6">
                            <div className="form-group row">
                                <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Product name </label>
                                <div className="col-md">
                                    <input type="text" className="form-control" ref='product_name' placeholder="Nama Product" />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="inputPassword3" className="col-sm-2 col-form-label"> Product Image</label>
                                <div className="col-md">
                                    <input style={{display : 'none'}} ref = 'input' type = 'file' onChange={this.onChangeHendler}/>   
                                    <input className = 'form-control btn-success' onClick={()=>this.refs.input.click()} type = 'button' value ={this.valueHandler()}  />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="inputPassword3" className="col-sm-2 col-form-label"> Serving </label>
                                <div className="col-md">
                                    <input type="number" className="form-control" ref='product_Serving'  placeholder="Serving" />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="inputPassword3" className="col-sm-2 col-form-label"> Calories</label>
                                <div className="col-md">
                                    <input type="number" className="form-control" ref='product_calories'  placeholder="Price" />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="inputPassword3" className="col-sm-2 col-form-label"> Fat</label>
                                <div className="col-md">
                                    <input type="number" className="form-control" ref='product_fat'  placeholder="Fat" />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="inputPassword3" className="col-sm-2 col-form-label"> Protein </label>
                                <div className="col-md">
                                    <input type="number" className="form-control" ref='product_protein'  placeholder="protein" />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="inputPassword3" className="col-sm-2 col-form-label"> Carb </label>
                                <div className="col-md">
                                    <input type="number" className="form-control" ref='product_carb'  placeholder="Carb" />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="inputPassword3" className="col-sm-2 col-form-label"> Fiber </label>
                                <div className="col-md">
                                    <input type="number" className="form-control" ref='product_fiber'  placeholder="Fiber" />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="inputPassword3" className="col-sm-2 col-form-label"> Price</label>
                                <div className="col-md">
                                    <input type="number" className="form-control" ref='product_price'  placeholder="Harga" />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Discount</label>
                                <div className="col-md">
                                    <input type="number" className="form-control" ref = 'product_discount'  placeholder="Discount"/>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Catagory</label>
                                <div className="col-md">
                                    <select className='form-control form-control-sm' ref='category'>
                                    {this.printDataCategory()}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Deskripsi</label>
                                <div className="col-md">
                                    <textarea className="form-control" id="exampleFormControlTextarea1" ref='product_description' rows={3} defaultValue={""} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <div className="col-md">
                                    <input className="btn btn-info form-control"  type = 'button' onClick={this.addData} value ="ADD"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        )
    }
}
export default Addproduct