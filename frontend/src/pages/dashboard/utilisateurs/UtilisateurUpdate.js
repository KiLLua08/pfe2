import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const UtilisateurUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

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

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/utilisateur/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Ensure expertiseList is an array
      const expertise = response.data.expertise;
      setFormData(response.data);

      if (expertise) {
        try {
          console.log(Array.isArray(JSON.parse(expertise)) ? JSON.parse(expertise) : [])
          setExpertiseList(Array.isArray(JSON.parse(expertise)) ? JSON.parse(expertise) : []);
        } catch {
          setExpertiseList([]);
        }
      } else {
        setExpertiseList([]);
      }

    } catch (error) {
      enqueueSnackbar('Failed to fetch user data', { variant: 'error' });
    }
  };

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

  const deleteExpertise = (index) => {
    const updatedExpertiseList = expertiseList.filter((_, i) => i !== index);
    setExpertiseList(updatedExpertiseList);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.role === 'none') {
      enqueueSnackbar('Veuillez sélectionner un rôle.', { variant: 'warning' });
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const data = new FormData();
      data.append('nom', formData.nom);
      data.append('prenom', formData.prenom);
      data.append('email', formData.email);
      data.append('role', formData.role);
      data.append('etat', formData.etat);
      if (formData.img) {
        data.append('img', formData.img);
      }
      // Ensure expertiseList is a JSON array, not a stringified JSON
      if (formData.role !== 'client' && formData.role !== 'admin' && expertiseList.length > 0) {
        expertiseList.forEach((expertise, index) => {
          data.append(`expertise[${index}]`, expertise);
        });
      } else {
        // Send an empty array if there are no expertises
        data.append('expertise', []);
      }

      await axios.put(`/utilisateur/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      enqueueSnackbar('Utilisateur mis à jour avec succès !', { variant: 'success' });
      navigate('/dashboard/utilisateurs');
    } catch (error) {
      enqueueSnackbar(error.response ? error.response.data.error : 'An error occurred', { variant: 'error' });
    }
  };


  return (
    <section className="py-5 py-lg-8">
      <div className="container">
        <div className="row">
          <div className="col-xl-12 offset-xl-12 col-md-12 col-12">
            <h1 className="mb-1">Modifier un utilisateur</h1>
            {error && <div className="alert alert-danger">{error}</div>}
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
              </div>

              <div className="row">

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
                            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                              {expertise}
                              <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                onClick={() => deleteExpertise(index)}
                              >
                                Supprimer
                              </button>
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
                Mettre à jour
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UtilisateurUpdate;
