import React from 'react';
import {withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import { connect} from 'react-redux'
import Axios from 'axios';
import { urlAPI } from '../support/url-API';
import { TableHead } from '@material-ui/core';
import { cartCount} from '../1 action'
import PageNotFound from './404';
import cookie from 'universal-cookie'
import swal from 'sweetalert'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import queryString from 'query-string'

function formatMoney(number) {
    return number.toLocaleString('in-RP', { style: 'currency', currency: 'IDR' });
}

const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5,
  },
});

class TablePaginationActions extends React.Component {
  handleFirstPageButtonClick = event => {
    this.props.onChangePage(event, 0);
  };

  handleBackButtonClick = event => {
    this.props.onChangePage(event, this.props.page - 1);
  };

  handleNextButtonClick = event => {
    this.props.onChangePage(event, this.props.page + 1);
  };

  handleLastPageButtonClick = event => {
    this.props.onChangePage(
      event,
      Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1),
    );
  };

  render() {
    const { classes, count, page, rowsPerPage, theme } = this.props;

    return (
      <div className={classes.root}>
        <IconButton
          onClick={this.handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="First Page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={this.handleBackButtonClick}
          disabled={page === 0}
          aria-label="Previous Page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={this.handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Next Page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={this.handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Last Page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </div>
    );
  }
}

TablePaginationActions.propTypes = {
  classes: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired,
};

const TablePaginationActionsWrapped = withStyles(actionsStyles, { withTheme: true })(
  TablePaginationActions,
);


const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 500,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});


var objcookie = new cookie
class CustomPaginationActionsTable extends React.Component {
  state = {
    rows: [],
    page: 0,
    rowsPerPage: 5,
    edit : -1,
    historyDetail : [],
    isDetail : false,
    selecctedFile : null,
    isEdit : false,
    modaldata : {},
    search : ""
  };
  componentDidMount(){
      this.getData()
      this.getDataUrl()
  }

