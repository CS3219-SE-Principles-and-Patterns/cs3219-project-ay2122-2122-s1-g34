import { ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";

import App from "app/App";
import theme from "app/theme";

// initialize firebase web sdk
import "common/utils/firebase.util";

import reportWebVitals from "./reportWebVitals";

axios.defaults.baseURL = "/api/v1";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
