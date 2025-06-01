import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from 'react-oidc-context';
import App from './App.jsx';
import LoginPage from './LoginPage.jsx';
import AdminPage from './AdminPage.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import Layout from './layout.jsx';

const cognitoAuthConfig = {
  authority: "https://ap-south-1ws3sznr4l.auth.ap-south-1.amazoncognito.com",  // Your Hosted UI domain
  client_id: "hlg4q9au1q962ieji881eerk1",
  redirect_uri: "http://localhost:5173/admin",   // adjust to your dev or production URL
  response_type: "code",
  scope: "openid email phone profile",
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider {...cognitoAuthConfig}>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout title="Home - Camlabs">
              <App />
            </Layout>
          }
        />
        <Route
          path="/login"
          element={
            <Layout title="Login - Camlabs">
              <LoginPage />
            </Layout>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Layout title="Admin - Camlabs">
                <AdminPage />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);
