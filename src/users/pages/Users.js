import React, { useEffect, useState, useContext } from "react";

import { UseHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/UI/ErrorModal";
import { AuthContext } from "../../shared/context/auth-context";
import UsersList from "../components/UsersList";

const Users = () => {
    const [loadedUsers, setLoadedUsers] = useState();
    const { error, sendRequest, clearError } = UseHttpClient();
    const auth = useContext(AuthContext);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const responseData = await sendRequest(
                    "http://localhost:5000/api/users",
                    "GET",
                    null,
                    {
                        Authorization: "Bearer " + auth.token,
                    }
                );
                setLoadedUsers(responseData.users);
            } catch (err) {}
        };
        fetchUsers();
    }, [sendRequest]);

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {loadedUsers && <UsersList items={loadedUsers} />}
        </React.Fragment>
    );
};

export default Users;
