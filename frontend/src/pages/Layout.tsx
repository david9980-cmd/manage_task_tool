import * as React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, Outlet, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LayersIcon from '@mui/icons-material/Layers';
import {
  AppProvider,
  type Session,
  type Navigation,
} from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import { useDemoRouter } from '../hooks/useDemoRouter';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../features/store';
import { logout } from '../features/authSlice';

const NAVIGATION = [
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />
  },
  {
    segment: 'taskboard',
    title: 'TaskBoard',
    icon: <LayersIcon />,
  },
];

interface LayoutProps {
  children: any
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const authState = useSelector((state: RootState) => state.auth);
  const user = authState.user;
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const router = useDemoRouter(location.pathname);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const filteredNavigation = NAVIGATION.filter((item) => {
    if (item.segment === 'dashboard' && user?.role === 'admin') {
      return true;
    }
    if (item.segment === 'taskboard') {
      return true;
    }
    return false;
  });

  const [session, setSession] = React.useState<Session | null>({
    user: {
      email: user?.email
    },
  });

  return (
    <AppProvider
      session={session}
      navigation={filteredNavigation}
      router={router}
      authentication={{
        signIn: () => {
        },
        signOut: () => {
          setSession(null)
          handleLogout()
        }
      }}
    >
      <DashboardLayout>
        <PageContainer>
          {children}
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}

export default Layout
