import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import UserDashboard from './pages/User/UserDashboard';
import PatientPreventiveAI from './pages/User/PatientPreventiveAI';
import PatientAIInsights from './pages/User/PatientAIInsights';
import PatientUploadReports from './pages/User/PatientUploadReports';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import AIHub from './pages/Doctor/AIHub';
import BrainTumorAnalytics from './pages/Doctor/BrainTumorAnalytics';
import NeurologicalRiskPrediction from './pages/Doctor/NeurologicalRiskPrediction';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/user/preventive-ai" element={<PatientPreventiveAI />} />
        <Route path="/user/ai-insights" element={<PatientAIInsights />} />
        <Route path="/user/upload-reports" element={<PatientUploadReports />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/ai-hub" element={<AIHub />} />
        <Route path="/doctor/brain-tumor-analytics" element={<BrainTumorAnalytics />} />
        <Route path="/doctor/neuro-risk-prediction" element={<NeurologicalRiskPrediction />} />
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
