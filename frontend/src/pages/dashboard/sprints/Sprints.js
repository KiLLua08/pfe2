import React, { useEffect, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Sprints.css';

const ItemType = {
    STORY: 'story',
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

const DraggableItem = ({ item, moveItem, isInSprint, removeStory, ShowDetails }) => {
    const [, ref] = useDrag({
        type: ItemType.STORY,
        item,
        end: (draggedItem, monitor) => {
            const dropResult = monitor.getDropResult();
            if (dropResult) {
                moveItem(draggedItem, dropResult.targetSprintId);
            }
        },
    });
    const itemClass = isInSprint ? 'full-width-item' : 'col-lg-4 col-md-6 col-12 mb-4';

    return (
        <div ref={ref} className={itemClass}>
            <span className="card-hover bg-white card card-lift text-center p-4">
                {/* Container for title and remove icon */}
                <div className="d-flex justify-content-between align-items-center">
                    <h4 className="mb-0 card-text fs-5">{item.titre}</h4>

                    {isInSprint && (
                        <>
                            <span className="bi bi-eye text-primary ms-2" onClick={() => ShowDetails(item)}></span>
                            <span
                                className="bi bi-trash text-danger"
                                onClick={() => removeStory(item.id)}
                                style={{ cursor: 'pointer' }} // Optional: Add cursor pointer
                            ></span>

                        </>


                    )}
                </div>

                <br />

                {!isInSprint &&
                    (<>
                        <span className="bi bi-eye text-primary ms-2" onClick={() => ShowDetails(item)}></span>
                        <span className={getBadgeClass(item.priorite)}>{item.priorite}</span>
                    </>

                    )}
            </span>
        </div>
    );
};

const DroppableContainer = ({ sprint, updateSprintStories, removeStory, ShowDetails, DeleteSprint }) => {
    const [{ isOver }, ref] = useDrop({
        accept: ItemType.STORY,
        drop: (item) => updateSprintStories(item, sprint.id),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    });

    return (
        <div ref={ref} className={`sprint-container ${isOver ? 'over' : ''}`}>
            <h3>{sprint.nom} (Sprint {sprint.numero})
                <span
                    className="bi bi-trash float-end"
                    onClick={() => DeleteSprint(sprint.id)}
                    title="Delete Sprint"
                >

                </span></h3>
            <p><strong>Description:</strong> {sprint.description}</p>
            <p><strong>Date Début:</strong> {new Date(sprint.dateDebut).toLocaleDateString()} <strong>Date Fin:</strong> {new Date(sprint.dateFin).toLocaleDateString()}</p>

            <p><strong>Statut:</strong> {sprint.statut} <strong>Priorité:</strong> {sprint.priorite}</p>

            <div className="story-list">
                {sprint.stories.length > 0 ? (
                    sprint.stories.map((story) => (
                        <DraggableItem
                            key={story.id}
                            item={story}
                            moveItem={updateSprintStories}
                            isInSprint={true}
                            removeStory={removeStory}
                            ShowDetails={ShowDetails}
                        />
                    ))
                ) : (
                    <p>Aucune user story dans ce sprint.</p>
                )}
            </div>
        </div>
    );
};

const Sprints = () => {
    const [userStories, setUserStories] = useState([]);
    const [sprints, setSprints] = useState([]);
    const { projetId } = useParams();
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUserStory, setSelectedUserStory] = useState(null);
    const [newSprint, setNewSprint] = useState({
        numero: '',
        nom: '',
        description: '',
        dateDebut: '',
        dateFin: '',
        statut: '',
        priorite: '',
        projetId
    });
    const [showAddSprintModal, setShowAddSprintModal] = useState(false);

    const handleShowDetails = (userStory) => {
        setSelectedUserStory(userStory);
        setShowEditModal(true);
    };

    const handleDeleteSprint = async (sprintId) => {
        try {
            await axios.delete(`/sprint/${sprintId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            fetchSprints();
            fetchUserStories();
            // Optionally, refresh the list of sprints or update the state
            // to remove the deleted sprint from the UI
        } catch (error) {
            console.error('Error deleting sprint:', error);
            // Optionally, show an error message
        }
    };
    const fetchSprints = async () => {
        try {
            const response = await axios.get(`/sprint/projet/${projetId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
            const sprintsWithStories = response.data.map(sprint => ({
                ...sprint,
                stories: sprint.userStories || []
            }));
            setSprints(sprintsWithStories);

        } catch (error) {
            console.error('Error fetching sprints:', error);
        }
    };

    const fetchUserStories = async () => {
        try {
            const response = await axios.get(`/userstories/projet/${projetId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });

            // Filter user stories where sprintId is null
            const filteredUserStories = response.data.filter(story => story.sprintId === null);
            setUserStories(filteredUserStories);
        } catch (error) {
            console.error('Error fetching user stories:', error);
        }
    };
    useEffect(() => {



        fetchSprints();
        fetchUserStories();
    }, [projetId]);

    const moveItem = async (item, targetSprintId) => {
        const newUserStories = userStories.filter(story => story.id !== item.id);
        const targetSprint = sprints.find(sprint => sprint.id === targetSprintId);
        if (!targetSprint) return;
        await axios.patch(`/sprint/updateSprintId/${item.id}`, {
            newSprintId: targetSprint.id
        }, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            }
        });
        fetchSprints();
        fetchUserStories();
    };

    const handleRemoveStory = async (storyId) => {
        try {
            // Make API call to set the sprintId of the story to null
            await axios.patch(`/sprint/updateSprintId/${storyId}`, {
                newSprintId: null
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                }
            });

            fetchSprints();
            fetchUserStories();

        } catch (error) {
            console.error('Error removing story:', error);
            // Optionally handle error state or display error message
        }
    };
    const handleAddSprint = () => {
        setShowAddSprintModal(true);
    };

    const handleAddSprintSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/sprint', newSprint, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // include your auth token if necessary
                },
            });

            fetchSprints();
            fetchUserStories();
            setShowAddSprintModal(false); // Close the modal after successful creation
            // Optionally, refresh the list of sprints or show a success message
        } catch (error) {
            console.error('Error creating sprint:', error.response?.data || error.message);
            // Optionally, show an error message
        }
    };

    return (
        <>
            <DndProvider backend={HTML5Backend}>
                <button className="btn btn-primary mb-4 float-end" onClick={handleAddSprint}>
                    Ajouter un Sprint
                </button>
                <div className="container">
                    <h2 className="mb-4">Sprints</h2>
                    {/* Button to add a new sprint */}

                    <div className="dnd-container">
                        <div className="column sticky-column custom-div">
                            <h4>User Stories sans sprint</h4>
                            <span>drag and drop pour ajouter a un sprint</span>
                            <br />
                            <div className="d-flex flex-wrap">
                                {userStories.map(story => (
                                    <DraggableItem
                                        key={story.id}
                                        item={story}
                                        moveItem={moveItem}
                                        isInSprint={false}
                                        removeStory={handleRemoveStory}
                                        ShowDetails={handleShowDetails}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="column">
                            {sprints.map(sprint => (
                                <DroppableContainer
                                    key={sprint.id}
                                    sprint={sprint}
                                    updateSprintStories={moveItem}
                                    removeStory={handleRemoveStory}
                                    ShowDetails={handleShowDetails}
                                    DeleteSprint={handleDeleteSprint}
                                />
                            ))}
                        </div>
                    </div>
                </div>



            </DndProvider>
            {showEditModal && selectedUserStory && (
                <div>
                    <div className="modal fade show"></div>
                    <div className="modal fade show custom-modal" id="editUserStoryModal" tabIndex="-1" aria-labelledby="editUserStoryModalLabel" aria-hidden="true" style={{ display: 'block' }}>
                        <div className="modal-dialog modal-dialog-centered modal-dialog-end">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="editUserStoryModalLabel">User Story Details</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowEditModal(false)} aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label htmlFor="editTitle" className="form-label">Titre</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="editTitle"
                                            name="titre"
                                            value={selectedUserStory.titre}
                                            readOnly
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="editDescription" className="form-label">Description</label>
                                        <textarea
                                            className="form-control"
                                            id="editDescription"
                                            name="description"
                                            rows="3"
                                            value={selectedUserStory.description}
                                            readOnly
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="editPriority" className="form-label">Priorité</label>
                                        <select
                                            className="form-select"
                                            id="editPriority"
                                            name="priorite"
                                            value={selectedUserStory.priorite}
                                            readOnly
                                            disabled
                                        >
                                            <option value="Critical">Critical</option>
                                            <option value="High">High</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Low">Low</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showAddSprintModal && (
                <div className="custom-modal-overlay">
                    <div className="modal-dialog modal-dialog-centered custom-modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Ajouter un Sprint</h5>
                                <button type="button" className="close" onClick={() => setShowAddSprintModal(false)} aria-label="Close">×</button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleAddSprintSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="sprintNumber" className="form-label">Numéro du Sprint</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="sprintNumber"
                                            value={newSprint.numero}
                                            onChange={(e) => setNewSprint({ ...newSprint, numero: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="sprintName" className="form-label">Nom du Sprint</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="sprintName"
                                            value={newSprint.nom}
                                            onChange={(e) => setNewSprint({ ...newSprint, nom: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="sprintDescription" className="form-label">Description</label>
                                        <textarea
                                            className="form-control"
                                            id="sprintDescription"
                                            rows="3"
                                            value={newSprint.description}
                                            onChange={(e) => setNewSprint({ ...newSprint, description: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="sprintStartDate" className="form-label">Date de Début</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="sprintStartDate"
                                            value={newSprint.dateDebut}
                                            onChange={(e) => setNewSprint({ ...newSprint, dateDebut: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="sprintEndDate" className="form-label">Date de Fin</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="sprintEndDate"
                                            value={newSprint.dateFin}
                                            onChange={(e) => setNewSprint({ ...newSprint, dateFin: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="sprintStatus" className="form-label">Statut</label>
                                        <select
                                            className="form-select"
                                            id="sprintStatus"
                                            value={newSprint.statut}
                                            onChange={(e) => setNewSprint({ ...newSprint, statut: e.target.value })}
                                        >
                                            <option value="">Choisir le Statut</option>
                                            <option value="Non commencé">Non commencé</option>
                                            <option value="En cours">En cours</option>
                                            <option value="Terminé">Terminé</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="sprintPriority" className="form-label">Priorité</label>
                                        <select
                                            className="form-select"
                                            id="sprintPriority"
                                            value={newSprint.priorite}
                                            onChange={(e) => setNewSprint({ ...newSprint, priorite: e.target.value })}
                                        >
                                            <option value="">Choisir la Priorité</option>
                                            <option value="Critique">Critique</option>
                                            <option value="Élevée">Élevée</option>
                                            <option value="Moyenne">Moyenne</option>
                                            <option value="Faible">Faible</option>
                                        </select>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={() => setShowAddSprintModal(false)}>Fermer</button>
                                        <button type="submit" className="btn btn-primary">Ajouter le Sprint</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </>
    );
};

export default Sprints;
