import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import LandingPage from './pages/landing.tsx';


export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;