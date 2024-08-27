import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useSnackbar } from 'notistack';
import 'bootstrap/dist/js/bootstrap.bundle.min';


const DashboardTicketUpdate = () => {
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  // Separate useState hooks for each form field
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("none");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [logs, setLogs] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [newLog, setNewLog] = useState('');
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [clientId, setClientId] = useState('');
  const [assignedId, setAssignedId] = useState('');
  const [clients, setClients] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [role, setRole] = useState(localStorage.getItem('role'));
  const [editingLogId, setEditingLogId] = useState(null);
  const [editingLogContent, setEditingLogContent] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');

  const handleFileUpload = async (event) => {
    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('attachments', file); // Append each file to the FormData object
    });

    try {
      const token = localStorage.getItem('token'); // Get JWT token from local storage
      const ticketId = id;
      // Adjust the URL and method as needed
      const response = await axios.post(`/ticket/${ticketId}/attachments`, // Your upload endpoint
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      enqueueSnackbar(`Attachments téléchargées avec succès`, { variant: 'success' });
      fetchTicketDetails();
      // Clear selected files
      setSelectedFiles([]);
    } catch (error) {
      enqueueSnackbar(`Erreur lors du téléchargement des fichiers : ${error}`, { variant: 'error' });

    }// Update the selected files state
  }

  const handleFileChange = async (event) => {
    setSelectedFiles([...event.target.files]);

  };

  const handleImageClick = (filename) => {
    setSelectedImage(filename);
    setOverlayVisible(true);
  };
  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handlePriorityChange = (event) => {
    setPriority(event.target.value);
  };

  const handleClientIdChange = (event) => {
    setClientId(event.target.value);
  };

  const handleAssignedIdChange = (event) => {
    setAssignedId(event.target.value);
  };
  const handleCloseOverlay = () => {
    setOverlayVisible(false);
    setSelectedImage(null);
  };


  const fetchTicketDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/ticket/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSubject(response.data.subject);
      setDescription(response.data.description);
      setCategory(response.data.category);
      setPriority(response.data.priority);
      setAttachments(response.data.attachments);
      setAssignedId(response.data.assignedUserId);
      setClientId(response.data.clientId);
      setLogs(response.data.Logs)
      setSubscribers(response.data.subscribers || []);
    } catch (error) {
      enqueueSnackbar(error.response ? error.response.data.error : "une erreur s'est produite", { variant: 'error' });
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/utilisateur/role/support', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAllUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error.message);
    }
  };

  useEffect(() => {


    fetchTicketDetails();
    fetchAssignedUsers();
    fetchClients();
    fetchUsers();

  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const data = {
        subject,
        category,
        description,
        priority,
        clientId: clientId,
        assignedUserId: assignedId,

      };
      const response = await axios.put(`/ticket/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      enqueueSnackbar(`Ticket N° ${response.data.id} Mis a jour avec success!`, { variant: 'success' });
      navigate("/dashboard/tickets");
      setError(null);
    } catch (error) {
      enqueueSnackbar(error.response ? error.response.data.error : "une erreur s'est produite", { variant: 'error' });

      setSuccess(null);
    }
  };
  const handleLogChange = (e) => {
    setNewLog(e.target.value);
  };

  const handleDeleteLog = async (logId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/ticket/log/${logId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLogs(logs.filter(log => log.id !== logId));
      enqueueSnackbar('Log supprimé avec succès', { variant: 'success' });

      setError(null);
    } catch (error) {
      enqueueSnackbar(error.response ? error.response.data.error : "une erreur s'est produite", { variant: 'error' });
      setSuccess(null);
    }
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

  const handleAddLog = async (e) => {

    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem("id");
      const response = await axios.post(`/ticket/${id}/logs`, { content: newLog, userId: userId }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLogs([...logs, response.data]);
      setNewLog('');

      fetchTicketDetails();
    } catch (error) {
      enqueueSnackbar(error.response ? error.response.data.error : "une erreur s'est produite", { variant: 'error' });
    }
  };

  const handleDeleteAttachment = async (attachmentId) => {
    try {
      const token = localStorage.getItem('token'); // Get JWT token from local storage

      const response = await axios.delete(`ticket/attachments/${attachmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Remove the deleted attachment from the state
      setAttachments(attachments.filter((attachment) => attachment.id !== attachmentId));


    } catch (error) {
      console.error('Error deleting attachment:', error);

    }
  };

  const handleUpdateLog = async (logId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`ticket/log/${logId}`, { content: editingLogContent }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLogs(logs.map(log => log.id === logId ? response.data : log));
      setEditingLogId(null);
      setEditingLogContent('');
      enqueueSnackbar("Log mis à jour avec succès", { variant: 'success' });

      setError(null);


      fetchTicketDetails();
    } catch (error) {
      enqueueSnackbar(error.response ? error.response.data.error : "une erreur s'est produite", { variant: 'error' });
      setSuccess(null);
    }
  };

  const startEditingLog = (log) => {
    setEditingLogId(log.id);
    setEditingLogContent(log.content);
  };

  const handleLogContentChange = (e) => {
    setEditingLogContent(e.target.value);
  };


  const fetchClients = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/utilisateur/role/client', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error.message);
    }
  };

  const fetchAssignedUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/utilisateur/role/admin', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAssignedUsers(response.data);
    } catch (error) {
      console.error('Error fetching assigned users:', error.message);
    }
  };


  const handleAddSubscriber = async () => {
    if (!selectedUser) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/ticket/${id}/subscribers`, { userId: selectedUser }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      //setSubscribers([...subscribers, allUsers.find(user => user.id === selectedUser)]);
      setSelectedUser('');
      fetchTicketDetails();
      enqueueSnackbar('Abonné ajouté avec succès', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(error.response ? error.response.data.error : "une erreur s'est produite", { variant: 'error' });
    }
  };
  const handleRemoveSubscriber = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/ticket/${id}/subscribers/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSubscribers(subscribers.filter(subscriber => subscriber.id !== userId));
      enqueueSnackbar('Abonné supprimé avec succès', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(error.response ? error.response.data.error : "une erreur s'est produite", { variant: 'error' });
    }
  };
  return (
    <section className="py-5 py-lg-8">
      <div className="container">
        <div className="row">
          <div className="col-xl-12">
            <h1 className="mb-1">Ticket N° {id}</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <form onSubmit={handleSubmit}>
              <div className="row"><span style={{ display: 'flex', justifyContent: 'flex-end', cursor: 'pointer' }} data-bs-toggle="modal"
                data-bs-target="#subscriberModal"><i className="bi bi-plus"></i>Ajouter des abonnés</span></div>
              <div className="row">
                <div className="col-xl-5 col-md-6 col-6">
                  <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select
                      className="form-control"
                      id="category"
                      value={category}
                      onChange={handleCategoryChange}
                    >

                      <option value="bug">Bug</option>
                      <option value="Demande de Fonctionnalité">Demande de Fonctionnalité</option>
                      <option value="Amélioration">Amélioration</option>
                      <option value="Performance">Performance</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Autres">Autres</option>
                    </select>
                  </div>
                </div>
                <div className="col-xl-6 col-md-6 col-6">
                  <div className="form-group">
                    <label htmlFor="priority">Priority</label>
                    <select
                      className="form-control"
                      id="priority"
                      value={priority}
                      onChange={handlePriorityChange}
                    >
                      <option value="Critique">Critique</option>
                      <option value="Élevée">Élevée</option>
                      <option value="Moyenne">Moyenne</option>
                      <option value="Basse">Basse</option>
                    </select>
                  </div>
                </div>
              </div>
              {role !== 'client' && (
                <>
                  <div className="row">
                    <div className="col-xl-5 col-md-6 col-6">
                      <label htmlFor="clientId">Client</label>
                      <select
                        className="form-control"
                        id="clientId"
                        name="clientId"
                        value={clientId}
                        onChange={handleClientIdChange}

                      >
                        <option value="">Veuillez sélectionner un client</option>
                        {clients.map(client => (
                          <option key={client.id} value={client.id}>
                            {client.nom + ' ' + client.prenom}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-xl-6 col-md-6 col-6">
                      <label htmlFor="assignedUserId">Assigné à</label>
                      <select
                        className="form-control"
                        id="assignedUserId"
                        name="assignedUserId"
                        value={assignedId}
                        onChange={handleAssignedIdChange}

                      >
                        <option value="">Veuillez sélectionner un utilisateur</option>
                        {assignedUsers.map(user => (
                          <option key={user.id} value={user.id}>
                            {user.nom + ' ' + user.prenom}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div className="form-group">
                <label htmlFor="subject">Sujet</label>
                <input
                  type="text"
                  className="form-control"
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  rows={5}
                  className="form-control"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
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
                              {log.Utilisateur && (
                                <> {log.Utilisateur.img !== "default" ? (<img
                                  src={`${process.env.REACT_APP_API_BASE_URL}/uploads/${log.Utilisateur.img}`}
                                  alt="Avatar"
                                  className="avatar avatar-xs rounded-circle"
                                />) : (<img
                                  src="assets/images/avatar/fallback.jpg"
                                  alt="Avatar"
                                  className="avatar avatar-xs rounded-circle"
                                />)}

                                  <div className="ms-2">
                                    <a className="text-reset fs-6"><b>{log.Utilisateur.nom} {log.Utilisateur.nom}</b></a>
                                    <br />

                                    <a className="text-reset fs-6">{log.content}</a>
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


              <div className="mt-4 ">
                <h3>Ajouter un Log</h3>
                <form >
                  <div className="form-group">
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder=" Ajouter un Log/Commentaire"
                      value={newLog}
                      onChange={handleLogChange}
                      required
                    ></textarea>
                  </div>
                  <div className="text-end"> {/* Utilizing Bootstrap utility class for text alignment */}
                    <br />
                    <button type="button" onClick={handleAddLog} className="btn btn-primary">
                      Ajouter Log
                    </button>
                  </div>
                </form>
              </div>

              <button type="submit" className="btn btn-primary">
                Enregistrer
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="modal fade" id="subscriberModal" tabIndex="-1" aria-labelledby="subscriberModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="subscriberModalLabel">Ajouter des abonnés</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <div className="mb-3 d-flex align-items-center">
                  <select className="form-select me-2" value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
                    <option value="">Sélectionner un utilisateur</option>
                    {allUsers.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.nom + ' ' + user.prenom}
                      </option>
                    ))}
                  </select>
                  <button className="btn btn-primary" onClick={handleAddSubscriber}>Ajouter</button>
                </div>
              </div>
              <h5>Abonnés</h5>
              <ul className="list-group">
                {subscribers.length > 0 ? (
                  subscribers.map(subscriber => (
                    <li key={subscriber.id} className="list-group-item d-flex justify-content-between align-items-center">
                      {subscriber.nom + ' ' + subscriber.prenom}
                      <button className="btn btn-danger btn-sm" onClick={() => handleRemoveSubscriber(subscriber.id)}>
                        Supprimer
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="list-group-item">pas d'abonnés pour ce ticket</li>
                )}
              </ul>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default DashboardTicketUpdate;
