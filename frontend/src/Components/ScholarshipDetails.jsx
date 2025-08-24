import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "../styles/scholarship-details.css";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

function ScholarshipDetails() {
    const { id } = useParams();
    const [scholarship, setScholarship] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showApplicationForm, setShowApplicationForm] = useState(false);
    const [applicationData, setApplicationData] = useState({
        fullName: "",
        dateOfBirth: "",
        gender: "",
        email: "",
        phoneNumber: "",
        address: "",
        nationality: "Indian",
        currentInstitution: "",
        courseName: "",
        yearOfStudy: "",
        academicPercentage: "",
        achievements: "",
        familyIncome: "",
        guardianName: "",
        guardianOccupation: "",
        guardianContact: "",
        reasonForApplying: "",
        documentsSubmitted: []
    });
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchScholarshipDetails();
    }, [id]);

    const fetchScholarshipDetails = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/scholarships/${id}`);
            if (!response.ok) {
                throw new Error("Scholarship not found");
            }
            const data = await response.json();
            setScholarship(data);
        } catch (error) {
            setError("Failed to load scholarship details");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setApplicationData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleApplicationSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");

        try {
            const token = sessionStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }

            const applicationPayload = {
                ...applicationData,
                scholarshipId: parseInt(id),
                academicPercentage: parseFloat(applicationData.academicPercentage),
                familyIncome: parseFloat(applicationData.familyIncome)
            };

            const response = await fetch(`${API_BASE_URL}/api/applications`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(applicationPayload)
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || "Failed to submit application");
            }

            alert("Application submitted successfully!");
            navigate("/student-dashboard");
        } catch (error) {
            setError(error.message || "Failed to submit application");
        } finally {
            setSubmitting(false);
        }
    };

    const isDeadlinePassed = () => {
        return new Date() > new Date(scholarship?.applicationDeadline);
    };

    const yearsOfStudy = ["First Year", "Second Year", "Third Year", "Final Year", "Post Graduate"];
    const genders = ["Male", "Female", "Other"];

    if (loading) return <div className="loading">Loading scholarship details...</div>;
    if (error && !scholarship) return <div className="error-message">{error}</div>;
    if (!scholarship) return <div className="error-message">Scholarship not found</div>;

    return (
        <div className="scholarship-details-container">
            <div className="details-header">
                <Link to="/scholarships" className="back-btn">← Back to Scholarships</Link>
                <h1>{scholarship.title}</h1>
            </div>

            <div className="scholarship-content">
                <div className="main-details">
                    <div className="info-section">
                        <h2>Scholarship Information</h2>
                        <div className="info-grid">
                            <div className="info-item">
                                <strong>Organization:</strong>
                                <span>{scholarship.organizationName}</span>
                            </div>
                            <div className="info-item">
                                <strong>Amount:</strong>
                                <span className="amount">₹{scholarship.amount.toLocaleString()}</span>
                            </div>
                            <div className="info-item">
                                <strong>Category:</strong>
                                <span className="category">{scholarship.category}</span>
                            </div>
                            <div className="info-item">
                                <strong>Available Slots:</strong>
                                <span>{scholarship.availableSlots}</span>
                            </div>
                            <div className="info-item">
                                <strong>Application Deadline:</strong>
                                <span className={isDeadlinePassed() ? "deadline-passed" : "deadline-active"}>
                                    {new Date(scholarship.applicationDeadline).toLocaleDateString()}
                                </span>
                            </div>
                            {scholarship.startDate && (
                                <div className="info-item">
                                    <strong>Start Date:</strong>
                                    <span>{new Date(scholarship.startDate).toLocaleDateString()}</span>
                                </div>
                            )}
                            {scholarship.endDate && (
                                <div className="info-item">
                                    <strong>End Date:</strong>
                                    <span>{new Date(scholarship.endDate).toLocaleDateString()}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="description-section">
                        <h2>Description</h2>
                        <p>{scholarship.description}</p>
                    </div>

                    <div className="eligibility-section">
                        <h2>Eligibility Criteria</h2>
                        <p>{scholarship.eligibilityCriteria}</p>
                        
                        <div className="criteria-details">
                            {scholarship.maxFamilyIncome && (
                                <div className="criteria-item">
                                    <strong>Maximum Family Income:</strong> ₹{scholarship.maxFamilyIncome.toLocaleString()}
                                </div>
                            )}
                            {scholarship.minPercentage && (
                                <div className="criteria-item">
                                    <strong>Minimum Academic Percentage:</strong> {scholarship.minPercentage}%
                                </div>
                            )}
                        </div>
                    </div>

                    {scholarship.requiredDocuments && (
                        <div className="documents-section">
                            <h2>Required Documents</h2>
                            <p>{scholarship.requiredDocuments}</p>
                        </div>
                    )}
                </div>

                <div className="application-section">
                    {isDeadlinePassed() ? (
                        <div className="deadline-notice">
                            <h3>Application Deadline Passed</h3>
                            <p>Unfortunately, the application deadline for this scholarship has passed.</p>
                        </div>
                    ) : scholarship.status !== 'ACTIVE' ? (
                        <div className="inactive-notice">
                            <h3>Scholarship Not Available</h3>
                            <p>This scholarship is currently not accepting applications.</p>
                        </div>
                    ) : (
                        <div className="apply-section">
                            {!showApplicationForm ? (
                                <div className="apply-prompt">
                                    <h3>Ready to Apply?</h3>
                                    <p>Fill out the application form to apply for this scholarship.</p>
                                    <button 
                                        onClick={() => setShowApplicationForm(true)} 
                                        className="apply-btn"
                                    >
                                        Apply Now
                                    </button>
                                </div>
                            ) : (
                                <div className="application-form">
                                    <h3>Scholarship Application</h3>
                                    {error && <div className="error-message">{error}</div>}
                                    
                                    <form onSubmit={handleApplicationSubmit}>
                                        <div className="form-section">
                                            <h4>Personal Information</h4>
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>Full Name *</label>
                                                    <input
                                                        type="text"
                                                        name="fullName"
                                                        value={applicationData.fullName}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Date of Birth *</label>
                                                    <input
                                                        type="date"
                                                        name="dateOfBirth"
                                                        value={applicationData.dateOfBirth}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Gender *</label>
                                                    <select
                                                        name="gender"
                                                        value={applicationData.gender}
                                                        onChange={handleInputChange}
                                                        required
                                                    >
                                                        <option value="">Select Gender</option>
                                                        {genders.map(gender => (
                                                            <option key={gender} value={gender}>{gender}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>Email *</label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={applicationData.email}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Phone Number *</label>
                                                    <input
                                                        type="tel"
                                                        name="phoneNumber"
                                                        value={applicationData.phoneNumber}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label>Address *</label>
                                                <textarea
                                                    name="address"
                                                    value={applicationData.address}
                                                    onChange={handleInputChange}
                                                    required
                                                    rows={3}
                                                />
                                            </div>
                                        </div>

                                        <div className="form-section">
                                            <h4>Academic Information</h4>
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>Current Institution *</label>
                                                    <input
                                                        type="text"
                                                        name="currentInstitution"
                                                        value={applicationData.currentInstitution}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Course Name *</label>
                                                    <input
                                                        type="text"
                                                        name="courseName"
                                                        value={applicationData.courseName}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>Year of Study *</label>
                                                    <select
                                                        name="yearOfStudy"
                                                        value={applicationData.yearOfStudy}
                                                        onChange={handleInputChange}
                                                        required
                                                    >
                                                        <option value="">Select Year</option>
                                                        {yearsOfStudy.map(year => (
                                                            <option key={year} value={year}>{year}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <label>Academic Percentage *</label>
                                                    <input
                                                        type="number"
                                                        name="academicPercentage"
                                                        value={applicationData.academicPercentage}
                                                        onChange={handleInputChange}
                                                        required
                                                        min="0"
                                                        max="100"
                                                        step="0.01"
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label>Achievements</label>
                                                <textarea
                                                    name="achievements"
                                                    value={applicationData.achievements}
                                                    onChange={handleInputChange}
                                                    rows={3}
                                                    placeholder="List your academic and extracurricular achievements"
                                                />
                                            </div>
                                        </div>

                                        <div className="form-section">
                                            <h4>Family Information</h4>
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>Family Income (₹/year) *</label>
                                                    <input
                                                        type="number"
                                                        name="familyIncome"
                                                        value={applicationData.familyIncome}
                                                        onChange={handleInputChange}
                                                        required
                                                        min="0"
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Guardian Name *</label>
                                                    <input
                                                        type="text"
                                                        name="guardianName"
                                                        value={applicationData.guardianName}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>Guardian Occupation *</label>
                                                    <input
                                                        type="text"
                                                        name="guardianOccupation"
                                                        value={applicationData.guardianOccupation}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Guardian Contact *</label>
                                                    <input
                                                        type="tel"
                                                        name="guardianContact"
                                                        value={applicationData.guardianContact}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-section">
                                            <h4>Additional Information</h4>
                                            <div className="form-group">
                                                <label>Reason for Applying *</label>
                                                <textarea
                                                    name="reasonForApplying"
                                                    value={applicationData.reasonForApplying}
                                                    onChange={handleInputChange}
                                                    required
                                                    rows={4}
                                                    placeholder="Explain why you are applying for this scholarship and how it will help you"
                                                />
                                            </div>
                                        </div>

                                        <div className="form-actions">
                                            <button 
                                                type="button" 
                                                onClick={() => setShowApplicationForm(false)}
                                                className="cancel-btn"
                                            >
                                                Cancel
                                            </button>
                                            <button 
                                                type="submit" 
                                                disabled={submitting}
                                                className="submit-btn"
                                            >
                                                {submitting ? "Submitting..." : "Submit Application"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ScholarshipDetails;