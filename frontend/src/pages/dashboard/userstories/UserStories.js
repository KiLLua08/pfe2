import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useParams } from 'react-router-dom';
import styles from './UserStories.module.css';


const UserStories = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { projetId } = useParams();
    const [userStories, setUserStories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [newUserStory, setNewUserStory] = useState({
        title: '',
        description: '',
        priority: '',
        intent: '',
        projetId
    });
    const [editUserStory, setEditUserStory] = useState({});
    const [viewMode, setViewMode] = useState('card');

    useEffect(() => {
        fetchUserStories();
    }, [projetId]);

    const fetchUserStories = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`/userstories/projet/${projetId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUserStories(response.data);
        } catch (error) {
            enqueueSnackbar('Error fetching user stories: ' + error.message, { variant: 'error' });
        }
    };

    const handleInputChange = (e, setUserStory) => {
        const { name, value } = e.target;
        setUserStory(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleAddUserStory = async () => {
        try {
            const token = localStorage.getItem('token');
            const userStoryData = {
                titre: newUserStory.title,
                description: newUserStory.description,
                priorite: newUserStory.priority,
                statut: newUserStory.intent || 'Non Démarré',
                projetId
            };

            await axios.post('/userstories', userStoryData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setShowModal(false);
            setNewUserStory({
                title: '',
                description: '',
                priority: '',
                intent: '',
            });

            fetchUserStories();
            enqueueSnackbar('User story added successfully!', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar('Error adding user story: ' + error.message, { variant: 'error' });
        }
    };

    const handleEditUserStory = (story) => {
        setEditUserStory(story);
        setShowEditModal(true);
    };

    const handleUpdateUserStory = async () => {
        try {
            const token = localStorage.getItem('token');
            const { id, titre, description, priorite, statut } = editUserStory;
            const userStoryData = { titre, description, priorite, statut };

            await axios.put(`/userstories/${id}`, userStoryData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setShowEditModal(false);
            setEditUserStory({});
            fetchUserStories();
            enqueueSnackbar('User story updated successfully!', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar('Error updating user story: ' + error.message, { variant: 'error' });
        }
    };

    const handleDeleteUserStory = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/userstories/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            fetchUserStories();
            enqueueSnackbar('User story deleted successfully!', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar('Error deleting user story: ' + error.message, { variant: 'error' });
        }
    };

    const getBadgeClass = (priority) => {
        switch (priority) {
            case 'Critical':
                return 'badge bg-danger';
            case 'High':
                return 'badge bg-warning';
            case 'Medium':
                return 'badge bg-info';
            case 'Low':
                return 'badge bg-success';
            default:
                return 'badge bg-secondary';
        }
    };

    return (
        <section className={`py-5 py-lg-8 ${styles.cardContainer}`} >
            <div className="container">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>User Stories</h2>
                    <div>
                        <button
                            className="btn btn-secondary me-2"
                            onClick={() => setViewMode(viewMode === 'card' ? 'list' : 'card')}
                        >
                            {viewMode === 'card' ? 'List View' : 'Card View'}
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={() => setShowModal(true)}
                        >
                            Ajouter un User Story
                        </button>
                    </div>
                </div>

                <div className="user-stories-list">
                    {userStories.length > 0 ? (
                        viewMode === 'card' ? (
                            <div className="row">
                                {userStories.map((story) => (
                                    <div className="col-lg-4 col-md-6 col-12 mb-4" key={story.id}>

                                        <span className="card-hover bg-white card card-lift text-center p-4">
                                            <h4 className="mb-0 card-text fs-5">{story.titre}</h4>
                                            <span>{story.titre}</span>
                                            <br />
                                            <span className={getBadgeClass(story.priorite)}>{story.priorite}</span>
                                            <div className="mt-2">
                                                <i className="bi bi-pencil-square text-warning me-2" onClick={() => handleEditUserStory(story)}></i>
                                                <i className="bi bi-trash text-danger" onClick={() => handleDeleteUserStory(story.id)}></i>
                                            </div>
                                        </span>

                                    </div>
                                ))}
                            </div>
                        ) : (
                            <ul className="list-group">
                                {userStories.map((story) => (
                                    <li className="list-group-item" key={story.id}>
                                        <h4 className="mb-0">{story.titre}</h4>
                                        <p>{story.description}</p>
                                        <span className={getBadgeClass(story.priorite)}>{story.priorite}</span>
                                        <div className="mt-2 float-end">
                                            <i className="bi bi-pencil-square text-warning me-2" onClick={() => handleEditUserStory(story)}></i>
                                            <i className="bi bi-trash text-danger" onClick={() => handleDeleteUserStory(story.id)}></i>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )
                    ) : (
                        <p>Aucune user story dans ce sprint.</p>
                    )}
                </div>

                {showModal && (
                    <div>
                        <div className="modal fade show "></div>
                        <div className="modal fade show custom-modal" id="userStoryModal" tabIndex="-1" aria-labelledby="userStoryModalLabel" aria-hidden="true" style={{ display: 'block' }}>
                            <div className="modal-dialog modal-dialog-centered modal-dialog-end">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="userStoryModalLabel">Add User Story</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="mb-3">
                                            <label htmlFor="title" className="form-label">Title</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="title"
                                                name="title"
                                                value={newUserStory.title}
                                                onChange={(e) => handleInputChange(e, setNewUserStory)}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="description" className="form-label">Description</label>
                                            <textarea
                                                className="form-control"
                                                id="description"
                                                name="description"
                                                rows="3"
                                                value={newUserStory.description}
                                                onChange={(e) => handleInputChange(e, setNewUserStory)}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="priority" className="form-label">Priority</label>
                                            <select
                                                className="form-select"
                                                id="priority"
                                                name="priority"
                                                value={newUserStory.priority}
                                                onChange={(e) => handleInputChange(e, setNewUserStory)}
                                            >
                                                <option value="">Select Priority</option>
                                                <option value="Critical">Critical</option>
                                                <option value="High">High</option>
                                                <option value="Medium">Medium</option>
                                                <option value="Low">Low</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                                        <button type="button" className="btn btn-primary" onClick={handleAddUserStory}>Add User Story</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {showEditModal && (
                    <div>
                        <div className="modal fade show"></div>
                        <div className="modal fade show custom-modal" id="editUserStoryModal" tabIndex="-1" aria-labelledby="editUserStoryModalLabel" aria-hidden="true" style={{ display: 'block' }}>
                            <div className="modal-dialog modal-dialog-centered modal-dialog-end">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="editUserStoryModalLabel">Edit User Story</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowEditModal(false)} aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="mb-3">
                                            <label htmlFor="editTitle" className="form-label">Title</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="editTitle"
                                                name="titre"
                                                value={editUserStory.titre}
                                                onChange={(e) => handleInputChange(e, setEditUserStory)}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="editDescription" className="form-label">Description</label>
                                            <textarea
                                                className="form-control"
                                                id="editDescription"
                                                name="description"
                                                rows="3"
                                                value={editUserStory.description}
                                                onChange={(e) => handleInputChange(e, setEditUserStory)}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="editPriority" className="form-label">Priority</label>
                                            <select
                                                className="form-select"
                                                id="editPriority"
                                                name="priorite"
                                                value={editUserStory.priorite}
                                                onChange={(e) => handleInputChange(e, setEditUserStory)}
                                            >
                                                <option value="">Select Priority</option>
                                                <option value="Critical">Critical</option>
                                                <option value="High">High</option>
                                                <option value="Medium">Medium</option>
                                                <option value="Low">Low</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Close</button>
                                        <button type="button" className="btn btn-primary" onClick={handleUpdateUserStory}>Update User Story</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default UserStories;
