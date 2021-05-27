import React from "react";

const Card = (props) => {
    return (
        <div className={`mt-5 mx-auto col-sm-3 ${props.styles}`}>
            {props.children}
        </div>
    );
};

export default Card;