import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuthStore } from './stores/useAuthStore';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import GuideDashboard from './pages/GuideDashboard';
import Slots from './pages/Slots';
import MyBookings from './pages/MyBookings';
import QRPass from './pages/QRPass';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import { UserRole } from './types';

function PrivateRoute({ children, roles }: { children: React.ReactNode; roles?: UserRole[] }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function App() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to="/" replace /> : <Register />}
          />

          {/* Guide Routes */}
          <Route
            path="/"
            element={
              <PrivateRoute roles={[UserRole.GUIDE]}>
                <GuideDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/slots"
            element={
              <PrivateRoute roles={[UserRole.GUIDE]}>
                <Slots />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <PrivateRoute roles={[UserRole.GUIDE]}>
                <MyBookings />
              </PrivateRoute>
            }
          />
          <Route
            path="/qr-pass"
            element={
              <PrivateRoute roles={[UserRole.GUIDE]}>
                <QRPass />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute roles={[UserRole.GUIDE]}>
                <Profile />
              </PrivateRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <PrivateRoute roles={[UserRole.ADMIN, UserRole.COORDINATOR]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
