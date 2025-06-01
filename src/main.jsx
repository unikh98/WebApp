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
  authority: "https://ap-south-1ws3sznr4l.auth.ap-south-1.amazoncognito.com",
  client_id: "hlg4q9au1q962ieji881eerk1",
  redirect_uri: "https://www.camlabs.in/admin", 
  response_type: "code",
  scope: "email openid phone",
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
