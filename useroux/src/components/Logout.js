
/**
* @file Logout.js
* @author Devin Arena
* @since 11/29/2021
* @description Logs the user out and redirects them to the homepage.
*/

import Axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { databaseURL } from "../Database";

const Logout = (props) => {

    const navigate = useNavigate();

    /**
     * Signs the user out by removing their session cookie.
     */
    const logout = () => {
        Axios.get(databaseURL + 'user/logout', { withCredentials: true }).then(response => {
            if (response.status === 200)
                navigate('/');
        });
    }

    useEffect(() => {
        logout();
    });

    return (
        <div className="Logout">

        </div>
    );

}

export default Logout;