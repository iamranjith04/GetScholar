import { useState } from "react";
import {Link} from "react-router-dom"
import { useNavigate } from "react-router-dom";
function Login(){
    const [userName,setUserName]=useState("");
    const [password,setPassword]=useState("");
    const navigate = useNavigate();
    const handleSubmit=async(e)=>{
        e.preventDefault();
        
         const authRequest = {
            email: userName,
            password: password
        };

        try{
            const response=await fetch("http://localhost:8080/auth/login",{
            method:"POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(authRequest)
            })
             if (!response.ok) {
                throw new Error("Invalid credentials");
            }
            const data = await response.json();
            sessionStorage.setItem("token", data.token);
            navigate("/home");
        }
        catch (error) {
            alert("Something went wrong. Please try again.");
        }
        
        
    }
    return(
        <>
            <h1 className="Registeruser">Login User</h1>
            <form className="UserForm" onSubmit={handleSubmit}>
                <label>Username:
                    <input type="email" 
                    name="username" 
                    className="userNameInput" 
                    value={userName}
                    onChange={(e)=>setUserName(e.target.value)}
                    placeholder="example@gmail.com"/>
                </label>
                <br/>
                <br/>
                <label>Password:
                    <input type="password" 
                    name="password" 
                    className="userPassword" 
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    placeholder="eg:#12Abcde"/>
                </label>

                <br/>
                <br/>
                <input type="submit" name="submitButton" className="submitButton" value="Submit"/>
                <br />
                <br />
                <Link to="/register" id="registerButton">Register</Link>
            </form>
        </>
    )
}

export default Login;