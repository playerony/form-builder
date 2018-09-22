import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";

import Landing from "./Landing/Landing";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Route exact path="/" component={Landing} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
