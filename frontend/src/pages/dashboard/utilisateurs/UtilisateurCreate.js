import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UtilisateurCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    mdp: '',
    role: 'none',
    img: null,
    etat: true
  });
  const [expertiseList, setExpertiseList] = useState([]);
  const [currentExpertise, setCurrentExpertise] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      img: e.target.files[0],
    });
  };

  const handleExpertiseChange = (e) => {
    setCurrentExpertise(e.target.value);
  };

  const addExpertise = () => {
    if (currentExpertise.trim() !== '') {
      setExpertiseList([...expertiseList, currentExpertise]);
      setCurrentExpertise('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.role === 'none') {
      setError('Veuillez sélectionner un rôle.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const data = new FormData();
      data.append('nom', formData.nom);
      data.append('prenom', formData.prenom);
      data.append('email', formData.email);
      data.append('mdp', formData.mdp);
      data.append('role', formData.role);
      data.append('etat', true);
      if (formData.img) {
        data.append('img', formData.img);
      }
      if (formData.role !== 'client' && formData.role !== 'admin' && expertiseList.length > 0) {
        data.append('expertise', JSON.stringify(expertiseList));
      }

      const response = await axios.post('/utilisateur', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess('Utilisateur créé avec succès !');
      navigate("/dashboard/utilisateurs");
      setError(null);
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        mdp: '',
        role: 'none',
        img: null,
      });
      setExpertiseList([]);
    } catch (error) {
      setError(error.response ? error.response.data.error : 'An error occurred');
      setSuccess(null);
    }
  };

  return (
    <section className="py-5 py-lg-8">
      <div className="container">
        <div className="row">
          <div className="col-xl-12 offset-xl-12 col-md-12 col-12">
            <h1 className="mb-1">Créer un utilisateur</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-xl-6 col-md-6 col-6">
                  <div className="form-group">
                    <label htmlFor="nom">Nom</label>
                    <input
                      type="text"
                      className="form-control"
                      id="nom"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-xl-6 col-md-6 col-6">
                  <div className="form-group">
                    <label htmlFor="prenom">Prénom</label>
                    <input
                      type="text"
                      className="form-control"
                      id="prenom"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-xl-6 col-md-6 col-6">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-xl-6 col-md-6 col-6">
                  <div className="form-group">
                    <label htmlFor="mdp">Mot de passe</label>
                    <input
                      type="password"
                      className="form-control"
                      id="mdp"
                      name="mdp"
                      value={formData.mdp}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>


              <div className="row">
                <div className="col-xl-6 col-md-6 col-6">
                  <div className="form-group">
                    <label htmlFor="img">Image de profil</label>
                    <input
                      type="file"
                      className="form-control"
                      id="img"
                      name="img"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                  </div>
                </div>
                <div className="col-xl-6 col-md-6 col-6">
                  <div className="form-group">
                    <label htmlFor="role">Rôle</label>
                    <select
                      className="form-control"
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                    >
                      <option value="none">Veuillez sélectionner un rôle</option>
                      <option value="admin">Admin</option>
                      <option value="client">Client</option>
                      <option value="project_manager">Project Manager</option>
                      <option value="front_developer">Front Developer</option>
                      <option value="back_developer">Back Developer</option>
                      <option value="fullstack_developer">Fullstack Developer</option>
                      <option value="designer">Designer</option>
                      <option value="qa_tester">QA Tester</option>
                      <option value="devops">DevOps</option>
                    </select>
                  </div>
                </div>
              </div>

              {(formData.role !== 'client' && formData.role !== 'admin') && (
                <div className="row">
                  <div className="col-xl-12 col-md-12 col-12">
                    <div className="form-group">
                      <label htmlFor="expertise">Expertise</label>
                      <div className="d-flex">
                        <input
                          type="text"
                          className="form-control"
                          id="expertiseInput"
                          value={currentExpertise}
                          onChange={handleExpertiseChange}
                        />
                        <button
                          type="button"
                          className="btn btn-primary ms-2"
                          onClick={addExpertise}
                        >
                          Ajouter
                        </button>
                      </div>
                      {expertiseList.length > 0 && (
                        <ul className="list-group mt-2">
                          {expertiseList.map((expertise, index) => (
                            <li key={index} className="list-group-item">
                              {expertise}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <br />
              <button type="submit" className="btn btn-primary">
                Créer
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UtilisateurCreate;
