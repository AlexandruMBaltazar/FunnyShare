import React from "react";
import ProfileImageWithDefault from "./ProfileImageWithDefault";
import Input from "./Input";

function ProfileCard(props) {
  const { displayName, username, image } = props.user;

  const showEditButton = props.isEditable && !props.inEditMode;

  return (
    <div className="card">
      <div className="card-header text-center">
        <ProfileImageWithDefault
          alt="profile"
          width="200"
          height="200"
          image={image}
          className="rounded-circle shadow"
        />
      </div>
      <div className="card-body text-center">
        {!props.inEditMode && <h4>{`${displayName}@${username}`}</h4>}
        {props.inEditMode && (
          <div className="mb-2">
            <Input
              value={displayName}
              label={`Change Display Name for ${username}`}
              onChange={props.onChangeDisplayName}
            />
          </div>
        )}
        {showEditButton && (
          <button
            onClick={props.onClickEdit}
            className="btn btn-outline-success"
          >
            <i className="fas fa-user-edit"></i> Edit
          </button>
        )}
        {props.inEditMode && (
          <div>
            <button onClick={props.onClickSave} className="btn btn-primary">
              <i className="fas fa-save"></i> Save
            </button>

            <button
              onClick={props.onClickCancel}
              className="btn btn-outline-secondary ms-1"
            >
              <i className="fas fa-window-close"></i> Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileCard;
