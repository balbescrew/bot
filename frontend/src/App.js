import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainPage from './pages/MainPage/MainPage';
import WarningsPage from './pages/WarningsPage/WarningsPage';
import ChatsListPage from './pages/ChatsListPage/ChatsListPage';
import AuthPage from './pages/AuthPage/AuthPage';
import { isAuthenticated } from './services/auth';

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainPage />
            </PrivateRoute>
          }
        />
        <Route path="/chats" element={<ChatsListPage />} />
        <Route path="/warnings" element={<WarningsPage />} />
      </Routes>
    </Router>
  );
}

export default App;