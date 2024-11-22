import { Formik, Form, Field } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import useAxios from '../hooks/useAxios';

const Login = () => {
  const navigate = useNavigate();
  const axios = useAxios();

  const loginSchema = Yup.object().shape({
    identificacion: Yup.string().required('Requerido'),
    password: Yup.string().min(4, 'Mínimo 4 caracteres').required('Requerido'),
  });

  const handleSubmit = async (values:any) => {
    try {
      const response = await axios.post('/auth/login', values);
      const { token } = response.data;

      localStorage.setItem('token', token);
      navigate('/table');
    } catch (error) {
      console.error('Error en login:', error);
      alert("Credenciales incorrectas o error en el servidor");
    }
  };

  const irRegister = () => {
    navigate('/register');
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg">
        <h2 className="text-2xl text-white mb-6 text-center">Ingresar</h2>
        <Formik
          initialValues={{ identificacion: '', password: '' }}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form className="space-y-4">
              <div>
                <label htmlFor="identificacion" className="block text-white">Identificación</label>
                <Field name="identificacion" type="text" className="w-full p-2 bg-gray-700 text-white rounded" />
                {errors.identificacion && touched.identificacion ? <div className="text-red-500">{errors.identificacion}</div> : null}
              </div>
              <div>
                <label htmlFor="password" className="block text-white">Contraseña</label>
                <Field name="password" type="password" className="w-full p-2 bg-gray-700 text-white rounded" />
                {errors.password && touched.password ? <div className="text-red-500">{errors.password}</div> : null}
              </div>
              <button type="submit" className="w-full p-2 bg-blue-500 hover:bg-blue-600 text-white rounded">Entrar</button>
              <button type="button" onClick={irRegister} className="w-full p-2 bg-blue-500 hover:bg-blue-600 text-white rounded">Registrar</button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
