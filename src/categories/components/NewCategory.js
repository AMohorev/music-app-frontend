import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import Input from "../../shared/formElements/Input";
import Button from "../../shared/UI/Button";
import { useForm } from "../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/UI/ErrorModal";
import { VALIDATOR_REQUIRE } from "../../shared/util/validators";
import { UseHttpClient } from "../../shared/hooks/http-hook";

const NewCategory = () => {
    const { error, sendRequest, clearError } = UseHttpClient();
    const auth = useContext(AuthContext);
    const history = useHistory();

    const [formState, inputHandler] = useForm(
        {
            name: {
                value: "",
                isValid: false,
            },
        },
        false
    );

    const postCategoryHandler = async (event) => {
        event.preventDefault();

        try {
            await sendRequest(
                "http://localhost:5000/api/categories",
                "POST",
                JSON.stringify({
                    name: formState.inputs.name.value,
                }),
                {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + auth.token,
                }
            );
            history.push("/categories");
        } catch (err) {}
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError}/>
            <div className="col-sm-4 container mx-auto authentication mt-5 pb-3">
                <form
                    onSubmit={postCategoryHandler}
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
                        initialValid={true}
                    />
                    <Button type="submit" disabled={!formState.isValid}>
                        Add
                    </Button>
                </form>
            </div>
        </React.Fragment>
    );
};

export default NewCategory;
