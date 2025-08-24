import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/forms.css";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

function CreateScholarship() {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        organizationName: "",
        amount: "",
        eligibilityCriteria: "",
        applicationDeadline: "",
        startDate: "",
        endDate: "",
        maxFamilyIncome: "",
        minPercentage: "",
        availableSlots: "",
        category: "General",
        requiredDocuments: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const categories = ["General", "Academic", "Sports", "Arts", "Technical", "Medical", "Engineering", "Other"];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const token = sessionStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }

            
            const scholarshipData = {
                ...formData,
                amount: parseFloat(formData.amount),
                maxFamilyIncome: formData.maxFamilyIncome ? parseFloat(formData.maxFamilyIncome) : null,
                minPercentage: formData.minPercentage ? parseFloat(formData.minPercentage) : null,
                availableSlots: parseInt(formData.availableSlots)
            };

            const response = await fetch(`${API_BASE_URL}/api/scholarships`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(scholarshipData)
            });

            if (!response.ok) {
                throw new Error("Failed to create scholarship");
            }

            alert("Scholarship created successfully!");
            navigate("/donor-dashboard");
        } catch (error) {
            setError("Failed to create scholarship. Please try again.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <div className="form-header">
                <h2>Create New Scholarship</h2>
                <Link to="/donor-dashboard" className="back-btn">← Back to Dashboard</Link>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="scholarship-form">
                <div className="form-section">
                    <h3>Basic Information</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Scholarship Title *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Organization Name *</label>
                            <input
                                type="text"
                                name="organizationName"
                                value={formData.organizationName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Description *</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                            rows={4}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Amount (₹) *</label>
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleInputChange}
                                required
                                min="1"
                            />
                        </div>
                        <div className="form-group">
                            <label>Category *</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                required
                            >
                                {categories.map(category => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Available Slots *</label>
                        <input
                            type="number"
                            name="availableSlots"
                            value={formData.availableSlots}
                            onChange={handleInputChange}
                            required
                            min="1"
                        />
                    </div>
                </div>

                <div className="form-section">
                    <h3>Important Dates</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Application Deadline *</label>
                            <input
                                type="date"
                                name="applicationDeadline"
                                value={formData.applicationDeadline}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Start Date</label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>End Date</label>
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h3>Eligibility Criteria</h3>
                    <div className="form-group">
                        <label>Eligibility Criteria *</label>
                        <textarea
                            name="eligibilityCriteria"
                            value={formData.eligibilityCriteria}
                            onChange={handleInputChange}
                            required
                            rows={3}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Maximum Family Income (₹)</label>
                            <input
                                type="number"
                                name="maxFamilyIncome"
                                value={formData.maxFamilyIncome}
                                onChange={handleInputChange}
                                placeholder="250000"
                            />
                        </div>
                        <div className="form-group">
                            <label>Minimum Academic Percentage (%)</label>
                            <input
                                type="number"
                                name="minPercentage"
                                value={formData.minPercentage}
                                onChange={handleInputChange}
                                min="0"
                                max="100"
                                step="0.01"
                                placeholder="75"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Required Documents</label>
                        <textarea
                            name="requiredDocuments"
                            value={formData.requiredDocuments}
                            onChange={handleInputChange}
                            rows={2}
                            placeholder="e.g., Academic transcripts, Income certificate, ID proof..."
                        />
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={() => navigate("/donor-dashboard")} className="cancel-btn">
                        Cancel
                    </button>
                    <button type="submit" disabled={loading} className="submit-btn">
                        {loading ? "Creating..." : "Create Scholarship"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateScholarship;