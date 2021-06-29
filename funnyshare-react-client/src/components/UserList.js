import React, { Component } from "react";
import * as apiCalls from "../api/apiCalls";
import UserListItem from "./UserListItem";

class UserList extends Component {
  state = {
    page: {
      content: [],
      number: 0,
      size: 3,
    },
  };

  componentDidMount() {
    this.loadData();
  }

  loadData = (requestedPage = 0) => {
    apiCalls
      .listUsers({ page: requestedPage, size: this.state.page.size })
      .then((response) => {
        this.setState({
          page: response.data,
          loadError: undefined,
        });
      })
      .catch((error) => {
        this.setState({ loadError: "User load failed" });
      });
  };

  onClickNext = () => {
    this.loadData(this.state.page.number + 1);
  };

  onClickPrevious = () => {
    this.loadData(this.state.page.number - 1);
  };

  render() {
    return (
      <div className="card">
        <h3 className="card-title m-auto">Users</h3>
        <div className="list-group list-group-flush" data-testid="usergroup">
          {this.state.page.content.map((user) => {
            return <UserListItem key={user.username} user={user} />;
          })}
        </div>
        <div className="p-2">
          {!this.state.page.first && (
            <span
              className="badge bg-light text-dark float-start"
              style={{ cursor: "pointer" }}
              onClick={this.onClickPrevious}
            >
              {" "}
              Previous Page{" "}
            </span>
          )}
          {!this.state.page.last && (
            <span
              className="badge bg-light text-dark float-end"
              style={{ cursor: "pointer" }}
              onClick={this.onClickNext}
            >
              {" "}
              Next Page{" "}
            </span>
          )}
        </div>
        {this.state.loadError && (
          <span className="text-danger text-center">
            {this.state.loadError}
          </span>
        )}
      </div>
    );
  }
}

export default UserList;
