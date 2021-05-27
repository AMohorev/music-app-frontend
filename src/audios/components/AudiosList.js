import React from 'react';
import AudioCard from "./AudioCard";

const AudiosList = props => {
    if (props.items.length === 0) {
        return <div>Audios not found</div>
    }

    return (
        <div className="row">
            {props.items.map((audio) => (
                <AudioCard key={audio.id} id={audio.id} name={audio.title} artist={audio.artist} image={audio.image}/>
            ))}
        </div>
    );
}

export default AudiosList;