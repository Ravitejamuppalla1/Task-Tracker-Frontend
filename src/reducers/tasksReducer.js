import { GET_TASKS,EDIT_TASK,DESTROY_TASK,CREATE_TASK, SORT_TASKS,SORTED_TASKS } from "../actions/tasksActions";

const taskInitialState = {
   data:[]
}

const  tasksReducers = (state = taskInitialState,action)=>{

    switch(action.type){
        case GET_TASKS:{
            console.log('inisde',{...state,data:action.payload})

           return {...state,data:action.payload}
        }
        case CREATE_TASK: {
            return { ...state, data:[...state.data,action.payload]}
        }
        case EDIT_TASK :{
            return {...state,data:state.data.map(ele=>{
                if(ele._id === action.payload._id){
                    return {...ele,...action.payload}
                }
                else{
                    return {...ele}
                }
            })}
        }
        case DESTROY_TASK:{
            return {...state,data:state.data.filter(ele=>ele.taskId !== action.payload)}
            
        }

        case  SORT_TASKS :{
            console.log(action.payload,'sort reducer')
            return {...state,data:action.payload}
        }

        case SORTED_TASKS :{
            return {...state,data:action.payload}

        }

        default :{
            return {...state}
        }
    }

}

export default tasksReducers