import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";


import Navbar from "./shared/Navbar";

import Footer from "./shared/Footer";

import Home from "./pages/Home";


import ServiceDirectory from "./modules/serviceDirectory/ServiceDirectory";


import OfficeDirectory from "./modules/officeDirectory/OfficeDirectory";


import InquiryManagement from "./modules/inquiryManagement/InquiryManagement";


import SmartServiceFinder from "./modules/smartFinder/SmartServiceFinder";


function App() {

  return (
    <BrowserRouter>

      <div className="app">

        <Navbar />


        <Routes>

          <Route
            path="/"
            element={
              <Home />
            }
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
              <InquiryManagement />
            }
          />


          <Route
            path="/finder"
            element={
              <SmartServiceFinder />
            }
          />

        </Routes>


        <Footer />

      </div>

    </BrowserRouter>
  );
}


export default App;