import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useSnackbar } from 'notistack';

const ProjetUpdate = () => {
    const { id } = useParams(); // Retrieve the project ID from the URL
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
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        // Fetch clients
        const fetchClients = async () => {
            try {
                const response = await axios.get('/utilisateur/role/client');
                setClients(response.data);
            } catch (error) {
                console.error('Error fetching clients:', error);
            }
        };

        // Fetch project managers (chefs de projet)
        const fetchChefsDeProjet = async () => {
            try {
                const response = await axios.get('/utilisateur/role/project_manager');
                setChefsDeProjet(response.data);
            } catch (error) {
                console.error('Error fetching project managers:', error);
            }
        };

        // Fetch the existing project data
        const fetchProjectData = async () => {
            try {
                const response = await axios.get(`/projet/${id}`);
                const projectData = response.data;
                setFormData({
                    ...projectData,
                    livrables: JSON.parse(projectData.livrables || '[]'),
                    risques: JSON.parse(projectData.risques || '[]'),
                    jalons: JSON.parse(projectData.jalons || '[]')
                });

                setTeamMembers(projectData.membresEquipe)
                const leader = projectData.membresEquipe.find(member => member.chefEquipe === true);
                if (leader) {
                    setTeamLeader(leader.utilisateur.id);
                }

            } catch (error) {
                console.error('Error fetching project data:', error);
            }
        };

        fetchClients();
        fetchChefsDeProjet();
        fetchProjectData();
    }, [id]);

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
            const newMember = {
                role: selectedRole, // Ensure you have a valid role assigned
                utilisateur: {
                    id: selectedUser.id,
                    nom: selectedUser.nom,
                    prenom: selectedUser.prenom
                }
            };

            setTeamMembers(prevMembers => {
                // Check if the user already exists in the teamMembers array
                const userExists = prevMembers.some(member => member.utilisateur.id === newMember.utilisateur.id);

                if (userExists) {
                    // If the user already exists, return the previous members array unchanged
                    return prevMembers;
                } else {
                    // If the user does not exist, add the new member to the teamMembers array
                    return [...prevMembers, newMember];
                }
            });

            setSelectedUserId('');
            setSelectedRole('');
        }
    };



    const removeTeamMember = (index) => {
        setTeamMembers(prevMembers => prevMembers.filter((_, i) => i !== index));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token'); // Retrieve the token from local storage or another secure place
            await axios.put(`/projet/${id}`, {
                ...formData,
                livrables: formData.livrables,
                risques: formData.risques,
                jalons: formData.jalons,
                membresEquipe: teamMembers,
                teamLeader
            }, {
                headers: {
                    Authorization: `Bearer ${token}` // Include the token in the request headers
                }
            });
            enqueueSnackbar('Projet mis à jour avec succès.', { variant: 'success' });
            navigate('/dashboard/projet');
        } catch (error) {
            enqueueSnackbar('Erreur lors de la mise à jour du projet.', { variant: 'error' });
            console.error('Error updating project:', error);
        }
    };
    const handleTeamLeaderChange = (e) => {
        const selectedTeamLeaderId = Number(e.target.value);

        // Update the teamLeader state
        setTeamLeader(selectedTeamLeaderId);

        // Update the teamMembers state
        setTeamMembers((prevMembers) =>
            prevMembers.map((member) => ({
                ...member,
                chefEquipe: member.utilisateur.id === selectedTeamLeaderId ? true : null,
            }))
        );
    };

    return (
        <section className="py-5 py-lg-8">
            <div className="container">
                <div className="row">
                    <div className="col-xl-12 col-md-12 col-12">
                        <h1 className="mb-1">Mettre à Jour le Projet</h1>
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
                                            value={formData.dateDebut.slice(0, 10)}
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
                                            value={formData.dateFin.slice(0, 10)}
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
                                            className="form-control"
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
                                            {showTeamDiv ? 'Masquer la sélection de l\'équipe' : 'Mettre a jour l\'équipe'}
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
                                                        {member.utilisateur.nom} {member.utilisateur.prenom} ({member.role})
                                                    </span>
                                                    <div className="d-flex align-items-center">
                                                        <div className="form-check me-3">
                                                            <input
                                                                className="form-check-input"
                                                                type="radio"
                                                                id={`teamLeader-${member.utilisateur.id}`}  // Unique ID for each radio button
                                                                name="teamLeader"
                                                                value={member.utilisateur.id}
                                                                checked={Number(teamLeader) === Number(member.utilisateur.id)}   // Check if member is the team leader
                                                                onChange={handleTeamLeaderChange}
                                                            />
                                                            <label
                                                                className="form-check-label"
                                                                htmlFor={`teamLeader-${member.utilisateur.id}`}  // Match with the radio button ID
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
                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <textarea
                                    rows={5}
                                    className="form-control"
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>
                            <div className="form-group">
                                <label>Livrables</label>
                                {formData.livrables.map((livrable, index) => (
                                    <div key={index} className="d-flex align-items-center mb-2">
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={livrable}
                                            onChange={(e) => handleArrayChange('livrables', index, e.target.value)}
                                            required
                                        />
                                        <i className='bi bi-trash text-danger ms-2' onClick={() => removeFromArray('livrables', index)}></i>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    className="btn btn-secondary "
                                    onClick={() => addToArray('livrables')}
                                >
                                    Ajouter un livrable
                                </button>

                            </div>
                            <div className="form-group">
                                <label>Risques</label>
                                {formData.risques.map((risque, index) => (
                                    <div key={index} className="d-flex align-items-center mb-2">
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={risque}
                                            onChange={(e) => handleArrayChange('risques', index, e.target.value)}
                                            required
                                        />
                                        <i className='bi bi-trash text-danger ms-2' onClick={() => removeFromArray('risques', index)}></i>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => addToArray('risques')}
                                >
                                    Ajouter un risque
                                </button>
                                <br />
                            </div>
                            <div className="form-group">
                                <label>Jalons</label>
                                {formData.jalons.map((jalon, index) => (
                                    <div key={index} className="d-flex align-items-center mb-2">
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={jalon}
                                            onChange={(e) => handleArrayChange('jalons', index, e.target.value)}
                                            required
                                        />
                                        <i className='bi bi-trash text-danger ms-2' onClick={() => removeFromArray('jalons', index)}></i>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    className="btn btn-secondary "
                                    onClick={() => addToArray('jalons')}
                                >
                                    Ajouter un jalon
                                </button>
                                <br />
                            </div>
                            <button type="submit" className="btn btn-primary">Mettre à Jour le Projet</button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProjetUpdate;