package com.Scholar.GetScholar.Modules;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.Scholar.GetScholar.Database.ScholarshipApplication;
import com.Scholar.GetScholar.Database.Scholarship;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "*")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;
    
    @Autowired
    private ScholarshipService scholarshipService;

    private Authentication getCurrentAuth() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return null;
        }
        return auth;
    }

    

    @PostMapping
    public ResponseEntity<?> submitApplication(@Valid @RequestBody ScholarshipApplication application) {
        try {
            Authentication auth = getCurrentAuth();
            if (auth == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication required"));
            }

            Optional<Scholarship> scholarship = scholarshipService.getScholarshipById(application.getScholarshipId());
            if (scholarship.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Scholarship not found"));
            }

            if (!"ACTIVE".equals(scholarship.get().getStatus())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Scholarship is not active"));
            }

            if (scholarship.get().getApplicationDeadline().isBefore(java.time.LocalDate.now())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Application deadline has passed"));
            }

            if (applicationService.hasUserApplied(auth.getName(), application.getScholarshipId())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "You have already applied for this scholarship"));
            }

            application.setApplicantUsername(auth.getName());
            ScholarshipApplication created = applicationService.submitApplication(application);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to submit application: " + e.getMessage()));
        }
    }

    @GetMapping("/my-applications")
    public ResponseEntity<?> getMyApplications() {
        try {
            Authentication auth = getCurrentAuth();
            if (auth == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication required"));
            }

            List<ScholarshipApplication> applications = applicationService.getApplicationsByUser(auth.getName());
            
            // Enrich with scholarship details
            List<Map<String, Object>> enrichedApplications = applications.stream()
                .map(app -> {
                    Map<String, Object> appData = new HashMap<>();
                    appData.put("id", app.getId());
                    appData.put("scholarshipId", app.getScholarshipId());
                    appData.put("fullName", app.getFullName());
                    appData.put("email", app.getEmail());
                    appData.put("status", app.getStatus());
                    appData.put("createdAt", app.getCreatedAt());
                    appData.put("reviewComments", app.getReviewComments());
                    
                    // Get scholarship details
                    Optional<Scholarship> scholarship = scholarshipService.getScholarshipById(app.getScholarshipId());
                    if (scholarship.isPresent()) {
                        appData.put("scholarshipTitle", scholarship.get().getTitle());
                        appData.put("organizationName", scholarship.get().getOrganizationName());
                        appData.put("amount", scholarship.get().getAmount());
                    }
                    
                    return appData;
                })
                .collect(Collectors.toList());

            return ResponseEntity.ok(enrichedApplications);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to fetch applications: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getApplicationDetails(@PathVariable Long id) {
        try {
            Authentication auth = getCurrentAuth();
            if (auth == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication required"));
            }

            Optional<ScholarshipApplication> application = applicationService.getApplicationById(id);
            if (application.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Application not found"));
            }

            // Check if user owns this application or owns the scholarship
            ScholarshipApplication app = application.get();
            Optional<Scholarship> scholarship = scholarshipService.getScholarshipById(app.getScholarshipId());
            
            boolean isApplicant = app.getApplicantUsername().equals(auth.getName());
            boolean isScholarshipOwner = scholarship.isPresent() && 
                                       scholarship.get().getCreatedBy().equals(auth.getName());

            if (!isApplicant && !isScholarshipOwner) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Access denied"));
            }

            return ResponseEntity.ok(app);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to fetch application: " + e.getMessage()));
        }
    }

    // ORGANIZATION APIs - Review and manage applications

    @GetMapping("/scholarship/{scholarshipId}")
    public ResponseEntity<?> getApplicationsForScholarship(@PathVariable Long scholarshipId) {
        try {
            Authentication auth = getCurrentAuth();
            if (auth == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication required"));
            }

            // Verify scholarship ownership
            Optional<Scholarship> scholarship = scholarshipService.getScholarshipById(scholarshipId);
            if (scholarship.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Scholarship not found"));
            }

            if (!scholarship.get().getCreatedBy().equals(auth.getName())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "You can only view applications for your own scholarships"));
            }

            List<ScholarshipApplication> applications = applicationService.getApplicationsForScholarship(scholarshipId);
            
            // Return summary view for organization
            List<Map<String, Object>> summaries = applications.stream()
                .map(app -> {
                    Map<String, Object> summary = new HashMap<>();
                    summary.put("id", app.getId());
                    summary.put("fullName", app.getFullName());
                    summary.put("email", app.getEmail());
                    summary.put("currentInstitution", app.getCurrentInstitution());
                    summary.put("courseName", app.getCourseName());
                    summary.put("academicPercentage", app.getAcademicPercentage());
                    summary.put("familyIncome", app.getFamilyIncome());
                    summary.put("status", app.getStatus());
                    summary.put("createdAt", app.getCreatedAt());
                    return summary;
                })
                .collect(Collectors.toList());

            return ResponseEntity.ok(summaries);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to fetch applications: " + e.getMessage()));
        }
    }

    @GetMapping("/my-scholarships/summary")
    public ResponseEntity<?> getAllMyScholarshipsApplications() {
        try {
            Authentication auth = getCurrentAuth();
            if (auth == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication required"));
            }

            List<ScholarshipApplication> applications = applicationService.getApplicationsForOrganization(auth.getName());
            
            // Group by scholarship and provide summary
            List<Map<String, Object>> summaries = applications.stream()
                .map(app -> {
                    Map<String, Object> summary = new HashMap<>();
                    summary.put("applicationId", app.getId());
                    summary.put("scholarshipId", app.getScholarshipId());
                    summary.put("applicantName", app.getFullName());
                    summary.put("applicantEmail", app.getEmail());
                    summary.put("status", app.getStatus());
                    summary.put("createdAt", app.getCreatedAt());
                    
                    // Add scholarship info
                    Optional<Scholarship> scholarship = scholarshipService.getScholarshipById(app.getScholarshipId());
                    if (scholarship.isPresent()) {
                        summary.put("scholarshipTitle", scholarship.get().getTitle());
                        summary.put("amount", scholarship.get().getAmount());
                    }
                    
                    return summary;
                })
                .collect(Collectors.toList());

            return ResponseEntity.ok(summaries);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to fetch applications: " + e.getMessage()));
        }
    }

    @PatchMapping("/{id}/review")
    public ResponseEntity<?> reviewApplication(
            @PathVariable Long id,
            @RequestBody Map<String, String> reviewData) {
        try {
            Authentication auth = getCurrentAuth();
            if (auth == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication required"));
            }

            String status = reviewData.get("status");
            String comments = reviewData.get("comments");

            if (status == null || status.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Status is required"));
            }

            if (!"APPROVED".equals(status) && !"REJECTED".equals(status)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Status must be either APPROVED or REJECTED"));
            }

            Optional<ScholarshipApplication> application = applicationService.getApplicationById(id);
            if (application.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Application not found"));
            }

            // Verify scholarship ownership
            ScholarshipApplication app = application.get();
            Optional<Scholarship> scholarship = scholarshipService.getScholarshipById(app.getScholarshipId());
            if (scholarship.isEmpty() || !scholarship.get().getCreatedBy().equals(auth.getName())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "You can only review applications for your own scholarships"));
            }

            ScholarshipApplication updated = applicationService.reviewApplication(
                id, status, comments, auth.getName()
            );

            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to review application: " + e.getMessage()));
        }
    }
}