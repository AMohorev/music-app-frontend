import React, { useEffect, useState, useContext } from "react";

import { useParams, useHistory } from "react-router-dom";
import { UseHttpClient } from "../../shared/hooks/http-hook";
import SimpleCard from "../../shared/UI/SimpleCard";
import "./AddAudioIntoPlaylist.css";
import ErrorModal from "../../shared/UI/ErrorModal";
import Button from "../../shared/UI/Button";
import { AuthContext } from "../../shared/context/auth-context";

const AddAudioIntoPlaylist = (props) => {
    const { playlistId } = useParams();
    const { error, sendRequest, clearError } = UseHttpClient();
    const [loadedAudios, setLoadedAudios] = useState();
    const auth = useContext(AuthContext);
    const history = useHistory();
    console.log(playlistId);

    useEffect(() => {
        const fetchAudios = async () => {
            try {
                const responseData = await sendRequest(
                    "http://localhost:5000/api/audios"
                );
                setLoadedAudios(responseData.audios);
            } catch (err) {
                console.log(err);
            }
        };
        fetchAudios();
    }, [sendRequest]);

    const addTrackIntoPlaylistHandler = async (audioId, event) => {
        event.preventDefault();
        try {
            await sendRequest(
                `http://localhost:5000/api/playlists/${playlistId}`,
                "POST",
                JSON.stringify({
                    audioId: audioId,
                }),
                {
                    Authorization: "Bearer " + auth.token,
                    "Content-type": "application/json",
                }
            );
        } catch (err) {}
        history.push(history.push(`/playlists/${playlistId}/addTrack`));
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {loadedAudios &&
                loadedAudios.map((audio) => (
                    <SimpleCard key={audio.id}>
                        <div className="audio-row">
                            <h3>
                                {audio.title} - {audio.artist}
                            </h3>
                        </div>
                        <form
                            onSubmit={(event) =>
                                addTrackIntoPlaylistHandler(audio.id, event)
                            }
                        >
                            <Button type="submit">Add</Button>
                        </form>
                    </SimpleCard>
                ))}
        </React.Fragment>
    );
};

export default AddAudioIntoPlaylist;
