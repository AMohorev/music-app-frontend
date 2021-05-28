import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import Comment from "./Comment";
import { PlayerContext } from "../../shared/context/playerContext";
import { AuthContext } from "../../shared/context/auth-context";
import Button from "../../shared/UI/Button";
import { UseHttpClient } from "../../shared/hooks/http-hook";
import Input from "../../shared/formElements/Input";
import { VALIDATOR_MINLENGTH } from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import "./AudioInfoCard.css";
import ErrorModal from "../../shared/UI/ErrorModal";

const AudioInfoCard = (props) => {
    const auth = useContext(AuthContext);
    const { setTrack } = useContext(PlayerContext);
    const { error, sendRequest, clearError } = UseHttpClient();
    const history = useHistory();
    const [comments, setComments] = useState(props.comments);

    const [formState, inputHandler] = useForm(
        {
            text: {
                value: "",
                isValid: false,
            },
        },
        false
    );

    const track = {
        url: "http://localhost:5000/" + props.track,
        cover: "http://localhost:5000/" + props.image,
        title: props.name,
        artist: [props.artist],
    };

    useEffect(() => {
        setTrack(track);
    }, []);

    const deleteAudioHandler = async () => {
        try {
            await sendRequest(
                `http://localhost:5000/api/audios/${props.id}`,
                "DELETE",
                null,
                {
                    Authorization: "Bearer " + auth.token,
                }
            );
            history.push("/audios");
        } catch (err) {}
    };

    const postCommentHandler = async (event) => {
        event.preventDefault();
        const responseData = await sendRequest(
            `http://localhost:5000/api/audios/${props.id}/comments`,
            "POST",
            JSON.stringify({
                text: formState.inputs.text.value,
                author: auth.userId,
            }),
            {
                Authorization: "Bearer " + auth.token,
                "Content-type": "application/json",
            }
        );
        const newComments = Array.from(comments);
        newComments.push(responseData.comment);
        setComments(newComments)
    };

    const addLikedAudioHandler = async () => {
        try {
            await sendRequest(
                `http://localhost:5000/api/playlists/liked/add/${props.id}`,
                "POST",
                null,
                {
                    Authorization: "Bearer " + auth.token,
                }
            );
            history.push("/audios");
        } catch (err) {}
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <div className={"d-flex flex-column mb-5"}>
                <div className={"d-flex justify-content-between audio-info"}>
                    <div className={"audio-info__image"}>
                        <img
                            className="img-fluid shadow"
                            src={"http://localhost:5000/" + props.image}
                            alt={props.name}
                        />
                    </div>
                    <div className="audio-info__options d-flex flex-column justify-content-between">
                        <div>
                            <h3 className={"audio-info__title mt-2"}>
                                {props.name}
                            </h3>
                            <p className={"audio-info__artist"}>
                                {props.artist}
                            </p>
                        </div>
                        <div className="d-flex flex-row justify-content-between">
                            <div className="d-flex flex-column justify-content-between audio-info__likes-views">
                                <div>Likes: {props.likes}</div>
                                <div>Views: {props.views}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className={
                        "float-left-sm d-flex flex-row mt-3 option-buttons"
                    }
                >
                    {auth.token && <Button onClick={addLikedAudioHandler} danger>Like</Button>}
                    {auth.role === "admin" && (
                        <Button to={`/audios/${props.id}/edit`} inverse>
                            Edit
                        </Button>
                    )}
                    {auth.role === "admin" && (
                        <Button inverse onClick={deleteAudioHandler}>
                            Delete
                        </Button>
                    )}
                </div>
                <hr />
                <h3 className={"mx-auto comments-title mb-3"}>Comments</h3>
                <div className={"d-flex flex-column container-fluid mx-auto"}>
                    {comments.map((comment) => (
                        <Comment
                            key={comment._id}
                            item={comment}
                            audioId={props.id}
                        />
                    ))}
                </div>
                {auth.token && <div className="col-sm-4 container mx-auto authentication mt-5 pb-3">
                    <form
                        onSubmit={postCommentHandler}
                        className="d-flex flex-column"
                    >
                        <Input
                            id="text"
                            element="textarea"
                            label="Add comment"
                            validators={[VALIDATOR_MINLENGTH(5)]}
                            errorText="Comment length should be > 5"
                            onInput={inputHandler}
                        />
                        <Button type="submit" disabled={!formState.isValid}>Add comment</Button>
                    </form>
                </div>}
            </div>
        </React.Fragment>
    );
};

export default AudioInfoCard;
