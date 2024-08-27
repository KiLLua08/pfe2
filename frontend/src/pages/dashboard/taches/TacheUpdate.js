import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useSnackbar } from 'notistack';
import 'bootstrap/dist/js/bootstrap.bundle.min';

const TacheUpdate = () => {
    const { id } = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [nom, setNom] = useState("");
    const [description, setDescription] = useState("");
    const [statut, setStatut] = useState("En cours");
    const [priorite, setPriorite] = useState("Moyenne");
    const [dateEcheance, setDateEcheance] = useState("");
    const [assignerId, setAssignerId] = useState("");
    const [allUsers, setAllUsers] = useState([]);
    const [logs, setLogs] = useState([]);
    const [attachments, setAttachments] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [newLog, setNewLog] = useState('');
    const [editingLogId, setEditingLogId] = useState(null);
    const [editingLogContent, setEditingLogContent] = useState('');
    const [isOverlayVisible, setOverlayVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleCloseOverlay = () => {
        setOverlayVisible(false);
        setSelectedImage(null);
    };

    const fetchTacheDetails = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`/tache/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setNom(response.data.nom);
            setDescription(response.data.description);
            setStatut(response.data.statut);
            setPriorite(response.data.priorite);
            setDateEcheance(response.data.dateEcheance);
            setAssignerId(response.data.assigneeId);
            setLogs(response.data.logs);
            setAttachments(response.data.attachments || []); // Set attachments
        } catch (error) {
            enqueueSnackbar(error.response ? error.response.data.error : "Une erreur s'est produite", { variant: 'error' });
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
            setAllUsers(filteredUsers);
        } catch (error) {
            console.error('Error fetching users:', error.message);
        }
    };

    useEffect(() => {
        fetchTacheDetails();
        fetchUsers();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const data = {
                nom,
                description,
                statut,
                priorite,
                dateEcheance,
                assigneeId: assignerId,
            };
            const response = await axios.put(`/tache/${id}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            enqueueSnackbar(`Tâche N° ${response.data.id} mise à jour avec succès!`, { variant: 'success' });
            navigate("/dashboard/taches");
            setError(null);
        } catch (error) {
            enqueueSnackbar(error.response ? error.response.data.error : "Une erreur s'est produite", { variant: 'error' });
            setSuccess(null);
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(prev => [...prev, ...files]);
    };

    const handleUploadAttachments = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            selectedFiles.forEach(file => formData.append('files', file));

            await axios.post(`/tache/${id}/attachments`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Refresh the task details after upload
            fetchTacheDetails();
        } catch (error) {
            enqueueSnackbar(error.response ? error.response.data.error : "Une erreur s'est produite", { variant: 'error' });
        }
    };

    const handleLogChange = (e) => {
        setNewLog(e.target.value);
    };

    const handleAddLog = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem("id");
            const response = await axios.post(`/tache/${id}/logs`, { description: newLog, userId: userId }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setLogs([...logs, response.data]);
            setNewLog('');
            fetchTacheDetails();
        } catch (error) {
            enqueueSnackbar(error.response ? error.response.data.error : "Une erreur s'est produite", { variant: 'error' });
        }
    };

    const handleUpdateLog = async (logId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`/tache/log/${logId}`, { description: editingLogContent }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setLogs(logs.map(log => log.id === logId ? response.data : log));
            setEditingLogId(null);
            setEditingLogContent('');
            enqueueSnackbar("Log mis à jour avec succès", { variant: 'success' });
            fetchTacheDetails();
        } catch (error) {
            enqueueSnackbar(error.response ? error.response.data.error : "Une erreur s'est produite", { variant: 'error' });
            setSuccess(null);
        }
    };

    const handleDeleteLog = async (logId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/tache/log/${logId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setLogs(logs.filter(log => log.id !== logId));
            enqueueSnackbar('Log supprimé avec succès', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar(error.response ? error.response.data.error : "Une erreur s'est produite", { variant: 'error' });
        }
    };

    const startEditingLog = (log) => {
        setEditingLogId(log.id);
        setEditingLogContent(log.description);
    };

    const handleLogContentChange = (e) => {
        setEditingLogContent(e.target.value);
    };

    const handleDeleteAttachment = async (filename) => {
        try {
            const token = localStorage.getItem('token'); // Get JWT token from local storage

            await axios.delete(`/tache/attachments/${filename}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Remove the deleted attachment from the state
            setAttachments(attachments.filter(attachment => attachment.filename !== filename));
            fetchTacheDetails();

        } catch (error) {
            enqueueSnackbar(error.response ? error.response.data.error : "Une erreur s'est produite", { variant: 'error' });
        }
    };

    const handleImageClick = (filename) => {
        setSelectedImage(filename);
        setOverlayVisible(true);
    };
    function formatDateTime(dateTime) {
        const date = new Date(dateTime);

        // Ensure date is valid
        if (isNaN(date.getTime())) {
            return 'Invalid Date';
        }

        // Format date components
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
        const year = date.getFullYear();

        // Construct formatted date string
        const formattedDateTime = `${hours}:${minutes} ${day}/${month}/${year}`;

        return formattedDateTime;
    }
    const formatDateForInput = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = ('0' + (d.getMonth() + 1)).slice(-2);
        const day = ('0' + d.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    };
    const handleFileUpload = async (event) => {
        const formData = new FormData();
        selectedFiles.forEach(file => {
            formData.append('attachments', file); // Append each file to the FormData object
        });

        try {
            const token = localStorage.getItem('token'); // Get JWT token from local storage
            const ticketId = id;
            // Adjust the URL and method as needed
            const response = await axios.post(`/tache/${ticketId}/attachments`, // Your upload endpoint
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            enqueueSnackbar(`Attachments téléchargées avec succès`, { variant: 'success' });
            fetchTacheDetails();
            // Clear selected files
            setSelectedFiles([]);
        } catch (error) {
            enqueueSnackbar(`Erreur lors du téléchargement des fichiers : ${error}`, { variant: 'error' });

        }// Update the selected files state
    }


    return (
        <section className="py-5 py-lg-8">
            <div className="container">
                <div className="row">
                    <div className="col-xl-12">
                        <h1 className="mb-1">Tâche N° {id}</h1>
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
                                            value={nom}
                                            onChange={(e) => setNom(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-xl-6 col-md-6 col-6">
                                    <div className="form-group">
                                        <label htmlFor="description">Description</label>
                                        <textarea
                                            className="form-control"
                                            id="description"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xl-6 col-md-6 col-6">
                                    <div className="form-group">
                                        <label htmlFor="statut">Statut</label>
                                        <select
                                            className="form-control"
                                            id="statut"
                                            value={statut}
                                            onChange={(e) => setStatut(e.target.value)}
                                        >
                                            <option value="En cours">En cours</option>
                                            <option value="Terminé">Terminé</option>
                                            <option value="Suspendu">Suspendu</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-xl-6 col-md-6 col-6">
                                    <div className="form-group">
                                        <label htmlFor="priorite">Priorité</label>
                                        <select
                                            className="form-control"
                                            id="priorite"
                                            value={priorite}
                                            onChange={(e) => setPriorite(e.target.value)}
                                        >
                                            <option value="Basse">Basse</option>
                                            <option value="Moyenne">Moyenne</option>
                                            <option value="Haute">Haute</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xl-6 col-md-6 col-6">
                                    <div className="form-group">
                                        <label htmlFor="dateEcheance">Date d'échéance</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="dateEcheance"
                                            value={formatDateForInput(dateEcheance)}
                                            onChange={(e) => setDateEcheance(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="col-xl-6 col-md-6 col-6">
                                    <div className="form-group">
                                        <label htmlFor="assignerId">Assigner</label>
                                        <select
                                            className="form-control"
                                            id="assignerId"
                                            value={assignerId}
                                            onChange={(e) => setAssignerId(e.target.value)}
                                        >
                                            <option value="">Aucun</option>
                                            {allUsers.map(user => (
                                                <option key={user.id} value={user.id}>
                                                    {user.nom} {user.prenom}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="attachment">Attachment</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    id="attachment"
                                    onChange={handleFileChange}
                                    name="attachment"
                                    accept="image/*"
                                    multiple
                                />
                                <span onClick={handleFileUpload} className="bi bi-box-arrow-in-up" style={{ 'cursor': 'pointer' }}>Upload</span>
                            </div>

                            {attachments.length > 0 && (
                                <div className="mt-4">
                                    <h3>Attachments</h3>
                                    <div className="slider">
                                        {attachments.map((attachment) => (
                                            <div key={attachment.id} className="slide">
                                                <img
                                                    width="100px" height="100px"
                                                    src={`${process.env.REACT_APP_API_BASE_URL}/uploads/${attachment.filename}`}
                                                    alt={attachment.filename}
                                                    onClick={() => handleImageClick(attachment.filename)}
                                                    style={{ cursor: 'pointer' }}
                                                    className="log-item"
                                                />

                                                <span className="bi bi-calendar-x-fill" onClick={() => handleDeleteAttachment(attachment.id)}></span>

                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {isOverlayVisible && (
                                <div className="overlay" onClick={handleCloseOverlay}>
                                    <div className="overlay-content">
                                        <img
                                            src={`${process.env.REACT_APP_API_BASE_URL}/uploads/${selectedImage}`}
                                            alt={selectedImage}
                                            className="full-size-image log-item"
                                        />

                                    </div>
                                </div>
                            )}
                            <hr />
                            <h2>Logs</h2>
                            <form >
                                <div className="form-group">
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        value={newLog}
                                        onChange={handleLogChange}
                                        placeholder="Ajouter un log..."
                                        required
                                    />
                                </div>
                                <br />
                                <button onClick={handleAddLog} className="btn btn-primary float-end">Ajouter Log</button>

                            </form>
                            <div className="mt-4">
                                <h3>Logs</h3>
                                {logs.length === 0 ? (
                                    <p>aucun log trouvé</p>
                                ) : (
                                    <ul className="list-unstyled">
                                        {logs.map((log) => (

                                            <li key={log.id} className="d-flex justify-content-between align-items-center mb-3 log-item">
                                                {editingLogId === log.id ? (
                                                    <textarea
                                                        rows={5}
                                                        value={editingLogContent}
                                                        onChange={handleLogContentChange}
                                                        className="form-control"
                                                    />
                                                ) : (
                                                    <div className="d-flex align-items-center">
                                                        <div className="d-flex align-items-center">
                                                            {log.user && (
                                                                <> {log.user.img !== "default" ? (<img
                                                                    src={`${process.env.REACT_APP_API_BASE_URL}/uploads/${log.user.img}`}
                                                                    alt="Avatar"
                                                                    className="avatar avatar-xs rounded-circle"
                                                                />) : (<img
                                                                    src="assets/images/avatar/fallback.jpg"
                                                                    alt="Avatar"
                                                                    className="avatar avatar-xs rounded-circle"
                                                                />)}

                                                                    <div className="ms-2">
                                                                        <a className="text-reset fs-6"><b>{log.user.nom} {log.user.nom}</b></a>
                                                                        <br />

                                                                        <a className="text-reset fs-6">{log.description}</a>
                                                                    </div></>)}

                                                        </div>

                                                    </div>
                                                )}

                                                <div className="d-flex align-items-center">
                                                    <span className="fs-6 me-2"><b>{formatDateTime(log.updatedAt)}</b></span>
                                                    <span className="bi bi-trash me-2" aria-hidden="true" onClick={() => handleDeleteLog(log.id)}></span>

                                                    <span
                                                        className={editingLogId === log.id ? 'bi bi-save me-2' : 'bi bi-pencil me-2'}
                                                        aria-hidden="true"
                                                        onClick={() => {
                                                            if (editingLogId === log.id) {
                                                                handleUpdateLog(log.id);
                                                            } else {
                                                                startEditingLog(log);
                                                            }
                                                        }}
                                                    ></span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <hr />
                            <button type="submit" className="btn btn-primary">Enregistrer</button>
                        </form>


                    </div>
                </div>

            </div>
        </section>
    );
};

export default TacheUpdate;
