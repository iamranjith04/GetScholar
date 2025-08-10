package com.Scholar.GetScholar.Database;


import lombok.Data;

@Data
public class AuthRegister {
    private String email;
    private String passward;
    public AuthRegister(String email, String passward) {
        this.email = email;
        this.passward = passward;
    }
    public String getEmail(){
        return email;
    }
    public void SetEmail(String email){
        this.email=email;
    }
    
}
