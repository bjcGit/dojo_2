import axios from 'axios';

const useAxios = () => {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL, 
  });

  // Interceptor para añadir el token en el header `x-token`
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['x-token'] = token;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return instance;
};

export default useAxios;
