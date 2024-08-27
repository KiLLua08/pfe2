import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
const SiteForm = () => {
    const categories = [
        "Conseil", "Éducation", "Mariages", "Marketing", "Mode",
        "Bijoux", "Restaurants", "Média et podcasts", "Immobilier et propriétés",
        "Photographie", "Art", "Santé et beauté", "Musique", "À but non lucratif",
        "Nature et animaux", "Fitness", "Design", "Voyage", "Décorateur d’intérieur",
        "Technologie", "Jeux", "Personnel et CV", "Nourriture"
    ];

    const objectifs = [
        "Remplir mon emploi du temps",
        "Promouvoir une entreprise physique",
        "Vendre des cours en ligne",
        "Envoyer des factures",
        "Présenter mon travail ou mettre en valeur mon savoir-faire",
        "Vendre mes produits",
        "Proposer mes services",
        "Proposer un formulaire de contact",
        "Collecter des dons",
        "Vendre des vidéos à la demande",
        "Vendre des abonnements",
        "Promouvoir un événement ou un projet",
        "Bâtir une communauté",
        "Publier un blog ou un autre média"
    ];
    const [currentSection, setCurrentSection] = useState(0);

    const handleNext = () => {
        setCurrentSection(prevSection => prevSection + 1);
    };

    const handleBack = () => {
        setCurrentSection(prevSection => prevSection - 1);
    };
    const handleSkip = () => {
        setCurrentSection(prevSection => prevSection + 1);
    };
  return (
    <>
   <>
  <div className="pattern-square" />
  <section className="bg-light py-5 py-lg-8 bg-opacity-50">
    <div className="container">
      <div className="row">
        <div className="col-12 col-md-6">
          <div>
            <h1 className="mb-0">De quoi votre site parle-t-il ?</h1>
            <h5>Cela nous permettra de vous proposer quelques idées de départ et des exemples.</h5>
          </div>
        </div>
        {/* Navbar Filter tabs */}
      
      </div>
    </div>
  </section>

  {currentSection === 0 && (  <section className="pattern-square bg-info bg-opacity-10">
  <div className="container position-relative z-1 py-xl-9 py-6">
    <div className="row">
      <div className="col-lg-10 offset-lg-1 col-md-12">
        <div className="row align-items-center g-5">
          <div className="col-lg-6 col-12 order-2">
            <div className="me-xl-7">
              <div className="mb-5">
                <h2 className="h1 mb-4">De quoi votre site parle-t-il ?</h2>
                <p className="mb-0">
                Cela nous permettra de vous proposer quelques idées de départ et des exemples.

                </p>
              </div>
              <div className="mb-5">
                <ul className="list-unstyled">
                  <li className="mb-2 d-flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={20}
                      height={20}
                      fill="currentColor"
                      className="bi bi-dot"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
                    </svg>
                    <span className="ms-1">
                      Not sure which technology to choose?
                    </span>
                  </li>
                  <li className="mb-2 d-flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={20}
                      height={20}
                      fill="currentColor"
                      className="bi bi-dot"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
                    </svg>
                    <span className="ms-1">Need advice on the next steps?</span>
                  </li>
                  <li className="mb-2 d-flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={20}
                      height={20}
                      fill="currentColor"
                      className="bi bi-dot"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
                    </svg>
                    <span className="ms-1">
                      Hesitating on how to plan the execution?
                    </span>
                  </li>
                </ul>
              </div>
              <div className="d-md-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center mb-3 mb-md-0 small">
                  <div className="d-flex align-items-center">
                    <img
                      src="../assets/images/avatar/avatar-7.jpg"
                      alt="Avatar"
                      className="avatar avatar-lg rounded-circle"
                    />
                    <div className="ms-3">
                      <h5 className="mb-0">Jitu Chauhan</h5>
                      <small className="me-4">Head of Sales</small>
                      <small>sales@blockui.com</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-12 order-lg-2">
            <div className="card shadow-sm">
              <div className="card-body">
                <form className="row needs-validation g-3" noValidate="">
                <div className="mt-6 col-12 d-flex flex-wrap gap-2">
        {categories.map(category => (
                <div key={category} className="filter-badge">
                    <input
                        type="radio"
                        id={category.toLowerCase().replace(/\s+/g, '-')}
                        name="category"
                        value={category}
                        
                    />
                   <span className="ms-2" style={{border: '0'}}>{category}</span>
                </div>
            ))}
           
            <div class="col-md-12">
            <br/>
                                        <label for="scheduleEmailInput"
                                            class="form-label">
                                           Vous ne trouvez pas ce que vous cherchez ?
                                            <span
class="text-danger">*</span>
                                        </label>
                                        <input type="email"
                                            class="form-control"
                                            id="scheduleEmailInput"
                                            placeholder='Décrivez votre site...'/>
                                        <div class="invalid-feedback">Please
                                            enter email.</div>
                                    </div>
        </div>
        <div className="d-flex justify-content-between">
                <div>
                  
                    <button className="btn btn-default" type="button" onClick={handleSkip}>
                        Ignorer
                    </button>
                </div>
                <button className="btn btn-primary" type="button" onClick={handleNext}>
                    Suivant
                </button>
            </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>)}





{currentSection === 1 && (  <section className="pattern-square bg-info bg-opacity-10">
  <div className="container position-relative z-1 py-xl-9 py-6">
    <div className="row">
      <div className="col-lg-10 offset-lg-1 col-md-12">
        <div className="row align-items-center g-5">
          <div className="col-lg-6 col-12 order-2">
            <div className="me-xl-7">
              <div className="mb-5">
                <h2 className="h1 mb-4">Quels sont vos principaux objectifs ?</h2>
                <p className="mb-0">
                Sélectionnez tous les éléments qui s’appliquent. Si quelque chose vous intéresse mais n’est pas une priorité absolue, ne vous inquiétez pas. Vous pouvez ajouter toutes nos fonctionnalités au template de votre choix.


                </p>
              </div>
              <div className="mb-5">
                <ul className="list-unstyled">
                  <li className="mb-2 d-flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={20}
                      height={20}
                      fill="currentColor"
                      className="bi bi-dot"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
                    </svg>
                    <span className="ms-1">
                      Not sure which technology to choose?
                    </span>
                  </li>
                  <li className="mb-2 d-flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={20}
                      height={20}
                      fill="currentColor"
                      className="bi bi-dot"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
                    </svg>
                    <span className="ms-1">Need advice on the next steps?</span>
                  </li>
                  <li className="mb-2 d-flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={20}
                      height={20}
                      fill="currentColor"
                      className="bi bi-dot"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
                    </svg>
                    <span className="ms-1">
                      Hesitating on how to plan the execution?
                    </span>
                  </li>
                </ul>
              </div>
              <div className="d-md-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center mb-3 mb-md-0 small">
                  <div className="d-flex align-items-center">
                    <img
                      src="../assets/images/avatar/avatar-7.jpg"
                      alt="Avatar"
                      className="avatar avatar-lg rounded-circle"
                    />
                    <div className="ms-3">
                      <h5 className="mb-0">Jitu Chauhan</h5>
                      <small className="me-4">Head of Sales</small>
                      <small>sales@blockui.com</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-12 order-lg-2">
            <div className="card shadow-sm">
              <div className="card-body">
                <form className="row needs-validation g-3" noValidate="">
                <div className="mt-6 col-12 d-flex flex-wrap gap-2">
                {objectifs.map(objectif => (
                <div key={objectif} className="filter-badge">
                    <input
                        type="checkbox"
                        id={objectif.toLowerCase().replace(/\s+/g, '-')}
                        name={objectif.toLowerCase().replace(/\s+/g, '-')}
                        value={objectif}
                       
                    />
                    <span className="ms-2" style={{border: '0'}}>{objectif}</span>
                </div>
            ))}
           
    
        </div>
        <div className="d-flex justify-content-between">
                <div>
                    <button className="btn btn-default" type="button" onClick={handleBack}>
                        Retour
                    </button>
                    <button className="btn btn-default" type="button" onClick={handleSkip}>
                        Ignorer
                    </button>
                </div>
                <button className="btn btn-primary" type="button" onClick={handleNext}>
                    Suivant
                </button>
            </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>)}




</>

    </>
  )
}

export default SiteForm
