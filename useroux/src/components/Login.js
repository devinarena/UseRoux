
import { useState } from 'react';
import Axios from 'axios';
import './Login.css';

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginInformation, setLoginInformation] = useState("");

    const login = (e) => {
        e.preventDefault();
        Axios.post("http://localhost:5000/login", {
            email: email,
            password: password
        }).then((response) => {
            if (response.data.err)
                setLoginInformation(response.data.err);
            else
                setLoginInformation("Successful login as " + response.data[0].username);
        });
    }

    return (
        <div className="Login">
            <form>
                <label>
                    Email:&nbsp;<input type="text" onChange={e => setEmail(e.target.value)} />
                </label>
                <label>
                    Password:&nbsp;<input type="password" onChange={e => setPassword(e.target.value)} />
                </label>
                <button type="submit" onClick={login}>Log In</button>
            </form>
            <h1>{loginInformation}</h1>
        </div>
    );
}

export default Login;