import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import BibleReader from './components/BibleReader';
import IAAssistant from './components/IAAssistant';
import ProgressTracker from './components/ProgressTracker';

function DarkModeSync() {
  const { user } = useAuth();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', Boolean(user?.dark_mode));
  }, [user]);

  return null;
}

function App() {
  return (
    <AuthProvider>
      <DarkModeSync />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/biblia"
            element={
              <PrivateRoute>
                <BibleReader />
              </PrivateRoute>
            }
          />
          <Route
            path="/assistente"
            element={
              <PrivateRoute>
                <IAAssistant />
              </PrivateRoute>
            }
          />
          <Route
            path="/progresso"
            element={
              <PrivateRoute>
                <ProgressTracker />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
