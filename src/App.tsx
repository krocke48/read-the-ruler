import React from 'react'
import { Link, Routes, Route } from 'react-router-dom'
import ReadRuler from './pages/ReadRuler'
import FindLine from './pages/FindLine'
import ConvertInches from './pages/ConvertInches'
import ConvertFeetInches from './pages/ConvertFeetInches'
import CountingBy from './pages/CountingBy'
import TeacherClasses from './pages/teacher/Classes'
import TeacherClassDetail from './pages/teacher/ClassDetail'
import StudentSignIn from './pages/student/SignIn'
import StudentHome from './pages/student/Home'
export default function App(){
  return (
    <div style={{minHeight:'100%'}}>
      <div className="wrap">
        <div className="hero">
          <h1>Shop Math Workshop</h1>
          <p className="sub">v46 — Voice input on Read the Ruler (Web Speech API), adaptive engine intact.</p>
          <div className="grid">
            <div className="card"><h3>Read the Ruler</h3><p className="mini">Adaptive pointer drill + voice (Chrome/Edge).</p><Link className="btn" to="/read">Open module</Link></div>
            <div className="card"><h3>Find the Line</h3><p className="mini">Drag the pointer to the requested tick.</p><Link className="btn" to="/find">Open module</Link></div>
            <div className="card"><h3>Convert Inches → Feet & Inches</h3><p className="mini">Random 13–240″.</p><Link className="btn" to="/convert-inches">Open module</Link></div>
            <div className="card"><h3>Convert Feet & Inches → Inches</h3><p className="mini">Quick total inches.</p><Link className="btn" to="/convert-feet-inches">Open module</Link></div>
            <div className="card"><h3>Counting by…</h3><p className="mini">6s, 8s, 12s, 16s.</p><Link className="btn" to="/counting-by">Open module</Link></div>
            <div className="card"><h3>Teacher Console</h3><p className="mini">Classes, rosters, pin versions, analytics.</p><Link className="btn" to="/teacher">Open</Link></div>
            <div className="card"><h3>Student</h3><p className="mini">Sign in with Class Code + PIN; see your progress.</p><Link className="btn" to="/student">Open</Link></div>
          </div>
          <p className="tiny" style={{marginTop:12}}>Build: v46</p>
        </div>
      </div>
      <Routes>
        <Route path="/read" element={<ReadRuler/>} />
        <Route path="/find" element={<FindLine/>} />
        <Route path="/convert-inches" element={<ConvertInches/>} />
        <Route path="/convert-feet-inches" element={<ConvertFeetInches/>} />
        <Route path="/counting-by" element={<CountingBy/>} />
        <Route path="/teacher" element={<TeacherClasses/>} />
        <Route path="/teacher/class/:id" element={<TeacherClassDetail/>} />
        <Route path="/student" element={<StudentSignIn/>} />
        <Route path="/student/home" element={<StudentHome/>} />
      </Routes>
    </div>
  )
}
