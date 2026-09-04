import {
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import api from "../../shared/api";

import "./SmartServiceFinder.css";


const categories = [
  "Not Sure",
  "Identification",
  "Transport",
  "Education",
  "Health",
  "Business",
  "Social Services",
  "Land & Property",
  "Other",
];


const quickNeeds = [
  {
    icon: "🪪",
    title: "Identity Document",
    text:
      "I need help with my NIC or identity document.",
    category:
      "Identification",
  },

  {
    icon: "🛂",
    title: "Passport",
    text:
      "I need to apply for or renew my passport.",
    category:
      "Identification",
  },

  {
    icon: "🚗",
    title: "Driving Licence",
    text:
      "I need help with my driving licence.",
    category:
      "Transport",
  },

  {
    icon: "🎓",
    title: "Education",
    text:
      "I need information about education or student assistance.",
    category:
      "Education",
  },

  {
    icon: "💼",
    title: "Start a Business",
    text:
      "I want to register or start a business.",
    category:
      "Business",
  },

  {
    icon: "🏠",
    title: "Land & Property",
    text:
      "I need help with land or property services.",
    category:
      "Land & Property",
  },
];


function SmartServiceFinder() {

  const [
    needDescription,
    setNeedDescription,
  ] = useState("");


  const [
    category,
    setCategory,
  ] = useState(
    "Not Sure"
  );


  const [
    recommendations,
    setRecommendations,
  ] = useState([]);


  const [
    detectedCategory,
    setDetectedCategory,
  ] = useState(null);


  const [
    loading,
    setLoading,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


  const [
    message,
    setMessage,
  ] = useState("");


  const [
    searched,
    setSearched,
  ] = useState(false);


  // ====================================
  // QUICK NEED
  // ====================================

  const handleQuickNeed =
    (item) => {

      setNeedDescription(
        item.text
      );


      setCategory(
        item.category
      );


      setRecommendations(
        []
      );


      setDetectedCategory(
        null
      );


      setSearched(false);

      setError("");

      setMessage("");
    };


  // ====================================
  // FIND SERVICE
  // ====================================

  const handleFindService =
    async (event) => {

      event.preventDefault();


      setError("");

      setMessage("");

      setRecommendations(
        []
      );

      setDetectedCategory(
        null
      );


      if (
        needDescription
          .trim()
          .length < 3
      ) {

        setError(
          "Please describe the government service or assistance you need."
        );

        return;
      }


      try {

        setLoading(true);

        setSearched(true);


        const response =
          await api.post(
            "/finder/recommend",
            {
              needDescription:
                needDescription.trim(),

              category,
            }
          );


        setRecommendations(
          response.data.data
        );


        setDetectedCategory(
          response.data
            .detectedCategory
        );


        setMessage(
          response.data.message
        );

      } catch (err) {

        console.error(err);


        setError(
          err.response
            ?.data
            ?.message ||
          "Unable to find services. Please check that the backend is running."
        );

      } finally {

        setLoading(false);

      }
    };


  // ====================================
  // RESET
  // ====================================

  const handleReset = () => {

    setNeedDescription("");

    setCategory(
      "Not Sure"
    );

    setRecommendations(
      []
    );

    setDetectedCategory(
      null
    );

    setError("");

    setMessage("");

    setSearched(false);

  };


  return (
    <main className="page-container">

      <div className="finder-header">

        <span className="page-label">
          SMART ASSISTANCE
        </span>

        <h1>
          Smart Service Finder
        </h1>

        <p>
          Not sure which government
          service you need? Describe
          your situation and GovGuide
          LK will suggest the most
          relevant services from the
          directory.
        </p>

      </div>


      <section className="finder-intro-card">

        <div className="finder-intro-icon">
          ✨
        </div>


        <div>

          <h2>
            How does it work?
          </h2>

          <p>
            Tell us what you need.
            The Smart Service Finder
            compares your request with
            available public services
            and ranks the closest
            matches.
          </p>

        </div>

      </section>


      <section className="quick-needs-section">

        <div className="finder-section-heading">

          <h2>
            Common needs
          </h2>

          <p>
            Select one or describe
            your own situation below.
          </p>

        </div>


        <div className="quick-needs-grid">

          {quickNeeds.map(
            (item) => (

              <button
                type="button"
                className="quick-need-card"
                key={item.title}
                onClick={() =>
                  handleQuickNeed(
                    item
                  )
                }
              >

                <span className="quick-need-icon">
                  {item.icon}
                </span>

                <strong>
                  {item.title}
                </strong>

              </button>

            )
          )}

        </div>

      </section>


      <section className="finder-form-card">

        <div className="form-heading">

          <h2>
            What do you need help with?
          </h2>

          <p>
            You can use simple
            everyday language.
          </p>

        </div>


        {error && (

          <div className="alert error-alert">
            {error}
          </div>

        )}


        <form
          onSubmit={
            handleFindService
          }
        >

          <div className="form-group">

            <label>
              Describe your need *
            </label>

            <textarea
              rows="5"
              value={
                needDescription
              }
              onChange={(event) =>
                setNeedDescription(
                  event.target.value
                )
              }
              placeholder="Example: I lost my NIC and need to know how to get a replacement."
            />

            <small>
              Include important words
              such as NIC, passport,
              licence, university or
              business registration.
            </small>

          </div>


          <div className="finder-category">

            <div className="form-group">

              <label>
                Service Category
              </label>

              <select
                value={category}
                onChange={(event) =>
                  setCategory(
                    event.target.value
                  )
                }
              >

                {categories.map(
                  (item) => (

                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>

                  )
                )}

              </select>

            </div>

          </div>


          <div className="finder-form-actions">

            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >

              {loading
                ? "Finding Services..."
                : "✨ Find My Service"}

            </button>


            <button
              type="button"
              className="secondary-button"
              onClick={handleReset}
            >
              Reset
            </button>

          </div>

        </form>

      </section>


      {searched &&
        !loading && (

        <section className="finder-results">

          <div className="finder-results-header">

            <div>

              <span className="page-label">
                RECOMMENDATIONS
              </span>

              <h2>
                Recommended Services
              </h2>

            </div>


            {detectedCategory && (

              <div className="detected-category">

                Smart category:

                <strong>
                  {
                    detectedCategory
                  }
                </strong>

              </div>

            )}

          </div>


          {message && (

            <div className="finder-message">
              {message}
            </div>

          )}


          {recommendations.length ===
          0 ? (

            <div className="empty-state">

              <div>
                🔍
              </div>

              <h3>
                No close service found
              </h3>

              <p>
                Try providing more
                details or selecting a
                service category.
              </p>


              <Link
                to="/services"
                className="primary-button finder-browse-button"
              >
                Browse All Services
              </Link>

            </div>

          ) : (

            <div className="finder-results-grid">

              {recommendations.map(
                (
                  service,
                  index
                ) => (

                  <article
                    className="finder-result-card"
                    key={
                      service._id
                    }
                  >

                    <div className="finder-result-top">

                      <div className="recommendation-rank">

                        #{index + 1}

                      </div>


                      <span
                        className={`match-badge ${
                          service.matchLevel ===
                          "Strong Match"
                            ? "strong-match"
                            : service.matchLevel ===
                              "Good Match"
                            ? "good-match"
                            : "possible-match"
                        }`}
                      >

                        {
                          service.matchLevel
                        }

                      </span>

                    </div>


                    <span className="category-badge">

                      {
                        service.category
                      }

                    </span>


                    <h2>
                      {
                        service.name
                      }
                    </h2>


                    <p className="department">

                      🏛️ {
                        service.department
                      }

                    </p>


                    <p className="finder-service-description">

                      {
                        service.description
                      }

                    </p>


                    {service.matchReasons
                      ?.length > 0 && (

                      <div className="why-match">

                        <h4>
                          Why this may
                          match
                        </h4>


                        <ul>

                          {service.matchReasons.map(
                            (
                              reason,
                              reasonIndex
                            ) => (

                              <li
                                key={
                                  reasonIndex
                                }
                              >
                                ✓ {reason}
                              </li>

                            )
                          )}

                        </ul>

                      </div>

                    )}


                    <div className="finder-info-grid">

                      <div>

                        <span>
                          Fee
                        </span>

                        <strong>

                          {service.fee ===
                          0
                            ? "Free"
                            : `LKR ${Number(
                                service.fee
                              ).toLocaleString()}`}

                        </strong>

                      </div>


                      <div>

                        <span>
                          Processing Time
                        </span>

                        <strong>
                          {
                            service.processingTime
                          }
                        </strong>

                      </div>

                    </div>


                    <div className="finder-documents">

                      <h4>
                        Required Documents
                      </h4>


                      {service
                        .requiredDocuments
                        ?.length > 0 ? (

                        <ul>

                          {service.requiredDocuments.map(
                            (
                              document,
                              documentIndex
                            ) => (

                              <li
                                key={
                                  documentIndex
                                }
                              >
                                {
                                  document
                                }
                              </li>

                            )
                          )}

                        </ul>

                      ) : (

                        <p>
                          No documents
                          specified.
                        </p>

                      )}

                    </div>


                    <div className="finder-eligibility">

                      <strong>
                        Eligibility:
                      </strong>

                      {" "}

                      {
                        service.eligibility
                      }

                    </div>

                  </article>

                )
              )}

            </div>

          )}

        </section>

      )}

    </main>
  );
}


export default SmartServiceFinder;