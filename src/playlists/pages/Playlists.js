import React, { useState, useEffect, useContext } from "react";

import { UseHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/UI/ErrorModal";
import PlaylistsList from "../components/PlaylistsList";
import { AuthContext } from "../../shared/context/auth-context";
import Button from "../../shared/UI/Button";

const Playlists = (props) => {
    const [loadedPlaylists, setLoadedPlaylists] = useState();
    const { error, sendRequest, clearError } = UseHttpClient();

    const auth = useContext(AuthContext);

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:5000/api/playlists/user/${auth.userId}`,
                    "GET",
                    null,
                    { Authorization: "Bearer " + auth.token }
                );
                setLoadedPlaylists(responseData.userPlaylists);
            } catch (err) {
                console.log(error);
            }
        };
        fetchPlaylists();
    }, [sendRequest]);

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {loadedPlaylists && <PlaylistsList items={loadedPlaylists} />}
            {auth.token && (
                <div className="mt-5 container-fluid">
                    <Button to={`/playlists/new`} inverse>
                        Add new playlist
                    </Button>
                </div>
            )}
        </React.Fragment>
    );
};

export default Playlists;
