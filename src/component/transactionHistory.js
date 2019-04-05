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
    isDetail : false
  };
  componentDidMount(){
      this.getData()
  }

  getData = () => {
    var getcookie = objcookie.get('memory-cookie')
    Axios.get(urlAPI + '/history?product_username=' +getcookie)
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

  onBtnDetail = (item) => {

  }
  renderHistoryDetail = () => {
    var jsx = this.state.historyDetail.map((row,index) => {
      return(
        <TableRow key={index}>
          <TableCell>{index+1}</TableCell>
          <TableCell>
              {row.product_name}
          </TableCell>
          <TableCell>{row.product_price}</TableCell>
          <TableCell>{row.product_discount} </TableCell>
          <TableCell>{row.product_quantity}</TableCell>
          <TableCell>{row.product_quantity * (row.product_price - (row.product_price* row.product_discount/100))}</TableCell>

        </TableRow>
      )
    })
    return jsx
  }


  render() {
    const { classes } = this.props;
    const { rows, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
    if(this.props.username){
    return (
        <div className='container'>
            <Paper className={classes.root}>
                <div className={classes.tableWrapper}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{fontSize:'24px', fontWeight:'600'}}>NO</TableCell>
                            <TableCell style={{fontSize:'24px', fontWeight:'600'}}>DATE</TableCell>
                            <TableCell style={{fontSize:'24px', fontWeight:'600'}}>ITEM</TableCell>
                            <TableCell style={{fontSize:'24px', fontWeight:'600'}}>TOTAL</TableCell>
                            <TableCell style={{fontSize:'24px', fontWeight:'600'}}></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row,index) => (
                        <TableRow key={row.id}>
                        <TableCell>{index+1}</TableCell>
                        <TableCell>
                            {row.tanggal}
                        </TableCell>
                        <TableCell>{row.item.length}</TableCell>
                        <TableCell>{formatMoney(row.total)} </TableCell>
                        <TableCell><input type='button' value='Detail' onClick={()=>this.setState({isDetail:true,historyDetail:row.item})} className='btn btn-danger mr-2'/></TableCell>

                        </TableRow>
                    ))}
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
            { this.state.isDetail ? <Paper className='mt-3'>
              <Table>
                <TableHead>
                <TableRow>
                    <TableCell style={{fontSize:'24px', fontWeight:'600'}}>NO</TableCell>
                    <TableCell style={{fontSize:'24px', fontWeight:'600'}}>NAME</TableCell>
                    <TableCell style={{fontSize:'24px', fontWeight:'600'}}>PRICE</TableCell>
                    <TableCell style={{fontSize:'24px', fontWeight:'600'}}>DISCOUNT</TableCell>
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

export default connect(mapStateToProps,{cartCount})(withStyles(styles)(CustomPaginationActionsTable));