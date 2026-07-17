import { useState, useEffect, useCallback, useRef } from 'react';

export const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const optionsRef = useRef(options);
  optionsRef.current = options;

  const fetchData = useCallback(async (customUrl = url) => {
    if (!customUrl) return;
    setLoading(true);
    setError(null);
    try {
      const headers = { ...optionsRef.current.headers };

      const token = import.meta.env.VITE_GITHUB_TOKEN;
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(customUrl, {
        ...optionsRef.current,
        headers,
      });

      if (!response.ok) {
        let errMsg = `Error: ${response.status} ${response.statusText}`;
        if (response.status === 403) {
          const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
          if (rateLimitRemaining === '0') {
            errMsg = 'GitHub API Rate Limit exceeded. Please add VITE_GITHUB_TOKEN to bypass limits.';
          } else {
            errMsg = 'Forbidden: GitHub API returned a 403 error.';
          }
        } else if (response.status === 404) {
          errMsg = 'User/Repository not found';
        }
        throw new Error(errMsg);
      }

      const json = await response.json();
      setData(json);
      return json;
    } catch (err) {
      setError(err.message || 'Something went wrong');
      setData(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (url) {
      fetchData().catch(() => {});
    }
  }, [url, fetchData]);

  return { data, loading, error, refetch: fetchData };
};
