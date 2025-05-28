import { Route, Routes } from 'react-router-dom';
import './App.css'
import LandingPage from './pages/LandingPage/LandingPage'
import SignUpPage from './pages/Sign up/sign-up-page';
import ConsultantPage from './pages/ConsultantPage/index';

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/consultant' element={<ConsultantPage />} />
      </Routes>
    </>
  )
}

export default App;
