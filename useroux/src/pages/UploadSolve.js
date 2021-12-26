
import { useEffect, useState } from 'react';
import './UploadSolve.css';
import Axios from 'axios';
import { databaseURL } from '../Database';
import { useNavigate } from 'react-router';

/**
* @file UploadSolve.js
* @author Devin Arena
* @since 11/25/2021
* @description Page for uploading solves to ExampleSolves.
*/

/**
 * Upload solves page allows users to upload their solve.
 * 
 * @param {Props} props 
 * @returns JSX for the upload solves page.
 */
const UploadSolve = (props) => {

    const [page, setPage] = useState(0);
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [scramble, setScramble] = useState("");
    const [time, setTime] = useState(0.0);
    const [steps, setSteps] = useState([{
        name: "",
        algorithm: "",
        text: "",
    }]);

    const navigate = useNavigate();

    /**
     * Check if the user is signed in, if they are, set user ID, if not, redirect them to the signin page.
     */
    useEffect(() => {
        Axios.get(databaseURL + 'user/info', { withCredentials: true }).catch(_error => {
            navigate('/login');
        });
    }, [navigate]);

    /**
     * Uploading a solve involves 2 sets of data, solve metadata, and steps.
     * The first page allows users to enter metadata, and the second allows users to enter steps.
     * 
     * @returns JSX for the first or second page
     */
    const getPage = () => {
        if (page === 0) {
            return (
                <form>
                    <label>Title *</label>
                    <input type="text" value={title} maxLength={255} onChange={e => setTitle(e.target.value)} required />
                    <label>Description *</label>
                    <textarea rows={10} value={desc} maxLength={5000} onChange={e => setDesc(e.target.value)} required />
                    <label>Scramble *</label>
                    <input type="text" value={scramble} maxLength={255} onChange={e => setScramble(e.target.value)} required />
                    <label>Time</label>
                    <input type="number" value={time > 0 ? time : ""} maxLength={18} onChange={e => setTime(e.target.value)} />
                    <button type="button" onClick={() => setPage(1)}>Steps</button>
                </form>
            );
        }
        if (page === 1) {
            return (
                <form onSubmit={uploadSolve} >
                    {steps.map((step, idx) => {
                        return (
                            <div className="Step" key={idx}>
                                <label>{"Step " + (idx + 1)}</label>
                                <label>Name *</label>
                                <input value={step.name} type="text" maxLength={255} onChange={
                                    e => setSteps(steps.map((step, cidx) => {
                                        if (cidx === idx) {
                                            return {
                                                name: e.target.value,
                                                algorithm: step.algorithm,
                                                text: step.text
                                            };
                                        } else
                                            return step;
                                    }))
                                } required />
                                <label>Algorithm *</label>
                                <input value={step.algorithm} type="text" maxLength={255} onChange={
                                    e => setSteps(steps.map((step, cidx) => {
                                        if (cidx === idx) {
                                            return {
                                                name: step.name,
                                                algorithm: e.target.value,
                                                text: step.text
                                            };
                                        } else
                                            return step;
                                    }))
                                } required />
                                <label>Description</label>
                                <textarea value={step.text} rows={5} maxLength={5000} onChange={
                                    e => setSteps(steps.map((step, cidx) => {
                                        if (cidx === idx) {
                                            return {
                                                name: step.name,
                                                algorithm: step.algorithm,
                                                text: e.target.value
                                            };
                                        } else
                                            return step;
                                    }))
                                } />
                                {idx > 0 && <button className="RemoveStep" type="button" onClick={() => removeStep(idx)}>Remove</button>}
                            </div>
                        );
                    })}
                    <button className="AddStep" type="button" onClick={() => addStep()}>+</button>
                    <div className="FinalButtons">
                        <button type="button" onClick={() => setPage(0)}>Solve Info</button>
                        <button type="submit">Upload</button>
                    </div>
                </form>
            );
        }
    }

    /**
     * Adds a blank step entry to the list of current steps.
     */
    const addStep = () => {
        setSteps(steps.concat({
            name: "",
            algorithm: "",
            text: "",
        }));
    }

    /**
     * Removes a step from the step list, shifting all steps after it back by 1.
     * 
     * @param {number} step the index of the step to remove
     */
    const removeStep = (step) => {
        setSteps(steps.filter((_step, idx) => idx !== step));
    }

    const uploadSolve = async (e) => {
        e.preventDefault();

        const solveData = {
            title: title,
            desc: desc,
            scramble: scramble,
            time: time,
        };

        Axios.post(databaseURL + "solve/upload", solveData).then((response) => {
            if (response.data.err) {
                console.log(response.data.err);
            } else {
                const id = response.data.id;
                let stepNum = 1;
                for (const step of steps) {
                    step.solveID = id;
                    step.stepNumber = stepNum++;
                }
                console.log(steps);
                Axios.post(databaseURL + "solve/upload/steps", { steps: steps }).then((response) => {
                    console.log(response);
                });
            }
        });
    }

    return (
        <div className="UploadSolve">
            <h1>Upload a Solve</h1>
            {getPage()}
        </div>
    );
}

export default UploadSolve;