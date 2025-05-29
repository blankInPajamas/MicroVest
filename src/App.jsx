import { Route, Routes } from 'react-router-dom';
import './App.css'
import LandingPage from './pages/LandingPage/LandingPage'
import SignUpPage from './pages/Sign up/sign-up-page';
import ConsultantPage from './pages/ConsultantPage/index';
import ChatArea from './pages/MessagingPage/ChatArea';

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/consultant' element={<ConsultantPage />} />
        <Route path='/messaging' element={<ChatArea />} />
      </Routes>
    </>
  )
}

export default App;
