
/**
* @file Logout.js
* @author Devin Arena
* @since 11/29/2021
* @description Logs the user out and redirects them to the homepage.
*/

import './Logout.css';
import Axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Link } from 'react-router-dom';
import { databaseURL } from "../Database";

/**
 * Logout page informs user they've been logged out and redirects them.
 * 
 * @param {Props} props 
 * @returns JSX for the logout page, a simple header stating the user was logged out.
 */
const Logout = (props) => {

    const navigate = useNavigate();
    const [redirect, setRedirect] = useState("");

    useEffect(() => {
        /**
        * Signs the user out by removing their session cookie.
        */
        const logout = () => {
            Axios.get(databaseURL + 'user/logout', { withCredentials: true }).then(response => {
                console.log(response);
                if (response.status === 200) {
                    setRedirect(response.data.message);
                    navigate('/');
                }
            }).catch(_error => {
                setRedirect("Could not log you out, are you logged in?");
            });
        }

        logout();
    }, [navigate]);

    return (
        <div className="Logout">
            <h1>{redirect}</h1>
            <Link to="/">Home</Link>
        </div>
    );

}

export default Logout;