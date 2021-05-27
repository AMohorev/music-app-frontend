import React, { useContext } from "react";

import SimpleCard from "../../shared/UI/SimpleCard";
import Button from "../../shared/UI/Button";
import { UseHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/UI/ErrorModal";
import { AuthContext } from "../../shared/context/auth-context";
import "./UsersList.css";

const UsersList = (props) => {
    let { error, sendRequest, clearError } = UseHttpClient();
    const auth = useContext(AuthContext);

    if (props.items.length === 0) {
        return <div>Users not found</div>;
    }

    const banUserHandler = async (userId, event) => {
        event.preventDefault();
        try {
            await sendRequest(
                `http://localhost:5000/api/users/ban`,
                "POST",
                JSON.stringify({
                    userId: userId,
                    type: "ban",
                }),
                {
                    Authorization: "Bearer " + auth.token,
                    "Content-type": "application/json",
                }
            );
        } catch (err) {}
    };

    const unbanUserHandler = async (userId, event) => {
        event.preventDefault();
        try {
            await sendRequest(
                `http://localhost:5000/api/users/ban`,
                "POST",
                JSON.stringify({
                    userId: userId,
                    type: "unban",
                }),
                {
                    Authorization: "Bearer " + auth.token,
                    "Content-type": "application/json",
                }
            );
        } catch (err) {}
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {props.items.map((user) => (
                <SimpleCard key={user.id}>
                    <div className="user-row">
                        <h3>
                            {user.name} - {user.email} - {user.role}
                        </h3>
                    </div>
                    <div className="user-options">
                        <Button to={"/users/" + user.id}>Edit</Button>
                        <form
                            onSubmit={
                                user.isBanned
                                    ? (event) =>
                                          unbanUserHandler(user.id, event)
                                    : (event) => banUserHandler(user.id, event)
                            }
                        >
                            <Button inverse type="submit">
                                {user.isBanned ? "Unblock" : "Block"}
                            </Button>
                        </form>
                    </div>
                </SimpleCard>
            ))}
        </React.Fragment>
    );
};

export default UsersList;
