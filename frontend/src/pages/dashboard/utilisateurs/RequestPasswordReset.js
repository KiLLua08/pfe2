import React, { useState } from 'react';
import axios from 'axios';

const RequestPasswordReset = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/utilisateur/request-password-reset', { email });
      if (response.status === 200) {
        setMessage('Un lien de réinitialisation du mot de passe a été envoyé à votre adresse e-mail.');
      }
    } catch (error) {
      setMessage('Erreur lors de l\'envoi du lien de réinitialisation du mot de passe.');
      console.error('Password reset request failed:', error);
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
                <h1 className="mb-1">Demande de réinitialisation du mot de passe</h1>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Adresse e-mail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <br/>
                  <button type="submit" className="btn btn-primary">
                    Envoyer le lien de réinitialisation
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

export default RequestPasswordReset;
