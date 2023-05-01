import React from "react";

// Styles
import "./collection-card.css";

// Image
import Image from 'next/image';

const CollectionCard = ({ id, name, traits, image }) => {
  return (
    <div className="collection-card">
      <Image src={image} alt={name} />
      <div className="details">
        <div className="name">
          {name}
          <div className="id">#{id}</div>
        </div>
        <div className="price-container">
          <Image src={'/weth.png'} className="wethImage" alt="eth icon" />
          <div className="price">{traits[0]?.value}</div>
        </div>
      </div>
    </div>
  );
};

export default CollectionCard;
