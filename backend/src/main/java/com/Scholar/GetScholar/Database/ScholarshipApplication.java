package com.Scholar.GetScholar.Database;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "scholarship_applications")
public class ScholarshipApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "scholarship_id", nullable = false)
    private Long scholarshipId;

    @NotBlank
    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Past
    @NotNull
    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;

    @NotBlank
    @Column(name = "gender", nullable = false)
    private String gender;

    @Email 
    @NotBlank
    @Column(name = "email", nullable = false)
    private String email;

    @NotBlank
    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    @NotBlank
    @Column(name = "address", length = 500, nullable = false)
    private String address;

    @NotBlank
    @Column(name = "nationality", nullable = false)
    private String nationality;

    @NotBlank
    @Column(name = "current_institution", nullable = false)
    private String currentInstitution;

    @NotBlank
    @Column(name = "course_name", nullable = false)
    private String courseName;

    @NotBlank
    @Column(name = "year_of_study", nullable = false)
    private String yearOfStudy;

    @NotNull
    @DecimalMin(value = "0.0", message = "Percentage must be positive")
    @DecimalMax(value = "100.0", message = "Percentage cannot exceed 100")
    @Column(name = "academic_percentage", nullable = false)
    private Double academicPercentage;

    @Column(name = "achievements", length = 1000)
    private String achievements;

    @NotNull
    @DecimalMin(value = "0.0", message = "Family income must be positive")
    @Column(name = "family_income", nullable = false)
    private Double familyIncome;

    @Column(name = "guardian_name")
    private String guardianName;

    @Column(name = "guardian_occupation")
    private String guardianOccupation;

    @Column(name = "guardian_contact")
    private String guardianContact;

    @NotBlank
    @Column(name = "reason_for_applying", length = 1000, nullable = false)
    private String reasonForApplying;

    @ElementCollection
    @CollectionTable(
        name = "application_documents", 
        joinColumns = @JoinColumn(name = "application_id")
    )
    @Column(name = "document_path")
    private List<String> documentsSubmitted = new ArrayList<>();

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "review_comments", length = 500)
    private String reviewComments;

    @Column(name = "reviewed_by")
    private String reviewedBy;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @Column(name = "applicant_username", nullable = false)
    private String applicantUsername;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "created_by")
    private String createdBy;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = "SUBMITTED";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public LocalDateTime getApplicationDate() {
        return this.createdAt;
    }
}