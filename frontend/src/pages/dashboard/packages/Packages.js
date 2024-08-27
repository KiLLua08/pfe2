import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Packages = () => {
    const [packages, setPackages] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await axios.get('/package');
                setPackages(response.data);
            } catch (error) {
                console.error('Error fetching packages:', error);
            }
        };

        fetchPackages();
    }, []);

    const handleEdit = (id) => {
        navigate(`/dashboard/packages/update/${id}`);
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm('Êtes-vous sûr de vouloir supprimer ce package ?');
        if (confirmed) {
            try {
                const token = localStorage.getItem('token'); // Retrieve the token from local storage or another secure place
                await axios.delete(`/package/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}` // Include the token in the request headers
                    }
                });
                setPackages(packages.filter(pkg => pkg.id !== id));
            } catch (error) {
                console.error('Error deleting package:', error);
            }
        }
    };


    return (
        <section className="mb-xl-9 my-5">
            <div className="container">
                <div className="row mb-4">
                    <div className="col-lg-12">
                        <div className="mb-4">
                            <h3 className="mb-4">Liste des Packages</h3>
                        </div>
                    </div>
                    <div className="col-lg-12 d-flex justify-content-end mb-3">
                        <Link to="/dashboard/packages/create" className="btn btn-primary">
                            Créer un package
                        </Link>
                    </div>
                </div>
                <div className="row g-5">
                    <table className="table" style={{ backgroundColor: 'white' }}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nom</th>
                                <th>Description</th>
                                <th>Prix</th>
                                <th>Ordre d'affichage</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {packages.map(pkg => (
                                <tr key={pkg.id}>
                                    <td>{pkg.id}</td>
                                    <td>{pkg.name}</td>
                                    <td>{pkg.description}</td>
                                    <td>{pkg.price} €</td>
                                    <td>{pkg.ordre_affichage}</td>
                                    <td>

                                        <i className="bi bi-pencil-square text-primary" onClick={() => handleEdit(pkg.id)}></i>


                                        <i onClick={() => handleDelete(pkg.id)} className="bi bi-trash text-danger"></i>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};

export default Packages;
