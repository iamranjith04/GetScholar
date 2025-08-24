import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

function DonorDashboard() {
    const [scholarships, setScholarships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyScholarships();
    }, []);

    const fetchMyScholarships = async () => {
        try {
            const token = sessionStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }

            const response = await fetch(`${API_BASE_URL}/api/scholarships/my-scholarships`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch scholarships");
            }

            const data = await response.json();
            setScholarships(data);
        } catch (error) {
            setError("Failed to load scholarships");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const updateScholarshipStatus = async (scholarshipId, newStatus) => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}/api/scholarships/${scholarshipId}/status`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                fetchMyScholarships(); 
                alert("Scholarship status updated successfully");
            } else {
                alert("Failed to update scholarship status");
            }
        } catch (error) {
            alert("Error updating scholarship status");
            console.error(error);
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        navigate("/");
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h2>Donor Dashboard</h2>
                <div className="header-actions">
                    <Link to="/home" className="back-btn">← Back to Home</Link>
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
            </div>

            <div className="dashboard-actions">
                <Link to="/create-scholarship" className="action-btn primary">
                    + Create New Scholarship
                </Link>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="scholarships-section">
                <h3>My Scholarships ({scholarships.length})</h3>
                
                {scholarships.length === 0 ? (
                    <div className="empty-state">
                        <p>You haven't created any scholarships yet.</p>
                        <Link to="/create-scholarship" className="action-btn">
                            Create Your First Scholarship
                        </Link>
                    </div>
                ) : (
                    <div className="scholarships-grid">
                        {scholarships.map(scholarship => (
                            <div key={scholarship.id} className="scholarship-card">
                                <div className="scholarship-header">
                                    <h4>{scholarship.title}</h4>
                                    <span className={`status-badge ${scholarship.status.toLowerCase()}`}>
                                        {scholarship.status}
                                    </span>
                                </div>
                                
                                <div className="scholarship-info">
                                    <p><strong>Organization:</strong> {scholarship.organizationName}</p>
                                    <p><strong>Amount:</strong> ₹{scholarship.amount.toLocaleString()}</p>
                                    <p><strong>Deadline:</strong> {new Date(scholarship.applicationDeadline).toLocaleDateString()}</p>
                                    <p><strong>Created:</strong> {new Date(scholarship.createdAt).toLocaleDateString()}</p>
                                </div>

                                <div className="scholarship-actions">
                                    <Link 
                                        to={`/view-applications/${scholarship.id}`} 
                                        className="action-btn secondary"
                                    >
                                        View Applications
                                    </Link>
                                    
                                    <div className="status-controls">
                                        {scholarship.status === 'ACTIVE' ? (
                                            <button 
                                                onClick={() => updateScholarshipStatus(scholarship.id, 'INACTIVE')}
                                                className="status-btn inactive"
                                            >
                                                Deactivate
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => updateScholarshipStatus(scholarship.id, 'ACTIVE')}
                                                className="status-btn active"
                                            >
                                                Activate
                                            </button>
                                        )}
                                        
                                        <button 
                                            onClick={() => updateScholarshipStatus(scholarship.id, 'CLOSED')}
                                            className="status-btn closed"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default DonorDashboard;