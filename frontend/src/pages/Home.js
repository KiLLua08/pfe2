import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Home = () => {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get('/package');
        const packagesData = response.data.map(pkg => ({
          ...pkg,
          features: JSON.parse(pkg.features || '[]') // Parse features as JSON
        }));
        setPackages(packagesData);
      } catch (error) {
        console.error('Error fetching packages', error);
      }
    };

    fetchPackages();
  }, []);

  const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  const settings = {
    dots: true,
    infinite: false, // Set to false to avoid infinite looping
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  const groupedPackages = chunkArray(packages, 3);

  // Debugging the grouped packages
  console.log('Grouped Packages:', groupedPackages);

  return (
    <>
      {/*Hero start*/}
      <section className="position-relative py-10">
        <video
          className="w-100"
          autoPlay=""
          muted=""
          loop=""
          style={{ objectFit: "cover" }}
          playsInline=""
        >
          <source
            src="assets/images/landings/it-company/video.mp4"
            type="video/mp4"
          />
        </video>
        <div className="container position-relative py-lg-10" data-cue11="fadeIn">
          <div className="row py-lg-10 justify-content-center text-center">
            <div className="col-lg-9 col-12">
              <div className="d-flex flex-column gap-6">
                <div className="d-flex flex-column gap-4">
                  <h1 className="text-white-stable display-4 mb-0">
                    Renforcez votre entreprise grâce à des solutions informatiques de pointe
                  </h1>
                  <p className="mb-0 text-white-50 lead px-lg-10">
                    Des solutions informatiques innovantes, méticuleusement adaptées à votre succès – là où la technologie rencontre l'excellence pour une transformation d'entreprise sans faille.
                  </p>
                </div>
                <div className="d-md-flex d-grid align-items-center justify-content-md-center gap-4">
                  <a href="#/siteform" className="btn btn-primary rounded-pill">
                    Créer un site internet
                  </a>
                  <Link
                    to="/contact"
                    className="link-white icon-link icon-link-hover card-grid-link d-flex justify-content-center"
                  >
                    je veux contacter un expert
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={14}
                      height={14}
                      fill="currentColor"
                      className="bi bi-arrow-right"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*Hero end*/}

      {/* Pricing section start */}
      <section className="container py-5">
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <div className="text-center mb-xl-9 mb-5">
              <h2 className="mb-3">Nos Packs</h2>
              <p className="mb-0 lead px-xl-7">
                Nous offrons des solutions adaptées à chaque budget et objectif. Découvrez nos options de tarification ci-dessous
              </p>
            </div>
          </div>
        </div>

        <div className="table-responsive-lg">
          <Slider {...settings}>
            {groupedPackages.map((group, groupIndex) => (
              <div key={groupIndex}>
                <div className="row g-3">
                  {group.map((pkg) => (
                    <div className="col-md-4" key={pkg.id}>
                      <div className="card bg-primary-subtle border-0 p-2 mb-5 mb-xl-0 d-flex flex-column h-100">
                        <div className="card-body bg-white shadow rounded-2 d-flex flex-column flex-grow-1">
                          <div className="mb-5">
                            <h3 className="h6 mb-3">{pkg.name}</h3>
                            <h2 className="d-flex align-items-center">
                              <span className="text-dark">{pkg.price}€</span>
                              {pkg.oldPrice && (
                                <del className="text-body-tertiary ms-1">
                                  {pkg.oldPrice}€
                                </del>
                              )}
                            </h2>
                          </div>
                          <div className="mb-5">
                            <span className="small">{pkg.description}</span>
                            <div
                              className="progress mt-2 bg-primary-subtle"
                              style={{ height: 8 }}
                            >
                              <div
                                className="progress-bar bg-primary bg-opacity-50"
                                style={{ width: `${pkg.progress || 0}%` }}
                              />
                            </div>
                          </div>
                          <div className="mb-5">
                            {pkg.features.length > 2 ? (
                              <ul className="list-unstyled">
                                {pkg.features.map((feature, featureIndex) => (
                                  <li className="mb-2 d-flex align-items-center" key={featureIndex}>
                                    <i className="bi bi-check-circle-fill text-success me-2" style={{ fontSize: '16px' }}></i>
                                    <span>{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-muted">Aucune caractéristique disponible.</p>
                            )}
                          </div>
                          <div className="mt-auto d-grid">
                            <a href="#" className="btn btn-outline-primary">
                              Choisir
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>
      {/* Pricing section end */}
    </>
  );
};

export default Home;
