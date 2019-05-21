import React from 'react'
import Axios from 'axios'
import {urlAPI} from '../support/url-API'
import swal from 'sweetalert'

class Category extends React.Component{
    state = {getdatacategory : [], addpopup : false, aditpopup:false, editCategory:[], searchData:''}
    componentDidMount (){
        this.getCategory()
    }

    getCategory = () => {
        Axios.get(urlAPI+'/authCategory/getallcategory')
        .then((res)=>{
            this.setState({getdatacategory : res.data, searchData:''})
        })
    }

    saveCategory = () => {
        var product_category = this.refs.category.value
        var newData = {product_category}
        Axios.post(urlAPI + '/authCategory/addCategory', newData)
        .then((res)=>{
            if(typeof(res.data)==="string"){
                swal('Category Have Been Taken','Try Again','error')
            }else{
                swal('Category Added','Success','success')
                this.setState({getdatacategory: res.data,addpopup:false})
            }
        
            })
        .catch((err)=>console.log(err))
    }
    
    deleteCategory=(id)=>{
        Axios.delete(urlAPI+'/authCategory/deleteCategory/'+id)
        .then((res)=>{
            swal('Delete Success','Success','success')
          // this.getItem()
            this.setState({getdatacategory:res.data})
          // this.refs.todo.value=''
        })
        .catch((err)=>console.log(err))
        
    }

    saveBtnEdit = (id) => {
        var product_category = ''
        if(this.refs.categoryEdit.value === ""){
            this.cancelBtn()
        }else{
            product_category = this.refs.categoryEdit.value
            var newData = {product_category}
            Axios.put(urlAPI+'/authCategory/updateCategory/'+id,newData)
            .then((res)=>{
                if(typeof(res.data)==="string"){
                    alert(res.data)
                }else{
                    swal('Update Category Success','Success','success')
                    this.setState({getdatacategory: res.data, aditpopup:false})
                }
            
                })
            .catch((err)=>console.log(err))
        }
    }


    cancelCategory=()=>{
        this.setState({addpopup:false})
    }

    editCategory = (id) => {
        this.setState({aditpopup:true, editCategory :id})
    }

    cancelBtn=()=>{
        this.setState({aditpopup:false})
    }

    getdatasearch=()=>{
        var input = this.refs.searchbyname.value
        this.setState({searchData : input})
      }

    

    renderCategory = () => {
        var arrSearchandFilter = this.state.getdatacategory.filter((val)=>{
            return val.product_category.toLowerCase().startsWith(this.state.searchData)
        })

        var data = arrSearchandFilter.map((val,index)=>{
            if(this.state.aditpopup === true && this.state.editCategory === val.id){
                return(
                    <tr>
                        <td>{index+1}</td>
                        <td><input placeholder={val.product_category} ref='categoryEdit'/></td>
                        <td><input type='button' className='btn btn-primary' value='SAVE'onClick={()=>this.saveBtnEdit(val.id)}/></td>
                        <td><input type='button' className='btn btn-danger' value='CANCEL' onClick={this.cancelBtn}/></td>                    
                    </tr>
                )
            }
            return(
                <tr>
                    <td>{index+1}</td>
                    <td>{val.product_category}</td>
                    <td><input type='button' className='btn btn-primary' value='Edit' onClick={()=>this.editCategory(val.id)}/></td>
                    <td><input type='button' className='btn btn-danger' value='Delete' onClick={()=>this.deleteCategory(val.id)}/></td>
                </tr>
            )
        })
        return data
    }

    render(){
        return(
            <div className="container">
                <h3 className = 'container' style={{marginLeft : '40%'}}>MANAGE CATEGORY</h3>
                <div className = 'container'>
                
                <div className="row">
                    <div className="col-md-4">
                        <input type='text' placeholder='SEARCH' ref="searchbyname" style={{marginBottom:'10px'}} className='form-control' onChange={this.getdatasearch}/>
                    </div>
                    <div className="col-md-3">
                    <input type='button' value='ADD CATEGORY' style={{marginBottom:'10px'}} className='btn btn-primary ' onClick={()=>this.setState({addpopup:true})}/>
                    </div>
                </div>

                        {
                            this.state.addpopup===true?
                            <div className='row'>
                            <div className='col-md-4'>
                                <input type='text' className='form-control' ref='category' placeholder='Add new category'/>
                            </div>
                            <div className='col-md-3'>
                                <input type='button' className='btn btn-primary' value='Save' onClick={this.saveCategory}/>
                                <input type='button' className='btn btn-danger' value='Cancel' onClick={this.cancelCategory}/>
                            </div>
                            </div>
                            : null
                        }
                        <table className='table'>
                            <thead>
                                <th>NO</th>
                                <th>CATEGORY</th>
                                <th>EDIT</th>
                                <th>DELETE</th>
                            </thead>
                            <tbody>
                                {this.renderCategory()}
                            </tbody>
                        </table>
                </div>
            </div>
        )
    }

}
export default Category