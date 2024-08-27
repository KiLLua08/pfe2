import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const DashboardTickets = () => {

  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedAssignedUser, setSelectedAssignedUser] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [clients, setClients] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ticketsPerPage] = useState(20);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });

  const role = localStorage.getItem("role");

  useEffect(() => {
    if (role === "client") {
      fetchTickets();
    }
    if (role === "admin") {
      fetchTicketsAdmin();
      fetchClients();
      fetchAssignedUsers();
    }
  }, [role]);

  const fetchTickets = async () => {
    try {
      const userId = localStorage.getItem("id");
      const token = localStorage.getItem('token');

      const response = await axios.post('/ticket/by-client', {
        clientId: userId
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTickets(response.data);
      setFilteredTickets(response.data);
    } catch (error) {
      console.error('Error fetching tickets:', error.message);
    }
  };

  const fetchTicketsAdmin = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.get('/ticket', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTickets(response.data);
      setFilteredTickets(response.data);
    } catch (error) {
      console.error('Error fetching tickets:', error.message);
    }
  };

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.get('/ticket/clients', {
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

      const response = await axios.get('/ticket/assigned', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAssignedUsers(response.data);
    } catch (error) {
      console.error('Error fetching assigned users:', error.message);
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedData = [...filteredTickets].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'asc' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    setFilteredTickets(sortedData);
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    filterTickets(selectedClient, category, selectedAssignedUser, selectedStatus);
  };

  const handleClientChange = (e) => {
    const clientId = e.target.value;
    setSelectedClient(clientId);
    filterTickets(clientId, selectedCategory, selectedAssignedUser, selectedStatus);
  };

  const handleAssignedUserChange = (e) => {
    const assignedUserId = e.target.value;
    setSelectedAssignedUser(assignedUserId);
    filterTickets(selectedClient, selectedCategory, assignedUserId, selectedStatus);
  };

  const handleStatusChange = (e) => {
    const status = e.target.value;
    setSelectedStatus(status);
    filterTickets(selectedClient, selectedCategory, selectedAssignedUser, status);
  };

  const filterTickets = (clientId, category, assignedUserId, status) => {
    let filtered = tickets;

    if (clientId) {
      filtered = filtered.filter(ticket => ticket.clientId != null && ticket.clientId.toString() === clientId);
    }
    if (category) {
      filtered = filtered.filter(ticket => ticket.category === category);
    }
    if (assignedUserId) {
      filtered = filtered.filter(ticket => ticket.assignedUserId != null && ticket.assignedUserId.toString() === assignedUserId);
    }
    if (status) {
      filtered = filtered.filter(ticket => ticket.status === status);
    }

    setFilteredTickets(filtered);
    setCurrentPage(1);
  };

  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = filteredTickets.slice(indexOfFirstTicket, indexOfLastTicket);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <section className="mb-xl-9 my-5">
      <div className="container">
        <div className="row mb-4">
          <div className="col-lg-12">
            <div className="mb-4">
              <h3 className="mb-4">Tous les tickets</h3>
            </div>
          </div>
          <div className="col-lg-12 col-md-10 col-12">
            <div className="row g-3 align-items-center">
              <div className="col-lg-4 col-md-4 col-12">
                <label htmlFor="categoryList" className="form-label ">
                  Filtrer par Categorie
                </label>
                <select
                  className="form-select"
                  id="categoryList"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                >
                  <option value="">Tous les types</option>
                  <option value="Bug">Bug</option>
                  <option value="Demande de Fonctionnalité">Demande de Fonctionnalité</option>
                  <option value="Amélioration">Amélioration</option>
                  <option value="Performance">Performance</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Autres">Autres</option>
                </select>
              </div>
              <div className="col-lg-4 col-md-4 col-12">
                <label htmlFor="statusList" className="form-label ">
                  Filtrer par Statut
                </label>
                <select
                  className="form-select"
                  id="statusList"
                  value={selectedStatus}
                  onChange={handleStatusChange}
                >
                  <option value="">Tous les statuts</option>
                  <option value="Nouveau">Nouveau</option>
                  <option value="En Cours">En Cours</option>
                  <option value="En Attente">En Attente</option>
                  <option value="Résolu">Résolu</option>
                  <option value="Fermé">Fermé</option>
                </select>
              </div>
              {role === "admin" && (
                <>
                  <div className="col-lg-4 col-md-4 col-12">
                    <label htmlFor="clientList" className="form-label ">
                      Filtrer par Client
                    </label>
                    <select
                      className="form-select"
                      id="clientList"
                      value={selectedClient}
                      onChange={handleClientChange}
                    >
                      <option value="">Tous les clients</option>
                      {clients.map(client => (
                        <option key={client.id} value={client.id}>
                          {client.nom + " " + client.prenom}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-lg-4 col-md-4 col-12">
                    <label htmlFor="assignedUserList" className="form-label ">
                      Filtrer par Assigné à
                    </label>
                    <select
                      className="form-select"
                      id="assignedUserList"
                      value={selectedAssignedUser}
                      onChange={handleAssignedUserChange}
                    >
                      <option value="">Tous les assignés</option>
                      {assignedUsers.map(user => (
                        <option key={user.id} value={user.id}>
                          {user.nom + " " + user.prenom}
                        </option>
                      ))}
                    </select>
                  </div>

                </>
              )}
              <div className="col-lg-12 col-md-12 col-12 d-flex justify-content-end">
                <button type="input" className="btn btn-primary">
                  <Link className="nav-link" to="/dashboard/ticket/create">
                    Créer un ticket
                  </Link>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="row g-5">
          <table className="table" style={{ backgroundColor: 'white' }}>
            <thead>
              <tr>
                <th scope="col" onClick={() => handleSort('id')}>
                  ID ° {sortConfig.key === 'id' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th scope="col" onClick={() => handleSort('subject')}>
                  Sujet {sortConfig.key === 'subject' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th scope="col" onClick={() => handleSort('category')}>
                  Categorie {sortConfig.key === 'category' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>

                {role === "admin" && (
                  <>
                    <th scope="col" onClick={() => handleSort('clientId')}>
                      Client {sortConfig.key === 'clientId' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                    </th>
                    <th scope="col" onClick={() => handleSort('assignedUserId')}>
                      Assigné à {sortConfig.key === 'assignedUserId' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                    </th>
                  </>
                )}
                <th scope="col" onClick={() => handleSort('createdAt')}>
                  Date de création {sortConfig.key === 'createdAt' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {currentTickets.map(ticket => (
                <tr key={ticket.id}>
                  <td>{ticket.id}</td>
                  <td>{ticket.subject}</td>
                  <td>{ticket.category}</td>

                  {role === "admin" && (
                    <>
                      <td>{clients.find(client => client.id === ticket.clientId)?.nom}</td>
                      <td>{assignedUsers.find(user => user.id === ticket.assignedUserId)?.nom} {assignedUsers.find(user => user.id === ticket.assignedUserId)?.prenom}</td>
                    </>
                  )}
                  <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/dashboard/ticket/update/${ticket.id}`}>
                      <i className="bi bi-eye"></i>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="row">
          <nav aria-label="Page navigation example">
            <ul className="pagination justify-content-center">
              {Array.from({ length: Math.ceil(filteredTickets.length / ticketsPerPage) }).map((_, index) => (
                <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => paginate(index + 1)}>
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </section>
  );
};

export default DashboardTickets;
