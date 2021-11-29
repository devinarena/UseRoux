
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Axios from 'axios';
import jwt_decode from 'jwt-decode';
import { databaseURL } from '../Database';

const Login = (props) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [loginInformation, setLoginInformation] = useState("Please enter your email and password.");

    const navigate = useNavigate();

    const login = (e) => {
        e.preventDefault();
        if (email.length < 1 && password.length < 1) {
            setLoginInformation("Email and password are required.")
            setError(true);
        } else if (email.length < 1) {
            setLoginInformation("Email is required.")
            setError(true);
        } else if (password.length < 1) {
            setLoginInformation("Password is required.")
            setError(true);
        }
        Axios.post(databaseURL + "user/login", {
            email: email,
            password: password
        }, { withCredentials: true }).then((response) => {
            if (response.data.err) {
                setLoginInformation(response.data.err);
                setError(true);
            } else {
                const data = jwt_decode(response.data.token);
                setLoginInformation("Successful login as " + data.username);
                setError(false);
                navigate(-1);
            }
        });
    }

    return (
        <div className="Login">
            <form>
                <h1>Login</h1>
                <p style={error ? { "color": "#f00" } : {}}>{loginInformation}</p>
                <label>
                    Email
                    <input type="text" onChange={e => setEmail(e.target.value)} required />
                </label>
                <label>
                    Password
                    <input type="password" onChange={e => setPassword(e.target.value)} required />
                </label>
                <button type="submit" onClick={login}>Login</button>
            </form>
        </div>
    );
}

export default Login;