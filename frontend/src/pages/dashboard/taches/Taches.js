import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Taches = () => {
    const [taches, setTaches] = useState([]);
    const [filteredTaches, setFilteredTaches] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [tachesPerPage] = useState(20);
    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });

    const role = localStorage.getItem("role");

    useEffect(() => {
        fetchTaches();
        fetchUsers();
    }, []);

    const fetchTaches = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/tache', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setTaches(response.data);
            setFilteredTaches(response.data);
        } catch (error) {
            console.error('Error fetching taches:', error.message);
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

            const filteredUsers = response.data.filter(user =>
                !['support', 'admin', 'client', 'project_manager'].includes(user.role)
            );

            setUsers(filteredUsers);
        } catch (error) {
            console.error('Error fetching users:', error.message);
        }
    };


    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });

        const sortedData = [...filteredTaches].sort((a, b) => {
            if (a[key] < b[key]) {
                return direction === 'asc' ? -1 : 1;
            }
            if (a[key] > b[key]) {
                return direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
        setFilteredTaches(sortedData);
    };

    const handleStatusChange = (e) => {
        const status = e.target.value;
        setSelectedStatus(status);
        filterTaches(status, selectedUser);
    };

    const handleUserChange = (e) => {
        const userId = e.target.value;
        setSelectedUser(userId);
        filterTaches(selectedStatus, userId);
    };

    const filterTaches = (status, userId) => {
        let filtered = taches;

        if (status) {
            filtered = filtered.filter(tache => tache.status === status);
        }
        if (userId) {
            filtered = filtered.filter(tache => tache.assigneeId != null && tache.assigneeId.toString() === userId);
        }

        setFilteredTaches(filtered);
        setCurrentPage(1);
    };

    const indexOfLastTache = currentPage * tachesPerPage;
    const indexOfFirstTache = indexOfLastTache - tachesPerPage;
    const currentTaches = filteredTaches.slice(indexOfFirstTache, indexOfLastTache);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <section className="mb-xl-9 my-5">
            <div className="container">
                <div className="row mb-4">
                    <div className="col-lg-12">
                        <div className="mb-4">
                            <h3 className="mb-4">Tous les Tâches</h3>
                        </div>
                    </div>
                    <div className="col-lg-12 col-md-10 col-12">
                        <div className="row g-3 align-items-center">
                            <div className="col-lg-4 col-md-4 col-12">
                                <label htmlFor="statusList" className="form-label">
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
                            <div className="col-lg-4 col-md-4 col-12">
                                <label htmlFor="userList" className="form-label">
                                    Filtrer par Assigné à
                                </label>
                                <select
                                    className="form-select"
                                    id="userList"
                                    value={selectedUser}
                                    onChange={handleUserChange}
                                >
                                    <option value="">Tous les assignés</option>
                                    {users.map(user => (
                                        <option key={user.id} value={user.id}>
                                            {user.nom + " " + user.prenom}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-lg-12 col-md-12 col-12 d-flex justify-content-end">
                                <button type="input" className="btn btn-primary">
                                    <Link className="nav-link" to="/dashboard/tache/create">
                                        Créer une tâche
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
                                <th scope="col" onClick={() => handleSort('nom')}>
                                    Nom {sortConfig.key === 'nom' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                                </th>
                                <th scope="col" onClick={() => handleSort('description')}>
                                    Description {sortConfig.key === 'description' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                                </th>
                                <th scope="col" onClick={() => handleSort('status')}>
                                    Statut {sortConfig.key === 'status' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                                </th>
                                <th scope="col" onClick={() => handleSort('dateEcheance')}>
                                    Date d'échéance {sortConfig.key === 'dateEcheance' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                                </th>
                                <th scope="col" onClick={() => handleSort('assigneeId')}>
                                    Assigné à {sortConfig.key === 'assigneeId' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                                </th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentTaches.map(tache => (
                                <tr key={tache.id}>
                                    <td>{tache.id}</td>
                                    <td>{tache.nom}</td>
                                    <td>{tache.description}</td>
                                    <td>{tache.status}</td>
                                    <td>{new Date(tache.dateEcheance).toLocaleDateString()}</td>
                                    <td>
                                        {users.find(user => user.id === tache.assigneeId)?.nom} {users.find(user => user.id === tache.assigneeId)?.prenom}
                                    </td>
                                    <td>
                                        <Link to={`/dashboard/tache/update/${tache.id}`}>
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
                            {Array.from({ length: Math.ceil(filteredTaches.length / tachesPerPage) }).map((_, index) => (
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

export default Taches;
