// src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './features/store';
import { setAuth } from './features/authSlice';
import Login from './pages/Login';
import Register from './pages/Register';
// import DashboardPage from './pages/DashboardPage';
// import TaskListPage from './pages/TaskListPage';
import PrivateRoute from './utils/ProtectedRoute';
import axios from 'axios';
import DashboardLayoutBasic from './pages/Layout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotFound from './pages/NotFound';
import Layout from './pages/Layout';
import TaskList from './components/TaskList';
import Dashboard from './pages/Dashboard';
import TaskBoard from './pages/Taskboard';
import CreateTask from './components/CreateTask';
import UpdateTask from './components/UpdateTask';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      dispatch(setAuth({ token, user }));
    }
  }, [dispatch]);

  return (
    <>
      <ToastContainer position="top-center" />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<PrivateRoute allowedRoles={['admin']} />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          <Route element={<PrivateRoute allowedRoles={['admin', 'manager', 'employee']} />}>
            <Route path="/taskboard" element={<TaskBoard />} />
          </Route>

          <Route element={<PrivateRoute allowedRoles={['admin', 'manager']} />}>
            <Route path="/taskboard/create" element={<CreateTask />} />
          </Route>

          <Route element={<PrivateRoute allowedRoles={['admin', 'manager']} />}>
            <Route path="/taskboard/edit/:id" element={<UpdateTask />} />
          </Route>

          <Route path="/unauthorized" element={<NotFound />} />

          <Route
            path="/"
            element={authState.token ? (authState.user?.role === 'admin' ? <Navigate to="/dashboard" /> : <Navigate to="/taskboard" />) : <Navigate to="/login" />}
          />
        </Routes>
      </Router >
    </>
  );
};

export default App;
