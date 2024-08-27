import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    if(localStorage.getItem('role')!=='client')
        navigate('/dashboard');
    else
    navigate('/'); // Redirect to home page or any other page
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
                    src="assets/images/logo/brand-icon.svg" // Update with your logo path if needed
                    alt="brand"
                    className="mb-3"
                  />
                </a>
                <h1 className="mb-1">404</h1>
                <h2 className="mb-3">Page Non Trouvée</h2>
                <p>Désolé, la page que vous recherchez n'existe pas.</p>
                <button onClick={handleHomeClick} className="btn btn-primary">
                  Retour à l'accueil
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default NotFoundPage;
