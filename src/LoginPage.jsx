import React, { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate('/admin');
    }
  }, [auth.isAuthenticated, navigate]);

  return (
    <div style={styles.outerContainer}>
      <div style={styles.container}>
        <h2 style={styles.title}>ಜಿಂಗೆ ಚಕಾ ಜಿಂಗೆ ಚಕಾ ತನನಂ ತುವಿ ತುವಿ</h2>
        <button style={styles.button} onClick={() => auth.signinRedirect()}>
          Sign in with AWS
        </button>
      </div>
    </div>
  );
}

const styles = {
  outerContainer: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',    
    backgroundColor: '#fff',
  },
  container: {
    maxWidth: '400px', 
    width: '90%',
    padding: '2rem',
    boxSizing: 'border-box',
    textAlign: 'center',
    color: '#333',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  title: {
    marginBottom: '1.5rem',
    fontSize: '2rem',
    fontWeight: '600',
  },
  button: {
    padding: '0.75rem 2rem',
    fontSize: '1rem',
    fontWeight: '600',
    backgroundColor: '#2575fc',
    border: 'none',
    borderRadius: '6px',
    color: 'white',
    cursor: 'pointer',
    transition: 'background-color 0.25s ease',
    width: '100%',
  },
};

export default LoginPage;
