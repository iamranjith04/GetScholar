import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css"
function Register(){
    const [name,setName]=useState("");
    const [userName,setUserName]=useState("");
    const [password,setPassword]=useState("");
    const [passError,setPassError]=useState("");
    const navigate = useNavigate();
    const handleSubmit=async(e)=>{
        e.preventDefault();
        const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
        if(!passwordRegex.test(password)){
            setPassError("password must contain 1 special character and should be length 8");
            return;
        }
        else if( password.length<8){
            setPassError("password must be atleast 8 characters");
            return;
        }
        const authRegister={
            name: name,
            email: userName,
            password: password
        }
        try{
            const response=await fetch("http://localhost:8080/auth/register",{
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(authRegister)
            })
            if(!response.ok){
                alert("something went wrong! Try again")
                return;
            }
            alert("Registed successfully")
            navigate("/login");
        }
        catch(error) {
            alert("Something went wrong. Please try again.");
        }
        
    };
    return(
        <>
            <h1 className="Registeruser">Register User</h1>
            <form className="UserForm" onSubmit={handleSubmit}>
                <label>Name:
                    <input type="text"
                    name="Name"
                    className="Name"
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                    />
                </label>
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
                {passError && <p style={{ color: "red" }}>{passError}</p>} 
                <br/>
                <br/>
                <input type="submit" name="submitButton" className="submitButton" value="Submit"/>
            </form>
        </>
    )
}

export default Register;