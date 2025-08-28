import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';
import { supabase } from '../lib/supabase';

// Check if current URL has OAuth parameters
const hasOAuthParams = (): boolean => {
  const urlParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  
  return urlParams.has('access_token') || 
         urlParams.has('code') || 
         hashParams.has('access_token') ||
         hashParams.has('code');
};

// Handle OAuth callback processing
const handleOAuthCallback = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.warn('⚠️ Session retrieval had error, but continuing:', error.message);
    }
    
    if (data.session) {
      return true;
    }
    
    // Fallback: try to get session again
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.warn('⚠️ Session fallback threw error:', sessionError);
      return false;
    }
    
    return !!sessionData.session;
  } catch (error) {
    console.error('❌ OAuth callback handling failed:', error);
    return false;
  }
};

export const OAuthHandler: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const processOAuthCallback = async () => {
      if (!hasOAuthParams() || processing) return;

      setProcessing(true);
      setError('');

      try {
        const success = await handleOAuthCallback();
        
        if (success) {
          // Wait a moment for auth state to update, then redirect
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 1500);
        } else {
          setError('Authentication failed. Please try again.');
          setTimeout(() => {
            navigate('/auth/signin', { replace: true });
          }, 3000);
        }
      } catch (err) {
        console.error('❌ OAuth processing error:', err);
        setError('An error occurred during authentication.');
        setTimeout(() => {
          navigate('/auth/signin', { replace: true });
        }, 3000);
      } finally {
        setProcessing(false);
      }
    };

    processOAuthCallback();
  }, [navigate, processing]);

  // Also redirect if user becomes authenticated through normal flow
  useEffect(() => {
    if (!loading && user && !hasOAuthParams()) {
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="text-center max-w-md mx-auto p-8">
        <LoadingSpinner />
        
        {processing ? (
          <>
            <h2 className="mt-6 text-xl font-semibold text-gray-900">
              Completing Sign In...
            </h2>
            <p className="mt-2 text-gray-600">
              Please wait while we process your authentication
            </p>
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                🔐 Processing OAuth tokens and establishing session
              </p>
            </div>
          </>
        ) : error ? (
          <>
            <h2 className="mt-6 text-xl font-semibold text-red-900">
              Authentication Error
            </h2>
            <p className="mt-2 text-red-600">{error}</p>
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">
                Redirecting you back to the sign-in page...
              </p>
            </div>
          </>
        ) : (
          <>
            <h2 className="mt-6 text-xl font-semibold text-gray-900">
              Processing Authentication...
            </h2>
            <p className="mt-2 text-gray-600">
              Just a moment while we sign you in
            </p>
          </>
        )}
      </div>
    </div>
  );
};
