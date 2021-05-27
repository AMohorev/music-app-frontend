import React, { useCallback, useState, useEffect } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import MusicPlayer from "react-responsive-music-player";

import Categories from "./categories/pages/Categories";
import CategoryAudio from "./audios/pages/CategoryAudio";
import MainNavigation from "./shared/Navigation/MainNavigation";
import Audios from "./audios/pages/Audios";
import AudioFullInfo from "./audios/pages/AudioFullInfo";
import { PlayerContext } from "./shared/context/playerContext";
import Playlists from "./playlists/pages/Playlists";
import PlaylistAudio from "./playlists/components/PlaylistAudio";
import Auth from "./users/pages/Auth";
import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";
import EditAudio from "./audios/components/EditAudio";
import NewCategory from "./categories/components/NewCategory";
import EditCategory from "./categories/components/EditCategory";
import NewAudio from "./audios/components/NewAudio";
import SearchAudios from "./audios/pages/SearchAudios";
import NewPlaylist from "./playlists/components/NewPlaylist";
import EditPlaylist from "./playlists/components/EditPlaylist";
import AddAudioIntoPlaylist from "./playlists/components/AddAudioIntoPlaylist";
import Users from "./users/pages/Users";
import EditUser from "./users/components/EditUser";

function App() {
    let routes;

    const { token, login, logout, userId, role } = useAuth();

    const [playlist, setPlaylist] = useState([
        {
            url: "", //"http://localhost:5000/uploads/audios/hund.mp3",
            cover: "http://localhost:5000/uploads/pictures/music.png",
            title: "Choose track first",
            artist: [],
        },
    ]);

    const setTrackForPlaylist = useCallback((track) => {
        const arr = [];
        arr.push(track);
        setPlaylist(arr);
    }, []);

    useEffect(() => {
        if (!token) {
            localStorage.setItem("Allowed", JSON.stringify( 0 ));
        } else {
            localStorage.setItem("Allowed", JSON.stringify( 0 ));
        }
    }, []);

    if (token) {
        routes = (
            <Switch>
                <Route path="/search">
                    <SearchAudios />
                </Route>
                <Route path={"/categories/new"}>
                    <NewCategory />
                </Route>
                <Route path={"/playlists/new"}>
                    <NewPlaylist />
                </Route>
                <Route exact path="/categories/edit/:categoryId">
                    <EditCategory />
                </Route>
                <Route exact path="/categories/:categoryId/newTrack">
                    <NewAudio />
                </Route>
                <Route exact path="/categories/:categoryId/tracks">
                    <CategoryAudio />
                </Route>
                <Route path="/playlists/user/:userId">
                    <Playlists />
                </Route>
                <Route path="/playlists/edit/:playlistId">
                    <EditPlaylist/>
                </Route>
                <Route path="/playlists/:playlistId/tracks">
                    <PlaylistAudio />
                </Route>
                <Route path="/playlists/:playlistId/addTrack">
                    <AddAudioIntoPlaylist/>
                </Route>
                <Route path="/audios/:audioId/edit">
                    <EditAudio />
                </Route>
                <Route path="/audios/:audioId">
                    <AudioFullInfo />
                </Route>
                <Route path="/audios">
                    <Audios />
                </Route>
                <Route path="/logout">
                    <Redirect to="/" />
                </Route>
                <Route path="/users/adminPanel">
                    <Users/>
                </Route>
                <Route path="/users/:userId">
                    <EditUser/>
                </Route>
                <Route exact path="/">
                    <Categories />
                </Route>
                <Redirect to="/" />
            </Switch>
        );
    } else {
        routes = (
            <Switch>
                <Route path="/categories/:categoryId/tracks">
                    <CategoryAudio />
                </Route>
                <Route path="/playlists/user/:userId">
                    <Playlists />
                </Route>
                <Route path="/search">
                    <SearchAudios />
                </Route>
                <Route path="/audios/:audioId">
                    <AudioFullInfo />
                </Route>
                <Route exact path="/audios">
                    <Audios />
                </Route>
                <Route path="/auth">
                    <Auth />
                </Route>
                <Route exact path="/">
                    <Categories />
                </Route>
                <Redirect to="/" />
            </Switch>
        );
    }

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn: !!token,
                token: token,
                userId: userId,
                login: login,
                logout: logout,
                role: role,
            }}
        >
            <PlayerContext.Provider
                value={{
                    setTrack: setTrackForPlaylist,
                }}
            >
                <BrowserRouter>
                    <main>
                        <div className="container">
                            <div className="row main-row">
                                <div
                                    style={{ background: "#181818" }}
                                    className="col-12 mb-5 pb-5"
                                >
                                    <MainNavigation />
                                    {routes}
                                </div>
                                <div
                                    style={{ background: "#262626" }}
                                    className="col-12 mt-5"
                                >
                                    <div className="mb-4">
                                        <MusicPlayer
                                            width="100%"
                                            playlist={playlist}
                                            mode="vertical"
                                            btnColor="#d32f2f"
                                            progressColor="#d32f2f"
                                            style={{ height: "300px", maxWidth: '100%' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </BrowserRouter>
            </PlayerContext.Provider>
        </AuthContext.Provider>
    );
}

export default App;
