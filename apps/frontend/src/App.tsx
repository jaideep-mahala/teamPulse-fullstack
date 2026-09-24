import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import LandingPage from './pages/landing.tsx';
import Login from './pages/login.tsx';
import Signup from './pages/signup.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import OAuthCallback from './pages/oauth-callback.tsx';
import OrganizationPopup from './pages/org.tsx';
import Dashboard from './pages/dashboard.tsx';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/oauth-callback" element={<OAuthCallback />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/organisation" element={<OrganizationPopup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/:orgId" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;