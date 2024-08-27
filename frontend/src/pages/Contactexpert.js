import React from 'react'

const Contactexpert = () => {
  return (
    <>
      <>
  {/*contact us*/}
  <section className="mb-xl-9 my-5">
    <div className="container">
      <div className="row">
        <div className="col-lg-10 offset-lg-1 col-md-12 col-12">
          <div className="row g-xl-7 gy-5">
            <div className="col-md-7 col-12">
              <div className="card shadow-sm">
                <div className="card-body">
                  <form className="row g-3 needs-validation" noValidate="">
                    <div className="col-lg-6 col-md-12">
                      <label
                        htmlFor="contactFirstNameInput"
                        className="form-label"
                      >
                        First Name
                        <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="contactFirstNameInput"
                        required=""
                      />
                      <div className="invalid-feedback">
                        Please enter firstname.
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-12">
                      <label
                        htmlFor="contactLastNameInput"
                        className="form-label"
                      >
                        Last Name
                        <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="contactLastNameInput"
                        required=""
                      />
                      <div className="invalid-feedback">
                        Please enter lastname.
                      </div>
                    </div>
                    <div className="col-md-12">
                      <label htmlFor="contactEmailInput" className="form-label">
                        Email
                        <span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="contactEmailInput"
                        required=""
                      />
                      <div className="invalid-feedback">
                        Please enter email.
                      </div>
                    </div>
                    <div className="col-md-12">
                      <label
                        htmlFor="contactCompanyNameInput"
                        className="form-label"
                      >
                        Company Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="contactCompanyNameInput"
                        required=""
                      />
                      <div className="invalid-feedback">
                        Please enter company name.
                      </div>
                    </div>
                    <div className="col-md-12">
                      <label htmlFor="contactPhoneInput" className="form-label">
                        Phone
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        id="contactPhoneInput"
                        required=""
                      />
                      <div className="invalid-feedback">
                        Please enter phone.
                      </div>
                    </div>
                    <div className="col-md-12">
                      <label htmlFor="contactTextarea" className="form-label">
                        Message
                      </label>
                      <textarea
                        className="form-control"
                        id="contactTextarea"
                        placeholder="Write to us"
                        rows={4}
                        required=""
                        defaultValue={""}
                      />
                      <div className="invalid-feedback">
                        Please enter a message.
                      </div>
                    </div>
                    <div className="d-grid">
                      <button className="btn btn-primary" type="submit">
                        Send
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-md-5 col-12">
              <div className="mb-7">
                <div className="icon-shape bg-primary bg-opacity-10 rounded icon-md mb-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={16}
                    height={16}
                    fill="currentColor"
                    className="bi bi-headset text-primary"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 1a5 5 0 0 0-5 5v1h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a6 6 0 1 1 12 0v6a2.5 2.5 0 0 1-2.5 2.5H9.366a1 1 0 0 1-.866.5h-1a1 1 0 1 1 0-2h1a1 1 0 0 1 .866.5H11.5A1.5 1.5 0 0 0 13 12h-1a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h1V6a5 5 0 0 0-5-5z" />
                  </svg>
                </div>
                <div>
                  <h4>Technical support</h4>
                  <p className="mb-0">
                    Found a persistent bug, or need help setting a new team
                    member up? Can’t crack a feature?
                    <a href="#" className="text-primary">
                      Let us know!
                    </a>
                  </p>
                </div>
              </div>
              <div className="mb-7">
                <div className="icon-shape bg-primary bg-opacity-10 rounded icon-md mb-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={16}
                    height={16}
                    fill="currentColor"
                    className="bi bi-chat-dots text-primary"
                    viewBox="0 0 16 16"
                  >
                    <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                    <path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9.06 9.06 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.437 10.437 0 0 1-.524 2.318l-.003.011a10.722 10.722 0 0 1-.244.637c-.079.186.074.394.273.362a21.673 21.673 0 0 0 .693-.125zm.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6c0 3.193-3.004 6-7 6a8.06 8.06 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a10.97 10.97 0 0 0 .398-2z" />
                  </svg>
                </div>
                <div>
                  <h4>General chat</h4>
                  <p className="mb-0">
                    Billing issues, customizations, plan changes--anything that
                    doesn’t fit in the other two brackets, goes here.
                    <a href="#" className="text-primary">
                      Start Chat
                    </a>
                  </p>
                </div>
              </div>
              <div className="mb-7">
                <div className="icon-shape bg-primary bg-opacity-10 rounded icon-md mb-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={16}
                    height={16}
                    fill="currentColor"
                    className="bi bi-newspaper text-primary"
                    viewBox="0 0 16 16"
                  >
                    <path d="M0 2.5A1.5 1.5 0 0 1 1.5 1h11A1.5 1.5 0 0 1 14 2.5v10.528c0 .3-.05.654-.238.972h.738a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 1 1 0v9a1.5 1.5 0 0 1-1.5 1.5H1.497A1.497 1.497 0 0 1 0 13.5v-11zM12 14c.37 0 .654-.211.853-.441.092-.106.147-.279.147-.531V2.5a.5.5 0 0 0-.5-.5h-11a.5.5 0 0 0-.5.5v11c0 .278.223.5.497.5H12z" />
                    <path d="M2 3h10v2H2V3zm0 3h4v3H2V6zm0 4h4v1H2v-1zm0 2h4v1H2v-1zm5-6h2v1H7V6zm3 0h2v1h-2V6zM7 8h2v1H7V8zm3 0h2v1h-2V8zm-3 2h2v1H7v-1zm3 0h2v1h-2v-1zm-3 2h2v1H7v-1zm3 0h2v1h-2v-1z" />
                  </svg>
                </div>
                <div>
                  <h4>Help Center</h4>
                  <p className="mb-0">
                    Want to share feedback on an existing feature or suggest a
                    new one? Talk to us!
                    <a href="#" className="text-primary">
                      Visit Help Center
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  {/*contact us*/}
</>

    </>
  )
}

export default Contactexpert
