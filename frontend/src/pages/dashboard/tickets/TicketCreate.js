import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';


const DashboardTicketCreate = () => {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    subject: '',
    category: 'none',
    description: '',
    priority: 'none',
    status: 'Nouveau',
    clientId: '',
    assignedUserId: null,
  });
  const [files, setFiles] = useState([]);
  const [clients, setClients] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [role, setRole] = useState(localStorage.getItem('role'));

  useEffect(() => {
    if (role !== 'client') {
      fetchClients();
      fetchAssignedUsers();
    }
  }, [role]);

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
      enqueueSnackbar('Error fetching clients: ' + error.message, { variant: 'error' });
    }
  };

  const fetchAssignedUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/utilisateur/role/support', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAssignedUsers(response.data);
    } catch (error) {
      enqueueSnackbar('Error fetching assigned users: ' + error.message, { variant: 'error' });
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
    if (formData.category === 'none') {
      enqueueSnackbar('Veuillez sélectionner une catégorie.', { variant: 'warning' });
      return;
    }
    if (formData.priority === 'none') {
      enqueueSnackbar('Veuillez sélectionner la priorité.', { variant: 'warning' });
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const userid = localStorage.getItem('id');
      const data = new FormData();
      data.append('subject', formData.subject);
      data.append('category', formData.category);
      data.append('description', formData.description);
      data.append('priority', formData.priority);
      data.append('status', 'Nouveau');
      data.append('clientId', role === 'client' ? userid : formData.clientId);
      data.append('assignedUserId', formData.assignedUserId);

      for (let i = 0; i < files.length; i++) {
        data.append('attachments', files[i]);
      }

      const response = await axios.post('/ticket', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      enqueueSnackbar('Ticket N° ' + response.data.id + ' créé avec succès !', { variant: 'success' });
      setFormData({
        subject: '',
        category: 'none',
        description: '',
        priority: 'medium',
        clientId: '',
        assignedUserId: '',
      });
      setFiles(null);
      navigate('/dashboard/tickets')
    } catch (error) {
      enqueueSnackbar(error.response ? error.response.data.error : 'An error occurred', { variant: 'error' });
    }
  };

  return (
    <section className="py-5 py-lg-8">
      <div className="container">
        <div className="row">
          <div className="col-xl-12 col-md-12 col-12">
            <h1 className="mb-1">Créer un ticket</h1>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-xl-5 col-md-6 col-6">
                  <div className="form-group">
                    <label htmlFor="category">Catégorie</label>
                    <select
                      className="form-control"
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      <option value="none">Veuillez sélectionner une catégorie</option>
                      <option value="Bug">Bug</option>
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
                    <label htmlFor="priority">Priorité</label>
                    <select
                      className="form-control"
                      id="priority"
                      name="priority"
                      value={formData.priority}
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
                        value={formData.clientId}
                        onChange={handleChange}
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
                        value={formData.assignedUserId}
                        onChange={handleChange}
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
                  name="subject"
                  value={formData.subject}
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
                <label htmlFor="attachment">Attachment</label>
                <input
                  type="file"
                  className="form-control"
                  id="attachment"
                  name="attachment"
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

export default DashboardTicketCreate;
