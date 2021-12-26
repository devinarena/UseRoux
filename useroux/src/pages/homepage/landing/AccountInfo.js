/**
* @file AccountInfo
* @author Devin Arena
* @since 11/28/2021
* @description Displays account information on the right sidebar if signed in, otherwise
*              displays buttons for logging in and signing up.
*/

import './AccountInfo.css';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Axios from 'axios';
import { databaseURL } from '../../../Database';

const AccountInfo = (props) => {

    const [userData, setUserData] = useState();

    /**
     * Makes a get request for user data to check if they are still logged in.
     */
    const getUserData = () => {
        Axios.get(databaseURL + 'user/info', { withCredentials: true }).then(response => {
            if (response.data)
                setUserData(response.data);
        }).catch(_error => {
        });
    }

    useEffect(() => {
        getUserData();
    }, []);

    if (!userData) {
        return (
            <div className="AccountContainer">
                <h1>You are not currently signed in.</h1>
                <div className="AccountButtons">
                    <Link to="/login">Login</Link>
                    <Link to="/signup">Sign Up</Link>
                </div>
                <a className="ForgotPassword" href="/">Forgot Password</a>
            </div>
        );
    } else {
        return (
            <div className="AccountContainer">
                <h1>Welcome, {userData.username}.</h1>
                <div className="AccountButtons">
                    <Link to="/upload">Upload Solve</Link>
                    <Link to="/logout">Logout</Link>
                    <Link to="/">Preferences</Link>
                </div>
            </div>
        );
    }
}

export default AccountInfo;