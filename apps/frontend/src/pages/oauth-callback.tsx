import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const OAuthCallback = (): JSX.Element => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      navigate('/login', {
        replace: true,
        state: { error: 'Google login failed. Please try again.' },
      });
      return;
    }

    sessionStorage.setItem('authToken', token);
    navigate('/organisation', { replace: true });
  }, [navigate, searchParams]);

  return <p>Signing you in...</p>;
};

export default OAuthCallback;