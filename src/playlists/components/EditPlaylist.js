import React, { useEffect, useContext, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import Input from "../../shared/formElements/Input";
import Button from "../../shared/UI/Button";
import { useForm } from "../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/UI/ErrorModal";
import { VALIDATOR_REQUIRE } from "../../shared/util/validators";
import { UseHttpClient } from "../../shared/hooks/http-hook";

const EditPlaylist = () => {
    const { error, sendRequest, clearError } = UseHttpClient();
    const auth = useContext(AuthContext);
    const history = useHistory();
    const { playlistId } = useParams();
    const [foundPlaylist, setFoundPlaylist] = useState();

    const [formState, inputHandler, setFormData] = useForm(
        {
            name: {
                value: "",
                isValid: false,
            },
        },
        false
    );

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:5000/api/playlists/${playlistId}`,
                    "Get",
                    null,
                    { Authorization: "Bearer " + auth.token }
                );
                setFoundPlaylist(responseData.playlist);
                setFormData(
                    {
                        name: {
                            value: responseData.playlist.playlistName,
                            isValid: true,
                        },
                    },
                    true
                );
            } catch (err) {}
        };

        fetchCategory();
    }, [sendRequest, playlistId, setFormData]);

    const editPlaylistHandler = async (event) => {
        event.preventDefault();
        try {
            await sendRequest(
                `http://localhost:5000/api/playlists/${playlistId}`,
                "PATCH",
                JSON.stringify({
                    name: formState.inputs.name.value,
                }),
                {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + auth.token,
                }
            );
            history.push(`/playlists/${playlistId}/tracks`);
        } catch (err) {}
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {foundPlaylist && (
                <div className="col-sm-4 container mx-auto authentication mt-5 pb-3">
                    <form
                        onSubmit={editPlaylistHandler}
                        className="d-flex flex-column"
                    >
                        <Input
                            id="name"
                            element="input"
                            type="text"
                            label="Name"
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText="Name cannot be empty"
                            onInput={inputHandler}
                            initialValue={foundPlaylist.playlistName}
                            initialValid={true}
                        />
                        <Button type="submit" disabled={!formState.isValid}>
                            Edit
                        </Button>
                    </form>
                </div>
            )}
        </React.Fragment>
    );
};

export default EditPlaylist;