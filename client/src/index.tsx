import { ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { SWRConfig } from "swr";

import App from "app/App";
import { store } from "app/store";
import theme from "app/theme";

import { SocketProvider } from "common/hooks/use-socket.hook";
// initialize firebase web sdk
import "common/utils/firebase.util";

import reportWebVitals from "./reportWebVitals";

axios.defaults.baseURL = "/api/v1";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <ThemeProvider theme={theme}>
          <SocketProvider>
            <SWRConfig
              value={{
                fetcher: (url, token) =>
                  axios
                    .get(url, { headers: { token } })
                    .then((res) => res.data),
              }}
            >
              <App />
            </SWRConfig>
          </SocketProvider>
        </ThemeProvider>
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
