import React from "react";
import defaultPicture from "../assets/profile.png";

function ProfileImageWithDefault(props) {
  let imageSource = defaultPicture;

  if (props.image) {
    imageSource = `/images/profile/${props.image}`;
  }

  return (
    <img
      {...props}
      src={props.src || imageSource}
      onError={(e) => {
        e.target.src = defaultPicture;
      }}
    />
  );
}

export default ProfileImageWithDefault;
