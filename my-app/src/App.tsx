import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from "react-redux";

import { AllLanguages, LanguagesTable, LanguageInfo, LanguageEdit, AllForms, FormInfo, Authorization, Registration } from './pages'
import NavigationBar from './components/NavBar';

import { AppDispatch } from "./store";
import { setLogin, setRole } from "./store/userSlice";

import AuthCheck, { STUDENT, MODERATOR } from './components/AuthCheck'

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const login = localStorage.getItem('login');
    const role = localStorage.getItem('role');
    if (login && role) {
      dispatch(setLogin(login));
      dispatch(setRole(parseInt(role)));
    }
  }, [dispatch]);

  return (
    <div className='d-flex flex-column vh-100'>
      <NavigationBar />
      <div className='container-xl d-flex flex-column px-2 px-sm-3 flex-grow-1'>
        <Routes>
          <Route path="/" element={<Navigate to="/languages" />} />
          <Route path="/languages" element={<AllLanguages />} />
          <Route path="/languages/:languages_id" element={<LanguageInfo />} />
          <Route path="/languages-edit" element={<AuthCheck allowedRoles={[MODERATOR]}><LanguagesTable /></AuthCheck>} />
          <Route path="/languages-edit/:languages_id" element={<AuthCheck allowedRoles={[MODERATOR]}><LanguageEdit /></AuthCheck>} />

          <Route path="/forms" element={<AuthCheck allowedRoles={[STUDENT, MODERATOR]}><AllForms /></AuthCheck>} />
          <Route path="/forms/:form_id" element={<AuthCheck allowedRoles={[STUDENT, MODERATOR]}><FormInfo /></AuthCheck>} />

          <Route path="/registration" element={<Registration />} />
          <Route path="/authorization" element={<Authorization />} />
        </Routes>
      </div>
    </div>
  )
}

export default App