import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

import { UseHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/UI/ErrorModal";
import AudioInfoCard from "../components/AudioInfoCard";
import { AuthContext } from "../../shared/context/auth-context";

const AudioFullInfo = (props) => {
    const [foundAudio, setFoundAudio] = useState();
    const { sendRequest, clearError, error } = UseHttpClient();
    const [allowed, setAllowed] = useState();
    const { audioId } = useParams();
    const auth = useContext(AuthContext);

    useEffect(() => {
        const fetchAudio = async () => {
            const responseData = await sendRequest(
                `http://localhost:5000/api/audios/${audioId}`
            );
            setFoundAudio(responseData.audio);
        };
        fetchAudio();
    }, [audioId, sendRequest]);

    useEffect(() => {
        if (!auth.token) {
            const count = localStorage.getItem("Allowed");
            if (count < 10) {
                localStorage.setItem("Allowed", JSON.stringify(+count + 1));
            }
            setAllowed(count);
        }
    }, [auth.token]);

    let content;
    if (allowed == 10) {
        content = <div className="container mt-5">
            <h1 style={{color: "#d32f2f", textAlign: "center"}}>You have reached limit of 10 songs. Register or login to listen more</h1>
        </div>;
    } else {
        content = (
            <React.Fragment>
                <ErrorModal error={error} onClear={clearError} />
                {foundAudio && (
                    <div className="container mt-5">
                        <AudioInfoCard
                            key={foundAudio.id}
                            id={foundAudio.id}
                            name={foundAudio.title}
                            artist={foundAudio.artist}
                            track={foundAudio.track}
                            image={foundAudio.image}
                            views={foundAudio.views}
                            likes={foundAudio.likes}
                            comments={foundAudio.comments}
                        />
                    </div>
                )}
            </React.Fragment>
        );
    }

    return content;
};

export default AudioFullInfo;
