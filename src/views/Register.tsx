import { Formik, Form, Field } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import useAxios from '../hooks/useAxios';

const Register = () => {
  const navigate = useNavigate();
  const axios = useAxios();

  const registerSchema = Yup.object().shape({
    identificacion: Yup.string().required('Requerido'),
    nombre: Yup.string().required('Requerido'),
    password: Yup.string().min(4, 'Mínimo 4 caracteres').required('Requerido'),
    fecha_naci: Yup.date().required('Requerido'),
    correo: Yup.string().email('Formato de correo inválido').required('Requerido'),
    celular: Yup.string().matches(/^\d+$/, 'Solo números').required('Requerido'),
  });

  const handleSubmit = async (values:any) => {
    try {
      await axios.post('/users', values);
      alert("Usuario registrado exitosamente");
      navigate('/login');
    } catch (error) {
      console.error('Error en el registro:', error);
      alert("Error al registrar el usuario, verifica los datos o inténtalo más tarde");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg">
        <h2 className="text-2xl text-white mb-6 text-center">Registra tus datos</h2>
        <Formik
          initialValues={{
            identificacion: '',
            nombre: '',
            password: '',
            fecha_naci: '',
            correo: '',
            celular: '',
          }}
          validationSchema={registerSchema}
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
                <label htmlFor="nombre" className="block text-white">Nombre</label>
                <Field name="nombre" type="text" className="w-full p-2 bg-gray-700 text-white rounded" />
                {errors.nombre && touched.nombre ? <div className="text-red-500">{errors.nombre}</div> : null}
              </div>
              <div>
                <label htmlFor="password" className="block text-white">Contraseña</label>
                <Field name="password" type="password" className="w-full p-2 bg-gray-700 text-white rounded" />
                {errors.password && touched.password ? <div className="text-red-500">{errors.password}</div> : null}
              </div>
              <div>
                <label htmlFor="fecha_naci" className="block text-white">Fecha de Nacimiento</label>
                <Field name="fecha_naci" type="date" className="w-full p-2 bg-gray-700 text-white rounded" />
                {errors.fecha_naci && touched.fecha_naci ? <div className="text-red-500">{errors.fecha_naci}</div> : null}
              </div>
              <div>
                <label htmlFor="correo" className="block text-white">Correo</label>
                <Field name="correo" type="email" className="w-full p-2 bg-gray-700 text-white rounded" />
                {errors.correo && touched.correo ? <div className="text-red-500">{errors.correo}</div> : null}
              </div>
              <div>
                <label htmlFor="celular" className="block text-white">Celular</label>
                <Field name="celular" type="text" className="w-full p-2 bg-gray-700 text-white rounded" />
                {errors.celular && touched.celular ? <div className="text-red-500">{errors.celular}</div> : null}
              </div>
              <button type="submit" className="w-full p-2 bg-blue-500 hover:bg-blue-600 text-white rounded">Registrar</button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Register;
