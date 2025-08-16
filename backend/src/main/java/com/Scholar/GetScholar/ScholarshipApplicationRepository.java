package com.Scholar.GetScholar;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.Scholar.GetScholar.Database.ScholarshipApplication;

import java.util.List;
import java.util.Optional;

@Repository
public interface ScholarshipApplicationRepository extends JpaRepository<ScholarshipApplication, Long> {
    
    // Find applications by user (applicant)
    List<ScholarshipApplication> findByApplicantUsernameOrderByCreatedAtDesc(String applicantUsername);
    
    // Find applications for a specific scholarship
    List<ScholarshipApplication> findByScholarshipIdOrderByCreatedAtDesc(Long scholarshipId);
    
    // Find applications for multiple scholarships (for organization view)
    List<ScholarshipApplication> findByScholarshipIdInOrderByCreatedAtDesc(List<Long> scholarshipIds);
    
    // Check if user already applied for a scholarship
    Optional<ScholarshipApplication> findByApplicantUsernameAndScholarshipId(String applicantUsername, Long scholarshipId);
    
    // Find by status
    List<ScholarshipApplication> findByStatusOrderByCreatedAtDesc(String status);
    
    // Find by email (needed for ScholarshipService)
    Optional<ScholarshipApplication> findByEmail(String email);
    
    // Count by status
    @Query("SELECT COUNT(a) FROM ScholarshipApplication a WHERE a.status = ?1")
    Long countByStatus(String status);
}