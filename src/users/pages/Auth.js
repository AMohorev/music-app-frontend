import React, { useState, useContext } from "react";
import Button from "../../shared/UI/Button";

import Input from "../../shared/formElements/Input";
import {
    VALIDATOR_MINLENGTH,
    VALIDATOR_EMAIL,
    VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { UseHttpClient } from "../../shared/hooks/http-hook";
import "./Auth.css";
import ErrorModal from "../../shared/UI/ErrorModal";
import ImageUpload from "../../shared/formElements/ImageUpload";
import { AuthContext } from "../../shared/context/auth-context";

const Auth = () => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const { error, sendRequest, clearError } = UseHttpClient();
    const auth = useContext(AuthContext);

    const [formState, inputHandler, setFormData] = useForm({
        email: {
            value: "",
            isValid: false,
        },
        password: {
            value: "",
            isValid: false,
        },
    });

    const authenticationHandler = async (event) => {
        event.preventDefault();
        if (isLoginMode) {
            try {
                const responseData = await sendRequest(
                    "http://localhost:5000/api/users/login",
                    "POST",
                    JSON.stringify({
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value,
                    }),
                    {
                        "Content-type": "application/json",
                    }
                );
                auth.login(
                    responseData.userId,
                    responseData.role,
                    responseData.token
                );
            } catch (err) {}
        } else {
            try {
                const formData = new FormData();
                formData.append("email", formState.inputs.email.value);
                formData.append("name", formState.inputs.name.value);
                formData.append("password", formState.inputs.password.value);
                formData.append("image", formState.inputs.image.value);

                const responseData = await sendRequest(
                    "http://localhost:5000/api/users/signup",
                    "POST",
                    formData
                );
                auth.login(
                    responseData.userId,
                    responseData.role,
                    responseData.token
                );
            } catch (err) {}
        }
        // history.push('/');
    };

    const switchFormModeHandler = () => {
        if (!isLoginMode) {
            setFormData(
                {
                    ...formState.inputs,
                    name: undefined,
                },
                formState.inputs.email.isValid &&
                    formState.inputs.password.isValid
            );
        } else {
            setFormData(
                {
                    ...formState.inputs,
                    name: {
                        value: "",
                        isValid: false,
                    },
                    image: {
                        value: null,
                        isValid: false,
                    },
                },
                false
            );
        }
        setIsLoginMode((prevState) => !prevState);
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <div className="col-sm-4 container mx-auto authentication mt-5 pb-3">
                <h6 style={{color: 'white'}}>Admin account: admin@admin.com - 12345678</h6>
                <form
                    onSubmit={authenticationHandler}
                    className="d-flex flex-column"
                >
                    {!isLoginMode && (
                        <Input
                            id="name"
                            element="input"
                            type="text"
                            label="Your name"
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText="Enter name"
                            onInput={inputHandler}
                        />
                    )}
                    {!isLoginMode && (
                        <ImageUpload id="image" fileTypes={".jpg,.png,.jpeg"} onInput={inputHandler} />
                    )}
                    <Input
                        id="email"
                        element="input"
                        type="email"
                        label="Email"
                        validators={[VALIDATOR_EMAIL()]}
                        errorText="Enter valid email"
                        onInput={inputHandler}
                    />
                    <Input
                        id="password"
                        element="input"
                        type="password"
                        label="Password"
                        validators={[VALIDATOR_MINLENGTH(8)]}
                        errorText="Length should > 8"
                        onInput={inputHandler}
                    />
                    <Button type="submit" disabled={!formState.isValid}>
                        {isLoginMode ? "Login" : "Sign up"}
                    </Button>
                </form>

                <Button type="submit" danger onClick={switchFormModeHandler}>
                    Switch to {isLoginMode ? "registration" : "login"}
                </Button>
            </div>
        </React.Fragment>
    );
};

export default Auth;
