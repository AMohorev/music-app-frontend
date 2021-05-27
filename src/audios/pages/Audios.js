import React, { useState, useEffect } from "react";

import { UseHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/UI/ErrorModal";
import AudiosList from "../components/AudiosList";

const Audios = (props) => {
    const [loadedAudios, setLoadedAudios] = useState();
    const { sendRequest, error, clearError } = UseHttpClient();

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

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {loadedAudios && <AudiosList items={loadedAudios} />}
        </React.Fragment>
    );
};

export default Audios;
