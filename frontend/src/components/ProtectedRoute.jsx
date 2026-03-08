import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // state={{ from: location }} 这里的目的是：等用户登录成功后，能自动跳回他原本想去的页面
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}