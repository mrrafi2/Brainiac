import React from "react";
import { Link } from "react-router-dom";
import img from "./images/logo2.webp";
import classes from "./style/logo.module.css"; 

const Logo = () => {
  return (
    <div className={classes.logoContainer}>
      <Link to="/">
        <img src={img} alt="Logo" className={classes.logoImg} />
      </Link>
      <p className={classes.logoText}>Brainiac</p>
    </div>
  );
};

export default Logo;
