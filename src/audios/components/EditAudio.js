import React, { useState, useContext, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";

import Input from "../../shared/formElements/Input";
import Button from "../../shared/UI/Button";
import { VALIDATOR_REQUIRE } from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { UseHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/UI/ErrorModal";
import { AuthContext } from "../../shared/context/auth-context";

const EditAudio = () => {
    const [foundAudio, setFoundAudio] = useState();
    const { error, sendRequest, clearError } = UseHttpClient();
    const auth = useContext(AuthContext);
    const { audioId } = useParams();
    const history = useHistory();

    const [formState, inputHandler, setFormData] = useForm(
        {
            title: {
                value: "",
                isValid: false,
            },
            artist: {
                value: "",
                isValid: false,
            },
        },
        true
    );

    useEffect(() => {
        const fetchAudio = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:5000/api/audios/${audioId}`
                );
                setFoundAudio(responseData.audio);
                setFormData(
                    {
                        title: {
                            value: responseData.audio.title,
                            isValid: true,
                        },
                        artist: {
                            value: responseData.audio.artist,
                            isValid: true,
                        },
                    },
                    true
                );
            } catch (err) {}
        };

        fetchAudio();
    }, [sendRequest, audioId, setFormData]);

    const editAudioHandler = async (event) => {
        event.preventDefault();
        try {
            await sendRequest(
                `http://localhost:5000/api/audios/${audioId}`,
                "PATCH",
                JSON.stringify({
                    title: formState.inputs.title.value,
                    artist: formState.inputs.artist.value,
                }),
                {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + auth.token,
                }
            );
            history.push("/audios/" + audioId);
        } catch (err) {}
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {foundAudio && (
                <div className="col-sm-4 container mx-auto authentication mt-5 pb-3">
                    <form
                        onSubmit={editAudioHandler}
                        className="d-flex flex-column"
                    >
                        <Input
                            id="title"
                            element="input"
                            type="text"
                            label="Title"
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText="Title cannot be empty"
                            onInput={inputHandler}
                            initialValue={foundAudio.title}
                            initialValid={true}
                        />
                        <Input
                            id="artist"
                            element="input"
                            type="text"
                            label="Artist"
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText="Artist cannot be empty"
                            onInput={inputHandler}
                            initialValue={foundAudio.artist}
                            initialValid={true}
                        />
                        <Button type="submit" disabled={!formState.isValid}>
                            Update
                        </Button>
                    </form>
                </div>
            )}
        </React.Fragment>
    );
};

export default EditAudio;
