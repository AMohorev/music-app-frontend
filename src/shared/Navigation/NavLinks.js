import React, { useContext } from "react";

import { AuthContext } from "../context/auth-context";
import { NavLink } from "react-router-dom";
import "./NavLinks.css";

const NavLinks = (props) => {
    const auth = useContext(AuthContext);
    const padding = auth.isLoggedIn ? 'px-2' : 'px-3'
    return (
        <ul className="navbar-nav mx-auto mb-2">
            <li className={`nav-item ${padding}`}>
                <NavLink className="nav-link selected" exact to="/">
                    Categories
                </NavLink>
            </li>
            <li className={`nav-item ${padding}`}>
                <NavLink className="nav-link selected" to="/audios">
                    Songs
                </NavLink>
            </li>
            {auth.isLoggedIn && (
                <li className={`nav-item ${padding}`}>
                    <NavLink
                        className="nav-link selected"
                        to={"/playlists/user/" + auth.userId}
                    >
                        Your playlists
                    </NavLink>
                </li>
            )}
            {!auth.isLoggedIn && (
                <li className={`nav-item ${padding}`}>
                    <NavLink className="nav-link selected" to="/auth">
                        Authorization
                    </NavLink>
                </li>
            )}
            {auth.isLoggedIn && auth.role === "admin" && (
                <li className={`nav-item ${padding}`}>
                    <NavLink className="nav-link selected" to="/users/adminPanel">
                        Admin panel
                    </NavLink>
                </li>
            )}
            {auth.isLoggedIn && (
                <li className={`nav-item ${padding}`}>
                    <NavLink
                        className="nav-link selected"
                        exact
                        to="/logout"
                        onClick={auth.logout}
                    >
                        Logout
                    </NavLink>
                </li>
            )}
            <li className={`nav-item ${padding}`}>
                <NavLink
                    className="nav-link selected"
                    exact
                    to="/search"
                >
                    Search
                </NavLink>
            </li>
        </ul>
    );
};

export default NavLinks;
