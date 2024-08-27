import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Import Link from react-router-dom
import { useSnackbar } from 'notistack';



const Header = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  useEffect(() => {

    checkExpiryAndClearStorage();

    // Retrieve the current expiry token value from local storage
    const currentExpiry = localStorage.getItem('expiry');

    // Check if the expiry token exists and is a valid number
    if (currentExpiry) {
      // Convert the expiry token to a number
      const expiryTime = Number(currentExpiry);

      // Add one hour (3600000 milliseconds) to the expiry token value
      const newExpiryTime = expiryTime + 3600000;

      // Save the updated expiry token value back to local storage
      localStorage.setItem('expiry', newExpiryTime.toString());
    }


    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);

    }
  }, [location.pathname]);

  const logout = () => {


    localStorage.clear();
    setIsAuthenticated(false);
    navigate('/');

  }

  const checkExpiryAndClearStorage = () => {
    const expiryTime = localStorage.getItem('expiry');
    const now = new Date().getTime();
    if (!expiryTime) {

      return false; // No expiry time set, proceed as normal
    }



    if (now > parseInt(expiryTime, 10)) {
      localStorage.clear();
      enqueueSnackbar('Votre session a expirée!', { variant: 'error' });
      navigate('/');
      setIsAuthenticated(false);
      return true; // Storage was cleared
    }

    return false; // Storage was not cleared
  };



  return (
    <>

      <header>

        <nav className="navbar navbar-expand-lg  navbar-light w-100">
          <div className="container px-3">
            <a className="navbar-brand" href="../index-2.html">
              <img src="../assets/images/logo/logo.svg" alt="" />
            </a>
            <button className="navbar-toggler offcanvas-nav-btn" type="button">
              <i className="bi bi-list" />
            </button>
            <div
              className="offcanvas offcanvas-start offcanvas-nav"
              style={{ width: "20rem" }}
            >
              <div className="offcanvas-header">
                <a href="../index-2.html" className="text-inverse">
                  <img src="../assets/images/logo/logo.svg" alt="" />
                </a>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                />
              </div>
              <div className="offcanvas-body pt-0 align-items-center">
                {/* check logged in user is a client or not (hide header buttons if not) */}
                {(role === "client" || !isAuthenticated) && (<>  <ul className="navbar-nav mx-auto align-items-lg-center">

                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/"

                      role="button"

                    >
                      Accueil
                    </Link>
                  </li>
                  {isAuthenticated && (<li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/dashboard"

                      role="button"

                    >
                      Dashboard
                    </Link>
                  </li>)}

                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/contact"

                      role="button"

                    >
                      Contact
                    </Link>
                  </li>
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      id="navbarDropdown"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      Docs
                    </a>
                    <div
                      className="dropdown-menu dropdown-menu-md"
                      aria-labelledby="navbarDropdown"
                    >
                      <a
                        className="dropdown-item mb-3 text-body"
                        href="../docs/index.html"
                      >
                        <div className="d-flex align-items-center">
                          <i className="bi bi-file-text fs-4 text-primary" />
                          <div className="ms-3 lh-1">
                            <h5 className="mb-1">Documentations</h5>
                            <p className="mb-0 fs-6">Browse the all documentation</p>
                          </div>
                        </div>
                      </a>
                      <a
                        className="dropdown-item text-body"
                        href="../docs/changelog.html"
                      >
                        <div className="d-flex align-items-center">
                          <i className="bi bi-clipboard fs-4 text-primary" />
                          <div className="ms-3 lh-1">
                            <h5 className="mb-1">
                              Changelog
                              <span className="text-primary ms-1" id="changelog" />
                            </h5>
                            <p className="mb-0 fs-6">See what's new</p>
                          </div>
                        </div>
                      </a>
                    </div>
                  </li>
                </ul>{!isAuthenticated ? (<div className="mt-3 mt-lg-0 d-flex align-items-center">
                  <Link to="login" className="btn btn-light mx-2">
                    Se connecter
                  </Link>

                  <Link to="login" className="btn btn-primary mx-2">
                    Créer un compte
                  </Link>


                </div>) : (<button onClick={logout} className="btn btn-light mx-2"><span className='bi bi-arrow-bar-left'>Se déconnecter</span ></button>)}
                </>)}


              </div>
            </div>
          </div>
        </nav>
      </header>


    </>
  )
}

export default Header
