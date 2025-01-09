import axios from 'axios';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export const signIn = async (email: string, password: string) => {
  const { data } = await axios.post(`${backendUrl}/auth/signin`, { email, password });
  
  // Stocker le token JWT localement
  sessionStorage.setItem('token', data.token);

      return data;
  };
  

export const signUp = async (email: string, password: string) => {
  const { data } = await axios.post(`${backendUrl}/signup`, { email, password });
  sessionStorage.setItem('token', data.token);
}
export const logout = async () => {
  try {
    const { data } = await axios.post(`${backendUrl}/auth/logout`);
    console.log('Logged out:', data.message);
    return data;
  } catch (error) {
    console.error('Logout error:', error.message);
    return { error: error.message };
  }
};

export const apiRequest = async (url:any, method:any) => {
  const token = localStorage.getItem('token');
  return axios({
    method,
    url: `${backendUrl}/${url}`,
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};
