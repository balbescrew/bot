export const storeToken = (token) => {
  localStorage.setItem('jwtToken', token);
};

export const getToken = () => {
  return localStorage.getItem('jwtToken');
};

export const clearToken = () => {
  localStorage.removeItem('jwtToken');
};