import React from 'react';
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
import { Link } from 'react-router-dom'
import Axios from 'axios';
import { urlAPI } from '../support/url-API';
import { TableHead } from '@material-ui/core';
import { cartCount} from '../1 action'
import PageNotFound from './404';
import cookie from 'universal-cookie'
import swal from 'sweetalert'
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
    rowsPerPage: 10,
    edit : -1,
    ManageTransaction : [],
    isDetail : false,
    searchh : "",
  };
  componentDidMount(){
      this.getData()
      this.getDataUrl()
  }


  getData = () => {
    Axios.get(urlAPI + '/authVerify/GetDataManageTransaction')
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

 
  TrasactionDetail=(id)=>{
    Axios.get(urlAPI +'/authVerify/GetDataManageTransactionbyID/'+id)
    .then((res) => {
        this.setState({ManageTransaction: res.data, isDetail:true})
    })
    .catch((err) => console.log(err))

  }

  renderManageTransaction = () => {
    var jsx = this.state.ManageTransaction.map((row,index) => {
      return(
        <TableRow key={index}>
          <TableCell>{index+1}</TableCell>
          <TableCell>
            {row.img_payment ?
            <div>
              <img style={{width:"300px", height:"300px"}} src={urlAPI+"/"+row.img_payment} className="card-img-top" alt="..." />
            </div>
            :
            <div>
              <img style={{width:"250px", height:"250px"}} src="https://cdn2.iconfinder.com/data/icons/new-year-s-hand-drawn-basic/64/question_mark-512.png" className="card-img-top" alt="..." />
            </div>   
            }
          </TableCell>
          <TableCell>{row.date}</TableCell>
          <TableCell>{formatMoney (row.total)}</TableCell>
          <TableCell>
              {row.img_payment?
                <div>
                  <input type='button' style={{borderRadius:"20px"}} className='btn btn-info' value='verify' onClick={()=>this.verify(row.id)} /> 
                  <input type='button' style={{borderRadius:"20px"}} className='btn btn-danger' value='decline' onClick={()=>this.decline(row.id)} /> 
                </div>
                :
                <div>
                  <input type='button' disabled style={{borderRadius:"20px"}} className='btn btn-info' value='verify'  /> 
                  <input type='button' disabled style={{borderRadius:"20px"}} className='btn btn-danger' value='decline'  /> 
                </div>
              }
               
          </TableCell>
        </TableRow>
      )
    })
    return jsx
  }

  verify=(id)=>{
    Axios.put(urlAPI+'/authVerify/VerifyDataManageTransaction/'+id) 
    .then((res)=>{
        swal('VERIFIED','SUCCESS','success')
        this.getData()
        console.log(res)
    })
    .catch((err)=>{
        console.log(err)
    })

  }

  decline=(id)=>{
    Axios.put(urlAPI+'/authVerify/RejectDataManageTransaction?id='+id+'&username='+this.props.username) 
    .then((res)=>{
        swal('DECLINE','SUCCESS','success')
        this.getData()
        console.log(res)
    })
    .catch((err)=>{
        console.log(err)
    })
  }

 getDataUrl=()=>{
    if(this.props.location.search){
      var Obj = queryString.parse(this.props.location.search)
      this.setState({searchh  : Obj.Managetransaction ? Obj.Managetransaction :""})
    }
}
  getDataSearch=()=>{
    var searchinput = this.refs.status.value
    this.setState({searchh : searchinput})
    this.pushurl()
  }

  pushurl=()=>{
    var newLink = `/Manage-transaction`
    newLink+='?' + 'Managetransaction'+'='+this.refs.status.value
    this.props.history.push(newLink)
  }

  renderFilter=()=>{
    const { rows, rowsPerPage, page } = this.state;

    if(this.state.searchh!==""){
            var filter = this.state.rows.filter((val)=>{
              return (val.status.includes(this.state.searchh)) 
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
            
                          <TableCell><input type='button' value='Detail' onClick={()=>this.TrasactionDetail(row.id)} className='btn btn-danger mr-2' style={{borderRadius:"20px"}}/></TableCell>
                      </TableRow>
                  )
              })
              return cetak
    }else if(this.state.searchh==""){
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
          
                        <TableCell><input type='button' value='Detail' onClick={()=>this.TrasactionDetail(row.id)} className='btn btn-danger mr-2' style={{borderRadius:"20px"}}/></TableCell>
                    </TableRow>
                )
            })
            return cetak
        }
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
                          <select defaultValue={this.state.searchh} class="form-control" ref="status" onChange={this.getDataSearch}>
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
                                      <TableCell style={{fontSize:'20px', fontWeight:'500'}}>NO</TableCell>
                                      <TableCell style={{fontSize:'20px', fontWeight:'500'}}>USERNAME</TableCell>
                                      <TableCell style={{fontSize:'20px', fontWeight:'500'}}>TOTAL</TableCell>
                                      <TableCell style={{fontSize:'20px', fontWeight:'500'}}>DATE</TableCell>
                                      <TableCell style={{fontSize:'20px', fontWeight:'500'}}> INVOICE </TableCell>
                                      <TableCell style={{fontSize:'20px', fontWeight:'500'}}> STATUS</TableCell>
                                      <TableCell style={{fontSize:'20px', fontWeight:'500'}}> ACTION </TableCell>
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
                                  rowsPerPageOptions={[10, 20, 30]}
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

            { this.state.isDetail ? <Paper className='mt-3'>
              <Table>
                <TableHead>
                <TableRow>
                    <TableCell style={{fontSize:'23px', fontWeight:'500'}}>NO</TableCell>
                    <TableCell style={{fontSize:'23px', fontWeight:'500'}}>TRANSACTION IMG</TableCell>
                    <TableCell style={{fontSize:'23px', fontWeight:'500'}}>DATE</TableCell>
                    <TableCell style={{fontSize:'23px', fontWeight:'500'}}>TOTAL ITEM</TableCell>
                    <TableCell style={{fontSize:'23px', fontWeight:'500'}}>ACTION</TableCell>
                </TableRow>                
                </TableHead>
                <TableBody>
                        {this.renderManageTransaction()}

                </TableBody>
                <TableFooter>
                        <TableRow>
                          <TableCell> <input type='button' className='btn btn-primary' value='close' style={{borderRadius:"20px"}} onClick={()=> this.setState({isDetail:false, historyDetail:[]})} /> </TableCell>
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

export default connect(mapStateToProps,{cartCount})(withStyles(styles)(CustomPaginationActionsTable));