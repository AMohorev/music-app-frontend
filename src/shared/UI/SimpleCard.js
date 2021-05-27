import React from 'react';

const SimpleCard = props => {
    return (
        <div className="d-flex flex-row justify-content-between mt-5">
            {props.children}
        </div>
    )
}

export default SimpleCard;