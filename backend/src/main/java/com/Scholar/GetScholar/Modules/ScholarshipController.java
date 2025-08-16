package com.Scholar.GetScholar.Modules;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.Scholar.GetScholar.Database.Scholarship;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/scholarships")
@CrossOrigin(origins = "*")
public class ScholarshipController {

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
    public ResponseEntity<?> createScholarship(@Valid @RequestBody Scholarship scholarship) {
        try {
            Authentication auth = getCurrentAuth();
            if (auth == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication required"));
            }

            scholarship.setCreatedBy(auth.getName());
            scholarship.setStatus("ACTIVE"); 
            Scholarship created = scholarshipService.createScholarship(scholarship);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to create scholarship: " + e.getMessage()));
        }
    }

    @GetMapping("/my-scholarships")
    public ResponseEntity<?> getMyScholarships() {
        try {
            Authentication auth = getCurrentAuth();
            if (auth == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication required"));
            }

            List<Scholarship> scholarships = scholarshipService.getScholarshipsByCreator(auth.getName());
            return ResponseEntity.ok(scholarships);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to fetch scholarships: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateScholarship(
            @PathVariable Long id, 
            @Valid @RequestBody Scholarship scholarship) {
        try {
            Authentication auth = getCurrentAuth();
            if (auth == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication required"));
            }

            
            Optional<Scholarship> existing = scholarshipService.getScholarshipById(id);
            if (existing.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Scholarship not found"));
            }

            if (!existing.get().getCreatedBy().equals(auth.getName())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "You can only update your own scholarships"));
            }

            scholarship.setId(id);
            scholarship.setCreatedBy(auth.getName());
            
            scholarship.setCreatedAt(existing.get().getCreatedAt());
            
            Scholarship updated = scholarshipService.updateScholarship(scholarship);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to update scholarship: " + e.getMessage()));
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateScholarshipStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusUpdate) {
        try {
            Authentication auth = getCurrentAuth();
            if (auth == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication required"));
            }

            String status = statusUpdate.get("status");
            if (status == null || status.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Status is required"));
            }

            if (!"ACTIVE".equals(status) && !"INACTIVE".equals(status) && !"CLOSED".equals(status)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Status must be ACTIVE, INACTIVE, or CLOSED"));
            }

            Optional<Scholarship> existing = scholarshipService.getScholarshipById(id);
            if (existing.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Scholarship not found"));
            }

            if (!existing.get().getCreatedBy().equals(auth.getName())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "You can only update your own scholarships"));
            }

            Scholarship scholarship = existing.get();
            scholarship.setStatus(status);
            Scholarship updated = scholarshipService.updateScholarship(scholarship);
            
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to update scholarship status: " + e.getMessage()));
        }
    }

   

    @GetMapping
    public ResponseEntity<?> getAvailableScholarships() {
        try {
            List<Scholarship> scholarships = scholarshipService.getActiveScholarships();
            return ResponseEntity.ok(scholarships);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to fetch scholarships: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getScholarshipDetails(@PathVariable Long id) {
        try {
            Optional<Scholarship> scholarship = scholarshipService.getScholarshipById(id);
            if (scholarship.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Scholarship not found"));
            }
            
            return ResponseEntity.ok(scholarship.get());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to fetch scholarship details: " + e.getMessage()));
        }
    }
}