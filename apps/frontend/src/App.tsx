import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import LandingPage from './pages/landing.tsx';
import Login from './pages/login.tsx';
import Signup from './pages/signup.tsx';
import Dashboard from './pages/dashboard.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';


export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;