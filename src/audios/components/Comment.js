import React from "react";

import "./Comment.css";

const Comment = (props) => {

    return (
        <div className="container-fluid mb-3">
            <div className={"d-flex flex-column comment-block shadow-sm"}>
                <h4 className={"comment-block__title pt-2 ps-2"}>
                    Comment text:
                </h4>
                <h5 className={"ms-4 comment-block__text pe-1"}>
                    {props.item.text}
                </h5>
            </div>
        </div>
    );
};

export default Comment;