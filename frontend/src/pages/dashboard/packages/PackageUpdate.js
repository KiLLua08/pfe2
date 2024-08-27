import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useSnackbar } from 'notistack';

const PackageUpdate = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        features: [''],
        price: '',
        ordre_affichage: ''
    });
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const fetchPackage = async () => {
            try {
                const token = localStorage.getItem('token'); // Retrieve the token from local storage or another secure place
                const response = await axios.get(`/package/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}` // Include the token in the request headers
                    }
                });
                const packageData = response.data;
                packageData.features = JSON.parse(packageData.features);
                setFormData(packageData);
            } catch (error) {
                console.error('Error fetching package:', error);
                enqueueSnackbar('Erreur lors de la récupération du package.', { variant: 'error' });
            }
        };

        fetchPackage();
    }, [id, enqueueSnackbar]);

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
            await axios.put(`/package/${id}`, {
                ...formData,
                features: JSON.stringify(formData.features) // Convert features array to JSON string
            }, {
                headers: {
                    Authorization: `Bearer ${token}` // Include the token in the request headers
                }
            });
            enqueueSnackbar('Package mis à jour avec succès.', { variant: 'success' });
            navigate('/dashboard/packages');
        } catch (error) {
            console.error('Error updating package:', error);
            enqueueSnackbar('Erreur lors de la mise à jour du package.', { variant: 'error' });
        }
    };

    return (
        <section className="py-5 py-lg-8">
            <div className="container">
                <div className="row">
                    <div className="col-xl-12 col-md-12 col-12">
                        <h1 className="mb-1">Modifier un package</h1>
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
                                {formData.features.length > 2 ? (
                                    formData.features.map((feature, index) => (
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
                                    ))
                                ) : (
                                    <p className="text-muted">Aucune caractéristique ajoutée. Utilisez le bouton ci-dessous pour ajouter des caractéristiques.</p>
                                )}
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

                            <div className="d-flex justify-content-end">
                                <button type="submit" className="btn btn-primary">
                                    Mettre à jour
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PackageUpdate;
