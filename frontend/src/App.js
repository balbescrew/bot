import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage/MainPage';
import WarningsPage from './pages/WarningsPage/WarningsPage';
import ChatsListPage from './pages/ChatsListPage/ChatsListPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/chats" element={<ChatsListPage />} />
        <Route path="/warnings" element={<WarningsPage />} />
      </Routes>
    </Router>
  );
}

export default App;