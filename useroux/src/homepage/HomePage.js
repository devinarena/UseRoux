
import './HomePage.css';
import Landing from './landing/Landing';
import Solves from './Solves';

/**
* @file HomePage.js
* @author Devin Arena
* @since 11/24/2021
* @description Handles logic for the homepage of ExampleSolves. HomePage will display list of solves,
*              user information, etc.
*/

/**
 * The HomePage widget will contain a landing for users, a list of solves to view,
 * and button for uploading, etc.
 * 
 * @param {Props} props any necessary props to use for the homepage.
 * @returns JSX for the homepage.
 */
const HomePage = (props) => {

    return (
        <div className="HomePage">
            <div className="Wrapper">
                <Landing />
                <Solves />
            </div>
        </div>
    );
}

export default HomePage;