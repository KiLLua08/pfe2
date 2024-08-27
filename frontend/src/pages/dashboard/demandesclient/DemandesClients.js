import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DemandesClients = () => {
    const [demandesClient, setDemandesClient] = useState([]);
    const [filteredDemandesClient, setFilteredDemandesClient] = useState([]);
    const [etatFilter, setEtatFilter] = useState('');
    const [clientFilter, setClientFilter] = useState('');
    const [clients, setClients] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDemandesClient = async () => {
            try {
                const token = localStorage.getItem('token'); // Adjust this based on where you store your token

                const response = await axios.get('/demande-client', {
                    headers: {
                        'Authorization': `Bearer ${token}` // Include the token in the Authorization header
                    }
                });

                setDemandesClient(response.data);
                setFilteredDemandesClient(response.data); // Initialize filtered data
            } catch (error) {
                console.error('Error fetching demandes client:', error);
            }
        };

        fetchDemandesClient();
    }, []);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const token = localStorage.getItem('token'); // Adjust this based on where you store your token

                const response = await axios.get('/utilisateur/role/client', {
                    headers: {
                        'Authorization': `Bearer ${token}` // Include the token in the Authorization header
                    }
                });// Adjust the endpoint as necessary
                setClients(response.data);
            } catch (error) {
                console.error('Error fetching clients:', error);
            }
        };

        fetchClients();
    }, []);

    const handleEdit = (id) => {
        navigate(`/dashboard/demandes-client/update/${id}`);
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm('Êtes-vous sûr de vouloir supprimer cette demande ?');
        if (confirmed) {
            try {
                const token = localStorage.getItem('token'); // Retrieve the token from local storage or another secure place
                await axios.delete(`/demande-client/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}` // Include the token in the request headers
                    }
                });
                setDemandesClient(demandesClient.filter(demande => demande.id !== id));
                setFilteredDemandesClient(filteredDemandesClient.filter(demande => demande.id !== id));
            } catch (error) {
                console.error('Error deleting demande client:', error);
            }
        }
    };

    const handleEtatChange = (e) => {
        const value = e.target.value;
        setEtatFilter(value);
        filterData(value, clientFilter);
    };

    const handleClientChange = (e) => {
        const value = e.target.value;
        setClientFilter(value);
        filterData(etatFilter, value);
    };

    const filterData = (etat, clientId) => {
        let filteredData = [...demandesClient];

        if (etat) {
            filteredData = filteredData.filter(demande => demande.etat === etat);
        }

        if (clientId) {
            filteredData = filteredData.filter(demande => demande.clientDemande.id === parseInt(clientId));
        }

        setFilteredDemandesClient(filteredData);
    };

    return (
        <section className="mb-xl-9 my-5">
            <div className="container">
                <div className="row mb-4">
                    <div className="col-lg-12">
                        <div className="mb-4">
                            <h3 className="mb-4">Liste des Demandes Client</h3>
                        </div>
                    </div>
                    <div className="col-lg-12 d-flex justify-content-end mb-3">
                        <Link to="/dashboard/demandes-client/create" className="btn btn-primary">
                            Créer une demande
                        </Link>
                    </div>
                </div>

                <div className="row mb-4">
                    <div className="col-lg-4">
                        <select
                            className="form-select"
                            value={etatFilter}
                            onChange={handleEtatChange}
                        >
                            <option value="">Tous les états
                            </option>
                            <option value="En attente traitement">En attente traitement</option>
                            <option value="En cours">En cours</option>
                            <option value="Traité">Traité</option>
                            <option value="Annulé">Annulé</option>
                        </select>
                    </div>

                    <div className="col-lg-4">
                        <select
                            className="form-select"
                            value={clientFilter}
                            onChange={handleClientChange}
                        >
                            <option value="">Tous les clients
                            </option>
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
                                <th>État</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDemandesClient.map(demande => (
                                <tr key={demande.id}>
                                    <td>{demande.id}</td>
                                    <td>{demande.clientDemande.prenom} {demande.clientDemande.nom}</td>
                                    <td>{demande.etat}</td>
                                    <td>
                                        <button onClick={() => handleEdit(demande.id)} className="btn btn-link">
                                            <i className="bi bi-pencil-square"></i>
                                        </button>
                                        <button onClick={() => handleDelete(demande.id)} className="btn btn-link text-danger ms-2">
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

export default DemandesClients;
