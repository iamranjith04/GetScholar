import {Link} from "react-router-dom"
import "../styles/auth.css";
function Auth(){
    return (
        <div className="auth-container">
            <h3>About</h3>
            <p>
                GetScholar is a platform that connects students with scholarships
                offered by organizations and providers, while also enabling
                organizations and individuals to publish their scholarship
                opportunities.
            </p>
            <div className="auth-buttons">
                <Link to="/login" id="loginButton" className="authbutton">Login</Link>
                <Link to="/register" id="registerButton" className="authbutton">Register</Link>
            </div>
        </div>
    )
}

export default Auth;