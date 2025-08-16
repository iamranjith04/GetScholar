package com.Scholar.GetScholar.Modules;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.Scholar.GetScholar.ScholarshipRepository;
import com.Scholar.GetScholar.Database.Scholarship;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ScholarshipService {

    @Autowired
    private ScholarshipRepository scholarshipRepository;

    // Scholarship-related methods only
    public Scholarship createScholarship(Scholarship scholarship) {
        scholarship.setCreatedAt(LocalDateTime.now());
        if (scholarship.getStatus() == null) {
            scholarship.setStatus("ACTIVE");
        }
        return scholarshipRepository.save(scholarship);
    }

    @Transactional(readOnly = true)
    public Optional<Scholarship> getScholarshipById(Long id) {
        return scholarshipRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Scholarship> getActiveScholarships() {
        return scholarshipRepository.findByStatusAndApplicationDeadlineAfterOrderByCreatedAtDesc("ACTIVE", LocalDate.now());
    }

    @Transactional(readOnly = true)
    public List<Scholarship> getScholarshipsByCreator(String createdBy) {
        return scholarshipRepository.findByCreatedByOrderByCreatedAtDesc(createdBy);
    }

    public Scholarship updateScholarship(Scholarship scholarship) {
        return scholarshipRepository.save(scholarship);
    }
}