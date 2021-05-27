import React from "react";
import { Link } from "react-router-dom";

import Card from "../../shared/UI/Card";

const AudioCard = (props) => {
    return (
        <Card styles={"border-0"}>
            <Link to={`/audios/${props.id}`}>
                <div
                    style={{ backgroundColor: "#2e2e2e", borderRadius: "5px" }}
                >
                    <div
                        style={{
                            boxShadow: "0 10px 6px -6px #1e1e1e",
                            borderRadius: "5px",
                        }}
                    >
                        <img
                            src={'http://localhost:5000/' + props.image}
                            className="card-img-top"
                            alt="image"
                        />
                    </div>

                    <div className="card-body">
                        <h5 style={{ color: "white" }} className="card-title">
                            {props.name}
                        </h5>
                        <p style={{ color: "lightgrey" }} className="card-text">
                            Artist: {props.artist}
                        </p>
                    </div>
                </div>
            </Link>
        </Card>
    );
};

export default AudioCard;