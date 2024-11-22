import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import useAxios from "../hooks/useAxios";

interface Code {
  code: string;
  isWinner: boolean;
}

const TableView = () => {
  const [codes, setCodes] = useState<Code[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const axios = useAxios();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCodes();
  }, []);

  const fetchCodes = async () => {
    try {
      const response = await axios.get("/codes/user-codes");
      const codeList = response.data.codes.map((codeObj: any) => ({
        code: codeObj.code,
        isWinner: codeObj.isWinner,
      }));
      setCodes(codeList);
    } catch (error) {
      console.error("Error al obtener los códigos:", error);
      setErrorMessage("No se pudo obtener la lista de códigos, verifique su sesión.");
    }
  };

  const addCode = async (values: { code: string }) => {
    try {
      const response = await axios.post("/codes/claim", { code: values.code });
      if (response.data.success) {
        await fetchCodes();
        setErrorMessage("");
        alert(response.data.msg);
      } else {
        setErrorMessage("No se pudo guardar el código en la base de datos.");
      }
    } catch (error: any) {
      console.error("Error al agregar el código:", error);
      const backendMessage = error.response?.data?.msg || "Error al procesar el código";
      setErrorMessage(backendMessage);

      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  const validationSchema = Yup.object({
    code: Yup.string()
      .matches(/^\d{4}$/, "El código debe tener exactamente 4 dígitos numéricos.")
      .test("range", "El código debe estar entre 0000 y 0999", (value) => {
        const numberValue = parseInt(value || "", 10);
        return !isNaN(numberValue) && numberValue >= 0 && numberValue <= 999;
      })
      .required("El código es obligatorio"),
  });

  const handleLogout = () => {
    // Limpiar token de autenticación y redirigir a la página de inicio de sesión
    localStorage.removeItem("x-token"); // O sessionStorage.removeItem("x-token") según donde esté almacenado
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-4">
      <div className="w-full max-w-2xl relative">
        <button
          onClick={handleLogout}
          className="absolute top-0 left-0 p-2 bg-red-500 hover:bg-red-600 rounded text-white"
        >
          Cerrar sesión
        </button>
        <h1 className="text-3xl mb-4 text-center mt-8">Lista de Códigos</h1>
        <Formik initialValues={{ code: "" }} validationSchema={validationSchema} onSubmit={addCode}>
          {({ errors, touched }) => (
            <Form className="flex mb-4 justify-center">
              <Field
                name="code"
                type="text"
                className="p-2 bg-gray-800 text-white rounded-l"
                placeholder="Ingrese un código"
              />
              <button type="submit" className="p-2 bg-blue-500 hover:bg-blue-600 rounded-r">
                Agregar
              </button>
              {errors.code && touched.code ? (
                <div className="text-red-500 ml-2">{errors.code}</div>
              ) : null}
            </Form>
          )}
        </Formik>

        {errorMessage && <div className="text-red-500 mb-4 text-center">{errorMessage}</div>}

        {codes.length > 0 ? (
          <table className="w-full table-auto bg-gray-800 rounded mx-auto border border-gray-700">
            <thead>
              <tr>
                <th className="p-2 border-b border-gray-700">Código</th>
                <th className="p-2 border-b border-gray-700">Premio</th>
              </tr>
            </thead>
            <tbody>
              {codes.map((codeObj, index) => (
                <tr key={index} className="border-t border-gray-700">
                  <td className="p-2 text-center">{codeObj.code}</td>
                  <td className="p-2 text-center">
                    {codeObj.isWinner ? "¡Ganador!" : "No es ganador"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-400 mt-4">No has registrado ningún código aún.</p>
        )}
      </div>
    </div>
  );
};

export default TableView;
