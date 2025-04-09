import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import injectContext from "./store/appContext.js";
// Customs components
import { Navbar } from "./component/Navbar.jsx";
import { Footer } from "./component/Footer.jsx";
import ScrollToTop from "./component/ScrollToTop.jsx";
import { BackendURL } from "./component/BackendURL.jsx";
// Customs Pages or Views
import { Home } from "./pages/Home.jsx";
import { Error404 } from './pages/Error404.jsx'
import { Login } from "./pages/Login.jsx";
import { Register } from "./pages/Register.jsx";
import { Find } from "./pages/Find.jsx";
import { DesignTrip } from "./pages/DesignTrip.jsx";
import { EditProfile } from "./pages/EditProfile.jsx";
import { Profile } from "./pages/Profile.jsx";
import { GetInspired } from "./pages/GetInspired.jsx";
import { TripPage } from "./pages/TripPage.jsx";
import { Community } from "./pages/Community.jsx";
import { UploadImage } from "./component/UploadImage.jsx";
import { TripPhoto } from "./component/TripPhoto.jsx";

// Create your first component
const Layout = () => {
    // The basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";
    if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL />;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<Error404 />} path='*' />
                        <Route element={<Login />} path="/login/" />
                        <Route element={<Register />} path="/register/" />
                        <Route element={<EditProfile />} path="/edit-profile/" />
                        <Route element={<Profile />} path="/profile/" />
                        <Route element={<Find />} path="/find/" />
                        <Route element={<DesignTrip />} path="/design-trip/" />
                        <Route element={<GetInspired />} path="/get-inspired/" />
                        <Route element={<TripPage />} path="/trip-page/:tripId" />
                        <Route element={<Community />} path="/community/" />
                        <Route element={<UploadImage />} path="/image/" />
                        <Route element={<TripPhoto />} path="/trip-photo/" />
                        
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