  getData = () => {
    var getcookie = objcookie.get('memory-cookie')
    Axios.get(urlAPI + '/authCheckout/showhistory?username=' +getcookie)
    .then((res) => {
        this.setState({rows : res.data})
    })
    .catch((err) => console.log(err))
  }

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ page: 0, rowsPerPage: event.target.value });
  };


  historyDetail=(id)=>{
    Axios.get(urlAPI +'/authCheckout/showhistorydetail/'+id)
    .then((res) => {
        this.setState({historyDetail: res.data,isDetail:true})
    })
    .catch((err) => console.log(err))

  }

  renderHistoryDetail = () => {
    var jsx = this.state.historyDetail.map((row,index) => {
      return(
        <TableRow key={index}>
          <TableCell>{index+1}</TableCell>
          <TableCell>
              <img style={{width:"50px", height:"50px"}} src={urlAPI+"/"+row.product_img} className="card-img-top" alt="..." />  
          </TableCell>
          <TableCell>
              {row.product_name}
          </TableCell>
          <TableCell>{row.quantity}</TableCell>
          <TableCell>{formatMoney(row.total)} </TableCell>
        </TableRow>
      )
    })
    return jsx
  }



  onChangeHendler = (event) => {
    this.setState({selecctedFile : event.target.files[0]})
  }
  valueHandler = () => {
      var value = this.state.selecctedFile ? this.state.selecctedFile.name : 'Pick a Picture'
      return value
  }

  modal =(row)=>{
    this.setState({isEdit:true, modaldata : row})
  }


  addData = ()=>{
    var username = this.state.modaldata.username
    var id = this.state.modaldata.id
    if(this.state.selecctedFile){
        var fd = new FormData()
        fd.append('payment_verification', this.state.selecctedFile, this.state.selecctedFile.name)  
        Axios.put(urlAPI+'/authVerify/payment-verified?username='+username+"&id="+id, fd)

            .then ((res)=> {
                if(res.data.error){
                    alert(res.data.msg)
                }else{
                    swal('Menunggu persetujuan',' UPLOAD SUCCESS','success')
                    this.setState({isEdit : false})
                    this.getData()
                }
            }) 
            .catch((err)=>{
                console.log(err)
            })
    }else{
        swal('Pilih Bukti Pembayaran','','warning')
    }     
}

  renderFilter=()=>{
    const { rows, rowsPerPage, page } = this.state;

    if(this.state.search!==""){
            var filter = this.state.rows.filter((val)=>{
              return (val.status.includes(this.state.search)) 
            })
        
            var cetak =  filter.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row,index) => {
              return (
                    <TableRow key={row.id}>
                            <TableCell>{index+1}</TableCell>
                            <TableCell>
                                {row.username}
                            </TableCell>
                            <TableCell>{formatMoney (row.total)}</TableCell>
                            <TableCell>{row.date} </TableCell>
                            <TableCell>{row.invoice_number} </TableCell>
                            <TableCell>{row.status} </TableCell>
                            <TableCell>
                                <div>
                                    <input type='button' value='Upload File' onClick={()=>this.modal(row)} style={{backgroundColor:"#ba719b",width:"80px", height:"35px" ,borderRadius:"20px", border:"solid transparent"}}/>  
                                </div>
                            </TableCell>

                            <TableCell><input type='button' value='Detail' onClick={()=>this.historyDetail(row.id)} style={{backgroundColor:"#71baaa",width:"80px", height:"35px" ,borderRadius:"20px", border:"solid transparent"}}/></TableCell>
                    </TableRow>
                  )
              })
              return cetak
    }else if(this.state.search==""){
          var cetak =  rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row,index) => {
            return (
              <TableRow key={row.id}>
                        <TableCell>{index+1}</TableCell>
                        <TableCell>
                            {row.username}
                        </TableCell>
                        <TableCell>{formatMoney (row.total)}</TableCell>
                        <TableCell>{row.date} </TableCell>
                        <TableCell>{row.invoice_number} </TableCell>
                        <TableCell>{row.status} </TableCell>
                        <TableCell>
                            <div>
                                <input type='button' value='Upload File' onClick={()=>this.modal(row)} style={{backgroundColor:"#ba719b",width:"80px", height:"35px" ,borderRadius:"20px", border:"solid transparent"}}/>  
                            </div>
                        </TableCell>

                        <TableCell><input type='button' value='Detail' onClick={()=>this.historyDetail(row.id)} style={{backgroundColor:"#71baaa",width:"80px", height:"35px" ,borderRadius:"20px", border:"solid transparent"}}/></TableCell>
              </TableRow>
                )
            })
            return cetak
        }
  }


  getDataUrl=()=>{
    if(this.props.location.search){
      var Obj = queryString.parse(this.props.location.search)
      this.setState({search  : Obj.transactionhistory ? Obj.transactionhistory :""})
    }
  }
  
  getDataSearch=()=>{
    var searchinput = this.refs.status.value
    this.setState({search : searchinput})
    this.pushurl()
  }

  pushurl=()=>{
    var newLink = `/transaction-history`
    newLink+='?' + 'transactionhistory'+'='+this.refs.status.value
    this.props.history.push(newLink)
  }



