import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import Navbar from "./shared/Navbar";

import Footer from "./shared/Footer";

import ComingSoon from "./shared/ComingSoon";

import Home from "./pages/Home";

import ServiceDirectory from "./modules/serviceDirectory/ServiceDirectory";

import OfficeDirectory from "./modules/officeDirectory/OfficeDirectory";


function App() {
  return (
    <BrowserRouter>

      <div className="app">

        <Navbar />


        <Routes>

          <Route
            path="/"
            element={<Home />}
          />


          <Route
            path="/services"
            element={
              <ServiceDirectory />
            }
          />


          <Route
            path="/offices"
            element={
              <OfficeDirectory />
            }
          />


          <Route
            path="/inquiries"
            element={
              <ComingSoon
                icon="💬"
                title="Inquiry Management"
                description="Submit public service inquiries and follow their progress."
              />
            }
          />


          <Route
            path="/finder"
            element={
              <ComingSoon
                icon="✨"
                title="Smart Service Finder"
                description="Answer a few questions to identify the public service you may need."
              />
            }
          />


        </Routes>


        <Footer />

      </div>

    </BrowserRouter>
  );
}


export default App;