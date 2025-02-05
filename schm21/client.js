// client.js
const BASE_URL = 'http://localhost:4000';

let accessToken = null;
let refreshToken = null;

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

const onRefreshed = (newToken) => {
  refreshSubscribers.forEach(callback => callback(newToken));
  refreshSubscribers = [];
};

const login = async () => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'testUser' })
  });
  const data = await response.json();
  accessToken = data.accessToken;
  refreshToken = data.refreshToken;
  console.log('Logged in with tokens:', { accessToken, refreshToken });
};

const refreshAccessToken = async () => {
  console.log('Refreshing token...');
  const response = await fetch(`${BASE_URL}/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  });

  if (!response.ok) throw new Error('Failed to refresh token');

  const data = await response.json();
  accessToken = data.accessToken;
  console.log('Token refreshed:', accessToken);
  return accessToken;
};

const customFetch = async (url, options = {}) => {
  const initialToken = accessToken;
  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${initialToken}`
  };

  let response = await fetch(url, options);

  if (response.status === 401) {
    console.log("Token expired. Refreshing token...");
    const currentToken = accessToken;

    if (initialToken !== currentToken) {
      options.headers.Authorization = `Bearer ${currentToken}`;
      return fetch(url, options);
    }

    if (!isRefreshing) {
      isRefreshing = true;
      try {
        await refreshAccessToken();
        onRefreshed(accessToken);
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        isRefreshing = false;
      }
    }

    return new Promise((resolve) => {
      subscribeTokenRefresh(async (newToken) => {
        options.headers.Authorization = `Bearer ${newToken}`;
        resolve(fetch(url, options));
      });
    });
  }

  return response;
};

const testMultipleRequests = async () => {
  await login();

  const requests = Array.from({ length: 5 }, (_, i) => 
    setTimeout(() => {
      customFetch(`${BASE_URL}/protected`)
        .then(res => res.json())
        .then(data => console.log(`Response ${i + 1}:`, data))
        .catch(err => console.error(`Error ${i + 1}:`, err));
    }, i * 2000)
  );
};

testMultipleRequests();
