import './App.css'
import { Routes, Route, Navigate  } from 'react-router-dom';

import { AllLanguages } from './pages/AllLanguages'
import { LanguageInfo } from './pages/LanguageInfo'

import { AllForms} from './pages/AllForms'
import NavigationBar from './components/NavBar';


function App() {
  
  
  return (
    <>
      <div className='container-xl px-2 px-sm-3'>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Navigate to="languages" />} />
        <Route path="/languages" element={<AllLanguages />} />
        <Route path="/languages/:languages_id" element={<LanguageInfo />} />
        <Route path="/forms" element={<AllForms />} />
      </Routes>
      </div>
    </>
  )
}

export default App