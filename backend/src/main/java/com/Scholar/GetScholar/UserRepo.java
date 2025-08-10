package com.Scholar.GetScholar;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Scholar.GetScholar.Database.UserDetail;
import java.util.Optional;


public interface UserRepo extends JpaRepository<UserDetail, Integer>{
    Optional<UserDetail> findByEmail(String email);
}
