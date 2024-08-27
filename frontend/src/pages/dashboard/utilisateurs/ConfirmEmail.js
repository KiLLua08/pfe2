import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

const ConfirmEmail = ({ onSuccess, onFailure }) => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [etat,setEtat]=useState(0);
  useEffect(() => {
    const confirmEmail = async () => {

      console.log(token)
      if (token) {
        try {
          const response = await axios.get(`/utilisateur/confirm/${token}`);
          if (response.status === 200) {
            onSuccess && onSuccess(response.data);
            navigate('/login'); // Redirect to login page or any other page on success
          }
        } catch (error) {
          setEtat(1)
          onFailure && onFailure(error);
          console.error('Email confirmation failed:', error);
        }
      } else {
        console.error('No token found in URL');
      }
    };

    confirmEmail();
  }, [onSuccess, onFailure, navigate]);

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
                <h1 className="mb-1">Bienvenue</h1>
                
                {etat===0 ?(<h2>Confirmation email en cours...</h2>):(<h2>Echec confirmation email ...</h2>)}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ConfirmEmail;
