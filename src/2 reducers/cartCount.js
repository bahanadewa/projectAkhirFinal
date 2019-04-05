const INITIAL_STATE = {count : 0}

export default(state = INITIAL_STATE, action) => {
    switch(action.type){
        case 'CART_COUNT':
            return {count : action.payload}
        case 'RESET_COUNT':
            return INITIAL_STATE
        default:
            return state
    }
}