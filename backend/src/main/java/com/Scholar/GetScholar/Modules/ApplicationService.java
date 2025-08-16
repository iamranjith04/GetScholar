package com.Scholar.GetScholar.Modules;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.Scholar.GetScholar.Database.ScholarshipApplication;
import com.Scholar.GetScholar.ScholarshipApplicationRepository;
import com.Scholar.GetScholar.ScholarshipRepository;
import com.Scholar.GetScholar.Database.Scholarship;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ApplicationService {

    @Autowired
    private ScholarshipApplicationRepository applicationRepository;
    
    @Autowired
    private ScholarshipRepository scholarshipRepository;

    public ScholarshipApplication submitApplication(ScholarshipApplication application) {
        return applicationRepository.save(application);
    }

    @Transactional(readOnly = true)
    public Optional<ScholarshipApplication> getApplicationById(Long id) {
        return applicationRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<ScholarshipApplication> getApplicationsByUser(String username) {
        return applicationRepository.findByApplicantUsernameOrderByCreatedAtDesc(username);
    }

    @Transactional(readOnly = true)
    public List<ScholarshipApplication> getApplicationsForScholarship(Long scholarshipId) {
        return applicationRepository.findByScholarshipIdOrderByCreatedAtDesc(scholarshipId);
    }

    @Transactional(readOnly = true)
    public List<ScholarshipApplication> getApplicationsForOrganization(String organizationUsername) {
        // Get all scholarships created by the organization
        List<Scholarship> scholarships = scholarshipRepository.findByCreatedByOrderByCreatedAtDesc(organizationUsername);
        
        // Get applications for all these scholarships
        return applicationRepository.findByScholarshipIdInOrderByCreatedAtDesc(
            scholarships.stream().map(Scholarship::getId).toList()
        );
    }

    @Transactional(readOnly = true)
    public boolean hasUserApplied(String username, Long scholarshipId) {
        return applicationRepository.findByApplicantUsernameAndScholarshipId(username, scholarshipId).isPresent();
    }

    public ScholarshipApplication reviewApplication(Long applicationId, String status, String comments, String reviewedBy) {
        ScholarshipApplication application = applicationRepository.findById(applicationId)
            .orElseThrow(() -> new IllegalArgumentException("Application not found"));

        application.setStatus(status);
        application.setReviewComments(comments);
        application.setReviewedBy(reviewedBy);
        application.setReviewedAt(LocalDateTime.now());

        return applicationRepository.save(application);
    }
}