import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, Protected, useAuth } from './auth';
import { Layout } from './components';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Suppliers from './pages/Suppliers';
import Expenses from './pages/Expenses';
import Users from './pages/Users';

function RoleRoute({ roles, children }) { return roles.includes(useAuth().user?.role) ? children : <Navigate to="/" replace/>; }
const Inside = ({children}) => <Protected><Layout>{children}</Layout></Protected>;
export default function App(){return <BrowserRouter><AuthProvider><Routes><Route path="/login" element={<Login/>}/><Route path="/" element={<Inside><Dashboard/></Inside>}/><Route path="/suppliers" element={<Inside><RoleRoute roles={['admin','accounts']}><Suppliers/></RoleRoute></Inside>}/><Route path="/expenses" element={<Inside><Expenses/></Inside>}/><Route path="/users" element={<Inside><RoleRoute roles={['admin']}><Users/></RoleRoute></Inside>}/><Route path="*" element={<Navigate to="/"/>}/></Routes></AuthProvider></BrowserRouter>}

