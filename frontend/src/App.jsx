import { useState } from 'react'
import Auth from './Components/Auth'
import Login from './Components/Login'
import Register from './Components/Register'
import Home from './Components/Home'
import DonorDashboard from './Components/DonorDashboard'
import StudentDashboard from './Components/StudentDashboard'
import CreateScholarship from './Components/CreateScholarship'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import ScholarshipDetails from './Components/ScholarshipDetails'
import ViewScholarships from './Components/ViewScholarships'

function App() {

  return (
    <>
      <h1 id="Title" className="Apptitle">GetScholar</h1>
      <Router>
        <Routes>
          <Route path="/" element={<Auth/>} />
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/home" element={<Home/>}/>
          <Route path="/donor-dashboard" element={<DonorDashboard/>}/>
          <Route path="/create-scholarship" element={<CreateScholarship/>}/>
          <Route path="/student-dashboard" element={<StudentDashboard/>}/>
          <Route path="/view-applications/:id" element={<ScholarshipDetails/>}/>
          <Route path="/scholarships" element={<ViewScholarships/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App