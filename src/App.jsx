import { Route, Routes } from 'react-router-dom';
import './App.css'
import LandingPage from './pages/LandingPage/LandingPage'
import SignUpPage from './pages/Sign up/sign-up-page';
import ConsultantPage from './pages/ConsultantPage/index';
import MessagingPage from './pages/MessagingPage/messaging-page';
import SignInPage from './pages/Log in/sign-in-page';

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/login' element={<SignInPage />} />
        <Route path='/consultant' element={<ConsultantPage />} />
        <Route path='/messaging' element={<MessagingPage />} />
      </Routes>
    </>
  )
}

export default App;
