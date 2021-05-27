import React, { useState } from "react";

import { UseHttpClient } from "../../shared/hooks/http-hook";
import { useForm } from "../../shared/hooks/form-hook";
import ErrorModal from "../../shared/UI/ErrorModal";
import Input from "../../shared/formElements/Input";
import { VALIDATOR_REQUIRE } from "../../shared/util/validators";
import Button from "../../shared/UI/Button";
import AudiosList from "../components/AudiosList";

const SearchAudios = () => {
    const [foundAudios, setFoundAudios] = useState([]);
    const { error, sendRequest, clearError } = UseHttpClient();

    const [formState, inputHandler] = useForm(
        {
            title: {
                value: "",
                isValid: false,
            },
        },
        false
    );

    const searchAudiosHandler = async (event) => {
        event.preventDefault();

        try {
            const responseData = await sendRequest(
                "http://localhost:5000/api/audios/search",
                "POST",
                JSON.stringify({
                    title: formState.inputs.title.value,
                }),
                { "Content-Type": "application/json" }
            );
            setFoundAudios(responseData.audios);
            console.log(responseData.audios)
        } catch (err) {}
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <div className="col-sm-4 container mx-auto authentication mt-5 pb-3">
                <form
                    onSubmit={searchAudiosHandler}
                    className="d-flex flex-column"
                >
                    <Input
                        id="title"
                        element="input"
                        type="text"
                        label="Title"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Search string cant be empty"
                        onInput={inputHandler}
                        initialValid={true}
                    />
                    <Button type="submit" disabled={!formState.isValid}>
                        Search
                    </Button>
                </form>
            </div>
            {foundAudios && foundAudios.length > 0 && <AudiosList items={foundAudios}/>}
        </React.Fragment>
    );
};

export default SearchAudios;
