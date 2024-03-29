import React from 'react'
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { asyncUserLogin } from '../actions/usersActions';
import "./Home.css";


const useStyles = makeStyles({

  root: {
        height: '100vh',
        backgroundColor: '#fff',

    },
    leftContainer: {
        width: '30%',
    },
    rightContainer: {
        width: '70%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        padding: '26px', 
        marginTop: '20px',
        marginLeft: "40px",
        textAlign: 'center',
        color: '#000', 
        backgroundColor: '#F8F8FF !important', 
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        width: '80%',

        height: '90%', 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
    },

    boldText: {
        fontWeight: 'bold ! important',
        fontSize: '30px ! important',
        marginTop: '1px ! important', 
    },
    textField: {
        marginBottom: '15px ! important', 
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderWidth: '2px', 
            },
        },
    },
    blackButton: {
        backgroundColor: 'black ! important',
        color: 'white',
        '&:hover': {
            backgroundColor: 'darkgrey', 
        },
    },

    image: {
        width: '100%', 
        height: '100%', 
        objectFit: 'cover', 

    },
    imageContainer: {
        marginTop: '80px', 
    },


});



const Login = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [formErrors, setformErrors] = useState({});

   const handlePhoneNumberChange = (e) => {
        setPhoneNumber(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let formData = {
            phoneNumber,
            password,
        };

        let reset =()=>{
            setPhoneNumber('')
            setPassword('')
        }

        dispatch(asyncUserLogin(formData,reset,props))
    };

    return (
        <div className={classes.root}>
            <Grid container spacing={0}>
                <Grid item className={classes.leftContainer}>
                    <Paper className={classes.paper}>

                        <Typography className={classes.boldText}>SIGN IN</Typography>

                        <form>
                           

                            <TextField
                                type="text"
                                value={phoneNumber}
                                placeholder="Enter your phonenumber"
                                onChange={handlePhoneNumberChange}
                                className={classes.textField}
                                fullWidth
                            />
                            <br />

                            <TextField
                                type="password"
                                value={password}
                                placeholder="Enter password"
                                onChange={handlePasswordChange}
                                className={classes.textField}
                                fullWidth
                            />
                            <br />

                            <Button variant="contained" className={classes.blackButton} onClick={handleSubmit}>
                                SIGN IN
                            </Button>
                        </form>

                        <Typography>Create an Account ? <Link to='/' style={{color:'red'}} >Sign up</Link> </Typography> 

                    </Paper>

                </Grid>

                <Grid item className={classes.rightContainer}>
                    <div className={classes.imageContainer}>
                        <img
                            src={require('../images/logo.png')}
                            alt="Welcome Image"
                            className={classes.image}
                        />
                    </div>
                </Grid>
            </Grid>
        </div>
    );
};



export default Login