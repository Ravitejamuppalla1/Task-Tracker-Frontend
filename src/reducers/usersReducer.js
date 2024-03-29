import { CREATE_USER } from "../actions/usersActions";

const userInitialState = {
    data:[]
}

const userReducers = (state =userInitialState,action)=>{
    switch(action.type){
        case CREATE_USER :{
            return {...state,data:[...state.data,action.payload]}
        }
        default :{
            return {...state}
        }
    }
}

export default userReducers