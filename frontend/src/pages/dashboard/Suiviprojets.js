import React from 'react'
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
const DashboardSuiviprojets = () => {
  return (
    <>
      <section className="mb-xl-9 my-5">
  <div className="container">
    <div className="row mb-4">
      <div className="col-lg-12">
        <div className="mb-4">
          <h3 className="mb-4">Tous les porjets</h3>
        </div>
      </div>
      <div className="col-lg-6 col-md-10 col-12">
        <div className="row g-3 align-items-center">
          <div className="col-lg-6 col-md-6 col-12">
            <label htmlFor="eventList" className="form-label visually-hidden">
              Search Category
            </label>
            <select className="form-select" id="eventList">
              <option selected="" disabled="" value="">
                Type of event
              </option>
              <option value="Conferences">Conferences</option>
              <option value="Online">Online</option>
              <option value="Livestream">Livestream</option>
              <option value="Video">Video</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <div className="row g-5">
      <div className="col-md-6">
        <div className="card shadow-sm h-100 border-0 card-lift overflow-hidden">
          <div className="row h-100 g-0">
            <a
              href="event-single.html"
              className="col-lg-5 col-md-12"
              style={{
                backgroundImage: "url(assets/images/event/event-img-2.jpg)",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                minHeight: "13rem"
              }}
            />
            <div className="col-lg-7 col-md-12">
              <div className="card-body h-100 d-flex align-items-start flex-column border rounded-end-lg-3 rounded-bottom-3 rounded-top-0 rounded-start-lg-0 border-start-lg-0 border-top-0 border-top-lg">
                <div className="mb-5">
                  <small className="text-uppercase fw-semibold ls-md">
                    Conference
                  </small>
                  <h4 className="my-2">
                  <Link to="/dashboard/projet" className="text-reset">
                      A look at building with Astro template
                    </Link>
                  </h4>
                  <small>July 2, 2024</small>
                </div>
                <div className="mt-auto">
                  <small className="me-2">9:00AM EDT</small>
                  <small>Germany</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div className="card shadow-sm h-100 border-0 card-lift overflow-hidden">
          <div className="row g-0 h-100">
            <a
              href="event-single.html"
              className="col-lg-5 col-md-12"
              style={{
                backgroundImage: "url(assets/images/event/event-img-3.jpg)",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                minHeight: "13rem"
              }}
            />
            <div className="col-lg-7 col-md-12">
              <div className="card-body h-100 d-flex align-items-start flex-column border rounded-end-lg-3 rounded-bottom-3 rounded-top-0 rounded-start-lg-0 border-start-lg-0 border-top-0 border-top-lg">
                <div className="mb-5">
                  <small className="text-uppercase fw-semibold ls-md">
                    Conference
                  </small>
                  <h4 className="my-2">
                    <Link to="/dashboard/projet" className="text-reset">
                      A look at building with Astro template
                    </Link>
                  </h4>
                  <small>June 28, 2024</small>
                </div>
                <div className="mt-auto">
                  <small className="me-2">9:00AM EDT</small>
                  <small>India</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div className="card shadow-sm h-100 border-0 card-lift overflow-hidden">
          <div className="row h-100 g-0">
            <a
              href="event-single.html"
              className="col-lg-5 col-md-12"
              style={{
                backgroundImage: "url(assets/images/event/event-img-4.jpg)",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                minHeight: "13rem"
              }}
            />
            <div className="col-lg-7 col-md-12">
              <div className="card-body h-100 d-flex align-items-start flex-column border rounded-end-lg-3 rounded-bottom-3 rounded-top-0 rounded-start-lg-0 border-start-lg-0 border-top-0 border-top-lg">
                <div className="mb-5">
                  <small className="text-uppercase fw-semibold ls-md">
                    Online
                  </small>
                  <h4 className="my-2">
                    <a href="event-single.html" className="text-reset">
                      Make a blog with Next.js, React, and Sanity
                    </a>
                  </h4>
                  <small>June 26, 2024</small>
                </div>
                <div className="mt-auto">
                  <small className="me-2">9:00AM EDT</small>
                  <small>Dubai</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div className="card shadow-sm h-100 border-0 card-lift overflow-hidden">
          <div className="row g-0 h-100">
            <a
              href="event-single.html"
              className="col-lg-5 col-md-12"
              style={{
                backgroundImage: "url(assets/images/event/event-img-5.jpg)",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                minHeight: "13rem"
              }}
            />
            <div className="col-lg-7 col-md-12">
              <div className="card-body h-100 d-flex align-items-start flex-column border rounded-end-lg-3 rounded-bottom-3 rounded-top-0 rounded-start-lg-0 border-start-lg-0 border-top-0 border-top-lg">
                <div className="mb-5">
                  <small className="text-uppercase fw-semibold ls-md">
                    Livestream
                  </small>
                  <h4 className="my-2">
                    <a href="event-single.html" className="text-reset">
                      Using Contentful CMS with Next.js
                    </a>
                  </h4>
                  <small>June 22, 2024</small>
                </div>
                <div className="mt-auto">
                  <small className="me-2">9:00AM EDT</small>
                  <small>London</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

    </>
  )
}

export default DashboardSuiviprojets
