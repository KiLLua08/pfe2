import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Utilisateurs = () => {
  const [users, setUsers] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRole, setSelectedRole] = useState('');
  const usersPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming you store JWT token in localStorage
        const response = await axios.get('/utilisateur', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }); // Adjust the endpoint as needed
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users', error);
      }
    };

    fetchUsers();
  }, []);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleToggleEtat = async (userId, currentEtat) => {
    if (currentEtat) {
      if (!window.confirm("Êtes-vous sûr de vouloir désactiver cet utilisateur ? Il ne pourra plus se connecter avec ses identifiants.")) {
        return; // If the user clicks "Cancel", exit the function
      }
    }
    try {
      const token = localStorage.getItem('token');
      const newEtat = !currentEtat;
      await axios.put(`/utilisateur/${userId}`, { etat: newEtat }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, etat: newEtat } : user
        )
      );
    } catch (error) {
      console.log('Failed to update user etat');
    }
  };



  const filteredUsers = users.filter((user) => {
    return selectedRole === '' || user.role === selectedRole;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <section className="mb-xl-9 my-5">
      <div className="container">
        <div className="row mb-4">
          <div className="col-lg-12">
            <div className="mb-4">
              <h3 className="mb-4">Tous les utilisateurs</h3>
            </div>
          </div>
          <div className="col-lg-6 col-md-10 col-12">
            <div className="row g-3 align-items-center">
              <div className="col-lg-6 col-md-6 col-12">
                <label htmlFor="roleFilter" className="form-label visually-hidden">
                  Filtrer par Rôle
                </label>
                <select
                  className="form-select"
                  id="roleFilter"
                  value={selectedRole}
                  onChange={handleRoleChange}
                >
                  <option value="">Tous les rôles</option>
                  <option value="admin">Admin</option>
                  <option value="client">Client</option>
                  <option value="project_manager">Project Manager</option>
                  <option value="front_developer">Front Developer</option>
                  <option value="back_developer">Back Developer</option>
                  <option value="fullstack_developer">Fullstack Developer</option>
                  <option value="designer">Designer</option>
                  <option value="qa_tester">QA Tester</option>
                  <option value="devops">DevOps</option>
                  {/* Add other roles as needed */}
                </select>
              </div>
              <div className="col-lg-6 col-md-6 col-12">
                <button type="button" className="btn btn-primary">
                  <Link className="nav-link" to="/dashboard/utilisateurs/create" style={{ color: 'white' }}>
                    Créer un utilisateur
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
                <th scope="col" onClick={() => handleSort('prenom')}>
                  Prénom {sortConfig.key === 'prenom' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th scope="col" onClick={() => handleSort('email')}>
                  Email {sortConfig.key === 'email' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th scope="col" onClick={() => handleSort('role')}>
                  Rôle {sortConfig.key === 'role' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.id}>
                  <th scope="row">{user.id}</th>
                  <td>{user.nom}</td>
                  <td>{user.prenom}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td><span style={{ marginRight: '5px' }}
                    onClick={() => handleToggleEtat(user.id, user.etat)}

                  >
                    {user.etat === true ? (
                      <i className="bi bi-toggle-on" style={{ color: 'green' }}></i>
                    ) : (
                      <i className="bi bi-toggle-off" style={{ color: 'red' }}></i>
                    )}
                  </span>
                    <Link to={`/dashboard/utilisateurs/update/${user.id}`}><i className="bi bi-eye"></i></Link></td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination */}
          <nav>
            <ul className="pagination">
              {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }, (_, index) => (
                <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                  <button onClick={() => paginate(index + 1)} className="page-link">
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

export default Utilisateurs;
