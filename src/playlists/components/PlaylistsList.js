import React from 'react';
import PlaylistCard from "./PlaylistCard";

const PlaylistsList = props => {
    if (props.items.length === 0) {
        return <div>Playlists not found</div>
    }

    return (
        <div className="row">
            {props.items.map((ctg) => (
                <PlaylistCard key={ctg.id} id={ctg.id} name={ctg.name} trackCount={ctg.tracks.length}/>
            ))}
        </div>
    );
}

export default PlaylistsList;