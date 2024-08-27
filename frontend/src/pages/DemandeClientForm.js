import React, { useState } from 'react';
import axios from 'axios';

const DemandeClientForm = () => {
    const [formData, setFormData] = useState({
        packageId: '3',
        clientId: '6',
        sujetSite: [],
        objectifsPrincipaux: [],
        typesPages: [],
        logoIdentiteVisuelle: false,
        referencesSites: [],
        delaisRealisation: '',
        fonctionnalitesSpecifiques: [],
        nomDomaineHebergement: false,
        styleVisuel: [],
        concurrents: [],
        etat: 'en attente traitement',
    });

    const typesPages = ['Accueil', 'À propos', 'Services', 'Contact', 'Blog', 'Portfolio', 'Équipe', 'Témoignages', 'FAQ', 'Boutique', 'Galerie', 'Événements', 'Ressources', 'Mentions légales', 'Politique de confidentialité', 'Conditions générales', 'Téléchargements', 'Support', 'Forum', 'Carte du site'];
    const delais = ['Moins d\'un mois', '1 à 3 mois', '3 à 6 mois', 'Plus de 6 mois'];
    const fonctionnalites = ['Système de réservation en ligne', 'Paiement en ligne sécurisé', 'Forum de discussion intégré', 'Galerie d’images et de vidéos', 'Blog avec options de publication', 'Intégration des réseaux sociaux', 'Gestion des utilisateurs et des permissions', 'Système de commentaires et d’avis', 'Outils de SEO et d’analyse', 'Espace membre et profils personnalisés'];

    const stylesVisuels = ['Moderne et épuré', 'Classique et élégant', 'Coloré et dynamique', 'Minimaliste et fonctionnel', 'Rustique et traditionnel', 'Contemporain et avant-gardiste', 'Luxe et sophistiqué', 'Naturel et organique', 'High-tech et futuriste', 'Art déco et rétro', 'Boho chic et artistique', 'Vintage et nostalgique'];

    const objectifs = ['Remplir mon emploi du temps', 'Promouvoir une entreprise physique', 'Vendre des cours en ligne', 'Envoyer des factures', 'Présenter mon travail ou mettre en valeur mon savoir-faire', 'Vendre mes produits', 'Proposer mes services', 'Proposer un formulaire de contact', 'Collecter des dons', 'Vendre des vidéos à la demande', 'Vendre des abonnements', 'Promouvoir un événement ou un projet', 'Bâtir une communauté', 'Publier un blog ou un autre média'];


    const [currentSection, setCurrentSection] = useState(0);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === 'concurrents') {
            // Convert comma-separated values into an array
            const concurrentsArray = value.split(',').map(item => item.trim()).filter(item => item !== '');
            setFormData((prevData) => ({
                ...prevData,
                [name]: concurrentsArray,
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: type === 'checkbox' ? checked : value,
            }));
        }
    };
    const handleMultiSelectChange = (e) => {
        const { name, value, checked } = e.target;
        setFormData((prevData) => {
            // Ensure currentValues is an array
            const currentValues = Array.isArray(prevData[name]) ? prevData[name] : [];
            if (checked) {
                return {
                    ...prevData,
                    [name]: [...currentValues, value],
                };
            } else {
                return {
                    ...prevData,
                    [name]: currentValues.filter((item) => item !== value),
                };
            }
        });
    };



    const handleNext = () => {
        setCurrentSection((prevSection) => prevSection + 1);
    };

    const handleBack = () => {
        setCurrentSection((prevSection) => prevSection - 1);
    };

    const handleSkip = () => {
        setCurrentSection((prevSection) => prevSection + 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/demande-client', formData);
            console.log('Form submitted successfully', response.data);
            // Optionally handle success (e.g., redirect or display a message)
        } catch (error) {
            console.error('Error submitting form', error);
            // Optionally handle error (e.g., display an error message)
        }
    };

    return (
        <>
            <section className="bg-light py-5 py-lg-8 bg-opacity-50">
                <div className="container">
                    <div className="row">
                        <div className="col-12 col-md-6">
                            <h1 className="mb-0">Demande de Client</h1>
                            <h5>Veuillez remplir ce formulaire pour nous donner plus de détails.</h5>
                        </div>
                    </div>
                </div>
            </section>

            {currentSection === 0 && (
                <section className="pattern-square bg-info bg-opacity-10">
                    <div className="container position-relative z-1 py-xl-9 py-6">
                        <div className="row">
                            <div className="col-lg-10 offset-lg-1 col-md-12">
                                <div className="row align-items-center g-5">
                                    <div className="col-lg-6 col-12">
                                        <div className="me-xl-7">
                                            <h2 className="h1 mb-4">Sélectionnez le package</h2>
                                            <p className="mb-0">Choisissez le package qui correspond le mieux à vos besoins.</p>
                                            {/* Render package selection options here */}
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-12">
                                        <div className="card shadow-sm">
                                            <div className="card-body">
                                                <form className="row needs-validation g-3" noValidate="" onSubmit={handleSubmit}>
                                                    {/* Add package selection fields here */}
                                                    <div className="d-flex justify-content-between">
                                                        <button className="btn btn-default" type="button" onClick={handleSkip}>Ignorer</button>
                                                        <button className="btn btn-primary" type="button" onClick={handleNext}>Suivant</button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {currentSection === 1 && (
                <section className="pattern-square bg-info bg-opacity-10">
                    <div className="container position-relative z-1 py-xl-9 py-6">
                        <div className="row">
                            <div className="col-lg-10 offset-lg-1 col-md-12">
                                <div className="row align-items-center g-5">
                                    <div className="col-lg-6 col-12">
                                        <div className="me-xl-7">
                                            <h2 className="h1 mb-4">Quels sont vos objectifs principaux ?</h2>
                                            <p className="mb-0">Sélectionnez tous les objectifs qui s’appliquent à votre demande.</p>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-12">
                                        <form className="row needs-validation g-3" noValidate="" onSubmit={handleSubmit}>
                                            <div className="card shadow-sm">
                                                <div className="card-body">
                                                    <div className="d-flex flex-wrap gap-2">
                                                        {objectifs.map((objectif) => (
                                                            <div key={objectif} className="filter-badge">
                                                                <input
                                                                    type="checkbox"
                                                                    id={objectif.toLowerCase().replace(/\s+/g, '-')}
                                                                    name="objectifsPrincipaux"
                                                                    value={objectif}
                                                                    checked={formData.objectifsPrincipaux.includes(objectif)}
                                                                    onChange={handleMultiSelectChange}
                                                                />
                                                                <span className="ms-2">{objectif}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="d-flex justify-content-between mt-4">
                                                        <button className="btn btn-default" type="button" onClick={handleBack}>Retour</button>
                                                        <button className="btn btn-default" type="button" onClick={handleSkip}>Ignorer</button>
                                                        <button className="btn btn-primary" type="button" onClick={handleNext}>Suivant</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}


            {currentSection === 2 && (
                <section className="pattern-square bg-info bg-opacity-10">
                    <div className="container position-relative z-1 py-xl-9 py-6">
                        <div className="row">
                            <div className="col-lg-10 offset-lg-1 col-md-12">
                                <div className="row align-items-center g-5">
                                    <div className="col-lg-6 col-12">
                                        <div className="me-xl-7">
                                            <h2 className="h1 mb-4">Quels types de pages souhaitez-vous inclure sur votre site ?</h2>
                                            <p className="mb-0">Sélectionnez tous les types de pages que vous souhaitez ajouter.</p>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-12">
                                        <form className="row needs-validation g-3" noValidate="" onSubmit={handleSubmit}>
                                            <div className="card shadow-sm">
                                                <div className="card-body">
                                                    <div className="d-flex flex-wrap gap-2">
                                                        {typesPages.map((page) => (
                                                            <div key={page} className="filter-badge">
                                                                <input
                                                                    type="checkbox"
                                                                    id={page.toLowerCase().replace(/\s+/g, '-')}
                                                                    name="typesPages"
                                                                    value={page}
                                                                    checked={formData.typesPages.includes(page)}
                                                                    onChange={handleMultiSelectChange}
                                                                />
                                                                <span className="ms-2">{page}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="d-flex justify-content-between mt-4">
                                                        <button className="btn btn-default" type="button" onClick={handleBack}>Retour</button>
                                                        <button className="btn btn-default" type="button" onClick={handleSkip}>Ignorer</button>
                                                        <button className="btn btn-primary" type="button" onClick={handleNext}>Suivant</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {currentSection === 3 && (
                <section className="pattern-square bg-info bg-opacity-10">
                    <div className="container position-relative z-1 py-xl-9 py-6">
                        <div className="row">
                            <div className="col-lg-10 offset-lg-1 col-md-12">
                                <div className="row align-items-center g-5">
                                    <div className="col-lg-6 col-12">
                                        <div className="me-xl-7">
                                            <h2 className="h1 mb-4">Avez-vous déjà un logo ou une identité visuelle ?</h2>
                                            <p className="mb-0">Indiquez si vous avez déjà un logo ou une identité visuelle.</p>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-12">
                                        <form className="row needs-validation g-3" noValidate="" onSubmit={handleSubmit}>
                                            <div className="card shadow-sm">
                                                <div className="card-body">
                                                    <div className="form-check">
                                                        <input
                                                            type="radio"
                                                            id="logoIdentiteVisuelleOui"
                                                            name="logoIdentiteVisuelle"
                                                            value="oui"
                                                            checked={formData.logoIdentiteVisuelle === 'oui'}
                                                            onChange={handleChange}
                                                            className="form-check-input"
                                                        />
                                                        <label htmlFor="logoIdentiteVisuelleOui" className="form-check-label ms-2">Oui</label>
                                                    </div>
                                                    <div className="form-check">
                                                        <input
                                                            type="radio"
                                                            id="logoIdentiteVisuelleNon"
                                                            name="logoIdentiteVisuelle"
                                                            value="non"
                                                            checked={formData.logoIdentiteVisuelle === 'non'}
                                                            onChange={handleChange}
                                                            className="form-check-input"
                                                        />
                                                        <label htmlFor="logoIdentiteVisuelleNon" className="form-check-label ms-2">Non</label>
                                                    </div>

                                                    <div className="d-flex justify-content-between mt-4">
                                                        <button className="btn btn-default" type="button" onClick={handleBack}>Retour</button>
                                                        <button className="btn btn-default" type="button" onClick={handleSkip}>Ignorer</button>
                                                        <button className="btn btn-primary" type="button" onClick={handleNext}>Suivant</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {currentSection === 4 && (
                <section className="pattern-square bg-info bg-opacity-10">
                    <div className="container position-relative z-1 py-xl-9 py-6">
                        <div className="row">
                            <div className="col-lg-10 offset-lg-1 col-md-12">
                                <div className="row align-items-center g-5">
                                    <div className="col-lg-6 col-12">
                                        <div className="me-xl-7">
                                            <h2 className="h1 mb-4">Avez-vous des références de sites que vous aimez ?</h2>
                                            <p className="mb-0">Indiquez si vous avez des références de sites que vous appréciez.</p>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-12">
                                        <form className="row needs-validation g-3" noValidate="" onSubmit={handleSubmit}>
                                            <div className="card shadow-sm">
                                                <div className="card-body">
                                                    <div className="form-check">
                                                        <input
                                                            type="radio"
                                                            id="referencesSitesOui"
                                                            name="referencesSites"
                                                            value="oui"
                                                            checked={formData.referencesSites === 'oui'}
                                                            onChange={handleChange}
                                                            className="form-check-input"
                                                        />
                                                        <label htmlFor="referencesSitesOui" className="form-check-label ms-2">Oui</label>
                                                    </div>
                                                    <div className="form-check">
                                                        <input
                                                            type="radio"
                                                            id="referencesSitesNon"
                                                            name="referencesSites"
                                                            value="non"
                                                            checked={formData.referencesSites === 'non'}
                                                            onChange={handleChange}
                                                            className="form-check-input"
                                                        />
                                                        <label htmlFor="referencesSitesNon" className="form-check-label ms-2">Non</label>
                                                    </div>

                                                    <div className="d-flex justify-content-between mt-4">
                                                        <button className="btn btn-default" type="button" onClick={handleBack}>Retour</button>
                                                        <button className="btn btn-default" type="button" onClick={handleSkip}>Ignorer</button>
                                                        <button className="btn btn-primary" type="button" onClick={handleNext}>Suivant</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {currentSection === 5 && (
                <section className="pattern-square bg-info bg-opacity-10">
                    <div className="container position-relative z-1 py-xl-9 py-6">
                        <div className="row">
                            <div className="col-lg-10 offset-lg-1 col-md-12">
                                <div className="row align-items-center g-5">
                                    <div className="col-lg-6 col-12">
                                        <div className="me-xl-7">
                                            <h2 className="h1 mb-4">Quels sont les délais pour la réalisation de votre site ?</h2>
                                            <p className="mb-0">Sélectionnez les délais souhaités pour la réalisation de votre site.</p>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-12">
                                        <form className="row needs-validation g-3" noValidate="" onSubmit={handleSubmit}>
                                            <div className="card shadow-sm">
                                                <div className="card-body">
                                                    <div className="d-flex flex-column gap-3">
                                                        {delais.map((delai) => (
                                                            <div key={delai} className="form-check">
                                                                <input
                                                                    type="radio"
                                                                    id={`delai-${delai}`}
                                                                    name="delaisRealisation"
                                                                    value={delai}
                                                                    checked={formData.delaisRealisation === delai}
                                                                    onChange={handleChange}
                                                                    className="form-check-input"
                                                                />
                                                                <label htmlFor={`delai-${delai}`} className="form-check-label ms-2">
                                                                    {delai}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="d-flex justify-content-between mt-4">
                                                        <button className="btn btn-default" type="button" onClick={handleBack}>Retour</button>
                                                        <button className="btn btn-default" type="button" onClick={handleSkip}>Ignorer</button>
                                                        <button className="btn btn-primary" type="button" onClick={handleNext}>Suivant</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {currentSection === 6 && (
                <section className="pattern-square bg-info bg-opacity-10">
                    <div className="container position-relative z-1 py-xl-9 py-6">
                        <div className="row">
                            <div className="col-lg-10 offset-lg-1 col-md-12">
                                <div className="row align-items-center g-5">
                                    <div className="col-lg-6 col-12">
                                        <div className="me-xl-7">
                                            <h2 className="h1 mb-4">Avez-vous des besoins spécifiques en termes de fonctionnalités ?</h2>
                                            <p className="mb-0">Sélectionnez toutes les fonctionnalités spécifiques que vous souhaitez.</p>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-12">
                                        <form className="row needs-validation g-3" noValidate="" onSubmit={handleSubmit}>
                                            <div className="card shadow-sm">
                                                <div className="card-body">
                                                    <div className="d-flex flex-wrap gap-2">
                                                        {fonctionnalites.map((fonctionnalite) => (
                                                            <div key={fonctionnalite} className="filter-badge">
                                                                <input
                                                                    type="checkbox"
                                                                    id={fonctionnalite.toLowerCase().replace(/\s+/g, '-')}
                                                                    name="fonctionnalitesSpecifiques"
                                                                    value={fonctionnalite}
                                                                    checked={formData.fonctionnalitesSpecifiques.includes(fonctionnalite)}
                                                                    onChange={handleMultiSelectChange}
                                                                />
                                                                <span className="ms-2">{fonctionnalite}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="d-flex justify-content-between mt-4">
                                                        <button className="btn btn-default" type="button" onClick={handleBack}>Retour</button>
                                                        <button className="btn btn-default" type="button" onClick={handleSkip}>Ignorer</button>
                                                        <button className="btn btn-primary" type="button" onClick={handleNext}>Suivant</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {currentSection === 7 && (
                <section className="pattern-square bg-info bg-opacity-10">
                    <div className="container position-relative z-1 py-xl-9 py-6">
                        <div className="row">
                            <div className="col-lg-10 offset-lg-1 col-md-12">
                                <div className="row align-items-center g-5">
                                    <div className="col-lg-6 col-12">
                                        <div className="me-xl-7">
                                            <h2 className="h1 mb-4">Avez-vous déjà un nom de domaine et un hébergement web ?</h2>
                                            <p className="mb-0">Indiquez si vous avez déjà un nom de domaine et un hébergement web.</p>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-12">
                                        <form className="row needs-validation g-3" noValidate="" onSubmit={handleSubmit}>
                                            <div className="card shadow-sm">
                                                <div className="card-body">
                                                    <div className="form-check">
                                                        <input
                                                            type="radio"
                                                            id="nomDomaineHebergementOui"
                                                            name="nomDomaineHebergement"
                                                            value="oui"
                                                            checked={formData.nomDomaineHebergement === 'oui'}
                                                            onChange={handleChange}
                                                            className="form-check-input"
                                                        />
                                                        <label htmlFor="nomDomaineHebergementOui" className="form-check-label ms-2">Oui</label>
                                                    </div>
                                                    <div className="form-check">
                                                        <input
                                                            type="radio"
                                                            id="nomDomaineHebergementNon"
                                                            name="nomDomaineHebergement"
                                                            value="non"
                                                            checked={formData.nomDomaineHebergement === 'non'}
                                                            onChange={handleChange}
                                                            className="form-check-input"
                                                        />
                                                        <label htmlFor="nomDomaineHebergementNon" className="form-check-label ms-2">Non</label>
                                                    </div>

                                                    <div className="d-flex justify-content-between mt-4">
                                                        <button className="btn btn-default" type="button" onClick={handleBack}>Retour</button>
                                                        <button className="btn btn-default" type="button" onClick={handleSkip}>Ignorer</button>
                                                        <button className="btn btn-primary" type="button" onClick={handleNext}>Suivant</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {currentSection === 8 && (
                <section className="pattern-square bg-info bg-opacity-10">
                    <div className="container position-relative z-1 py-xl-9 py-6">
                        <div className="row">
                            <div className="col-lg-10 offset-lg-1 col-md-12">
                                <div className="row align-items-center g-5">
                                    <div className="col-lg-6 col-12">
                                        <div className="me-xl-7">
                                            <h2 className="h1 mb-4">Comment décririez-vous le style visuel souhaité pour votre site ?</h2>
                                            <p className="mb-0">Sélectionnez le style visuel que vous souhaitez pour votre site.</p>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-12">
                                        <form className="row needs-validation g-3" noValidate="" onSubmit={handleSubmit}>
                                            <div className="card shadow-sm">
                                                <div className="card-body">
                                                    <div className="d-flex flex-wrap gap-2">
                                                        {stylesVisuels.map((style) => (
                                                            <div key={style} className="filter-badge">
                                                                <input
                                                                    type="checkbox"
                                                                    id={style.toLowerCase().replace(/\s+/g, '-')}
                                                                    name="styleVisuel" // Ensure this matches the key in formData
                                                                    value={style}
                                                                    checked={Array.isArray(formData.styleVisuel) && formData.styleVisuel.includes(style)}
                                                                    onChange={handleMultiSelectChange}
                                                                />
                                                                <span className="ms-2">{style}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="d-flex justify-content-between mt-4">
                                                        <button className="btn btn-default" type="button" onClick={handleBack}>Retour</button>
                                                        <button className="btn btn-default" type="button" onClick={handleSkip}>Ignorer</button>
                                                        <button className="btn btn-primary" type="button" onClick={handleNext}>Suivant</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}


            {currentSection === 9 && (
                <section className="pattern-square bg-info bg-opacity-10">
                    <div className="container position-relative z-1 py-xl-9 py-6">
                        <div className="row">
                            <div className="col-lg-10 offset-lg-1 col-md-12">
                                <div className="row align-items-center g-5">
                                    <div className="col-lg-6 col-12">
                                        <div className="me-xl-7">
                                            <h2 className="h1 mb-4">Quels sont vos principaux concurrents ?</h2>
                                            <p className="mb-0">Veuillez entrer une liste de vos concurrents en utilisant des liens.</p>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-12">
                                        <form className="row needs-validation g-3" noValidate="" onSubmit={handleSubmit}>
                                            <div className="card shadow-sm">
                                                <div className="card-body">
                                                    <div className="mt-4">
                                                        <label htmlFor="concurrentsLinks" className="form-label">Liste des concurrents (URLs séparées par des virgules)</label>
                                                        <textarea
                                                            id="concurrents"
                                                            name="concurrents" // Ensure this matches the key in formData
                                                            value={formData.concurrents}
                                                            onChange={handleChange}
                                                            className="form-control"
                                                            rows="4"
                                                            placeholder="Entrez les URLs des concurrents ici..."
                                                        />
                                                    </div>
                                                    <div className="d-flex justify-content-between mt-4">
                                                        <button className="btn btn-default" type="button" onClick={handleBack}>Retour</button>
                                                        <button className="btn btn-default" type="button" onClick={handleSkip}>Ignorer</button>
                                                        <button className="btn btn-primary" type="submit">Envoyer</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}



            <div className="d-flex justify-content-center mt-4">
                {Array.from({ length: 9 }, (_, index) => (
                    <button
                        key={index + 1}
                        className={`btn ${currentSection === index + 1 ? 'btn-primary' : 'btn-outline-primary'} mx-2`}
                        onClick={() => setCurrentSection(index + 1)}
                    >
                        Etape {index + 1}
                    </button>
                ))}
            </div>
        </>
    );
};

export default DemandeClientForm;
