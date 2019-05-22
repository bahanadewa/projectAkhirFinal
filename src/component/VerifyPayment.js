import React from 'react'
import Axios from 'axios'
import {urlAPI} from '../support/url-API'
import swal from 'sweetalert'
import cookie from 'universal-cookie'

var objcookie = new cookie
var username = objcookie.get('memory-cookie')

class VerifyPayment extends React.Component{

state={selecctedFile : null, history : [], user : []}

componentDidMount=()=>{
    this.getdatahistory()
}

getdatahistory=()=>{
    Axios.get(urlAPI+'/authVerify/getdatahistory?username='+username)
    .then((res)=>{
        this.setState({history : res.data})
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

addData = ()=>{
        var id = this.refs.List.value
        if(this.state.selecctedFile && id >0){
            var fd = new FormData()
            fd.append('payment_verification', this.state.selecctedFile, this.state.selecctedFile.name)  
            Axios.put(urlAPI+'/authVerify/payment-verified?username='+username+"&id="+id, fd)

                .then ((res)=> {
                    if(res.data.error){
                        // this.setState({error : res.data.msg})
                        alert(res.data.msg)
                        
                    }else{
                        swal('Menunggu persetujuan',' UPLOAD SUCCESS','success')
                        this.getdatahistory()
                    }
                }) 
                .catch((err)=>{
                    console.log(err)
                })
        }else{
            swal('Pilih bukti dan tanggal orderan','','warning')
        }
 
        
}

printDataList=()=>{
    var data = this.state.history.map((val)=>{
    return (
    <option value={val.id}>{val.invoice_number} | {val.date} |  {val.status}</option>
    )
    })
    return data
}






    render(){
        return(
            <div style={{height:"700px", width:"100%"}}>
                <div className="row justify-content-center">
                    <div className="col-md-5">  
                            <div className="col-md mt-2">
                                <input style={{display : 'none'}} ref = 'input' type = 'file' onChange={this.onChangeHendler}/>   
                                <input className = 'form-control btn-success' onClick={()=>this.refs.input.click()} type = 'button' value ={this.valueHandler()}  />
                            </div>
                            <div className="col-md mt-2">
                                        <select className='form-control form-control-sm' ref='List'>
                                        <option value="0"> Your Order List </option>
                                        {this.printDataList()}
                                        </select>
                            </div>
                    </div>
                </div>
                <div className="row justify-content-center">
                         <center><input className="btn btn-info mt-2"  type = 'button' onClick={this.addData} value ="Upload"/></center>
                </div>
                

            </div>
        )
    }
}

export default VerifyPayment