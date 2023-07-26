import React from "react";
import { BsStripe } from "react-icons/bs";
import Img1 from "../../assets/OIG.jpeg";
import { Link } from "react-router-dom";
import "./Home.scss";

import { ShowOnLogin, ShowOnLogout } from "../../components/protect/HiddenLink";

const Home = () => {
    return (
        <div className="home">
            <nav className="container --flex-between">
                <div className="logo" style={{ color: '#145ca8' }}>
                    <BsStripe size={30} />
                    <span className="text">StockFlow</span> 
                </div>
                <ul className="home-links">
                    <ShowOnLogout>
                    <li>
                        <button className="--btn --btn-primary">
                            <Link to="/register">Register</Link>
                        </button>
                    </li>
                    </ShowOnLogout>
                    <ShowOnLogout>
                    <li>
                        <button className="--btn --btn-primary">
                            <Link to="/login">Login</Link>
                        </button>
                    </li>
                    </ShowOnLogout>
                    <ShowOnLogin>
                    <li>
                        <button className="--btn --btn-primary">
                            <Link to="/Dashboard">Dashboard</Link>
                        </button>
                    </li>
                    </ShowOnLogin>
                </ul>
            </nav>
            {/* HERO SECTION */}
            <section className="container hero">
                <div className="hero-text">
                    <h2>Inventory {"&"} Stock Management Solution</h2>
                    <p>
                        Inventory system to control and manage products in the warehouse in
                        real timeand integrated to make it easier to develop your business.
                    </p>
                    <div className="hero-buttons">
                        <button className="--btn --btn-secondary">
                            Free Trial 1 Month
                        </button>
                    </div>
                    <div className="--flex-start">
                        <NumberText num="1K" text="Brand Owners" />
                        <NumberText num="2K" text="Active Users" />
                        <NumberText num="100+" text="Partners" />
                    </div>
                </div>

                <div className="hero-image">
                    <img src={Img1} alt="Inventory" />
                </div>
            </section>
        </div>
    );
};

const NumberText = ({ num, text }) => {
    return (
      <div className="--mr">
        <h3 className="--color-black">{num}</h3>
        <p className="--color-black">{text}</p>
      </div>
    );
};

export default Home;