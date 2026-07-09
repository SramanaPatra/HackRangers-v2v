import Onboarding from "./pages/Onboarding.jsx";
import Circles from "./pages/Circles.jsx";
import AICompanion from "./pages/AICompanion.jsx";
import { Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation.jsx";
import Home from "./pages/Home.jsx";
import Journal from "./pages/Journal.jsx";
import Exercises from "./pages/Exercises.jsx";
import Community from "./pages/Community.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Quiz from "./pages/Quiz.jsx";

export default function App() {
  return (
    <div className="flex min-h-screen bg-petal">
      <Navigation />
      <main className="flex-1 p-6 md:p-10 pb-24 md:pb-10 max-w-5xl mx-auto w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/exercises" element={<Exercises />} />
          <Route path="/community" element={<Community />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/circles" element={<Circles />} />
          <Route path="/companion" element={<AICompanion />} />
        </Routes>
      </main>
    </div>
  );
}
