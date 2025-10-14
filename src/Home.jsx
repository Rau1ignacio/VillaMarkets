import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';



const Home = ()=>{
    return(
        <div class Name="home-page" >

        <nav className="navbar navbar-expand-lg navbar-light bg success bn shadow-sm">
            <div className="container">
                <a className="navbar-brand d-flex align-items-center" href="#">
                    <img src="./src/images/logovilla.jpg" alt="Villa Market" style={{ height: '40px', marginRight: '10px' }} />
                    <span className="fw-bold text-white"> villamarkets</span>





                </a>

                <button className="navbar-toggler" type ="button" data-bs-toggle="collapse" data-bs-target="#navbar">
                    <span className ="navbar-toggler-icon"></span>
                </button>

                



            </div>
        </nav>

    </div>
    )
}

export default Home;

