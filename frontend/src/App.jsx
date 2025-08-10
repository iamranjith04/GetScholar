import { useState } from 'react'
import Auth from './Components/Auth'
import Login from './Components/login'
import Register from './Components/Register'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1 id="Title" className="Apptitle">GetScholar</h1>
      <Router>
        <Routes>
          <Route path="/" element={<Auth/>} />
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
