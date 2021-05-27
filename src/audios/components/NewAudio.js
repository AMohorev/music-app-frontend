import React, { useContext } from "react";
import {useHistory, useParams} from "react-router-dom";

import Input from "../../shared/formElements/Input";
import Button from "../../shared/UI/Button";
import { useForm } from "../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/UI/ErrorModal";
import { VALIDATOR_REQUIRE } from "../../shared/util/validators";
import { UseHttpClient } from "../../shared/hooks/http-hook";
import ImageUpload from "../../shared/formElements/ImageUpload";

const NewAudio = () => {
    const { error, sendRequest, clearError } = UseHttpClient();
    const auth = useContext(AuthContext);
    const { categoryId } = useParams();
    const history = useHistory();

    const [formState, inputHandler] = useForm(
        {
            title: {
                value: "",
                isValid: false,
            },
            artist: {
                value: "",
                isValid: false
            },
            image: {
                value: "",
                isValid: false,
            },
            audio: {
                value: "",
                isValid: false
            }
        },
        false
    );

    const postAudioIntoCategoryHandler = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("title", formState.inputs.title.value);
        formData.append("artist", formState.inputs.artist.value);
        formData.append("image", formState.inputs.image.value);
        formData.append("audio", formState.inputs.audio.value);

        try {
            await sendRequest(
                `http://localhost:5000/api/categories/${categoryId}`,
                "POST",
                formData,
                {
                    Authorization: "Bearer " + auth.token,
                }
            );
            history.push("/categories/" + categoryId);
        } catch (err) {}
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError}/>
            <div className="col-sm-4 container mx-auto authentication mt-5 pb-3">
                <form
                    onSubmit={postAudioIntoCategoryHandler}
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
                        initialValid={true}
                    />
                    <ImageUpload id="image" fileTypes={".jpg,.png,.jpeg"} onInput={inputHandler} />
                    <ImageUpload id="audio" fileTypes={".mp3"} onInput={inputHandler} />
                    <Button type="submit" disabled={!formState.isValid}>
                        Add
                    </Button>
                </form>
            </div>
        </React.Fragment>
    );
};

export default NewAudio;
