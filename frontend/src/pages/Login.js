import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';


const Login = ({ onSuccess, onFailure }) => {
  const [formData, setFormData] = useState({
    email: '',
    mdp: ''
  });
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const { email, mdp } = formData;



  const handleFailure = (error) => {
    console.error('Google sign-in failed. Error:', error);
  };


  const handleChange = e => {
    setError('')
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !mdp) {
      setError('Veuillez saisir votre adresse e-mail et votre mot de passe.');
      return;
    }

    try {
      const res = await axios.post('/auth/login', { email, mdp });
      const { token, nom, prenom, id, role } = res.data;
      const now = new Date();
      const expiryTime = now.getTime() + 60 * 60000; // Convert minutes to milliseconds


      localStorage.setItem('token', token);
      localStorage.setItem('nom', nom);
      localStorage.setItem('prenom', prenom);
      localStorage.setItem('id', id);
      localStorage.setItem('role', role);
      localStorage.setItem('expiry', expiryTime.toString());
      if (role === "client")
        navigate("/");
      else
        navigate("/dashboard");

      // Handle successful login, e.g., redirect to dashboard
    } catch (error) {
      const errorMessage = error.response && error.response.data ? error.response.data : 'Une erreur est survenue lors de la connexion.';
      setError(errorMessage); // Handle login error
    }
  };



  // google login
  const handleSuccess = async (response) => {
    try {
      // Send the ID token to your backend
      const res = await axios.post('/api/auth/google-login', { token: response.tokenId });

      // Store the received token in localStorage (or use cookies)
      localStorage.setItem('token', res.data.token);


      // Optionally, store other user information
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // Update application state if using a state management library
      // dispatch({ type: 'LOGIN_SUCCESS', payload: res.data.user });

      // Redirect the user to the dashboard or another page
      navigate('/');
    } catch (error) {
      console.error('Error authenticating with Google:', error);
    }
  };
  return (
    <>
      <div className="pattern-square" />
      {/*Pageheader start*/}
      <section className="py-5 py-lg-8">
        <div className="container">
          <div className="row">
            <div className="col-xl-4 offset-xl-4 col-md-12 col-12">
              <div className="text-center">
                <a href="index-2.html">
                  <img
                    src="assets/images/logo/brand-icon.svg"
                    alt="brand"
                    className="mb-3"
                  />
                </a>
                <h1 className="mb-1">Bienvenue</h1>
                <p className="mb-0">
                  Vous n'avez pas encore de compte?{' '}
                  <a href="signup.html" className="text-primary">
                    Inscrivez-vous ici
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*Pageheader end*/}
      {/*Sign up start*/}
      <section>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-5 col-lg-6 col-md-8 col-12">
              <div className="card shadow-sm mb-6">
                <div className="card-body">
                  <form
                    className="needs-validation mb-6"
                    noValidate
                    onSubmit={handleSubmit}
                  >
                    <div className="mb-3">
                      <label
                        htmlFor="signinEmailInput"
                        className="form-label"
                      >
                        Email
                        <span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="signinEmailInput"
                        name="email"
                        value={email}
                        onChange={handleChange}
                        required
                      />

                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor="formSignUpPassword"
                        className="form-label"
                      >
                        Mot de passe
                        <span className="text-danger">*</span>
                      </label>
                      <div className="password-field position-relative">
                        <input
                          type="password"
                          className="form-control fakePassword"
                          id="formSignUpPassword"
                          name="mdp"
                          value={mdp}
                          onChange={handleChange}
                          required
                        />
                        <span>
                          <i className="bi bi-eye-slash passwordToggler" />
                        </span>

                      </div>
                    </div>
                    {error && <div className="text-danger mb-3">{error}</div>}
                    <div className="mb-4 d-flex align-items-center justify-content-between">
                      <div>
                        <Link to="/reset/request"> Mot de passe oublié ? </Link>



                      </div>
                    </div>
                    <div className="d-grid">
                      <button className="btn btn-primary" type="submit">
                        Se connecter
                      </button>
                    </div>
                  </form>

                  <div className="d-grid mt-3">

                    {  /* google here*/}



                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*Sign up end*/}
    </>
  );
};

export default Login;
