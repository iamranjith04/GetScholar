package com.Scholar.GetScholar;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.Scholar.GetScholar.Database.Scholarship;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ScholarshipRepository extends JpaRepository<Scholarship, Long> {
    
    List<Scholarship> findByStatusAndApplicationDeadlineAfterOrderByCreatedAtDesc(String status, LocalDate date);
    
    List<Scholarship> findByCreatedByOrderByCreatedAtDesc(String createdBy);
}