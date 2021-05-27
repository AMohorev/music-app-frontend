import React from "react";

const MainHeader = (props) => {
    return (
        <div className="mt-1">
            {props.children}
        </div>
    );
};

export default MainHeader;