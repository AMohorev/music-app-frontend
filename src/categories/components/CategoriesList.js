import React from "react";

import CategoryCard from "./CategoryCard";

const CategoriesList = (props) => {
    if (props.items.length === 0) {
        return <div>Categories not found</div>;
    }

    return (
        <div className="row">
            {props.items.map((ctg) => (
                <CategoryCard key={ctg.id} id={ctg.id} name={ctg.name} trackCount={ctg.tracks.length}/>
            ))}
        </div>
    );
};

export default CategoriesList;
