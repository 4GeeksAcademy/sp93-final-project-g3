import React from "react";
import { Link } from "react-router-dom";
import Welcome from "../../img/Welcome.png";
import Testimonies from "../../img/Testimonies.png";
import "../../styles/home.css";

export const Home = () => {
    return (
        <div>
            {/* :earth_africa: Hero Section */}
            <section
                className="hero-section vh-100 bg-image"
                style={{ backgroundImage: `url(${Welcome})` }}
            >
                <button className="mb-5">Start Exploring</button>
            </section>

            {/* :desert_island: Most Searched Destinations */}
            <section className="most-searched text-center">
                <h2>Most Searched for Destinations</h2>
                <div className="container">
                    <div className="row justify-content-center">
                        {/* Card 1 */}
                        <div className="col-md-5">
                            <div className="card">
                                <img
                                    src="https://www.rjtravelagency.com/wp-content/uploads/2023/10/Thailand-2.jpg"
                                    className="card-img-top"
                                    alt="Thailand"
                                />
                                <div className="card-body">
                                    <h5 className="card-title text-center">Thailand</h5>
                                </div>
                            </div>
                        </div>
                        {/* Card 2 */}
                        <div className="col-md-5">
                            <div className="card">
                                <img
                                    src="https://media.istockphoto.com/id/484915982/photo/akihabara-tokyo.jpg?s=612x612&w=0&k=20&c=kbCRYJS5vZuF4jLB3y4-apNebcCEkWnDbKPpxXdf9Cg="
                                    className="card-img-top"
                                    alt="Tokyo"
                                />
                                <div className="card-body">
                                    <h5 className="card-title text-center">Tokyo</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="bg-white py-5">
                <div className="container text-center">
                    <h2 className="text-center how-it-works-title">How Does It Work?</h2>
                    <p className="text-center how-it-works-description">
                        Discover the best way to travel—whether you're joining an adventure or creating your own.
                    </p>

                    {/* Option A */}
                    <div className="row justify-content-center mb-5">
                        <h4 className="how-it-works-subtitles">Find your next adventure</h4>
                        <div className="d-flex justify-content-between how-it-works">
                            <div className="step">
                                <div className="step-number">1</div>
                                <h5 className="step-title">Search for a Trip</h5>
                                <p className="step-subtitle">Find the perfect trip that matches your interests.</p>
                            </div>
                            <div className="step">
                                <div className="step-number">2</div>
                                <h5 className="step-title">Join the Trip</h5>
                                <p className="step-subtitle">Book your spot and get ready for an adventure.</p>
                            </div>
                            <div className="step">
                                <div className="step-number">3</div>
                                <h5 className="step-title">Enjoy the Adventure</h5>
                                <p className="step-subtitle">Meet new people and explore exciting places.</p>
                            </div>
                            <div className="step">
                                <div className="step-number">4</div>
                                <h5 className="step-title">Share Your Experience</h5>
                                <p className="step-subtitle">Tell your story and inspire other travelers.</p>
                            </div>
                        </div>
                    </div>

                    {/* Option B */}
                    <div className="row justify-content-center">
                        <h4 className="how-it-works-subtitles">Design your own adventure</h4>
                        <div className="d-flex justify-content-between how-it-works">
                            <div className="step">
                                <div className="step-number">1</div>
                                <h5 className="step-title">Create Your Trip</h5>
                                <p className="step-subtitle">Design an itinerary that others can join.</p>
                            </div>
                            <div className="step">
                                <div className="step-number">2</div>
                                <h5 className="step-title">Accept Travelers</h5>
                                <p className="step-subtitle">Review and approve participants for your trip.</p>
                            </div>
                            <div className="step">
                                <div className="step-number">3</div>
                                <h5 className="step-title">Enjoy the Adventure</h5>
                                <p className="step-subtitle">Lead the journey and create memories.</p>
                            </div>
                            <div className="step">
                                <div className="step-number">4</div>
                                <h5 className="step-title">Share Your Story</h5>
                                <p className="step-subtitle">Inspire others by sharing your experience.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="container my-5">
                <h2 className="testimonial-title text-center mb-4">Testimonies</h2>
                <div id="testimonialCarousel" className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <div className="text-center">
                                <p className="testimonial-text">"This platform changed the way I travel!"</p>
                                <h5 className="testimonial-author">- John Doe</h5>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <div className="text-center">
                                <p className="testimonial-text">"I met amazing people and had unforgettable experiences."</p>
                                <h5 className="testimonial-author">- Jane Smith</h5>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <div className="text-center">
                                <p className="testimonial-text">"Super easy to find trips and travel with like-minded people!"</p>
                                <h5 className="testimonial-author">- Alex Lee</h5>
                            </div>
                        </div>
                    </div>
                    {/* Carousel Controls */}
                    <button className="carousel-control-prev" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon"></span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="next">
                        <span className="carousel-control-next-icon"></span>
                    </button>
                </div>
            </section>

        </div>
    );
};