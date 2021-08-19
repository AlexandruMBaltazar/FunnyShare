import React, { useState, useEffect } from "react";
import * as apiCalls from "../api/apiCalls";
import ProfileCard from "../components/ProfileCard";
import { connect } from "react-redux";
import PostFeed from "../components/PostFeed";
import Spinner from "../components/Spinner";

const UserPage = (props) => {
  const [user, setUser] = useState();
  const [userNotFound, setUserNotFound] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [inEditMode, setInEditMode] = useState(false);
  const [originalDisplayName, setOriginalDisplayName] = useState();
  const [pendingUpdateCall, setPendingUpdateCall] = useState(false);
  const [image, setImage] = useState();
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadUser = () => {
      const username = props.match.params.username;
      if (!username) {
        return;
      }

      setUserNotFound(false);
      setIsLoadingUser(true);

      apiCalls
        .getUser(username)
        .then((response) => {
          setUser(response.data);
          setIsLoadingUser(false);
        })
        .catch((error) => {
          setUserNotFound(true);
          setIsLoadingUser(false);
        });
    };

    loadUser();
  }, [props.match.params.username]);

  // // Whenever props changes this method will be called
  // componentDidUpdate(prevProps) {
  //   // Check if it needs to load the data again
  //   if (prevProps.match.params.username !== this.props.match.params.username) {
  //     this.loadUser();
  //   }
  // }

  const onClickCancel = () => {
    const updatedUser = { ...user };
    if (originalDisplayName !== undefined) {
      updatedUser.displayName = originalDisplayName;
    }

    setInEditMode(false);
    setUser(updatedUser);
    setOriginalDisplayName();
    setImage();
    setErrors({});
  };

  const onClickSave = () => {
    const userId = props.loggedInUser.id;

    const userUpdate = {
      displayName: user.displayName,
      image: image && image.split(",")[1],
    };

    setPendingUpdateCall(true);

    apiCalls
      .updateUser(userId, userUpdate)
      .then((response) => {
        const updatedUser = { ...user };
        updatedUser.image = response.data.image;

        setUser(updatedUser);
        setInEditMode(false);
        setOriginalDisplayName();
        setImage();
        setPendingUpdateCall(false);

        const action = {
          type: "update-success",
          payload: updatedUser,
        };
        props.dispatch(action);
      })
      .catch((error) => {
        let errors = {};
        if (error.response.data.validationErrors) {
          errors = error.response.data.validationErrors;
        }
        setErrors(errors);
        setPendingUpdateCall(false);
      });
  };

  const onChangeDisplayName = (event) => {
    const updatedUser = { ...user };

    if (originalDisplayName === undefined) {
      setOriginalDisplayName(user.displayName);
    }

    updatedUser.displayName = event.target.value;

    const updatedErrors = { ...errors };
    updatedErrors.displayName = undefined;

    setUser(updatedUser);
    setErrors(updatedErrors);
  };

  const onFileSelect = (event) => {
    if (event.target.files.length === 0) {
      return;
    }

    const updatedErrors = { ...errors };
    updatedErrors.image = undefined;

    const file = event.target.files[0];
    let reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setErrors(updatedErrors);
    };

    reader.readAsDataURL(file);
  };

  let pageContent;

  if (isLoadingUser) {
    pageContent = <Spinner />;
  } else if (userNotFound) {
    pageContent = (
      <div className="alert alert-danger text-center" role="alert">
        <div className="alert-heading">
          <i className="fas fa-exclamation-triangle fa-3x"></i>
        </div>
        <h5>User not found</h5>
      </div>
    );
  } else {
    const isEditable =
      props.loggedInUser.username === props.match.params.username;
    pageContent = user && (
      <ProfileCard
        user={user}
        isEditable={isEditable}
        inEditMode={inEditMode}
        onClickEdit={() => setInEditMode(true)}
        onClickCancel={onClickCancel}
        onClickSave={onClickSave}
        onChangeDisplayName={onChangeDisplayName}
        pendingUpdateCall={pendingUpdateCall}
        loadedImage={image}
        onFileSelect={onFileSelect}
        errors={errors}
      />
    );
  }

  return (
    <div data-testid="userpage">
      <div className="row">
        <div className="col">{pageContent}</div>
        <div className="col">
          <PostFeed user={props.match.params.username} />
        </div>
      </div>
    </div>
  );
};

UserPage.defaultProps = {
  match: {
    params: {},
  },
};

const mapStateToProps = (state) => {
  return {
    loggedInUser: state,
  };
};

export default connect(mapStateToProps)(UserPage);
