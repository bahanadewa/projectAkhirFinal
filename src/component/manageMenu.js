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
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Axios from 'axios';
import { urlAPI } from '../support/url-API';
import {Button,Icon,Input,Label} from 'semantic-ui-react';
import swal from "sweetalert";
import {connect} from 'react-redux'
import PageNotFound from './404'
import queryString from 'query-string'
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
    getdatacategory:[],
    page: 0,
    rowsPerPage: 5,
    isEdit : false,
    editItem : {},
    searchDataname : "",
    searchDatakategory : "",
    selecctedFile : null
  };

  componentDidMount(){
        this.getDataApi()
        this.getDataCategory()
        this.getDataUrl()
  }

  getDataApi = () =>{
        Axios.get(urlAPI+'/getallproduct')
        .then ((res)=> this.setState({rows : res.data }))
        .catch((err)=> console.log(err))
  }

  getDataUrl=()=>{
    // console.log(this.props.location.search)
    // console.log(queryString.parse(this.props.location.search))
    if(this.props.location.search){
      var Obj = queryString.parse(this.props.location.search)
      this.setState({searchDataname : Obj.product ? Obj.product : '',  searchDatakategory: Obj.category ? Obj.category : ""})
    }
  }

  getDataCategory = ()=>{
        Axios.get(urlAPI+'/getallcategory')
        .then((res)=>{
          this.setState({getdatacategory : res.data})
        })    
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
    this.setState({searchDataname : inputname})
    this.pushurl()
  }

  pushurl=()=>{
    var newLink = `/manage-menu`
    var params = []

    if(this.refs.searchbyname.value){
      params.push({
        params :'product' ,
        value : this.refs.searchbyname.value
      })
    }
    for(var i =0; i< params.length; i++){
      if(i===0){
        newLink+='?' + params[i].params+'='+params[i].value
      }else{
        newLink += '&' + params[i].params+'='+params[i].value
      }
    }
    this.props.history.push(newLink)

}


  renderOptionCatrgory =()=>{
        var data = this.state.getdatacategory.map((val)=>{
            return (
            <option value={val.id}>{val.product_category}</option>
            )
        })
        return data
}

  onSaveBtnEdit=()=>{
        var product_name = this.refs.product_name.value ? this.refs.product_name.value : this.state.editItem.product_name ;
        var product_serving = this.refs.product_serving.value ? this.refs.product_serving.value  : this.state.editItem.product_serving ;
        var product_calories = this.refs.product_calories.value? this.refs.product_calories.value : this.state.editItem.product_calories ;
        var product_fat = this.refs.product_fat .value? this.refs.product_fat .value : this.state.editItem.product_fat ;
        var product_protein = this.refs.product_protein.value? this.refs.product_protein.value : this.state.editItem.product_protein ;
        var product_carb = this.refs.product_carb.value? this.refs.product_carb.value : this.state.editItem.product_carb ;
        var product_fiber =  this.refs.product_fiber.value? this.refs.product_fiber.value : this.state.editItem.product_fiber ;
        var product_price = this.refs.product_price.value? this.refs.product_price.value : this.state.editItem.product_price ;
        var product_discount = this.refs.product_discount.value? this.refs.product_discount.value : this.state.editItem.product_discount ;
        var product_description = this.refs.product_description.value? this.refs.product_description.value : this.state.editItem.product_description ;


    var data = {
        product_name, product_serving, product_calories,
        product_fat, product_protein, product_carb, product_fiber ,
        product_price , product_discount, product_description
    }
     var product_category = this.refs.product_category.value
     
    if(this.state.selecctedFile){
      var fd = new FormData()
      fd.append('edit', this.state.selecctedFile, this.state.selecctedFile.name)    
      fd.append('data',JSON.stringify(data))

      fd.append('imageBefore', this.state.editItem.product_img)

      Axios.put(urlAPI+'/editProduct/'+this.state.editItem.id, fd)
            .then((res)=>{
              this.setState({isEdit : false})
              this.getDataApi()
            })
      Axios.put(urlAPI+'/updateCategoryProduct/'+this.state.editItem.id, {product_category})
            .then((res)=>{
              this.setState({isEdit : false})
              this.getDataApi()
            })
      swal('UPDATE','SUCCESS','success')

    }else{
      Axios.put(urlAPI+'/editProduct/'+this.state.editItem.id,data)
            .then((res)=>{
              this.setState({isEdit : false})
              this.getDataApi()
              swal('UPDATE','SUCCESS','success')
            })  
      Axios.put(urlAPI+'/updateCategoryProduct/'+this.state.editItem.id, {product_category})
            .then((res)=>{
              this.setState({isEdit : false})
              this.getDataApi()
            }) 
     }   
  }


  onChangeHendler = (event) => {
    //untuk mendapatkan file image
    this.setState({selecctedFile : event.target.files[0]})
  }

  valueHandler = () => {
    var value = this.state.selecctedFile ? this.state.selecctedFile.name : 'Pick a Picture'
    return value
  }

  renderJsx =()=>{
      var arrSearchandFilter = this.state.rows.filter((val)=>{
          return (val.product_name.toLowerCase().startsWith(this.state.searchDataname)) 
          // && (val.product_category.toLowerCase().startsWith(this.state.searchDatakategory))
      })
      var jsx = arrSearchandFilter.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((val)=>{
          return(
            <TableRow key = {val.id}>
                <TableCell component="th" scope="row">
                    {val.id}
                </TableCell>
                <TableCell align="">{val.product_name}</TableCell>
                <TableCell align=""><img src={urlAPI+"/"+val.product_img} width="150px" height="150px"/></TableCell>
                <TableCell align="">{val.product_serving}</TableCell>
                <TableCell align="">{val.product_calories}</TableCell>
                <TableCell align="">{val.product_fat}</TableCell>
                <TableCell align="">{val.product_protein}</TableCell>
                <TableCell align="">{val.product_carb}</TableCell>
                <TableCell align="">{val.product_fiber}</TableCell>
                <TableCell align="">{val.product_category}</TableCell>
                <TableCell align="">{val.product_price}</TableCell>
                <TableCell align="">{val.product_discount}</TableCell>
                <TableCell align="">{val.product_description}</TableCell>
                
                <TableCell>
                        <Button onClick={()=>this.btnEDIT(val)} animated color="teal">
                            {/* <Button.Content visible></Button.Content> */}
                            <Button.Content visible>
                                <Icon name='edit' />
                            </Button.Content>
                        </Button>

                        <Button animated color="red" onClick={()=>this.onBtnDelete(val.id)}>
                            {/* <Button.Content visible></Button.Content> */}
                            <Button.Content visible>
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




// =========================================== BATAS AKHIR FUNCTION ===============================================


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
                    {/* <div className="col-md-6">
                        <input type='text' placeholder='SEARCH BY CATEGORY' ref="searchbycategory" style={{marginBottom:'10px'}} className='form-control' onChange={this.getdatasearch}/>
                    </div> */}
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
                                    <TableCell style={{fontSize :'16px',fontWeight:"600px"}}>DESC</TableCell>
                                    <TableCell style={{fontSize :'16px',fontWeight:"600px"}}>ACTION</TableCell>
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
              
              <div>
              <Modal isOpen={this.state.isEdit} toggle={()=>this.setState({isEdit: false})} className={this.props.className}>
                <ModalHeader toggle={()=>this.setState({isEdit: false})}>EDIT PRODUCT</ModalHeader>

                <ModalBody>
                  <div className="container">
                  <div className="row justify-content-center">
                        <div className="col-md">
                              <td>
                                <tr> 
                                    <label> PRODUCT NAME </label> 
                                    <input type="text" placeholder={this.state.editItem.product_name} ref="product_name" className="form form-control"/> 
                                </tr>
                                <tr> 
                                    <label> IMAGE </label>
                                    <div>
                                      <tr>
                                          <img src={urlAPI+'/'+this.state.editItem.product_img} width="100%"/> 
                                      </tr>
                                      <tr>
                                          <input style={{display : 'none'}} ref = 'input' type = 'file' onChange={this.onChangeHendler}/> 
                                          <input className = 'form-control btn-success mt-2' onClick={()=>this.refs.input.click()} type = 'button' value ={this.valueHandler()}  />  
                                      </tr>
                                    </div>
                                </tr>
                                <tr> 
                                    <label> SERVING </label>
                                    <input type="number" ref="product_serving" className="form form-control"/> 
                                </tr>
                                <tr>
                                    <label> CALORIES </label> 
                                    <input type="number" ref="product_calories"  className="form form-control"/>
                                </tr>
                                <tr>
                                    <label> FAT </label> 
                                    <input type="number" ref="product_fat" className="form form-control"/>
                                </tr>
                                <tr>
                                    <label> PROTEIN </label> 
                                    <input type="number" ref="product_protein" className="form form-control"/>
                                </tr>
                                <tr>
                                    <label> CARB </label> 
                                    <input type="number" ref="product_carb"  className="form form-control"/>
                                </tr>
                                <tr>
                                    <label> FIBER </label> 
                                    <input type="number" ref="product_fiber"  className="form form-control"/>
                                </tr>
                                <tr>
                                    <label> CATEGORY </label> 
                                    <select className='form-control form-control-sm' ref="product_category">
                                    {this.renderOptionCatrgory()}
                                    </select>
                                </tr>
                                <tr>
                                    <label> PRICE </label> 
                                    <input type="number" ref="product_price"  className="form form-control"/>
                                </tr>
                                <tr>
                                    <label> DISCOUNT </label> 
                                    <input type="number" ref="product_discount"  className="form form-control"/>
                                </tr>

                                <tr>
                                    <label> DESC </label> 
                                    <input type="number" ref="product_description"  className="form form-control"/>              
                                </tr>
                              </td>
                        </div> 
                  </div>
                  </div>
                </ModalBody>

                <ModalFooter>
                  <Button color="primary" onClick={this.onSaveBtnEdit}> Save </Button>{' '}
                  <Button color="secondary" onClick={()=>this.setState({isEdit: false})}>Cancel</Button>
                </ModalFooter>
              </Modal>
              </div>
  
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