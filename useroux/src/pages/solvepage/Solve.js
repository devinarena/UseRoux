
/**
* @file Solve.js
* @author Devin Arena
* @since 11/29/2021
* @description Solve page contains information regarding the solve including scramble,
*              description, comments, etc.
*/

import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { databaseURL } from '../../Database';
import './Solve.css';

const Solve = (props) => {

    const { id } = useParams();
    const [solve, setSolve] = useState();
    const [signedIn, setSignedIn] = useState(false);
    const navigate = useNavigate();

    /**
     * Grabs data from the SQL server on page load.
     */
    useEffect(() => {
        Axios.get(databaseURL + 'solve',
            {
                params: {
                    solveID: id,
                }
            }).then(response => {
                if (response.data.err)
                    navigate(-1);
                setSolve(response.data[0]);
            }).catch(_error => {
                navigate(-1);
            });
        Axios.get(databaseURL + 'user/info', { withCredentials: true }).then(response => {
            if (response.data)
                setSignedIn(true);
        });
    }, [id, navigate]);

    /**
     * Displays a comment box if signed in, otherwise a simple you must sign in message.
     */
    const commentBox = () => {
        if (signedIn)
            return (
                <form onSubmit={e => e.preventDefault()}>
                    <h1>Post a comment</h1>
                    <textarea rows={10} />
                    <button type="submit">Post</button>
                </form>
            );
        return (
            <form onSubmit={e => e.preventDefault()}>
                <h2>You must be signed in to comment.</h2>
            </form>
        );
    }

    if (!solve) {
        return (
            <div className="SolvePage">
                <div className="SolveInfo">
                </div>
            </div>
        );
    }

    const test = new Array(10).fill(["devinarena", "11/29/2021", "This is a test comment!"], 0, 10);

    return (
        <div className="SolvePage">
            <div className="SolveInfo">
                <h1>{solve.title}</h1>
                <h3 className="Date">{solve.posted.split("T")[0]}</h3>
                <p>Scramble: <span className="Scramble">{solve.scramble}</span></p>
                <p>{solve.description}</p>
            </div>
            {commentBox()}
            <ul className="SolveComments">
                {test.map((comment, idx) => {
                    return (
                        <li key={idx}>
                            <header>
                                <h1>{comment[0]}</h1>
                                <p>{comment[1]}</p>
                            </header>
                            <p>{comment[2]}</p>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default Solve;