import { Link, useNavigate } from "react-router-dom";
import "../styles/Home.css";

function Home(){
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        navigate("/");
    };

    return(
        <div className="home-container">
            <div className="logout-section">
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
            
            <div className="user-type-selection">
                <h2>Welcome to GetScholar</h2>
                <p>Choose your role to get started:</p>
                
                <div className="role-cards">
                    <div className="role-card">
                        <h3>🎓 Donate Scholarships</h3>
                        <p>
                            Are you an organization or individual looking to help students? 
                            Create and manage scholarship opportunities for deserving students.
                        </p>
                        <Link to="/donor-dashboard" className="role-btn donor-btn">
                            Continue as Donor
                        </Link>
                    </div>

                    <div className="role-card">
                        <h3>📚 Get Scholarships</h3>
                        <p>
                            Are you a student seeking financial assistance for your education? 
                            Browse and apply for scholarships that match your profile.
                        </p>
                       
                        <Link to="/student-dashboard" className="role-btn student-btn">
                            Continue as Student
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;