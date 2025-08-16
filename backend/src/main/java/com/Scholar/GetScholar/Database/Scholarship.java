package com.Scholar.GetScholar.Database;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "scholarships")
public class Scholarship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", length = 2000)
    private String description;

    @NotBlank
    @Column(name = "organization_name", nullable = false)
    private String organizationName;

    @NotNull
    @Column(name = "amount", nullable = false)
    private Double amount;

    @Column(name = "eligibility_criteria", length = 1000)
    private String eligibilityCriteria;

    @NotNull
    @Column(name = "application_deadline", nullable = false)
    private LocalDate applicationDeadline;

    @NotNull
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "max_family_income")
    private Double maxFamilyIncome;

    @Column(name = "min_percentage")
    private Double minPercentage;

    @Column(name = "available_slots")
    private Integer availableSlots;

    @Column(name = "category")
    private String category; 

    @Column(name = "status")
    private String status; 

    @Column(name = "created_by", nullable = false)
    private String createdBy; 

    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = "ACTIVE";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    
    public void setCreatedAt(LocalDateTime dateTime) {
        this.createdAt = dateTime;
    }
}