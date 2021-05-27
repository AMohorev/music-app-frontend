import React, { useEffect, useState, useContext } from "react";

import CategoriesList from "../components/CategoriesList";
import { UseHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/UI/ErrorModal";
import Button from "../../shared/UI/Button";
import {AuthContext} from "../../shared/context/auth-context";

const Categories = (props) => {
    const [loadedCategories, setLoadedCategories] = useState();
    const { error, sendRequest, clearError } = UseHttpClient();
    const auth = useContext(AuthContext);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const responseData = await sendRequest(
                    "http://localhost:5000/api/categories"
                );
                setLoadedCategories(responseData.categories);
            } catch (err) {
                console.log(err);
            }
        };
        fetchCategories();
    }, [sendRequest]);

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError}/>
            {loadedCategories && <CategoriesList items={loadedCategories} />}
            {auth.role === "admin" && (<div className="mt-3 container-fluid">
                <Button to={`/categories/new`} inverse>
                    Add new category
                </Button>
            </div>)}

        </React.Fragment>
    );
};
export default Categories;
