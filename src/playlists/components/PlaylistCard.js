import React from 'react';
import Card from "../../shared/UI/Card";
import {Link} from "react-router-dom";

const PlaylistCard = (props) => {
    return (
        <Card styles={"border-0"}>
            <Link to={`/playlists/${props.id}/tracks`}>
                <div
                    style={{ backgroundColor: "#2e2e2e", borderRadius: "5px" }}
                >
                    <div className="card-body">
                        <h5 style={{ color: "white" }} className="card-title">
                            {props.name}
                        </h5>
                        <p style={{ color: "lightgrey" }} className="card-text">
                            Track count: {props.trackCount}
                        </p>
                    </div>
                </div>
            </Link>
        </Card>
    );
}

export default PlaylistCard;