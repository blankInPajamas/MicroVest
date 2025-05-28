import './App.css'
import { Routes, Route } from 'react-router-dom';

import LandingPage from './pages/LandingPage/LandingPage'
import SignupPage from './pages/Sign up/sign-in-page';

function App() {

  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/signup' element={<SignupPage />} />
      </Routes>
    </div>
  )
}

export default App;
