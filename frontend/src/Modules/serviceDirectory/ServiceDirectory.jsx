import {
  useEffect,
  useState,
} from "react";

import api from "../../shared/api";


const categories = [
  "All",
  "Identification",
  "Transport",
  "Education",
  "Health",
  "Business",
  "Social Services",
  "Land & Property",
  "Other",
];


const emptyForm = {
  name: "",
  category: "",
  department: "",
  description: "",
  documents: "",
  fee: "",
  processingTime: "",
  eligibility: "",
};


function ServiceDirectory() {

  const [services, setServices] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("All");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [form, setForm] =
    useState(emptyForm);


  // ====================================
  // LOAD SERVICES
  // ====================================

  const loadServices = async () => {

    try {

      setLoading(true);

      setError("");


      const response =
        await api.get(
          "/services",
          {
            params: {
              search,
              category,
            },
          }
        );


      setServices(
        response.data.data
      );

    } catch (err) {

      console.error(err);

      setError(
        "Unable to load services. Please check that the backend is running."
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    const timeout =
      setTimeout(() => {

        loadServices();

      }, 300);


    return () =>
      clearTimeout(timeout);

  }, [search, category]);


  // ====================================
  // FORM INPUT
  // ====================================

  const handleChange = (event) => {

    const {
      name,
      value,
    } = event.target;


    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  // ====================================
  // VALIDATION
  // ====================================

  const validateForm = () => {

    if (
      form.name.trim().length < 3
    ) {

      return "Service name must contain at least 3 characters.";

    }


    if (!form.category) {

      return "Please select a service category.";

    }


    if (!form.department.trim()) {

      return "Department name is required.";

    }


    if (
      form.description.trim().length < 10
    ) {

      return "Please provide a clear service description.";

    }


    if (
      form.fee === "" ||
      Number(form.fee) < 0
    ) {

      return "Please enter a valid service fee.";

    }


    if (
      !form.processingTime.trim()
    ) {

      return "Processing time is required.";

    }


    return "";
  };


  // ====================================
  // SAVE SERVICE
  // ====================================

  const handleSubmit =
    async (event) => {

      event.preventDefault();


      setError("");

      setSuccess("");


      const validationError =
        validateForm();


      if (validationError) {

        setError(
          validationError
        );

        return;

      }


      const serviceData = {

        name:
          form.name.trim(),

        category:
          form.category,

        department:
          form.department.trim(),

        description:
          form.description.trim(),

        requiredDocuments:
          form.documents
            .split(",")
            .map((document) =>
              document.trim()
            )
            .filter(Boolean),

        fee:
          Number(form.fee),

        processingTime:
          form.processingTime.trim(),

        eligibility:
          form.eligibility.trim() ||
          "General public",
      };


      try {

        if (editingId) {

          await api.put(
            `/services/${editingId}`,
            serviceData
          );

          setSuccess(
            "Service updated successfully."
          );

        } else {

          await api.post(
            "/services",
            serviceData
          );

          setSuccess(
            "Service added successfully."
          );

        }


        setForm(
          emptyForm
        );

        setEditingId(
          null
        );

        setShowForm(
          false
        );


        await loadServices();

      } catch (err) {

        console.error(err);


        setError(
          err.response?.data?.message ||
          "Unable to save the service."
        );

      }
    };


  // ====================================
  // EDIT
  // ====================================

  const handleEdit = (service) => {

    setEditingId(
      service._id
    );


    setForm({

      name:
        service.name || "",

      category:
        service.category || "",

      department:
        service.department || "",

      description:
        service.description || "",

      documents:
        service.requiredDocuments
          ?.join(", ") || "",

      fee:
        service.fee ?? "",

      processingTime:
        service.processingTime || "",

      eligibility:
        service.eligibility || "",

    });


    setShowForm(
      true
    );


    setError("");

    setSuccess("");


    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  // ====================================
  // DELETE
  // ====================================

  const handleDelete =
    async (service) => {

      const confirmed =
        window.confirm(
          `Are you sure you want to delete "${service.name}"?`
        );


      if (!confirmed) {

        return;

      }


      try {

        await api.delete(
          `/services/${service._id}`
        );


        setSuccess(
          "Service deleted successfully."
        );


        await loadServices();

      } catch (err) {

        console.error(err);


        setError(
          "Unable to delete the service."
        );

      }
    };


  // ====================================
  // CANCEL FORM
  // ====================================

  const cancelForm = () => {

    setShowForm(
      false
    );

    setEditingId(
      null
    );

    setForm(
      emptyForm
    );

    setError("");

  };


  return (
    <main className="page-container">

      <div className="page-header">

        <div>

          <span className="page-label">
            PUBLIC SERVICES
          </span>

          <h1>
            Government Service Directory
          </h1>

          <p>
            Find important information about
            Sri Lankan public services,
            required documents, fees and
            processing times.
          </p>

        </div>


        <button
          className="primary-button"
          onClick={() => {

            if (showForm) {

              cancelForm();

            } else {

              setShowForm(true);

            }

          }}
        >

          {showForm
            ? "Close Form"
            : "+ Add Service"}

        </button>

      </div>


      {error && (

        <div className="alert error-alert">
          {error}
        </div>

      )}


      {success && (

        <div className="alert success-alert">
          {success}
        </div>

      )}


      {showForm && (

        <section className="form-card">

          <div className="form-heading">

            <h2>
              {editingId
                ? "Update Government Service"
                : "Add Government Service"}
            </h2>

            <p>
              Enter clear information that
              will help citizens understand
              the service.
            </p>

          </div>


          <form
            onSubmit={handleSubmit}
            className="service-form"
          >

            <div className="form-grid">


              <div className="form-group">

                <label>
                  Service Name *
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Passport Application"
                />

              </div>


              <div className="form-group">

                <label>
                  Category *
                </label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >

                  <option value="">
                    Select category
                  </option>

                  {categories
                    .filter(
                      (item) =>
                        item !== "All"
                    )
                    .map(
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


              <div className="form-group full-width">

                <label>
                  Responsible Department *
                </label>

                <input
                  type="text"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  placeholder="e.g. Department of Immigration and Emigration"
                />

              </div>


              <div className="form-group full-width">

                <label>
                  Description *
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Explain what this service is used for..."
                />

              </div>


              <div className="form-group full-width">

                <label>
                  Required Documents
                </label>

                <input
                  type="text"
                  name="documents"
                  value={form.documents}
                  onChange={handleChange}
                  placeholder="NIC, Birth Certificate, Application Form"
                />

                <small>
                  Separate documents using commas.
                </small>

              </div>


              <div className="form-group">

                <label>
                  Fee (LKR) *
                </label>

                <input
                  type="number"
                  name="fee"
                  value={form.fee}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                />

              </div>


              <div className="form-group">

                <label>
                  Processing Time *
                </label>

                <input
                  type="text"
                  name="processingTime"
                  value={
                    form.processingTime
                  }
                  onChange={handleChange}
                  placeholder="e.g. 7 working days"
                />

              </div>


              <div className="form-group full-width">

                <label>
                  Eligibility
                </label>

                <input
                  type="text"
                  name="eligibility"
                  value={form.eligibility}
                  onChange={handleChange}
                  placeholder="e.g. Sri Lankan citizens"
                />

              </div>

            </div>


            <div className="form-actions">

              <button
                type="submit"
                className="primary-button"
              >

                {editingId
                  ? "Update Service"
                  : "Save Service"}

              </button>


              <button
                type="button"
                className="secondary-button"
                onClick={cancelForm}
              >
                Cancel
              </button>

            </div>

          </form>

        </section>

      )}


      <section className="search-panel">

        <div className="search-box">

          <span>
            🔎
          </span>

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search services or departments..."
          />

        </div>


        <select
          className="filter-select"
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
                value={item}
                key={item}
              >
                {item}
              </option>

            )
          )}

        </select>

      </section>


      <div className="results-summary">

        <strong>
          {services.length}
        </strong>

        {" "}
        service
        {services.length !== 1
          ? "s"
          : ""}
        {" "}
        found

      </div>


      {loading ? (

        <div className="loading">
          Loading services...
        </div>

      ) : services.length === 0 ? (

        <div className="empty-state">

          <div>
            📭
          </div>

          <h3>
            No services found
          </h3>

          <p>
            Try another search term or
            select another category.
          </p>

        </div>

      ) : (

        <div className="service-grid">

          {services.map(
            (service) => (

              <article
                className="service-card"
                key={service._id}
              >

                <div className="service-card-top">

                  <span className="category-badge">
                    {service.category}
                  </span>


                  <div className="card-actions">

                    <button
                      onClick={() =>
                        handleEdit(
                          service
                        )
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() =>
                        handleDelete(
                          service
                        )
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>


                <h2>
                  {service.name}
                </h2>


                <p className="department">
                  🏛️ {service.department}
                </p>


                <p className="service-description">
                  {service.description}
                </p>


                <div className="service-info-row">

                  <div>

                    <span>
                      Fee
                    </span>

                    <strong>

                      {service.fee === 0
                        ? "Free"
                        : `LKR ${Number(
                            service.fee
                          ).toLocaleString()}`}

                    </strong>

                  </div>


                  <div>

                    <span>
                      Processing
                    </span>

                    <strong>
                      {service.processingTime}
                    </strong>

                  </div>

                </div>


                <div className="documents-section">

                  <h4>
                    Required Documents
                  </h4>


                  {service.requiredDocuments
                    ?.length > 0 ? (

                    <ul>

                      {service.requiredDocuments.map(
                        (
                          document,
                          index
                        ) => (

                          <li
                            key={`${document}-${index}`}
                          >
                            {document}
                          </li>

                        )
                      )}

                    </ul>

                  ) : (

                    <p>
                      No documents specified.
                    </p>

                  )}

                </div>


                <div className="eligibility">

                  <strong>
                    Eligibility:
                  </strong>

                  {" "}

                  {service.eligibility}

                </div>

              </article>

            )
          )}

        </div>

      )}

    </main>
  );
}


export default ServiceDirectory;