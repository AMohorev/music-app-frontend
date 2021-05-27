import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";

import { UseHttpClient } from "../../shared/hooks/http-hook";
import AudiosList from "../../audios/components/AudiosList";
import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/UI/ErrorModal";
import Button from "../../shared/UI/Button";

const PlaylistAudio = (props) => {
    const [loadedAudios, setLoadedAudios] = useState();
    const auth = useContext(AuthContext);
    const { playlistId } = useParams();
    const history = useHistory();

    const { error, sendRequest, clearError } = UseHttpClient();

    useEffect(() => {
        try {
            const fetchPlaylist = async () => {
                const responseData = await sendRequest(
                    `http://localhost:5000/api/playlists/${playlistId}`,
                    "GET",
                    null,
                    { Authorization: "Bearer " + auth.token }
                );
                setLoadedAudios(responseData.playlist);
            };
            fetchPlaylist();
        } catch (err) {
            console.log(err);
        }
    }, [sendRequest]);

    const deletePlaylistHandler = async () => {
        try {
            await sendRequest(
                `http://localhost:5000/api/playlists/${playlistId}`,
                "DELETE",
                null,
                {
                    Authorization: "Bearer " + auth.token,
                }
            );
            history.push("/playlists/user/" + auth.userId);
        } catch (err) {}
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <div className="mt-5">
                {loadedAudios && (
                    <div className="col text-center container">
                        <h3 style={{ color: "white" }} className="text-center">
                            {loadedAudios.playlistName}
                        </h3>
                        <AudiosList items={loadedAudios.playlistTracks} />
                    </div>
                )}
                {loadedAudios && auth.userId === loadedAudios.owner && (
                    <div
                        className="ms-3 mt-5 d-flex flex-column justify-content-between text-center"
                        style={{ height: "150px" }}
                    >
                        {loadedAudios.playlistName !== "Liked" && (
                            <Button
                                to={`/playlists/edit/${playlistId}`}
                                inverse
                            >
                                Edit
                            </Button>
                        )}
                        <Button
                            to={`/playlists/${playlistId}/addTrack`}
                            inverse
                        >
                            Add track
                        </Button>
                        {loadedAudios.playlistName != "Liked" && (
                            <Button inverse onClick={deletePlaylistHandler}>
                                Delete
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </React.Fragment>
    );
};

export default PlaylistAudio;
