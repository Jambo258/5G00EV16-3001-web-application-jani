import React from "react";

//import Button from "../../shared/components/button/Button";
import Card from "../../shared/components/card/Card";
import PlaceItem from "./PlaceItem";

import "./PlacesList.css";

const PlacesList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          <h2>No todos found.</h2>
        </Card>
      </div>
    );
  }

  return (
    <ul className="place-list">
      {props.items.map((place) => (
        <PlaceItem
          key={place.id}
          id={place.id}
          image={
            "https://visitylojarvi.fi/wp-content/uploads/2016/11/ylojarvi-seitseminen-nuotiopaikka.jpg"
          }
          title={place.title}
          creatorId={place.creatorId}
          onDelete={props.onDeletePlace}
        />
      ))}
    </ul>
  );
};

export default PlacesList;
