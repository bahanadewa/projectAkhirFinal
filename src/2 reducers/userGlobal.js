const INITIAL_STATE = {id : 0, user_name : "",role : "",error : "",loading:false,  cookie : false, login_verify : ""}

export default (state=INITIAL_STATE, action)=>{
switch(action.type){
   case 'LOGIN_SUCCESS':
       return {...INITIAL_STATE,
            user_name : action.payload[0].username,
            role : action.payload[0].role,
            id : action.payload[0].id,
            cookie : true
           }
   case 'LOADING':
       return{...INITIAL_STATE , loading : true,cookie : true}
   case 'USER_NOT_FOUND':
        return{...INITIAL_STATE , error : action.payload[1] , cookie : true}
   case 'SYSTEM_ERROR':
       return {...INITIAL_STATE , error : 'System Error' ,cookie: true} 
   case 'RESET_USER' :
       return {...INITIAL_STATE , cookie:true}
   case 'USERNAME_NOT_AVAILABLE':
       return {...INITIAL_STATE, error : 'Username not available',cookie: true}
   case 'COOKIE_CHECKED' :
       return {...state, cookie : true}
   case 'LOGIN_VERIFY' :
       return{...INITIAL_STATE, error : "VERIFIKASI TERLEBIH DAHULU"}
   case 'LOGIN_SUCCESS-1' :
       return{...INITIAL_STATE, loading :false}
   default :
       return state
}
   
}