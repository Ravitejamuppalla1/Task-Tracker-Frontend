import React from "react";
import { Link, Route,withRouter } from "react-router-dom";
import Register from "./Register";
import Login from "./login";
import Home from "./Home";


const Container = () => {

    return (
        <div>
            <Link to='/'></Link>
            <Link to='/login'></Link>
            <Link to='home'></Link>

            <Route path='/' component={Register} exact={true} />
            <Route path='/login' component={Login} exact={true}/>
            <Route path='/home' component={Home} exact={true}/>
            
        </div>
    )
}

export default withRouter(Container)