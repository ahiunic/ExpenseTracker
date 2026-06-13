<<<<<<< Updated upstream
=======
import { Component } from 'react';
>>>>>>> Stashed changes
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, Protected, useAuth } from './auth';
import { Layout } from './components';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Suppliers from './pages/Suppliers';
import Expenses from './pages/Expenses';
import Users from './pages/Users';

function RoleRoute({ roles, children }) { return roles.includes(useAuth().user?.role) ? children : <Navigate to="/" replace/>; }
<<<<<<< Updated upstream
const Inside = ({children}) => <Protected><Layout>{children}</Layout></Protected>;
export default function App(){return <BrowserRouter><AuthProvider><Routes><Route path="/login" element={<Login/>}/><Route path="/" element={<Inside><Dashboard/></Inside>}/><Route path="/suppliers" element={<Inside><RoleRoute roles={['admin','accounts']}><Suppliers/></RoleRoute></Inside>}/><Route path="/expenses" element={<Inside><Expenses/></Inside>}/><Route path="/users" element={<Inside><RoleRoute roles={['admin']}><Users/></RoleRoute></Inside>}/><Route path="*" element={<Navigate to="/"/>}/></Routes></AuthProvider></BrowserRouter>}
=======
class ErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) return <div className="card p-6"><h2 className="font-black text-red-700">This page could not be displayed</h2><p className="mt-2 text-sm text-slate-600">{this.state.error.message}</p><button className="btn-primary mt-4" onClick={() => location.reload()}>Reload page</button></div>;
    return this.props.children;
  }
}
const Inside = ({children}) => <Protected><Layout>{children}</Layout></Protected>;
export default function App(){return <BrowserRouter><AuthProvider><ErrorBoundary><Routes><Route path="/login" element={<Login/>}/><Route path="/" element={<Inside><Dashboard/></Inside>}/><Route path="/suppliers" element={<Inside><RoleRoute roles={['admin','accounts']}><Suppliers/></RoleRoute></Inside>}/><Route path="/expenses" element={<Inside><Expenses/></Inside>}/><Route path="/users" element={<Inside><RoleRoute roles={['admin']}><Users/></RoleRoute></Inside>}/><Route path="*" element={<Navigate to="/"/>}/></Routes></ErrorBoundary></AuthProvider></BrowserRouter>}
>>>>>>> Stashed changes

