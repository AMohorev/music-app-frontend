import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";

import { UseHttpClient } from "../../shared/hooks/http-hook";
import AudiosList from "../components/AudiosList";
import Button from "../../shared/UI/Button";
import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/UI/ErrorModal";
import Modal from "../../shared/UI/Modal";

const CategoryAudio = (props) => {
    const [loadedAudios, setLoadedAudios] = useState();

    const { categoryId } = useParams();
    const { error, sendRequest, clearError } = UseHttpClient();
    const auth = useContext(AuthContext);
    const history = useHistory();
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

    const showDeleteConfirmModalHandler = () => setConfirmDeleteModal(true);
    const cancelDeleteHandler = () => setConfirmDeleteModal(false);

    useEffect(() => {
        const fetchAudios = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:5000/api/categories/${categoryId}`
                );
                setLoadedAudios(responseData.category);
            } catch (err) {
                console.log(err);
            }
        };

        fetchAudios();
    }, [sendRequest]);

    const deleteCategoryHandler = async () => {
        try {
            await sendRequest(
                `http://localhost:5000/api/categories/${categoryId}`,
                "DELETE",
                null,
                {
                    Authorization: "Bearer " + auth.token,
                }
            );
            history.push("/categories");
        } catch (err) {}
    };

    return (
        <div className="mt-5 container">
            <ErrorModal error={error} onClear={clearError} />
            <Modal
                show={confirmDeleteModal}
                onCancel={cancelDeleteHandler}
                header="Are you sure?"
                footer={
                    <Button inverse onClick={deleteCategoryHandler}>
                        Delete
                    </Button>
                }
            >
                <p>Do you want to delete?</p>
            </Modal>
            {loadedAudios && (
                <div className="col text-center container-fluid center-block">
                    <div className="mx-auto">
                        <img
                            style={{ width: "200px", height: "200px" }}
                            className="rounded-circle"
                            src="http://localhost:5000/uploads/pictures/music.png"
                            alt=""
                        />
                        <h3
                            style={{ color: "white" }}
                            className="text-center mt-1"
                        >
                            {loadedAudios.categoryName}
                        </h3>
                        {auth.role === "admin" && (
                            <div
                                className="ms-3 d-flex flex-column justify-content-between"
                                style={{ height: "150px" }}
                            >
                                <Button
                                    to={`/categories/edit/${loadedAudios.categoryId}`}
                                    inverse
                                >
                                    Edit
                                </Button>
                                <Button
                                    to={`/categories/${loadedAudios.categoryId}/newTrack`}
                                    inverse
                                >
                                    Add track
                                </Button>
                                <Button
                                    inverse
                                    onClick={showDeleteConfirmModalHandler}
                                >
                                    Delete
                                </Button>
                            </div>
                        )}
                    </div>

                    <AudiosList items={loadedAudios.categoryTracks} />
                </div>
            )}
        </div>
    );
};
export default CategoryAudio;
