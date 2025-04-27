import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StartScreen from './components/StartScreen';
import ChatScreen from './components/ChatScreen';

function App() {

  return (
    <Router>
    <Routes>
      <Route path="/" element={<StartScreen />} />
      <Route path="/chat" element={<ChatScreen />} />
    </Routes>
  </Router>
  )
}

export default App
