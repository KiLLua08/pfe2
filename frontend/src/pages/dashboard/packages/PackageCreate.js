import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSnackbar } from 'notistack';

const PackageCreate = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        features: [''],
        price: '',
        ordre_affichage: ''
    });
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFeatureChange = (index, value) => {
        const newFeatures = [...formData.features];
        newFeatures[index] = value;
        setFormData({
            ...formData,
            features: newFeatures
        });
    };

    const addFeature = () => {
        setFormData({
            ...formData,
            features: [...formData.features, '']
        });
    };

    const removeFeature = (index) => {
        const newFeatures = formData.features.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            features: newFeatures
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token'); // Retrieve the token from local storage or another secure place
            await axios.post('/package', {
                ...formData,
                features: JSON.stringify(formData.features) // Convert features array to JSON string
            }, {
                headers: {
                    Authorization: `Bearer ${token}` // Include the token in the request headers
                }
            });
            enqueueSnackbar('Package créé avec succès.', { variant: 'success' });
            navigate('/dashboard/packages');
        } catch (error) {
            enqueueSnackbar('Erreur lors de la création du package.', { variant: 'error' });
            console.error('Error creating package:', error);
        }
    };

    return (
        <section className="py-5 py-lg-8">
            <div className="container">
                <div className="row">
                    <div className="col-xl-12 col-md-12 col-12">
                        <h1 className="mb-1">Créer un Package</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Nom</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    name="name"
                                    value={formData.name}
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
                                <label htmlFor="ordre_affichage">Ordre d'affichage</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="ordre_affichage"
                                    name="ordre_affichage"
                                    value={formData.ordre_affichage}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Caractéristiques</label>
                                {formData.features.map((feature, index) => (
                                    <div key={index} className="d-flex align-items-center mb-2">
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={feature}
                                            onChange={(e) => handleFeatureChange(index, e.target.value)}
                                            required
                                        />
                                        <i className='bi bi-trash text-danger ms-2' onClick={() => removeFeature(index)}></i>

                                    </div>
                                ))}
                                <button
                                    type="button"
                                    className="btn btn-secondary float-end"
                                    onClick={addFeature}
                                >
                                    Ajouter une caractéristique
                                </button>
                                <br />
                            </div>
                            <div className="form-group">
                                <label htmlFor="price">Prix</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <br />

                            <button type="submit" className="btn btn-primary ">
                                Créer
                            </button>


                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PackageCreate;
