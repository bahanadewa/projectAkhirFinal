const INITIAL_STATE = {id :0, user_name:"",error :"",loading: false, role :"", cookie : false}

export default (state=INITIAL_STATE, action)=>{
   if (action.type==='LOGIN_SUCCESS'){
      return {...INITIAL_STATE,
               user_name : action.payload.username, 
               role : action.payload.role, 
               id : action.payload.id,
               cookie : true}
   } else if (action.type==='USER_NAME_NOT_FOUND'){
      return{...INITIAL_STATE,error : "USER NOT FOUND",cookie : true}
   }else if(action.type==="LOADING"){
      return{...INITIAL_STATE,loading : true,cookie : true}
   }else if(action.type==="SISTEM_ERROR"){
      return{...INITIAL_STATE,error: "SERVER ERROR",cookie : true}
   }else if(action.type==="RESET_USER"){
      return {...INITIAL_STATE, cookie : true}
   }else if(action.type ==="USERNAME_NOT_AVAILABLE"){ 
      return {...INITIAL_STATE, error : 'USER NAME NOT AVAILABLE',cookie : true}
  }else if (action.type ==="COOKIE_CHECKED"){
      return {...state, cookie : true}
  }else {
      return state
   }
   
}