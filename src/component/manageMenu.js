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
import { Link } from 'react-router-dom';
import Axios from 'axios';
import { urlAPI } from '../support/url-API';
import {Button,Icon,Input,Label} from 'semantic-ui-react';
import swal from "sweetalert";
import {connect} from 'react-redux'
import PageNotFound from './404'
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

class CustomPaginationActionsTable extends React.Component {
  state = {
    rows: [],
    page: 0,
    rowsPerPage: 5,
    isEdit : false,
    editItem : {},
    searchDataname : "",
    searchDatakategory : "",
  };

  componentDidMount(){
        this.getDataApi()
  }

  getDataApi = () =>{
        Axios.get(urlAPI+'/getallproduct')
        .then ((res)=> this.setState({rows : res.data,searchDataname : "",searchDatakategory :""}))
        .catch((err)=> console.log(err))
  }

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  onBtnDelete = (id)=>{
        Axios.delete(urlAPI+'/product-menu/'+id)
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
    var name = this.name.inputRef.value ===""? this.state.editItem.name: this.nameEDIT.inputRef.value ;
    var img = this.img.inputRef.value ===""? this.state.editItem.img: this.imgEDIT.inputRef.value ;
    var serving = parseInt (this.serving.inputRef.value) ===""? this.state.editItem.serving: this.servingEDIT.inputRef.value ;
    var calories = parseInt (this.calories.inputRef.value ) ===""? this.state.editItem.calories: this.caloriesEDIT.inputRef.value ;
    var fat = parseInt (this.fat.inputRef.value ) ===""? this.state.editItem.fat: this.fatEDIT.inputRef.value ;
    var protein = parseInt ( this.protein.inputRef.value) ===""? this.state.editItem.protein: this.proteinEDIT.inputRef.value ;
    var carb =parseInt  (this.carb.inputRef.value ) ===""? this.state.editItem.carb: this.carbEDIT.inputRef.value ;
    var fiber =parseInt  (this.fiber.inputRef.value ) ===""? this.state.editItem.fiber: this.fiberEDIT.inputRef.value ;
    var category = this.category.inputRef.value ===""? this.state.editItem.category: this.categoryEDIT.inputRef.value ;
    var price =parseInt  (this.price.inputRef.value ) ===""? this.state.editItem.prive: this.priceEDIT.inputRef.value ;
    var discount =parseInt  (this.discount.inputRef.value ) ===""? this.state.editItem.discount: this.discountEDIT.inputRef.value ;

    var newData={name , img, serving,calories,fat,protein,carb,fiber,category,price,discount}

    Axios.put(urlAPI+'/product-menu/'+this.state.editItem.id, newData)
    .then((res) =>{
        this.getDataApi()
        swal('edit status','edit product success','success')
        this.setState({isEdit:false, editItem: {}})
    })
    .catch ((err) => {console.log(err)})
  }

  getdatasearch=()=>{
    var inputname = this.refs.searchbyname.value
    var inputcategory = this.refs.searchbycategory.value
    this.setState({searchDataname : inputname,searchDatakategory :inputcategory})
  }


