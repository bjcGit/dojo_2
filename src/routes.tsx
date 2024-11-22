import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './views/Login';
import Register from './views/Register';
import TableView from './views/TableView';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>        
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />       
        <Route path="/table" element = { <TableView /> }/>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
