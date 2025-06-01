import React from 'react';
import { useAuth } from 'react-oidc-context';

function AdminPage() {
  const auth = useAuth();

  const signOutRedirect = () => {
    const cognitoDomain = "https://ap-south-1ws3sznr4l.auth.ap-south-1.amazoncognito.com";
    const clientId = "hlg4q9au1q962ieji881eerk1";
    const logoutUri = "http://localhost:5173/";  // redirect after logout

    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Admin Panel</h2>
      <p>Welcome, {auth.user?.profile.email}</p>
      <button onClick={() => auth.removeUser()}>Sign out (local)</button>
      <button onClick={signOutRedirect}>Sign out (Cognito redirect)</button>
    </div>
  );
}

export default AdminPage;
