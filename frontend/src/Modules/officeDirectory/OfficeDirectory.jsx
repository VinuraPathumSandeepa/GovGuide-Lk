import {
  useEffect,
  useState,
} from "react";

import api from "../../shared/api";


const districts = [
  "All",
  "Ampara",
  "Anuradhapura",
  "Badulla",
  "Batticaloa",
  "Colombo",
  "Galle",
  "Gampaha",
  "Hambantota",
  "Jaffna",
  "Kalutara",
  "Kandy",
  "Kegalle",
  "Kilinochchi",
  "Kurunegala",
  "Mannar",
  "Matale",
  "Matara",
  "Monaragala",
  "Mullaitivu",
  "Nuwara Eliya",
  "Polonnaruwa",
  "Puttalam",
  "Ratnapura",
  "Trincomalee",
  "Vavuniya",
];


const officeTypes = [
  "Government Department",
  "Divisional Secretariat",
  "District Secretariat",
  "Municipal Council",
  "Provincial Office",
  "Service Center",
  "Other",
];


const emptyForm = {
  name: "",
  officeType: "",
  district: "",
  address: "",
  phone: "",
  email: "",
  openingHours: "",
  services: "",
  description: "",
};


function OfficeDirectory() {
  const [offices, setOffices] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [district, setDistrict] =
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
  // LOAD OFFICES
  // ====================================

  const loadOffices = async () => {
    try {
      setLoading(true);

      setError("");

      const response =
        await api.get(
          "/offices",
          {
            params: {
              search,
              district,
            },
          }
        );

      setOffices(
        response.data.data
      );
    } catch (err) {
      console.error(err);

      setError(
        "Unable to load offices. Please check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const timeout =
      setTimeout(() => {
        loadOffices();
      }, 300);

    return () =>
      clearTimeout(timeout);
  }, [search, district]);


  // ====================================
  // HANDLE INPUT
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
      return "Office name must contain at least 3 characters.";
    }

    if (!form.officeType) {
      return "Please select an office type.";
    }

    if (!form.district) {
      return "Please select a district.";
    }

    if (
      form.address.trim().length < 5
    ) {
      return "Please enter a valid office address.";
    }

    if (
      form.phone.trim().length < 9
    ) {
      return "Please enter a valid phone number.";
    }

    if (
      form.email &&
      !form.email.includes("@")
    ) {
      return "Please enter a valid email address.";
    }

    if (
      !form.openingHours.trim()
    ) {
      return "Opening hours are required.";
    }

    return "";
  };


  // ====================================
  // SAVE OFFICE
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

      const officeData = {
        name:
          form.name.trim(),

        officeType:
          form.officeType,

        district:
          form.district,

        address:
          form.address.trim(),

        phone:
          form.phone.trim(),

        email:
          form.email.trim(),

        openingHours:
          form.openingHours.trim(),

        availableServices:
          form.services
            .split(",")
            .map((service) =>
              service.trim()
            )
            .filter(Boolean),

        description:
          form.description.trim(),
      };


      try {
        if (editingId) {
          await api.put(
            `/offices/${editingId}`,
            officeData
          );

          setSuccess(
            "Office updated successfully."
          );
        } else {
          await api.post(
            "/offices",
            officeData
          );

          setSuccess(
            "Office added successfully."
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

        await loadOffices();
      } catch (err) {
        console.error(err);

        setError(
          err.response?.data?.message ||
          "Unable to save the office."
        );
      }
    };


  // ====================================
  // EDIT OFFICE
  // ====================================

  const handleEdit =
    (office) => {
      setEditingId(
        office._id
      );

      setForm({
        name:
          office.name || "",

        officeType:
          office.officeType || "",

        district:
          office.district || "",

        address:
          office.address || "",

        phone:
          office.phone || "",

        email:
          office.email || "",

        openingHours:
          office.openingHours || "",

        services:
          office.availableServices
            ?.join(", ") || "",

        description:
          office.description || "",
      });

      setShowForm(true);

      setError("");

      setSuccess("");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };


  // ====================================
  // DELETE OFFICE
  // ====================================

  const handleDelete =
    async (office) => {
      const confirmed =
        window.confirm(
          `Are you sure you want to delete "${office.name}"?`
        );

      if (!confirmed) {
        return;
      }

      try {
        await api.delete(
          `/offices/${office._id}`
        );

        setSuccess(
          "Office deleted successfully."
        );

        await loadOffices();
      } catch (err) {
        console.error(err);

        setError(
          "Unable to delete the office."
        );
      }
    };


  // ====================================
  // CANCEL FORM
  // ====================================

  const cancelForm = () => {
    setShowForm(false);

    setEditingId(null);

    setForm(emptyForm);

    setError("");
  };


  return (
    <main className="page-container">

      <div className="page-header">

        <div>

          <span className="page-label">
            PUBLIC OFFICES
          </span>

          <h1>
            Government Office Directory
          </h1>

          <p>
            Find government offices across
            Sri Lanka, including addresses,
            contact information, opening
            hours and available public
            services.
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
            : "+ Add Office"}
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
                ? "Update Government Office"
                : "Add Government Office"}
            </h2>

            <p>
              Add clear office information
              to help citizens identify where
              they need to go.
            </p>

          </div>


          <form
            onSubmit={handleSubmit}
            className="service-form"
          >

            <div className="form-grid">


              <div className="form-group">

                <label>
                  Office Name *
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Colombo District Secretariat"
                />

              </div>


              <div className="form-group">

                <label>
                  Office Type *
                </label>

                <select
                  name="officeType"
                  value={form.officeType}
                  onChange={handleChange}
                >

                  <option value="">
                    Select office type
                  </option>

                  {officeTypes.map(
                    (type) => (
                      <option
                        key={type}
                        value={type}
                      >
                        {type}
                      </option>
                    )
                  )}

                </select>

              </div>


              <div className="form-group">

                <label>
                  District *
                </label>

                <select
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                >

                  <option value="">
                    Select district
                  </option>

                  {districts
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


              <div className="form-group">

                <label>
                  Phone Number *
                </label>

                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="0112345678"
                />

              </div>


              <div className="form-group full-width">

                <label>
                  Address *
                </label>

                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Enter office address"
                />

              </div>


              <div className="form-group">

                <label>
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="office@example.gov.lk"
                />

              </div>


              <div className="form-group">

                <label>
                  Opening Hours *
                </label>

                <input
                  type="text"
                  name="openingHours"
                  value={
                    form.openingHours
                  }
                  onChange={handleChange}
                  placeholder="Monday - Friday, 8:30 AM - 4:15 PM"
                />

              </div>


              <div className="form-group full-width">

                <label>
                  Available Services
                </label>

                <input
                  type="text"
                  name="services"
                  value={form.services}
                  onChange={handleChange}
                  placeholder="Passport Application, Visa Information"
                />

                <small>
                  Separate services using commas.
                </small>

              </div>


              <div className="form-group full-width">

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  value={
                    form.description
                  }
                  onChange={handleChange}
                  rows="3"
                  placeholder="Briefly describe the office..."
                />

              </div>

            </div>


            <div className="form-actions">

              <button
                type="submit"
                className="primary-button"
              >
                {editingId
                  ? "Update Office"
                  : "Save Office"}
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
            placeholder="Search offices, locations or services..."
          />

        </div>


        <select
          className="filter-select"
          value={district}
          onChange={(event) =>
            setDistrict(
              event.target.value
            )
          }
        >

          {districts.map(
            (item) => (
              <option
                key={item}
                value={item}
              >
                {item === "All"
                  ? "All Districts"
                  : item}
              </option>
            )
          )}

        </select>

      </section>


      <div className="results-summary">

        <strong>
          {offices.length}
        </strong>

        {" "}

        office
        {offices.length !== 1
          ? "s"
          : ""}

        {" "}

        found

      </div>


      {loading ? (

        <div className="loading">
          Loading offices...
        </div>

      ) : offices.length === 0 ? (

        <div className="empty-state">

          <div>
            🏢
          </div>

          <h3>
            No offices found
          </h3>

          <p>
            Try another search term or
            select another district.
          </p>

        </div>

      ) : (

        <div className="service-grid">

          {offices.map(
            (office) => (

              <article
                className="service-card"
                key={office._id}
              >

                <div className="service-card-top">

                  <span className="category-badge">
                    {office.district}
                  </span>


                  <div className="card-actions">

                    <button
                      onClick={() =>
                        handleEdit(
                          office
                        )
                      }
                    >
                      Edit
                    </button>


                    <button
                      className="delete-button"
                      onClick={() =>
                        handleDelete(
                          office
                        )
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>


                <h2>
                  {office.name}
                </h2>


                <p className="department">
                  🏛️ {office.officeType}
                </p>


                {office.description && (
                  <p className="service-description">
                    {office.description}
                  </p>
                )}


                <div className="documents-section">

                  <h4>
                    📍 Address
                  </h4>

                  <p>
                    {office.address}
                  </p>

                </div>


                <div className="service-info-row">

                  <div>

                    <span>
                      Phone
                    </span>

                    <strong>
                      {office.phone}
                    </strong>

                  </div>


                  <div>

                    <span>
                      District
                    </span>

                    <strong>
                      {office.district}
                    </strong>

                  </div>

                </div>


                <div className="documents-section">

                  <h4>
                    🕒 Opening Hours
                  </h4>

                  <p>
                    {office.openingHours}
                  </p>

                </div>


                {office.email && (

                  <div className="documents-section">

                    <h4>
                      ✉️ Email
                    </h4>

                    <p>
                      {office.email}
                    </p>

                  </div>

                )}


                <div className="documents-section">

                  <h4>
                    Available Services
                  </h4>


                  {office.availableServices
                    ?.length > 0 ? (

                    <ul>

                      {office.availableServices.map(
                        (
                          service,
                          index
                        ) => (

                          <li
                            key={`${service}-${index}`}
                          >
                            {service}
                          </li>

                        )
                      )}

                    </ul>

                  ) : (

                    <p>
                      No services specified.
                    </p>

                  )}

                </div>

              </article>

            )
          )}

        </div>

      )}

    </main>
  );
}


export default OfficeDirectory;