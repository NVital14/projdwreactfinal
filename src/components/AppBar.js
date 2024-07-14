import React, { useContext } from 'react'; import 'bootstrap/dist/css/bootstrap.min.css';
import { ROUTES, AppContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { Route } from 'react-router-dom';
import '../App.css';
import { logOut } from '../API/api';

const AppBar = () => {
    const navigate = useNavigate();
    const { context, setContext } = useContext(AppContext);

    return (
        <nav className="navbar navbar-expand-sm navbar-toggleable-sm navbar-light custom-navbar">
            <div className="container-fluid">
                <button className="nav-link btn btn-link" onClick={() => navigate(ROUTES.HOME)}><span id="title">My Favorite Things</span></button>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target=".navbar-collapse"
                    aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="navbar-collapse collapse d-sm-inline-flex justify-content-between">
                    <ul className="navbar-nav flex-grow-1">

                    {context.isAdmin ?
                            <li className="nav-item">
                                <button className="nav-link btn btn-link text-light" onClick={() => navigate(ROUTES.CATEGORIES)}><strong>Categorias</strong></button>
                                {/* <a className="nav-link text-light"> <strong>As Minhas Reviews</strong></a> */}

                            </li> : ""}
                        {context.isAuthenticated ?
                            <li className="nav-item">
                                <button className="nav-link btn btn-link text-light" onClick={() => navigate(ROUTES.MYREVIEWS)}><strong>As Minhas Reviews</strong></button>
                                {/* <a className="nav-link text-light"> <strong>As Minhas Reviews</strong></a> */}

                            </li> : ""}
                            {context.isAuthenticated ?
                            <li className="nav-item">
                                <button className="nav-link btn btn-link text-light" onClick={() => navigate(ROUTES.FAVORITES)}><strong>Favoritos</strong></button>
                                {/* <a className="nav-link text-light"> <strong>As Minhas Reviews</strong></a> */}

                            </li> : ""}

                    </ul>

                    {context.isAuthenticated ?
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <button className="nav-link btn btn-link"><strong>Olá, {context.user.userName}!</strong></button>
                            </li>
                            <li className="nav-item">
                                <button className="nav-link btn btn-link" onClick={async () => { await logOut(); setContext((prevState) => ({ ...prevState, isAuthenticated: false })); navigate(ROUTES.HOME); }} ><strong>Sair</strong></button>

                            </li>
                        </ul>
                        :
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <button className="nav-link btn btn-link" onClick={() => navigate(ROUTES.REGISTER)}><strong>Registo</strong></button>
                            </li>
                            <li className="nav-item">
                                <button className="nav-link btn btn-link" onClick={() => navigate(ROUTES.LOG_IN)}><strong>Entrar</strong></button>

                            </li>
                        </ul>}
                </div>
            </div>
        </nav>

    );
}

export default AppBar;