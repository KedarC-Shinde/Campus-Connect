import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import StudentHome from "./pages/StudentHome";
import MentorHome from "./pages/MentorHome";
import TpoHome from "./pages/TpoHome";
import RecruiterHome from "./pages/RecruiterHome";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/student/home" element={<StudentHome />} />
      <Route path="/mentor/home" element={<MentorHome />} />
      <Route path="/tpo/home" element={<TpoHome />} />
      <Route path="/recruiter/home" element={<RecruiterHome />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
