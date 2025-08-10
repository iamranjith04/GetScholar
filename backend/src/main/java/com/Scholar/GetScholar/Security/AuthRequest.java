package com.Scholar.GetScholar.Security;

import lombok.Data;

@Data
public class AuthRequest {
    private String email;
    private String password;
}
