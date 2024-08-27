import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useSnackbar } from 'notistack';

const DemandeClientUpdate = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        sujetSite: '',
        objectifsPrincipaux: '',
        typesPages: '',
        logoIdentiteVisuelle: false,
        referencesSites: '',
        delaisRealisation: '',
        fonctionnalitesSpecifiques: '',
        nomDomaineHebergement: false,
        styleVisuel: '',
        concurrents: '',
        etat: '',
        nom: '',
        prenom: '',
        id: ''
    });
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const fetchDemande = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`/demande-client/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const demandeData = response.data;
                setFormData({
                    ...demandeData,
                    sujetSite: JSON.parse(demandeData.sujetSite),
                    objectifsPrincipaux: JSON.parse(demandeData.objectifsPrincipaux),
                    typesPages: JSON.parse(demandeData.typesPages),
                    referencesSites: JSON.parse(demandeData.referencesSites),
                    fonctionnalitesSpecifiques: JSON.parse(demandeData.fonctionnalitesSpecifiques),
                    styleVisuel: JSON.parse(demandeData.styleVisuel),
                    concurrents: JSON.parse(demandeData.concurrents),
                    nom: demandeData.clientDemande.nom,
                    prenom: demandeData.clientDemande.prenom,
                    clientId: demandeData.clientDemande.id
                });
            } catch (error) {
                console.error('Error fetching demande client:', error);
                enqueueSnackbar('Erreur lors de la récupération des données.', { variant: 'error' });
            }
        };

        fetchDemande();
    }, [id, enqueueSnackbar]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/demande-client/${id}`, {
                etat: formData.etat
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            enqueueSnackbar('État mis à jour avec succès.', { variant: 'success' });
            navigate('/dashboard/demandes-client');
        } catch (error) {
            console.error('Error updating demande client:', error);
            enqueueSnackbar('Erreur lors de la mise à jour de l\'état.', { variant: 'error' });
        }
    };

    return (
        <section className="py-5 py-lg-8">
            <div className="container">
                <div className="row">
                    <div className="col-xl-12 col-md-12 col-12">
                        <h1 className="mb-1">Demande Client N° {id}</h1>
                        <h3 className="mb-1"> Client ID :{formData.clientId} </h3>
                        <h3 className="mb-1"> Client : {formData.prenom} {formData.nom}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <div className="d-flex justify-content-end">
                                    <button type="submit" className="btn btn-primary">
                                        Mettre à jour
                                    </button>
                                </div>
                                <label htmlFor="etat">État</label>
                                <select
                                    id="etat"
                                    name="etat"
                                    value={formData.etat}
                                    onChange={handleChange}
                                    className="form-control"
                                >
                                    <option value="En attente traitement">En attente traitement</option>
                                    <option value="En cours">En cours</option>
                                    <option value="Traité">Traité</option>
                                    <option value="Annulé">Annulé</option>
                                </select>
                            </div>


                            <div className="form-group">
                                <label htmlFor="sujetSite">Sujet du site</label>
                                <textarea
                                    className="form-control"
                                    id="sujetSite"
                                    value={formData.sujetSite}
                                    readOnly
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="objectifsPrincipaux">Objectifs principaux</label>
                                <textarea
                                    className="form-control"
                                    id="objectifsPrincipaux"
                                    value={formData.objectifsPrincipaux}
                                    readOnly
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="typesPages">Types de pages</label>
                                <textarea
                                    className="form-control"
                                    id="typesPages"
                                    value={formData.typesPages}
                                    readOnly
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="logoIdentiteVisuelle">Logo / Identité visuelle</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="logoIdentiteVisuelle"
                                    value={formData.logoIdentiteVisuelle ? 'Oui' : 'Non'}
                                    readOnly
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="referencesSites">Références de sites</label>
                                <textarea
                                    className="form-control"
                                    id="referencesSites"
                                    value={formData.referencesSites}
                                    readOnly
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="delaisRealisation">Délais de réalisation</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="delaisRealisation"
                                    value={formData.delaisRealisation}
                                    readOnly
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="fonctionnalitesSpecifiques">Fonctionnalités spécifiques</label>
                                <textarea
                                    className="form-control"
                                    id="fonctionnalitesSpecifiques"
                                    value={formData.fonctionnalitesSpecifiques}
                                    readOnly
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="nomDomaineHebergement">Nom de domaine / Hébergement</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="nomDomaineHebergement"
                                    value={formData.nomDomaineHebergement ? 'Oui' : 'Non'}
                                    readOnly
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="styleVisuel">Style visuel</label>
                                <textarea
                                    className="form-control"
                                    id="styleVisuel"
                                    value={formData.styleVisuel}
                                    readOnly
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="concurrents">Concurrents</label>
                                <textarea
                                    className="form-control"
                                    id="concurrents"
                                    value={formData.concurrents}
                                    readOnly
                                />
                            </div>


                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DemandeClientUpdate;
