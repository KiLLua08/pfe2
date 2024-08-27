import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

const TacheCreate = () => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [formData, setFormData] = useState({
        nom: '',
        description: '',
        priorite: 'none',
        statut: 'Nouveau',
        projetId: '',
        assigneeId: '',
        dateEcheance: '',
        userstoryId: ''
    });
    const [files, setFiles] = useState([]);
    const [projets, setProjets] = useState([]);
    const [users, setUsers] = useState([]);
    const [userStories, setUserStories] = useState([]);
    const [currentUser, setCurrentUser] = useState('');

    useEffect(() => {
        fetchProjets();
        fetchUsers();
        fetchCurrentUser(); // Fetch the current user
    }, []);

    useEffect(() => {
        if (formData.projetId) {
            fetchUserStoriesForProject(formData.projetId); // Fetch user stories when project changes
        } else {
            setUserStories([]);
        }
    }, [formData.projetId]);

    const fetchProjets = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/projet', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setProjets(response.data);
        } catch (error) {
            enqueueSnackbar('Error fetching projects: ' + error.message, { variant: 'error' });
        }
    };

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/utilisateur', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Filter out users with roles 'support', 'client', 'admin', or 'project_manager'
            const filteredUsers = response.data.filter(user =>
                !['support', 'client', 'admin', 'project_manager'].includes(user.role)
            );
            setUsers(filteredUsers);
        } catch (error) {
            console.error('Error fetching users:', error.message);
        }
    };

    const fetchCurrentUser = () => {
        const userId = localStorage.getItem('userId');
        setCurrentUser(userId);
        setFormData(prevState => ({
            ...prevState,
            assigneeId: userId // Set the current user as default assignee
        }));
    };

    const fetchUserStoriesForProject = async (projectId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`/userstories/projet/${projectId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUserStories(response.data);
        } catch (error) {
            enqueueSnackbar('Error fetching user stories: ' + error.message, { variant: 'error' });
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
        setFiles(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.priorite === 'none') {
            enqueueSnackbar('Veuillez sélectionner la priorité.', { variant: 'warning' });
            return;
        }
        if (!formData.dateEcheance) {
            enqueueSnackbar('Veuillez sélectionner une date d\'échéance.', { variant: 'warning' });
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const data = new FormData();
            data.append('nom', formData.nom);
            data.append('description', formData.description);
            data.append('priorite', formData.priorite);
            data.append('statut', formData.statut);
            data.append('projetId', formData.projetId);
            data.append('assigneeId', formData.assigneeId);
            data.append('dateEcheance', formData.dateEcheance);
            data.append('userstoryId', formData.userstoryId);

            for (let i = 0; i < files.length; i++) {
                data.append('attachments', files[i]);
            }

            const response = await axios.post('/tache', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            enqueueSnackbar('Tâche N° ' + response.data.id + ' créée avec succès !', { variant: 'success' });
            setFormData({
                nom: '',
                description: '',
                priorite: 'none',
                statut: 'Nouveau',
                projetId: '',
                assigneeId: currentUser, // Set default assignee to current user
                dateEcheance: '',
                userstoryId: ''
            });
            setFiles([]);
            navigate('/dashboard/taches');
        } catch (error) {
            enqueueSnackbar(error.response ? error.response.data.error : 'An error occurred', { variant: 'error' });
        }
    };

    return (
        <section className="py-5 py-lg-8">
            <div className="container">
                <div className="row">
                    <div className="col-xl-12 col-md-12 col-12">
                        <h1 className="mb-1">Créer une tâche</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-xl-5 col-md-6 col-6">
                                    <div className="form-group">
                                        <label htmlFor="projetId">Projet</label>
                                        <select
                                            className="form-control"
                                            id="projetId"
                                            name="projetId"
                                            value={formData.projetId}
                                            onChange={handleChange}
                                        >
                                            <option value="">Veuillez sélectionner un projet</option>
                                            {projets.map(projet => (
                                                <option key={projet.id} value={projet.id}>
                                                    {projet.nom}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="col-xl-5 col-md-6 col-6">
                                    <div className="form-group">
                                        <label htmlFor="userstoryId">Histoire utilisateur</label>
                                        <select
                                            className="form-control"
                                            id="userstoryId"
                                            name="userstoryId"
                                            value={formData.userstoryId}
                                            onChange={handleChange}
                                        >
                                            <option value="">Veuillez sélectionner une histoire utilisateur</option>
                                            {userStories.map(userStory => (
                                                <option key={userStory.id} value={userStory.id}>
                                                    {userStory.titre}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="col-xl-5 col-md-6 col-6">
                                    <div className="form-group">
                                        <label htmlFor="priorite">Priorité</label>
                                        <select
                                            className="form-control"
                                            id="priorite"
                                            name="priorite"
                                            value={formData.priorite}
                                            onChange={handleChange}
                                        >
                                            <option value="none">Veuillez sélectionner la priorité</option>
                                            <option value="Critique">Critique</option>
                                            <option value="Élevée">Élevée</option>
                                            <option value="Moyenne">Moyenne</option>
                                            <option value="Basse">Basse</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="col-xl-5 col-md-6 col-6">
                                    <div className="form-group">
                                        <label htmlFor="assigneeId">Assigné à</label>
                                        <select
                                            className="form-control"
                                            id="assigneeId"
                                            name="assigneeId"
                                            value={formData.assigneeId}
                                            onChange={handleChange}
                                        >
                                            <option value="">Veuillez sélectionner un utilisateur</option>
                                            {users.map(user => (
                                                <option key={user.id} value={user.id}>
                                                    {user.nom + ' ' + user.prenom}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="col-xl-5 col-md-6 col-6">
                                    <div className="form-group">
                                        <label htmlFor="dateEcheance">Date d'échéance</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="dateEcheance"
                                            name="dateEcheance"
                                            value={formData.dateEcheance}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

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
                                <label htmlFor="attachments">Attachments</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    id="attachments"
                                    name="attachments"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    multiple
                                />
                            </div>
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

export default TacheCreate;