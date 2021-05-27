import React, { useEffect, useContext, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import Input from "../../shared/formElements/Input";
import Button from "../../shared/UI/Button";
import { useForm } from "../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/UI/ErrorModal";
import { VALIDATOR_REQUIRE } from "../../shared/util/validators";
import { UseHttpClient } from "../../shared/hooks/http-hook";

const EditUser = () => {
    const { error, sendRequest, clearError } = UseHttpClient();
    const auth = useContext(AuthContext);
    const history = useHistory();
    const { userId } = useParams();
    const [foundUser, setFoundUser] = useState();

    const [formState, inputHandler, setFormData] = useForm(
        {
            name: {
                value: "",
                isValid: false,
            },
            role: {
                value: "",
                isValid: false
            }
        },
        false
    );

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:5000/api/users/${userId}`
                );
                setFoundUser(responseData.user);
                setFormData(
                    {
                        name: {
                            value: responseData.user.name,
                            isValid: true,
                        },
                        role: {
                            value: responseData.user.role,
                            isValid: true
                        }
                    },
                    true
                );
            } catch (err) {}
        };

        fetchUser();
    }, [sendRequest, userId, setFormData]);

    const editUserHandler = async (event) => {
        event.preventDefault()
        try {
            await sendRequest(
                `http://localhost:5000/api/users/${userId}`,
                "PATCH",
                JSON.stringify({
                    name: formState.inputs.name.value,
                    role: formState.inputs.role.value
                }),
                {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + auth.token,
                }
            );
            history.push('/users/adminPanel');
        } catch (err) {}
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {foundUser && (
                <div className="col-sm-4 container mx-auto authentication mt-5 pb-3">
                    <form
                        onSubmit={editUserHandler}
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
                            initialValue={foundUser.name}
                            initialValid={true}
                        />
                        <Input
                            id="role"
                            element="input"
                            type="text"
                            label="Role (admin or user)"
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText="Role cannot be empty"
                            onInput={inputHandler}
                            initialValue={foundUser.role}
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

export default EditUser;