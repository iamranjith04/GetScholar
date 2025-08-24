import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

function StudentDashboard() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyApplications();
    }, []);

    const fetchMyApplications = async () => {
        try {
            const token = sessionStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }

            const response = await fetch(`${API_BASE_URL}/api/applications/my-applications`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch applications");
            }

            const data = await response.json();
            setApplications(data);
        } catch (error) {
            setError("Failed to load applications");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        navigate("/");
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'APPROVED': return 'green';
            case 'REJECTED': return 'red';
            case 'UNDER_REVIEW': return 'orange';
            default: return 'gray';
        }
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h2>Student Dashboard</h2>
                <div className="header-actions">
                    <Link to="/home" className="back-btn">← Back to Home</Link>
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
            </div>

            <div className="dashboard-actions">
                <Link to="/scholarships" className="action-btn primary">
                    🔍 Browse Scholarships
                </Link>
                <Link to="/my-applications" className="action-btn secondary">
                    📋 View All Applications
                </Link>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="stats-section">
                <div className="stat-card">
                    <h4>Total Applications</h4>
                    <p className="stat-number">{applications.length}</p>
                </div>
                <div className="stat-card">
                    <h4>Approved</h4>
                    <p className="stat-number approved">
                        {applications.filter(app => app.status === 'APPROVED').length}
                    </p>
                </div>
                <div className="stat-card">
                    <h4>Under Review</h4>
                    <p className="stat-number pending">
                        {applications.filter(app => app.status === 'UNDER_REVIEW').length}
                    </p>
                </div>
                <div className="stat-card">
                    <h4>Rejected</h4>
                    <p className="stat-number rejected">
                        {applications.filter(app => app.status === 'REJECTED').length}
                    </p>
                </div>
            </div>

            <div className="recent-applications">
                <h3>Recent Applications</h3>
                
                {applications.length === 0 ? (
                    <div className="empty-state">
                        <p>You haven't applied for any scholarships yet.</p>
                        <Link to="/scholarships" className="action-btn">
                            Browse Available Scholarships
                        </Link>
                    </div>
                ) : (
                    <div className="applications-list">
                        {applications.slice(0, 5).map(application => (
                            <div key={application.id} className="application-card">
                                <div className="application-header">
                                    <h4>{application.scholarshipTitle}</h4>
                                    <span 
                                        className="status-badge"
                                        style={{ backgroundColor: getStatusColor(application.status) }}
                                    >
                                        {application.status.replace('_', ' ')}
                                    </span>
                                </div>
                                
                                <div className="application-info">
                                    <p><strong>Organization:</strong> {application.organizationName}</p>
                                    <p><strong>Amount:</strong> ₹{application.amount.toLocaleString()}</p>
                                    <p><strong>Applied:</strong> {new Date(application.createdAt).toLocaleDateString()}</p>
                                    {application.reviewComments && (
                                        <p><strong>Comments:</strong> {application.reviewComments}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                        
                        {applications.length > 5 && (
                            <Link to="/my-applications" className="view-all-link">
                                View All {applications.length} Applications →
                            </Link>
                        )}
                    </div>
                )}
            </div>

            <div className="quick-actions">
                <h3>Quick Actions</h3>
                <div className="quick-actions-grid">
                    <Link to="/scholarships" className="quick-action-card">
                        <span className="icon">🔍</span>
                        <h4>Find Scholarships</h4>
                        <p>Search and filter available opportunities</p>
                    </Link>
                    <Link to="/my-applications" className="quick-action-card">
                        <span className="icon">📊</span>
                        <h4>Track Applications</h4>
                        <p>Monitor your application status</p>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default StudentDashboard;