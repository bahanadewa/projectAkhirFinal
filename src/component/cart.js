import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
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
import Axios from 'axios';
import { urlAPI } from '../support/url-API';
import {Button,Icon,Input,Label} from 'semantic-ui-react';
import swal from "sweetalert";
import {connect} from 'react-redux'
import PageNotFound from './404'
import cookie from 'universal-cookie'
// import PageNotFound from '../pageNotFound'


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
    isEdit : false,
    editItem : {}
  };

  componentDidMount(){
        this.getDataApi()
  }

  getDataApi = () =>{
        var getcookie = objcookie.get('memory-cookie')
        Axios.get(urlAPI+'/cart?product_idUser'+this.props.id)
        .then ((res)=> this.setState({rows : res.data}))
        .catch((err)=> console.log(err))
  }

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  onBtnDelete = (id)=>{
        Axios.delete(urlAPI+'/cart/'+id)
        .then((res)=>{
            this.getDataApi()
        })
        .catch((err)=> console.log(err))
  }


  btnEDIT = (param) =>{
      this.setState({isEdit:true, editItem : param})
  }

  btnCANCEL = (param) =>{
    this.setState({isEdit:false , editItem:param})
    
  }

  BtnSave = ()=>{
      
      var product_name = this.state.editItem.product_name
      var product_img = this.state.editItem.product_img
      var product_category = this.state.editItem.product_category
      var product_quantity = this.quantityEdit.inputRef.value === ""? this.state.editItem.product_quantity : this.quantityEdit.inputRef.value
      var product_price = this.state.editItem.product_price
     
     var newData = {product_name,product_img,product_category,product_quantity,product_price}

    Axios.put(urlAPI+'/cart/'+this.state.editItem.id, newData)
    .then((res) =>{
        this.getDataApi()
        swal('edit status','edit product success','success')
        this.setState({isEdit:false, editItem: {}})
    })
    .catch ((err) => {console.log(err)})
  }


  renderJsx =()=>{
      var jsx = this.state.rows.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((val)=>{
          return(
            <TableRow key = {val.id}>
                <TableCell component="th" scope="row">
                    {val.id}
                </TableCell>
                <TableCell align="">{val.product_name}</TableCell>
                <TableCell align=""><img src={val.product_img} width="50px"/></TableCell>
                <TableCell align="">{val.product_category}</TableCell>
                <TableCell align="">{val.product_price}</TableCell>
                <TableCell align="">{val.product_quantity}</TableCell>
                <TableCell align="">{val.product_price * val.product_quantity}</TableCell>
                
                
                <TableCell>
                        <Button onClick={()=>this.btnEDIT(val)} animated color="teal">
                            <Button.Content visible>Edit</Button.Content>
                            <Button.Content hidden>
                                <Icon name='edit' />
                            </Button.Content>
                        </Button>

                        <Button animated color="red" onClick={()=>this.onBtnDelete(val.id)}>
                            <Button.Content visible>Delete</Button.Content>
                            <Button.Content hidden>
                                <Icon name='delete' />
                            </Button.Content>
                        </Button>
                </TableCell>
            </TableRow>
          )
      })
      return jsx
    }; 

  handleChangeRowsPerPage = event => {
    this.setState({ page: 0, rowsPerPage: event.target.value });
  };




  render() {
    const { classes } = this.props;
    const { rows, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
    var {product_quantity, img, serving,calories,fat,protein,carb,fiber,category,price,discount} = this.state.editItem
    if (this.props.role === "user" | this.props.role === "admin")
    {
    return (
        <div className="container">
                <Paper className={classes.root}>
                    <div className={classes.tableWrapper}>
                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{fontSize :'16px',fontWeight:"600px"}}>ID</TableCell>
                                    <TableCell style={{fontSize :'16px',fontWeight:"600px"}}>NAME</TableCell>
                                    <TableCell style={{fontSize :'16px',fontWeight:"600px"}}>IMG</TableCell>
                                    <TableCell style={{fontSize :'16px',fontWeight:"600px"}}>CATEGORY</TableCell>
                                    <TableCell style={{fontSize :'16px',fontWeight:"600px"}}>PRICE</TableCell>
                                    <TableCell style={{fontSize :'16px',fontWeight:"600px"}}>QUANTITIES</TableCell>
                                    <TableCell style={{fontSize :'16px',fontWeight:"600px"}}>TOTAL</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {this.renderJsx()}
                          
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 50 * emptyRows }}>
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
                {/* ========================================== EDIT PRODUCT SECTION ================================================== */}
                {
                  this.state.isEdit === true ?
                  <Paper className="mt-5">
                      <Table>
                          <TableHead>
                              <TableRow>
                              <TableCell style={{fontSize :'24px',fontWeight:"600px"}}>EDIT PRODUCT{" ( "+product_quantity+" )"}</TableCell>
                              </TableRow>

                              <TableBody>
                                  <TableRow>
                                      <TableCell>

                                      <Input ref={input => this.quantityEdit=input} placeholder={product_quantity} className="mt-2 ml-2 mb-2" />
                                                           


                                          <Button onClick={this.BtnSave} animated color="teal" className="mt-2 ml-2 mb-2" >
                                              <Button.Content visible>Save</Button.Content>
                                              <Button.Content hidden>
                                                  <Icon name='save' />
                                              </Button.Content>
                                          </Button>
                                          <Button onClick={this.btnCANCEL} animated color="red" className="mt-2 ml-2 mb-2" >
                                              <Button.Content visible>cancel</Button.Content>
                                              <Button.Content hidden>
                                                  <Icon name='cancel' />
                                              </Button.Content>
                                          </Button>
                                      </TableCell>
                                  </TableRow>
                              </TableBody>

                          </TableHead>  
                      </Table>
                  </Paper>
                  : null
                }
        </div>
    );

    } return <PageNotFound/>
  }
}

CustomPaginationActionsTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return{
    role : state.user.role,
    id : state.user.id
  }
}


export default connect(mapStateToProps) (withStyles(styles)(CustomPaginationActionsTable));