// ================================================== RENDER ===========================================

  render() {
    const { classes } = this.props;
    const { rows, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
    if(this.props.username){
    return (
        <div className='container'>
              <div style={{width:"300px", marginTop:"10px"}}>
                  <Paper>
                        <select defaultValue={this.state.search} class="form-control" ref="status" onChange={this.getDataSearch}>
                                <option value=""> SEMUA </option>
                                <option value="BELUM BAYAR"> BELUM BAYAR </option>
                                <option value="DIPROSES"> DIPROSES </option>
                                <option value="DISETUJUI"> DISETUJUI </option>
                                <option value="DITOLAK"> DITOLAK </option>
                        </select>
                  </Paper>
              </div>
            <Paper className={classes.root}>
                <div className={classes.tableWrapper}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{fontSize:'24px', fontWeight:'600'}}>NO</TableCell>
                            <TableCell style={{fontSize:'24px', fontWeight:'600'}}>USERNAME</TableCell>
                            <TableCell style={{fontSize:'24px', fontWeight:'600'}}>TOTAL</TableCell>
                            <TableCell style={{fontSize:'24px', fontWeight:'600'}}>DATE</TableCell>
                            <TableCell style={{fontSize:'24px', fontWeight:'600'}}> INVOICE </TableCell>
                            <TableCell style={{fontSize:'24px', fontWeight:'600'}}> STATUS</TableCell>
                            <TableCell style={{fontSize:'24px', fontWeight:'600'}}>UPLOAD</TableCell>
                            <TableCell style={{fontSize:'24px', fontWeight:'600'}}></TableCell>
                            <TableCell style={{fontSize:'24px', fontWeight:'600'}}></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>

                    {
                        this.renderFilter()
                    }


                    {emptyRows > 0 && (
                        <TableRow style={{ height: 48 * emptyRows }}>
                        <TableCell colSpan={6} />
                        </TableRow>
                    )}
                    </TableBody>
                    <TableFooter>
                    <TableRow>
                        <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        colSpan={3}
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        SelectProps={{
                            native: true,
                        }}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                        ActionsComponent={TablePaginationActionsWrapped}
                        />
                    </TableRow>
                    </TableFooter>
                </Table>
                </div>
            </Paper>



{/* ============================================== MODAL UPLOAD ============================================== */}
            <Modal isOpen={this.state.isEdit} toggle={()=>this.setState({isEdit: false})} className={this.props.className}>
                <ModalHeader toggle={()=>this.setState({isEdit: false})}>UPLOAD YOUR PROOF OF PAYMENT </ModalHeader>

                <ModalBody>
                            <div>
                                <input style={{display : 'none'}} ref = 'input' type = 'file' onChange={this.onChangeHendler}/>   
                                <input className = 'form-control btn-success' onClick={()=>this.refs.input.click()} type = 'button' value ={this.valueHandler()}  />
                            </div>
                </ModalBody>

                <ModalFooter>
                            <div>
                                <input type= 'button' onClick={()=>this.addData()} value ="Upload" style={{backgroundColor:"#ba719b",width:"80px", height:"35px" ,borderRadius:"20px", border:"solid transparent",margin:"10px"}} />
                                <input  type = 'button' onClick={()=>this.setState({isEdit: false,selecctedFile:null})} value ="Cancel" style={{backgroundColor:"red",width:"80px", height:"35px" ,borderRadius:"20px", border:"solid transparent",margin:"10px"}}/>
                            </div>
                </ModalFooter>
              </Modal>






{/* ============================================== DETAIL HISTORY ============================================== */}

            { this.state.isDetail ? <Paper className='mt-3'>
              <Table>
                <TableHead>
                <TableRow>
                    <TableCell style={{fontSize:'24px', fontWeight:'600'}}>NO</TableCell>
                    <TableCell style={{fontSize:'24px', fontWeight:'600'}}>PRODUCT IMG</TableCell>
                    <TableCell style={{fontSize:'24px', fontWeight:'600'}}>PRODUCT NAME</TableCell>
                    <TableCell style={{fontSize:'24px', fontWeight:'600'}}>QUANTITIES</TableCell>
                    <TableCell style={{fontSize:'24px', fontWeight:'600'}}>TOTAL</TableCell>
                </TableRow>                
                </TableHead>
                <TableBody>
                        {this.renderHistoryDetail()}

                </TableBody>
                <TableFooter>
                        <TableRow>
                          <TableCell> <input type='button' className='btn btn-primary' value='close' onClick={()=> this.setState({isDetail:false, historyDetail:[]})} /> </TableCell>
                        </TableRow>
                </TableFooter>      
              </Table>
            </Paper> : null}
        </div>
    );
  } return <PageNotFound />
  }
}

CustomPaginationActionsTable.propTypes = {
  classes: PropTypes.object.isRequired,
};





const mapStateToProps = (state) => {
    return {
        id : state.user.id,
        username : state.user.user_name,
        cart : state.cart.count
    }
}

export default withRouter (connect(mapStateToProps,{cartCount})(withStyles(styles)(CustomPaginationActionsTable)));