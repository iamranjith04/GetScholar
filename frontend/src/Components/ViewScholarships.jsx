import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
//import "../styles/scholarships.css";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

function ViewScholarships() {
    const [scholarships, setScholarships] = useState([]);
    const [filteredScholarships, setFilteredScholarships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filters, setFilters] = useState({
        category: "",
        minAmount: "",
        maxAmount: "",
        searchTerm: ""
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchScholarships();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [scholarships, filters]);

    const fetchScholarships = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/scholarships`);
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

    const applyFilters = () => {
        let filtered = scholarships.filter(scholarship => {
            const matchesCategory = !filters.category || scholarship.category === filters.category;
            const matchesMinAmount = !filters.minAmount || scholarship.amount >= parseFloat(filters.minAmount);
            const matchesMaxAmount = !filters.maxAmount || scholarship.amount <= parseFloat(filters.maxAmount);
            const matchesSearch = !filters.searchTerm || 
                scholarship.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                scholarship.organizationName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                scholarship.description.toLowerCase().includes(filters.searchTerm.toLowerCase());
            
            return matchesCategory && matchesMinAmount && matchesMaxAmount && matchesSearch;
        });
        setFilteredScholarships(filtered);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const clearFilters = () => {
        setFilters({
            category: "",
            minAmount: "",
            maxAmount: "",
            searchTerm: ""
        });
    };

    const categories = ["General", "Academic", "Sports", "Arts", "Technical", "Medical", "Engineering", "Other"];

    if (loading) return <div className="loading">Loading scholarships...</div>;

    return (
        <div className="scholarships-container">
            <div className="scholarships-header">
                <h2>Available Scholarships</h2>
                <div className="header-actions">
                    <Link to="/student-dashboard" className="back-btn">← Back to Dashboard</Link>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="filters-section">
                <div className="filter-row">
                    <div className="filter-group">
                        <input
                            type="text"
                            name="searchTerm"
                            placeholder="Search scholarships..."
                            value={filters.searchTerm}
                            onChange={handleFilterChange}
                            className="search-input"
                        />
                    </div>
                    
                    <div className="filter-group">
                        <select
                            name="category"
                            value={filters.category}
                            onChange={handleFilterChange}
                            className="filter-select"
                        >
                            <option value="">All Categories</option>
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <input
                            type="number"
                            name="minAmount"
                            placeholder="Min Amount (₹)"
                            value={filters.minAmount}
                            onChange={handleFilterChange}
                            className="amount-input"
                        />
                    </div>

                    <div className="filter-group">
                        <input
                            type="number"
                            name="maxAmount"
                            placeholder="Max Amount (₹)"
                            value={filters.maxAmount}
                            onChange={handleFilterChange}
                            className="amount-input"
                        />
                    </div>

                    <button onClick={clearFilters} className="clear-filters-btn">
                        Clear Filters
                    </button>
                </div>
            </div>

            <div className="scholarships-results">
                <p className="results-count">
                    Showing {filteredScholarships.length} of {scholarships.length} scholarships
                </p>

                {filteredScholarships.length === 0 ? (
                    <div className="no-results">
                        <p>No scholarships found matching your criteria.</p>
                        <button onClick={clearFilters} className="action-btn">
                            Clear Filters to See All
                        </button>
                    </div>
                ) : (
                    <div className="scholarships-grid">
                        {filteredScholarships.map(scholarship => (
                            <div key={scholarship.id} className="scholarship-card">
                                <div className="scholarship-header">
                                    <h3>{scholarship.title}</h3>
                                    <span className="category-badge">{scholarship.category}</span>
                                </div>

                                <div className="scholarship-info">
                                    <p className="organization">{scholarship.organizationName}</p>
                                    <p className="amount">₹{scholarship.amount.toLocaleString()}</p>
                                    <p className="deadline">
                                        <strong>Deadline:</strong> {new Date(scholarship.applicationDeadline).toLocaleDateString()}
                                    </p>
                                    <p className="description">{scholarship.description}</p>
                                </div>

                                <div className="scholarship-footer">
                                    <Link 
                                        to={`/scholarship/${scholarship.id}`} 
                                        className="view-details-btn"
                                    >
                                        View Details & Apply
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ViewScholarships;