  renderJsx =()=>{
      var arrSearchandFilter = this.state.rows.filter((val)=>{
          return val.product_name.toLowerCase().startsWith(this.state.searchDataname) && val.product_category.toLowerCase().startsWith(this.state.searchDatakategory)
      })
      var jsx = arrSearchandFilter.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((val)=>{
          return(
            <TableRow key = {val.id}>
                <TableCell component="th" scope="row">
                    {val.id}
                </TableCell>
                <TableCell align="">{val.product_name}</TableCell>
                <TableCell align=""><img src={urlAPI+"/"+val.product_img} width="50px"/></TableCell>
                <TableCell align="">{val.product_serving}</TableCell>
                <TableCell align="">{val.product_calories}</TableCell>
                <TableCell align="">{val.product_fat}</TableCell>
                <TableCell align="">{val.product_protein}</TableCell>
                <TableCell align="">{val.product_carb}</TableCell>
                <TableCell align="">{val.product_fiber}</TableCell>
                <TableCell align="">{val.product_category}</TableCell>
                <TableCell align="">{val.product_price}</TableCell>
                <TableCell align="">{val.product_discount}</TableCell>
                
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
    var {name, img, serving,calories,fat,protein,carb,fiber,category,price,discount} = this.state.editItem
    if (this.props.role === "admin")
    {
    return (
        <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <input type='text' placeholder='SEARCH BY NAME' ref="searchbyname" style={{marginBottom:'10px'}} className='form-control' onChange={this.getdatasearch}/>
                    </div>
                    <div className="col-md-6">
                        <input type='text' placeholder='SEARCH BY CATEGORY' ref="searchbycategory" style={{marginBottom:'10px'}} className='form-control' onChange={this.getdatasearch}/>
                    </div>
                </div>
                <Paper className={classes.root}>
                    <div className={classes.tableWrapper}>
                      
                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{fontSize :'16px',fontWeight:"600px"}}>ID</TableCell>
                                    <TableCell style={{fontSize :'16px',fontWeight:"600px"}}>NAME</TableCell>
                                    <TableCell style={{fontSize :'16px',fontWeight:"600px"}}>IMG</TableCell>
                                    <TableCell style={{fontSize :'16px',fontWeight:"600px"}}>SERVING</TableCell>
                                    <TableCell style={{fontSize :'16px',fontWeight:"600px"}}>CALORIES</TableCell>
                                    <TableCell style={{fontSize :'16px',fontWeight:"600px"}}>FAT</TableCell>
                                    <TableCell style={{fontSize :'16px',fontWeight:"600px"}}>PROTEIN</TableCell>
                                    <TableCell style={{fontSize :'16px',fontWeight:"600px"}}>CARB</TableCell>
                                    <TableCell style={{fontSize :'16px',fontWeight:"600px"}}>FIBER</TableCell>
                                    <TableCell style={{fontSize :'16px',fontWeight:"600px"}}>CATEGORY</TableCell>
                                    <TableCell style={{fontSize :'16px',fontWeight:"600px"}}>PRICE</TableCell>
                                    <TableCell style={{fontSize :'16px',fontWeight:"600px"}}>DISCOUNT</TableCell>
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
              
                <div className="mt-5">
                  <center><a href="/add-product" class="btn btn-info" role="button">ADD PRODUCT</a></center>
                    
                </div>
             
                
                {/* ========================================== EDIT PRODUCT SECTION ================================================== */}
                {
                  this.state.isEdit === true ?
                  <Paper className="mt-5">
                      <Table>
                          <TableHead>
                              <TableRow>
                              <TableCell style={{fontSize :'24px',fontWeight:"600px"}}>EDIT PRODUCT{" ( "+name+" )"}</TableCell>
                              </TableRow>

                              <TableBody>
                                  <TableRow>
                                      <TableCell>

                                        <Input ref={input => this.nameEDIT=input} placeholder="input product name" className="mt-2 ml-2 mb-2" />
                                        <Input ref={input => this.imgEDIT=input} placeholder="Img" className="mt-2 ml-2 mb-2" />
                                        <Input ref={input => this.servingEDIT=input} placeholder="serving" className="mt-2 ml-2 mb-2" />
                                        <Input ref={input => this.caloriesEDIT=input} placeholder="calories" className="mt-2 ml-2 mb-2" />
                                        <Input ref={input => this.fatEDIT=input} placeholder="fat" className="mt-2 ml-2 mb-2" />
                                        <Input ref={input => this.proteinEDIT=input} placeholder="protein" className="mt-2 ml-2 mb-2" />
                                        <Input ref={input => this.carbEDIT=input} placeholder="carb" className="mt-2 ml-2 mb-2" />
                                        <Input ref={input => this.fiberEDIT=input} placeholder="fiber" className="mt-2 ml-2 mb-2" />
                                        <Input ref={input => this.categoryEDIT=input} placeholder="category" className="mt-2 ml-2 mb-2" />
                                        <Input ref={input => this.priceEDIT=input} className="ml-2" labelPosition='right' type='text' placeholder='Amount'>
                                            <Label basic> Rp </Label>
                                            <input />
                                            <Label>.00</Label>
                                        </Input>
                                        <Input ref={input => this.discountEDIT=input} placeholder="discount" className="mt-2 ml-2 mb-2" />



                                          <Button onClick={this.btnSAVE} animated color="teal" className="mt-2 ml-2 mb-2" >
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
    role : state.user.role
  }
}


export default connect(mapStateToProps) (withStyles(styles)(CustomPaginationActionsTable));