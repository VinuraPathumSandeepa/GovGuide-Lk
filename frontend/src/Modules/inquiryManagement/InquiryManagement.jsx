import {
    useEffect,
    useState,
} from "react";

import api from "../../shared/api";

import "./InquiryManagement.css";


const districts = [
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


const serviceCategories = [
    "Identification",
    "Transport",
    "Education",
    "Health",
    "Business",
    "Social Services",
    "Land & Property",
    "Other",
];


const statuses = [
    "All",
    "Pending",
    "In Progress",
    "Resolved",
];


const emptyForm = {
    fullName: "",
    email: "",
    phone: "",
    district: "",
    serviceCategory: "",
    subject: "",
    message: "",
};


function InquiryManagement() {
    const [
        inquiries,
        setInquiries,
    ] = useState([]);


    const [
        search,
        setSearch,
    ] = useState("");


    const [
        status,
        setStatus,
    ] = useState("All");


    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        error,
        setError,
    ] = useState("");


    const [
        success,
        setSuccess,
    ] = useState("");


    const [
        referenceNumber,
        setReferenceNumber,
    ] = useState("");


    const [
        showForm,
        setShowForm,
    ] = useState(false);


    const [
        form,
        setForm,
    ] = useState(
        emptyForm
    );


    // ====================================
    // LOAD INQUIRIES
    // ====================================

    const loadInquiries =
        async () => {
            try {
                setLoading(true);

                setError("");


                const response =
                    await api.get(
                        "/inquiries",
                        {
                            params: {
                                search,
                                status,
                            },
                        }
                    );


                setInquiries(
                    response.data.data
                );
            } catch (err) {
                console.error(err);


                setError(
                    "Unable to load inquiries. Please check that the backend is running."
                );
            } finally {
                setLoading(false);
            }
        };


    useEffect(() => {
        const timeout =
            setTimeout(() => {
                loadInquiries();
            }, 300);


        return () =>
            clearTimeout(
                timeout
            );
    }, [
        search,
        status,
    ]);


    // ====================================
    // HANDLE INPUT
    // ====================================

    const handleChange =
        (event) => {
            const {
                name,
                value,
            } = event.target;


            setForm(
                (previous) => ({
                    ...previous,
                    [name]: value,
                })
            );
        };


    // ====================================
    // VALIDATION
    // ====================================

    const validateForm =
        () => {
            if (
                form.fullName
                    .trim()
                    .length < 3
            ) {
                return "Please enter your full name.";
            }


            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (
                !emailPattern.test(
                    form.email
                )
            ) {
                return "Please enter a valid email address.";
            }


            if (
                form.phone
                    .trim()
                    .length < 9
            ) {
                return "Please enter a valid phone number.";
            }


            if (!form.district) {
                return "Please select your district.";
            }


            if (
                !form.serviceCategory
            ) {
                return "Please select a service category.";
            }


            if (
                form.subject
                    .trim()
                    .length < 4
            ) {
                return "Inquiry subject must contain at least 4 characters.";
            }


            if (
                form.message
                    .trim()
                    .length < 10
            ) {
                return "Please provide more information about your inquiry.";
            }


            return "";
        };


    // ====================================
    // SUBMIT INQUIRY
    // ====================================

    const handleSubmit =
        async (event) => {
            event.preventDefault();


            setError("");

            setSuccess("");

            setReferenceNumber(
                ""
            );


            const validationError =
                validateForm();


            if (
                validationError
            ) {
                setError(
                    validationError
                );

                return;
            }


            try {
                const response =
                    await api.post(
                        "/inquiries",
                        {
                            fullName:
                                form.fullName.trim(),

                            email:
                                form.email.trim(),

                            phone:
                                form.phone.trim(),

                            district:
                            form.district,

                            serviceCategory:
                            form.serviceCategory,

                            subject:
                                form.subject.trim(),

                            message:
                                form.message.trim(),
                        }
                    );


                setSuccess(
                    "Your inquiry was submitted successfully."
                );


                setReferenceNumber(
                    response.data
                        .referenceNumber
                );


                setForm(
                    emptyForm
                );


                setShowForm(
                    false
                );


                await loadInquiries();
            } catch (err) {
                console.error(err);


                setError(
                    err.response
                        ?.data
                        ?.message ||
                    "Unable to submit your inquiry."
                );
            }
        };


    // ====================================
    // UPDATE STATUS
    // ====================================

    const handleStatusChange =
        async (
            inquiryId,
            newStatus
        ) => {
            try {
                await api.patch(
                    `/inquiries/${inquiryId}/status`,
                    {
                        status:
                        newStatus,
                    }
                );


                setSuccess(
                    "Inquiry status updated successfully."
                );


                setError("");


                await loadInquiries();
            } catch (err) {
                console.error(err);


                setError(
                    err.response
                        ?.data
                        ?.message ||
                    "Unable to update inquiry status."
                );
            }
        };


    // ====================================
    // DELETE INQUIRY
    // ====================================

    const handleDelete =
        async (inquiry) => {
            const confirmed =
                window.confirm(
                    `Are you sure you want to delete inquiry ${inquiry.referenceNumber}?`
                );


            if (!confirmed) {
                return;
            }


            try {
                await api.delete(
                    `/inquiries/${inquiry._id}`
                );


                setSuccess(
                    "Inquiry deleted successfully."
                );


                setError("");


                await loadInquiries();
            } catch (err) {
                console.error(err);


                setError(
                    "Unable to delete the inquiry."
                );
            }
        };


    // ====================================
    // DATE FORMAT
    // ====================================

    const formatDate =
        (date) => {
            return new Date(
                date
            ).toLocaleDateString(
                "en-LK",
                {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                }
            );
        };


    return (
        <main className="page-container">

            <div className="page-header">

                <div>

          <span className="page-label">
            CITIZEN SUPPORT
          </span>

                    <h1>
                        Inquiry Management
                    </h1>

                    <p>
                        Ask questions about Sri Lankan
                        public services and track
                        inquiries using a unique
                        reference number.
                    </p>

                </div>


                <button
                    className="primary-button"
                    onClick={() =>
                        setShowForm(
                            !showForm
                        )
                    }
                >
                    {showForm
                        ? "Close Form"
                        : "+ Submit Inquiry"}
                </button>

            </div>


            {error && (
                <div className="alert error-alert">
                    {error}
                </div>
            )}


            {success && (
                <div className="alert success-alert">

                    <strong>
                        {success}
                    </strong>


                    {referenceNumber && (
                        <div className="reference-success">

                            Your reference number:

                            <strong>
                                {
                                    referenceNumber
                                }
                            </strong>

                            <span>
                Keep this number
                to track your
                inquiry.
              </span>

                        </div>
                    )}

                </div>
            )}


            {showForm && (

                <section className="form-card">

                    <div className="form-heading">

                        <h2>
                            Submit a Public Service Inquiry
                        </h2>

                        <p>
                            Tell us what information
                            you need. All required
                            fields are marked with *.
                        </p>

                    </div>


                    <form
                        onSubmit={
                            handleSubmit
                        }
                    >

                        <div className="form-grid">

                            <div className="form-group">

                                <label>
                                    Full Name *
                                </label>

                                <input
                                    type="text"
                                    name="fullName"
                                    value={
                                        form.fullName
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter your full name"
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Email Address *
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={
                                        form.email
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="example@email.com"
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Phone Number *
                                </label>

                                <input
                                    type="text"
                                    name="phone"
                                    value={
                                        form.phone
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="0712345678"
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    District *
                                </label>

                                <select
                                    name="district"
                                    value={
                                        form.district
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >

                                    <option value="">
                                        Select district
                                    </option>

                                    {districts.map(
                                        (district) => (
                                            <option
                                                key={
                                                    district
                                                }
                                                value={
                                                    district
                                                }
                                            >
                                                {
                                                    district
                                                }
                                            </option>
                                        )
                                    )}

                                </select>

                            </div>


                            <div className="form-group full-width">

                                <label>
                                    Service Category *
                                </label>

                                <select
                                    name="serviceCategory"
                                    value={
                                        form.serviceCategory
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >

                                    <option value="">
                                        Select service category
                                    </option>

                                    {serviceCategories.map(
                                        (
                                            category
                                        ) => (
                                            <option
                                                key={
                                                    category
                                                }
                                                value={
                                                    category
                                                }
                                            >
                                                {
                                                    category
                                                }
                                            </option>
                                        )
                                    )}

                                </select>

                            </div>


                            <div className="form-group full-width">

                                <label>
                                    Subject *
                                </label>

                                <input
                                    type="text"
                                    name="subject"
                                    value={
                                        form.subject
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="What is your inquiry about?"
                                />

                            </div>


                            <div className="form-group full-width">

                                <label>
                                    Inquiry Message *
                                </label>

                                <textarea
                                    name="message"
                                    rows="5"
                                    value={
                                        form.message
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Describe the information or assistance you need..."
                                />

                            </div>

                        </div>


                        <div className="form-actions">

                            <button
                                type="submit"
                                className="primary-button"
                            >
                                Submit Inquiry
                            </button>


                            <button
                                type="button"
                                className="secondary-button"
                                onClick={() => {
                                    setShowForm(
                                        false
                                    );

                                    setForm(
                                        emptyForm
                                    );

                                    setError("");
                                }}
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
                        onChange={(
                            event
                        ) =>
                            setSearch(
                                event.target
                                    .value
                            )
                        }
                        placeholder="Search reference number, name, email or subject..."
                    />

                </div>


                <select
                    className="filter-select"
                    value={status}
                    onChange={(
                        event
                    ) =>
                        setStatus(
                            event.target
                                .value
                        )
                    }
                >

                    {statuses.map(
                        (item) => (
                            <option
                                key={item}
                                value={item}
                            >
                                {item ===
                                "All"
                                    ? "All Statuses"
                                    : item}
                            </option>
                        )
                    )}

                </select>

            </section>


            <div className="results-summary">

                <strong>
                    {
                        inquiries.length
                    }
                </strong>

                {" "}

                inquiry
                {inquiries.length !==
                1
                    ? "ies"
                    : ""}

                {" "}

                found

            </div>


            {loading ? (

                <div className="loading">
                    Loading inquiries...
                </div>

            ) : inquiries.length ===
            0 ? (

                <div className="empty-state">

                    <div>
                        💬
                    </div>

                    <h3>
                        No inquiries found
                    </h3>

                    <p>
                        Try another reference
                        number or select another
                        status.
                    </p>

                </div>

            ) : (

                <div className="inquiry-grid">

                    {inquiries.map(
                        (inquiry) => (

                            <article
                                className="inquiry-card"
                                key={
                                    inquiry._id
                                }
                            >

                                <div className="inquiry-top">

                                    <div>

                    <span className="reference-label">
                      Reference
                    </span>

                                        <strong className="reference-number">
                                            {
                                                inquiry.referenceNumber
                                            }
                                        </strong>

                                    </div>


                                    <span
                                        className={`inquiry-status ${inquiry.status
                                            .toLowerCase()
                                            .replace(
                                                " ",
                                                "-"
                                            )}`}
                                    >
                    {
                        inquiry.status
                    }
                  </span>

                                </div>


                                <div className="inquiry-category">
                                    {
                                        inquiry.serviceCategory
                                    }
                                </div>


                                <h2>
                                    {
                                        inquiry.subject
                                    }
                                </h2>


                                <p className="inquiry-message">
                                    {
                                        inquiry.message
                                    }
                                </p>


                                <div className="inquiry-person">

                                    <div>
                    <span>
                      Submitted by
                    </span>

                                        <strong>
                                            {
                                                inquiry.fullName
                                            }
                                        </strong>
                                    </div>


                                    <div>
                    <span>
                      District
                    </span>

                                        <strong>
                                            {
                                                inquiry.district
                                            }
                                        </strong>
                                    </div>


                                    <div>
                    <span>
                      Date
                    </span>

                                        <strong>
                                            {formatDate(
                                                inquiry.createdAt
                                            )}
                                        </strong>
                                    </div>

                                </div>


                                <div className="inquiry-contact">

                                    <p>
                                        📧 {
                                        inquiry.email
                                    }
                                    </p>

                                    <p>
                                        📞 {
                                        inquiry.phone
                                    }
                                    </p>

                                </div>


                                {inquiry.response && (

                                    <div className="inquiry-response">

                                        <strong>
                                            Response
                                        </strong>

                                        <p>
                                            {
                                                inquiry.response
                                            }
                                        </p>

                                    </div>

                                )}


                                <div className="inquiry-actions">

                                    <div className="status-control">

                                        <label>
                                            Update Status
                                        </label>

                                        <select
                                            value={
                                                inquiry.status
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                handleStatusChange(
                                                    inquiry._id,
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                        >

                                            <option value="Pending">
                                                Pending
                                            </option>

                                            <option value="In Progress">
                                                In Progress
                                            </option>

                                            <option value="Resolved">
                                                Resolved
                                            </option>

                                        </select>

                                    </div>


                                    <button
                                        className="inquiry-delete-button"
                                        onClick={() =>
                                            handleDelete(
                                                inquiry
                                            )
                                        }
                                    >
                                        Delete
                                    </button>

                                </div>

                            </article>

                        )
                    )}

                </div>

            )}

        </main>
    );
}


export default InquiryManagement;