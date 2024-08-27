import React from 'react';
import { HashRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './pages/Header';
import Footer from './pages/Footer';
import Home from './pages/Home';
import SiteForm from './pages/SiteForm';
import Contactexpert from './pages/Contactexpert';
import Login from './pages/Login';
import Dashboard from './pages/dashboard/Dashboard';
import ConfirmEmail from './pages/dashboard/utilisateurs/ConfirmEmail';
import ResetPassword from './pages/dashboard/utilisateurs/ResetPassword';
import ResetPasswordReset from './pages/dashboard/utilisateurs/RequestPasswordReset';
import ChatButton from './pages/dashboard/chats/ChatButton';
import DemandeClientForm from './pages/DemandeClientForm';
import axios from 'axios';
import NotFoundPage from './pages/NotFoundPage';
import { SnackbarProvider, useSnackbar } from 'notistack';
function App() {

  axios.defaults.baseURL = 'http://localhost:5000/api/';
  return (
    <div className="App">
      <SnackbarProvider maxSnack={3}>
        <main>
          <Router>
            <AppRoutes />
          </Router>

        </main>
      </SnackbarProvider>
    </div>
  );
}

function AppRoutes() {
  const location = useLocation();
  const hideHeader = location.pathname === '/login' || location.pathname.includes('confirm') || location.pathname.includes('reset'); // Hide header on login page
  const hideFooter = location.pathname.includes('dashboard');
  const role = localStorage.getItem('role') === "client" || localStorage.getItem('role') === null;
  return (
    <>
      {!hideHeader && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/confirm/:token" element={<ConfirmEmail />} />
        <Route path="/reset/:token" element={<ResetPassword />} />
        <Route path="/reset/request" element={<ResetPasswordReset />} />
        <Route path="/contact" element={<Contactexpert />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/siteform" element={<DemandeClientForm />} />
        <Route path="*" element={<NotFoundPage />} />
        {/* Add more routes here as needed */}
      </Routes>
      {(!hideHeader && role) && <ChatButton />}

      {(!hideHeader && !hideFooter) && <Footer />}
    </>
  );
}

export default App;

//12345 mdp
