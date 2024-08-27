import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSnackbar } from 'notistack';

const ProjetCreate = () => {
    const [formData, setFormData] = useState({
        nom: '',
        description: '',
        clientId: '',
        chefProjetId: '',
        dateDebut: '',
        dateFin: '',
        statut: 'non démarré',
        budget: '',
        priorite: '',
        livrables: [''],
        risques: [''],
        jalons: ['']
    });

    const [clients, setClients] = useState([]);
    const [chefsDeProjet, setChefsDeProjet] = useState([]);
    const [roles, setRoles] = useState([

        'front_developer',
        'back_developer',
        'fullstack_developer',
        'designer',
        'qa_tester',
        'devops',

    ]);
    const [usersByRole, setUsersByRole] = useState([]);
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedUserId, setSelectedUserId] = useState('');
    const [teamMembers, setTeamMembers] = useState([]);
    const [teamLeader, setTeamLeader] = useState('');
    const [showTeamDiv, setShowTeamDiv] = useState(false);
    const [users, setUsers] = useState([]);

    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const token = localStorage.getItem('token'); // Retrieve the token from local storage or another secure place
                const response = await axios.get('/utilisateur', {
                    headers: {
                        Authorization: `Bearer ${token}` // Include the token in the request headers
                    }
                });
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchAllUsers();
    }, []);

    useEffect(() => {
        // Fetch clients and project managers
        const fetchClientsAndChefs = async () => {
            try {
                const clientsResponse = await axios.get('/utilisateur/role/client');
                setClients(clientsResponse.data);

                const chefsResponse = await axios.get('/utilisateur/role/project_manager');
                setChefsDeProjet(chefsResponse.data);
            } catch (error) {
                console.error('Error fetching clients or project managers:', error);
            }
        };

        fetchClientsAndChefs();
    }, []);

    const removeTeamMember = (index) => {
        setTeamMembers(prevMembers => prevMembers.filter((_, i) => i !== index));
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleArrayChange = (key, index, value) => {
        const newArray = [...formData[key]];
        newArray[index] = value;
        setFormData({
            ...formData,
            [key]: newArray
        });
    };

    const addToArray = (key) => {
        setFormData({
            ...formData,
            [key]: [...formData[key], '']
        });
    };

    const removeFromArray = (key, index) => {
        const newArray = formData[key].filter((_, i) => i !== index);
        setFormData({
            ...formData,
            [key]: newArray
        });
    };

    const handleSelectRole = async (e) => {
        const selectedRole = e.target.value;
        setSelectedRole(selectedRole);

        if (selectedRole) {
            try {
                const response = await axios.get(`/utilisateur/role/${selectedRole}`);
                setUsersByRole(response.data);
            } catch (error) {
                console.error('Error fetching users by role:', error);
            }
        } else {
            setUsersByRole([]);
        }
    };

    const handleAddTeamMember = () => {
        const selectedUser = users.find(user => user.id === Number(selectedUserId));

        if (selectedUser) {
            setTeamMembers(prevMembers => {
                // Check if the user already exists in the teamMembers array
                const userExists = prevMembers.some(member => member.id === selectedUser.id);

                if (userExists) {
                    // If the user already exists, return the previous members array unchanged
                    return prevMembers;
                } else {
                    // If the user does not exist, add the new member to the teamMembers array
                    return [...prevMembers, selectedUser];
                }
            });

            setSelectedUserId('');
            setSelectedRole('');
            console.log(teamMembers);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const token = localStorage.getItem('token'); // Retrieve the token from local storage or another secure place
            const response = await axios.post('/projet', {
                ...formData,
                livrables: formData.livrables,
                risques: formData.risques,
                jalons: formData.jalons,
                teamMembers,
                teamLeader
            }, {
                headers: {
                    Authorization: `Bearer ${token}` // Include the token in the request headers
                }
            });
            enqueueSnackbar('Projet créé avec succès.', { variant: 'success' });
            navigate('/dashboard/projet');
        } catch (error) {
            enqueueSnackbar('Erreur lors de la création du projet.', { variant: 'error' });
            console.error('Error creating project:', error);
        }
    };

    return (
        <section className="py-5 py-lg-8">
            <div className="container">
                <div className="row">
                    <div className="col-xl-12 col-md-12 col-12">
                        <h1 className="mb-1">Créer un Projet</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="row mb-3">
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="clientId">Client</label>
                                        <select
                                            className="form-control"
                                            id="clientId"
                                            name="clientId"
                                            value={formData.clientId}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Sélectionner un client</option>
                                            {clients.map(client => (
                                                <option key={client.id} value={client.id}>
                                                    {client.nom} {client.prenom}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="chefProjetId">Chef de Projet</label>
                                        <select
                                            className="form-control"
                                            id="chefProjetId"
                                            name="chefProjetId"
                                            value={formData.chefProjetId}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Sélectionner un chef de projet</option>
                                            {chefsDeProjet.map(chef => (
                                                <option key={chef.id} value={chef.id}>
                                                    {chef.nom} {chef.prenom}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="statut">Statut</label>
                                        <select
                                            className="form-control"
                                            id="statut"
                                            name="statut"
                                            value={formData.statut}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="non démarré">Non démarré</option>
                                            <option value="en cours">En cours</option>
                                            <option value="terminé">Terminé</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="dateDebut">Date de Début</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="dateDebut"
                                            name="dateDebut"
                                            value={formData.dateDebut}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="dateFin">Date de Fin</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="dateFin"
                                            name="dateFin"
                                            value={formData.dateFin}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="budget">Budget</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="budget"
                                            name="budget"
                                            value={formData.budget}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="priorite">Priorité</label>
                                        <select
                                            className="form-select"
                                            id="priorite"
                                            name="priorite"
                                            value={formData.priorite}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Sélectionner une priorité</option>
                                            <option value="haute">Haute</option>
                                            <option value="moyenne">Moyenne</option>
                                            <option value="basse">Basse</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-4"></div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <br></br>
                                        <button type="button" className="btn btn-primary float-end" onClick={() => setShowTeamDiv(!showTeamDiv)}>
                                            {showTeamDiv ? 'Masquer la sélection de l\'équipe' : 'Sélectionner l\'équipe'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-3" >
                                {showTeamDiv && (
                                    <div className="row mb-3 shadow-div" >
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="role">Rôle</label>
                                                <select
                                                    className="form-control"
                                                    id="role"
                                                    value={selectedRole}
                                                    onChange={handleSelectRole}
                                                >
                                                    <option value="">Sélectionner un rôle</option>
                                                    {roles.map(role => (
                                                        <option key={role} value={role}>{role}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="user">Utilisateur</label>
                                                <select
                                                    className="form-control"
                                                    id="user"
                                                    value={selectedUserId}
                                                    onChange={(e) => setSelectedUserId(e.target.value)}
                                                >
                                                    <option value="">Sélectionner un utilisateur</option>
                                                    {usersByRole.map(user => (
                                                        <option key={user.id} value={user.id}>
                                                            {user.nom} {user.prenom}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <br />
                                            <button type="button" className="btn btn-secondary float-end" onClick={handleAddTeamMember}>
                                                Ajouter à l'équipe
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {teamMembers.length > 0 && (
                                    <div className="mb-3 shadow-div">
                                        <h4>Équipe</h4>
                                        <ul className="list-group">
                                            {teamMembers.map((member, index) => (
                                                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                                    <span>
                                                        {member.nom} {member.prenom} ({member.role})
                                                    </span>
                                                    <div className="d-flex align-items-center">
                                                        <div className="form-check me-3">
                                                            <input
                                                                className="form-check-input"
                                                                type="radio"
                                                                id={`teamLeader-${member.id}`}  // Unique ID for each radio button
                                                                name="teamLeader"
                                                                value={member.id}

                                                                onChange={(e) => setTeamLeader(e.target.value)}
                                                            />
                                                            <label
                                                                className="form-check-label"
                                                                htmlFor={`teamLeader-${member.id}`}  // Match with the radio button ID
                                                            >
                                                                Chef d'équipe
                                                            </label>
                                                        </div>
                                                        <i
                                                            className="bi bi-trash text-danger cursor-pointer"
                                                            onClick={() => removeTeamMember(index)}
                                                        >
                                                        </i>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                            </div>
                            <div className="row mb-3">
                                <div className="form-group">
                                    <label htmlFor="nom">Nom Projet</label>
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
                            <div className="row mb-3">
                                <div className="form-group">
                                    <label htmlFor="description">Description</label>
                                    <textarea
                                        className="form-control"
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="5"
                                        required
                                    ></textarea>
                                </div>
                            </div>
                            {/* Livrables, Risques, and Jalons */}
                            {['livrables', 'risques', 'jalons'].map((key) => (
                                <div key={key} className="row mb-3">
                                    <div className="form-group">
                                        <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                                        {formData[key].map((item, index) => (
                                            <div key={index} className="d-flex mb-2">
                                                <input
                                                    type="text"
                                                    className="form-control me-2"
                                                    value={item}
                                                    onChange={(e) => handleArrayChange(key, index, e.target.value)}
                                                    required
                                                />

                                                <i className="bi bi-trash text-danger cursor-pointer" onClick={() => removeFromArray(key, index)}
                                                ></i>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => addToArray(key)}
                                        >
                                            Ajouter {key.slice(0, -1)}
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {/* Team Selection */}


                            <button type="submit" className="btn btn-primary">
                                Créer le Projet
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProjetCreate;
