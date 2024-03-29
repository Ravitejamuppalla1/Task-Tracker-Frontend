import { createStore, combineReducers } from 'redux'
import { applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import userReducers from '../reducers/usersReducer'
import tasksReducers from '../reducers/tasksReducer'

const configureStore = () => {
    console.log(tasksReducers)

    const store = createStore(combineReducers({
        users :userReducers,
        tasks:tasksReducers
        
    }), applyMiddleware(thunk))
    return store
}

export default configureStore