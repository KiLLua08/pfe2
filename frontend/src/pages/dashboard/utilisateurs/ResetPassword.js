import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

const ResetPassword = ({ onSuccess, onFailure }) => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      const response = await axios.post(`/utilisateur/reset-password/${token}`, { newPassword });
      if (response.status === 200) {
        onSuccess && onSuccess(response.data);
        navigate('/login'); // Redirect to login page on success
      }
    } catch (error) {
      onFailure && onFailure(error);
      setMessage('Échec de la réinitialisation du mot de passe.');
      console.error('Password reset failed:', error);
    }
  };

  return (
    <>
      <div className="pattern-square" />
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
                <h1 className="mb-1">Réinitialiser le mot de passe</h1>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Nouveau mot de passe"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <br/>
                  <div className="form-group">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Confirmer le mot de passe"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <br/>
                  <button type="submit" className="btn btn-primary">
                    Réinitialiser le mot de passe
                  </button>
                </form>
                {message && <p>{message}</p>}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ResetPassword;
