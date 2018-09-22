import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";

import Landing from "./Landing/Landing";
import Dashboard from "./Dashboard/Dashboard";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Route exact path="/" component={Landing} />
          <Route exact path="/builder" component={Dashboard} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
