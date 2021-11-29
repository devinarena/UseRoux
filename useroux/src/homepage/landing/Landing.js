
import AccountInfo from './AccountInfo';
import './Landing.css';

/**
* @file Landing.js
* @author Devin Arena
* @since 11/24/2021
* @description Contains news updates and the Logo for the ExampleSolves.
*/

/**
 * Landing widget contains a logo and news updates for the site.
 * 
 * @param {Props} props any props needed by the Landing.
 * @returns JSX for the Landing widget.
 */
const Landing = (props) => {

    return (
        <div className="SideBar">
            <div className="Landing">
                <h1>ExampleSolves</h1>
                <h3>Share your solves with the world and learn from others.</h3>
            </div>
            <AccountInfo />
            <div className="NewsDialog">
                <h1>Working on the project.</h1>
                <h3 className="Date">11/24/2021</h3>
                <p>This is an example dialog, I'll be putting news updates here eventually.</p>
                <p>For now, it doesn't really do anything interesting.</p>
            </div>
        </div>
    );
}

export default Landing;