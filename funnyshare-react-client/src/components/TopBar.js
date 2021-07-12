import React, { Component } from "react";
import logo from "../assets/funnyshare-logo.png";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import ProfileImageWithDefault from "./ProfileImageWithDefault";

class TopBar extends Component {
  onClickLogout = () => {
    const action = {
      type: "logout-success",
    };

    this.props.dispatch(action);
  };

  topBarLinks(isLoggedIn) {
    let links = (
      <ul className="nav navbar-nav ms-auto">
        <li className="nav-item">
          <Link to="/signup" className="nav-link">
            Sign Up
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/login" className="nav-link">
            Login
          </Link>
        </li>
      </ul>
    );

    if (this.props.user.isLoggedIn) {
      links = (
        <ul className="nav navbar-nav ms-auto">
          <li className="nav-item nav-link">
            <ProfileImageWithDefault
              className="rounded-circle me-1"
              width="32"
              height="32"
              image={this.props.user.image}
            />
            {this.props.user.displayName}
          </li>
          <li
            className="nav-item nav-link"
            onClick={this.onClickLogout}
            style={{ cursor: "pointer" }}
          >
            Logout
          </li>
          <li className="nav-item">
            <Link to={`/${this.props.user.username}`} className="nav-link">
              My Profile
            </Link>
          </li>
        </ul>
      );
    }

    return links;
  }

  render() {
    return (
      <div className="bg-white shadow-sm mb-2">
        <div className="container">
          <nav className="navbar navbar-light navbar-expand">
            <Link to="/" className="navbar-brand">
              <img src={logo} alt="FunnyShare" width="60" /> FunnyShare
            </Link>
            {this.topBarLinks(this.props.user.isLoggedIn)}
          </nav>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state,
  };
};

export default connect(mapStateToProps)(TopBar);
