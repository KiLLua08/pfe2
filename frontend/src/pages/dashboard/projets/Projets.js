import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Projets = () => {
    const [projets, setProjets] = useState([]);
    const [filteredProjets, setFilteredProjets] = useState([]);
    const [statutFilter, setStatutFilter] = useState('');
    const [clientFilter, setClientFilter] = useState('');
    const [clients, setClients] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjets = async () => {
            try {
                const response = await axios.get('/projet');
                setProjets(response.data);
                setFilteredProjets(response.data); // Initialize filtered data
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        fetchProjets();
    }, []);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await axios.get('/utilisateur/role/client'); // Adjust the endpoint as necessary
                setClients(response.data);
            } catch (error) {
                console.error('Error fetching clients:', error);
            }
        };

        fetchClients();
    }, []);

    const handleEdit = (id) => {
        navigate(`/dashboard/projet/update/${id}`);
    };
    const handleUserStories = (id) => {
        navigate(`/dashboard/projet/userstories/${id}`);
    };

    const handleSprints = (id) => {
        navigate(`/dashboard/projet/sprint/${id}`);
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?');
        if (confirmed) {
            try {
                const token = localStorage.getItem('token'); // Retrieve the token from local storage or another secure place
                await axios.delete(`/projet/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}` // Include the token in the request headers
                    }
                });
                setProjets(projets.filter(projet => projet.id !== id));
                setFilteredProjets(filteredProjets.filter(projet => projet.id !== id));
            } catch (error) {
                console.error('Error deleting project:', error);
            }
        }
    };

    const handleStatutChange = (e) => {
        const value = e.target.value;
        setStatutFilter(value);
        filterData(value, clientFilter);
    };

    const handleClientChange = (e) => {
        const value = e.target.value;
        setClientFilter(value);
        filterData(statutFilter, value);
    };

    const filterData = (statut, clientId) => {
        let filteredData = [...projets];

        if (statut) {
            filteredData = filteredData.filter(projet => projet.statut === statut);
        }

        if (clientId) {
            filteredData = filteredData.filter(projet => projet.clientId === parseInt(clientId));
        }

        setFilteredProjets(filteredData);
    };

    return (
        <section className="mb-xl-9 my-5">
            <div className="container">
                <div className="row mb-4">
                    <div className="col-lg-12">
                        <div className="mb-4">
                            <h3 className="mb-4">Liste des Projets</h3>
                        </div>
                    </div>
                    <div className="col-lg-12 d-flex justify-content-end mb-3">
                        <Link to="/dashboard/projets/create" className="btn btn-primary">
                            Créer un projet
                        </Link>
                    </div>
                </div>

                <div className="row mb-4">
                    <div className="col-lg-4">
                        <select
                            className="form-select"
                            value={statutFilter}
                            onChange={handleStatutChange}
                        >
                            <option value="">Tous les statuts</option>
                            <option value="non démarré">Non démarré</option>
                            <option value="en cours">En cours</option>
                            <option value="terminé">Terminé</option>
                        </select>
                    </div>

                    <div className="col-lg-4">
                        <select
                            className="form-select"
                            value={clientFilter}
                            onChange={handleClientChange}
                        >
                            <option value="">Tous les clients</option>
                            {clients.map(client => (
                                <option key={client.id} value={client.id}>
                                    {client.prenom} {client.nom}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="row g-5">
                    <table className="table" style={{ backgroundColor: 'white' }}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Client</th>
                                <th>Nom</th>

                                <th>Statut</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProjets.map(projet => (
                                <tr key={projet.id}>
                                    <td>{projet.id}</td>
                                    <td>{projet.client ? `${projet.client.prenom} ${projet.client.nom}` : 'N/A'}</td>
                                    <td>{projet.nom}</td>

                                    <td>{projet.statut}</td>
                                    <td>
                                        <button onClick={() => handleUserStories(projet.id)} className="btn btn-link">
                                            <i className="bi bi-file-text badge bg-primary">User Stories</i>
                                        </button>
                                        <button onClick={() => handleSprints(projet.id)} className="btn btn-link">
                                            <i className="bi bi-file-text badge bg-danger">Sprints</i>
                                        </button>
                                        <button onClick={() => handleEdit(projet.id)} className="btn btn-link">
                                            <i className="bi bi-pencil-square"></i>
                                        </button>


                                        <button onClick={() => handleDelete(projet.id)} className="btn btn-link text-danger ms-2">
                                            <i className="bi bi-trash"></i>
                                        </button>



                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};

export default Projets;
