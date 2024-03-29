import Swal from 'sweetalert2'
import axios from '../config/axios'

export const GET_TASKS = "GET_TASKS"
export const EDIT_TASK = "EDIT_TASK"
export const DESTROY_TASK = "DESTROY_TASK"
export const CREATE_TASK = "CREATE_TASK"
export const SORT_TASKS = "SORT_TASKS"
export const SORTED_TASKS = "SORTED_TASKS"


export const getAdmin = (data) => {
    return {
        type: GET_TASKS,
        payload: data
    }
}

export const asyncGetTasks = (token) => {
    return (dispatch) => {
        axios.get('/api/tasklists', {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        })
            .then((result) => {
                dispatch(getAdmin(result.data))
            })
    }

}


//create task

export const createTask = (data) => {
    return {
        type: CREATE_TASK,
        payload: data
    }
}


export const asyncCreateTask = (formData, reset) => {
    return (dispatch) => {
        axios.post('/api/createtask', formData, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        })

            .then((response) => {
                const result = response.data
                reset()
                dispatch(createTask(result))


            })
    }
}


//EditTask

export const edittask = (data) => {

    return {
        type: EDIT_TASK,
        payload: data
    }
}

export const asyncEditTask = (taskId, formData, reset, setEditTask) => {
    return (dispatch) => {
        axios.put(`/api/Edittask/${taskId}`, formData, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        })
            .then((result) => {
                const upadtedtask = result.data
                dispatch(edittask(upadtedtask))
                reset()
                setEditTask(false)


            })

    }

}


//Delete task

export const destroytask = (data) => {
    return {
        type: DESTROY_TASK,
        payload: data
    }
}


export const asyncDeleteTask = (id, setShow) => {
    return (dispatch) => {
        axios.delete(`api/deletetask/${id}`, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        })
            .then((response) => {
                if (response.data.error === 'Cannot delete a completed task') {
                    Swal.fire(response.data.error);

                } else if (response.data._id) {
                    dispatch(destroytask(response.data._id));
                    dispatch(asyncGetTasks());
                    Swal.fire('Task deleted successfully');
                } 
                setShow(false)
            })
            .catch((err) => {
                Swal.fire('Error occurred while deleting task');
                setShow(false)

            });

    }
}

export const sortPriorityTask = (data) => {

    return {
        type: SORT_TASKS,
        payload: data
    }

}


export const asyncSortTask = (formData) => {
    return (dispatch) => {
        axios.post('/api/sortbypriority', formData, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        })

            .then((result) => {
                const sortData = result.data
                dispatch(sortPriorityTask(sortData))

            })
            .catch((error) => {
                console.log(error)
            })
    }
}



export const sortedTasks = (data) => {
    return {
        type: SORTED_TASKS,
        payload: data
    };
};

export const asyncSort = (formData) => {
    return (dispatch) => {
        axios.post('/api/sort', formData, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        })
        .then((result) => {
            const sortData = result.data;
            dispatch(sortedTasks(sortData))
        })
        .catch((error) => {
            console.log(error)
        });
    };
};