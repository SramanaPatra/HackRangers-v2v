import { Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation.jsx";
import RequireAuth from "./components/RequireAuth.jsx";
import Home from "./pages/Home.jsx";
import Journal from "./pages/Journal.jsx";
import Exercises from "./pages/Exercises.jsx";
import Circles from "./pages/Circles.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Quiz from "./pages/Quiz.jsx";
import Onboarding from "./pages/Onboarding.jsx";
import AICompanion from "./pages/AICompanion.jsx";
import Profile from "./pages/Profile.jsx";

export default function App() {
  return (
    <div className="flex min-h-screen bg-petal">
      <Navigation />
      <main className="flex-1 p-6 md:p-10 pb-24 md:pb-10 max-w-5xl mx-auto w-full">
        <Routes>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
          <Route path="/journal" element={<RequireAuth><Journal /></RequireAuth>} />
          <Route path="/exercises" element={<RequireAuth><Exercises /></RequireAuth>} />
          <Route path="/circles" element={<RequireAuth><Circles /></RequireAuth>} />
          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/quiz" element={<RequireAuth><Quiz /></RequireAuth>} />
          <Route path="/companion" element={<RequireAuth><AICompanion /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
        </Routes>
      </main>
    </div>
  );
}