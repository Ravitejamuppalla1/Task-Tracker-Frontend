import axios from '../config/axios'
import Swal from 'sweetalert2'

export const CREATE_USER = "CREATE_USER"

//Register

export const createUSer = (data) => {
    return {
        type: CREATE_USER,
        payload: data
    }
}

export const asyncUserRegister = (formData, reset, props) => {
    return (dispatch) => {
        axios.post('/api/register', formData)
            .then((result) => {
                if (result.data.hasOwnProperty('password')) {
                    dispatch(createUSer(result.data))
                    reset()
                    props.history.push('/login')

                }
                else {
                    Swal.fire(result.data.errors.phoneNumber.message)
                }

            })
            .catch((error) => {
                Swal.fire('Phone Number is already registered')
            })
    }
}

//Login

export const asyncUserLogin = (formData, reset, props) => {
    return (dispatch) => {
        axios.post('/api/login', formData)
            .then((result) => {

                localStorage.setItem('token', result.data.token)
                if (localStorage.getItem('token') != 'undefined') {
                    reset()
                    Swal.fire('Successfully logged in')
                    props.history.push('/home')
                }
                else {
                    Swal.fire('Invalid phone number or password')
                }
            })

            .catch((err) => {
                Swal.fire({
                    errors: "Invalid phone number or password"
                })
            })
    }
}