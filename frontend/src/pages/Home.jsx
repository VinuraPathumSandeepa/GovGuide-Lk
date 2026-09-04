import { Link } from "react-router-dom";


function Home() {
  return (
    <main>

      <section className="hero">

        <div className="hero-content">

          <div className="hero-text">

            <span className="hero-badge">
              🇱🇰 Built for Sri Lanka
            </span>

            <h1>
              Government services made
              <span> simple.</span>
            </h1>

            <p>
              GovGuide LK helps Sri Lankan citizens
              discover public services, understand
              required documents, locate relevant
              offices and get assistance without
              unnecessary confusion.
            </p>


            <div className="hero-actions">

              <Link
                to="/services"
                className="primary-button"
              >
                Browse Services
              </Link>

              <Link
                to="/finder"
                className="secondary-button"
              >
                Find My Service
              </Link>

            </div>

          </div>


          <div className="hero-card">

            <div className="hero-card-icon">
              🏛️
            </div>

            <h3>
              Public Service Information
            </h3>

            <p>
              Find requirements, fees,
              processing times and responsible
              departments in one place.
            </p>

          </div>

        </div>

      </section>


      <section className="problem-section">

        <div className="section-heading">

          <span>
            THE PROBLEM
          </span>

          <h2>
            Why does Sri Lanka need GovGuide LK?
          </h2>

          <p>
            Information about public services can
            be spread across different websites,
            offices and documents. Citizens may
            not know where to go, which documents
            are required or how long a process
            may take.
          </p>

        </div>

      </section>


      <section className="features-section">

        <div className="section-heading">

          <span>
            GOVGUIDE FEATURES
          </span>

          <h2>
            Everything you need in one place
          </h2>

        </div>


        <div className="feature-grid">

          <Link
            to="/services"
            className="feature-card"
          >

            <div className="feature-icon">
              📋
            </div>

            <h3>
              Service Directory
            </h3>

            <p>
              Search government services,
              requirements, fees and processing
              times.
            </p>

          </Link>


          <Link
            to="/offices"
            className="feature-card"
          >

            <div className="feature-icon">
              📍
            </div>

            <h3>
              Office Directory
            </h3>

            <p>
              Discover relevant public offices
              and filter locations by district.
            </p>

          </Link>


          <Link
            to="/inquiries"
            className="feature-card"
          >

            <div className="feature-icon">
              💬
            </div>

            <h3>
              Inquiry Assistance
            </h3>

            <p>
              Submit questions and track the
              progress of public service
              inquiries.
            </p>

          </Link>


          <Link
            to="/finder"
            className="feature-card"
          >

            <div className="feature-icon">
              ✨
            </div>

            <h3>
              Smart Service Finder
            </h3>

            <p>
              Answer a few simple questions
              and discover the service most
              relevant to you.
            </p>

          </Link>

        </div>

      </section>

    </main>
  );
}


export default Home;