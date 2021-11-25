
import { useEffect, useState } from 'react';
import Axios from 'axios';
import './Solves.css';

/**
* @file Solves.js
* @author Devin Arena
* @since 11/24/2021
* @description Queries the MySQL server and grabs results for solves. Displays them in a list
*              with links for the user to open up the simulator.
*/

const Solves = (props) => {

    const [solves, setSolves] = useState([]);

    /**
     * When the page loads, we grab the solves from the MySQL server.
     */
    useEffect(() => {
        const solveGrab = async () => {
            await getSolves();
        }
        solveGrab();
    }, []);

    /**
     * Queries the MySQL server for a list of solves to be displayed.
     */
    const getSolves = async () => {
        Axios.get('http://localhost:5000/getsolves', {
            params: {
                count: 50,
            }
        }).then((response) => {
            if (response.data) {
                setSolves(response.data);
            }
        });
    }

    return (
        <div className="Solves">
            <h1>Solves</h1>
            <h3>Click on a solve to view it, click 'view' to open it in the simulator.</h3>
            <div className="SolveList">
                <ul>
                    {solves.map((solve) => {
                        return (
                            <li key={solve.id}>
                                <div className="SolveData">
                                    <h1>{solve.title}</h1>
                                    <h3 className="Date">{solve.posted.split("T")[0]}</h3>
                                    <h3>{solve.username}</h3>
                                </div>
                                <a href={"/simulator?solve=" + solve.id}>View</a>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}

export default Solves;