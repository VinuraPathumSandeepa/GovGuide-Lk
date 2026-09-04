import { Link, NavLink } from "react-router-dom";


function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-container">

        <Link
          to="/"
          className="brand"
        >
          <div className="brand-icon">
            G
          </div>

          <div>
            <h1>GovGuide LK</h1>

            <span>
              Public Service Assistant
            </span>
          </div>
        </Link>


        <nav className="nav-links">

          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/services"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            Services
          </NavLink>

          <NavLink
            to="/offices"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            Offices
          </NavLink>

          <NavLink
            to="/inquiries"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            Inquiries
          </NavLink>

          <NavLink
            to="/finder"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            Smart Finder
          </NavLink>

        </nav>

      </div>
    </header>
  );
}


export default Navbar;