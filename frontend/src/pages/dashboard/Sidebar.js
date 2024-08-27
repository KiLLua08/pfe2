import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Import Link from react-router-dom
const Sidebar = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role")
  const name = localStorage.getItem("prenom") + " " + localStorage.getItem("nom");
  const logout = () => {
    localStorage.clear();
    navigate('/')

  }



  return (
    <>
      <div className="col-lg-3 col-md-4">
        <div className="d-flex align-items-center mb-4 justify-content-center justify-content-md-start">
          <img
            src="assets/images/avatar/avatar-1.jpg"
            alt="avatar"
            className="avatar avatar-lg rounded-circle"
          />
          <div className="ms-3">
            <h5 className="mb-0">{name}</h5>
            <small>Compte {role}</small>
          </div>
        </div>
        {/* Navbar */}

<div className="accordion accordion-header d-md-none text-center d-grid">
  <button
    className="accordion-item btn btn-light mb-3 d-flex align-items-center justify-content-between"
    type="button"
    data-bs-toggle="collapse"
    data-bs-target="#collapseAccountMenu"
    aria-expanded="false"
    aria-controls="collapseAccountMenu"
  >
    Account Menu
    <i className="bi bi-chevron-down ms-2" />
  </button>
</div>

{role === "client" && (
  <div className="accordion-collapse collapse d-md-block" id="collapseAccountMenu">
    <ul className="nav flex-column nav-account p-2">
      <li className="nav-item">
        <Link
          className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
          to="/dashboard"
        >
          <i className="align-bottom bx bx-home" />
          <span className="ms-2">Home</span>
        </Link>
      </li>

      <li className="nav-item">
        <Link
          className={`nav-link ${location.pathname.includes('/chat') ? 'active' : ''}`}
          to="/dashboard/chat"
        >
          <i className="align-bottom bx bx-link" />
          <span className="ms-2">Messages</span>
        </Link>
      </li>

      <li className="nav-item">
        <Link
          className={`nav-link ${location.pathname.includes('/ticket') ? 'active' : ''}`}
          to="/dashboard/tickets"
        >
          <i className="align-bottom bx bx-box" />
          <span className="ms-2">Tickets</span>
        </Link>
      </li>

      <li className="nav-item">
        <Link className="nav-link" onClick={logout}>
          <i className="align-bottom bx bx-log-out" />
          <span className="ms-2">Sign Out</span>
        </Link>
      </li>
    </ul>
  </div>
)}

        {role === "admin" && (
          <div className="accordion-collapse collapse d-md-block" id="collapseAccountMenu">
            <ul className="nav flex-column nav-account">
              <li className="nav-item">
                <a
                  className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                  data-bs-toggle="collapse"
                  href="#homeSubmenu"
                  role="button"
                  aria-expanded="false"
                  aria-controls="homeSubmenu"
                >
                  <i className="align-bottom bx bx-home" />
                  <span className="ms-2">Home</span>
                  <i className="align-bottom bx bx-chevron-down ms-auto"></i>
                </a>
                <div className="collapse" id="homeSubmenu">
                  <ul className="nav flex-column ms-3">
                    <li className="nav-item">
                      <Link className={`nav-link ${location.pathname === '/dashboard/subpage1' ? 'active' : ''}`} to="/dashboard/subpage1">
                        <span className="ms-2">Subpage 1</span>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className={`nav-link ${location.pathname === '/dashboard/subpage2' ? 'active' : ''}`} to="/dashboard/subpage2">
                        <span className="ms-2">Subpage 2</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>

              <li className="nav-item">
                <a
                  className={`nav-link`}
                  data-bs-toggle="collapse"
                  href="#ProjetSubmenu"
                  role="button"
                  aria-expanded="false"
                  aria-controls="ProjetSubmenu"
                >
                  <i className="align-bottom bx bx-home" />
                  <span className="ms-2">Gestion projets</span>
                  <i className="align-bottom bx bx-chevron-down ms-auto"></i>
                </a>
                <div className="collapse" id="ProjetSubmenu">
                  <ul className="nav flex-column ms-3">
                    <li className="nav-item">
                      <Link className={`nav-link ${location.pathname === '/dashboard/projet/create' ? 'active' : ''}`} to="/dashboard/projet/create">
                        <span className="ms-2">Créer un projet</span>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className={`nav-link ${location.pathname === '/dashboard/projet' ? 'active' : ''}`} to="/dashboard/projet">
                        <span className="ms-2">Liste projets</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>

              <li className="nav-item">
                <Link className={`nav-link ${location.pathname.includes('/utilisateurs') ? 'active' : ''}`} to="/dashboard/utilisateurs">
                  <i className="align-bottom bx bx-link" />
                  <span className="ms-2">Gestion utilisateurs</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname.includes('/packages') ? 'active' : ''}`} to="/dashboard/packages">
                  <i className="align-bottom bx bx-link" />
                  <span className="ms-2">Gestion packages</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname.includes('/taches') ? 'active' : ''}`} to="/dashboard/taches">
                  <i className="align-bottom bx bx-link" />
                  <span className="ms-2">Gestion Taches</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname.includes('/demandes-client') ? 'active' : ''}`} to="/dashboard/demandes-client">
                  <i className="align-bottom bx bx-link" />
                  <span className="ms-2">Gestion demandes clients</span>
                </Link>
              </li>

              <li className="nav-item">
                <Link className={`nav-link ${location.pathname.includes('/chat') ? 'active' : ''}`} to="/dashboard/chat">
                  <i className="align-bottom bx bx-link" />
                  <span className="ms-2">Messages</span>
                </Link>
              </li>

              <li className="nav-item">
                <Link className={`nav-link ${location.pathname.includes('/ticket') ? 'active' : ''}`} to="/dashboard/tickets">
                  <i className="align-bottom bx bx-box" />
                  <span className="ms-2">Tickets</span>
                </Link>
              </li>


              <li className="nav-item">
                <Link className="nav-link" onClick={logout}>
                  <i className="align-bottom bx bx-log-out" />
                  <span className="ms-2">Sign Out</span>
                </Link>
              </li>
            </ul>
          </div>
        )}



      </div>
    </>
  )
}

export default Sidebar
