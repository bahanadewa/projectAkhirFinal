import {combineReducers} from 'redux'
import user_name from './userGlobal'
import Cart from './cartCount'

export default combineReducers({
    user : user_name,
    cart : Cart
})