import React from "react"
import "../styles/header.css";

const Header = () => {
    return(
        <header>
        <div className="main_header_img">
          <img
            className="logo-loyola img-fluid"
            src="https://ipl.edu.do/images/logo-loyola.svg"
            alt="logo-loyola"
          />
        </div>
        <div className="main_header">
          <h1>Finca Experimental</h1>
          <p className="main_header_p">Profesor André Vloebergh</p>
        </div>
      </header>
    )
}

export default Header