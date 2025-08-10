package com.Scholar.GetScholar.Modules;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.Scholar.GetScholar.UserRepo;
import com.Scholar.GetScholar.Database.UserDetail;

@Service
public class CustomUserDetailsService implements UserDetailsService{
    
    @Autowired
    private UserRepo userDetailRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userDetailRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    public void addUser(UserDetail details){
        userDetailRepository.save(details);
    }
}