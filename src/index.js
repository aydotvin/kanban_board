import React from "react";
import ReactDOM from "react-dom";

import RoutesManager from "./routes";

import "./style/external/bootstrap.min.css";
import "./style/styles.css";

import { Provider } from "react-redux";
// import { persistor, store } from "./state/store";
import { persistor, store } from "./state/store";
import { PersistGate } from "redux-persist/integration/react";

import enums from "./enum";
import lang from "./language/default_lang";

window.lang = lang;
window.enums = enums;

ReactDOM.render(
	<Provider store={store}>
		<PersistGate persistor={persistor}>
			<RoutesManager></RoutesManager>
		</PersistGate>
	</Provider>,
	document.getElementById("root")
);
