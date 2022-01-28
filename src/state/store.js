import { createStore } from "redux";
import reducers from "./reducers/index";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
// import persistReducer from "redux-persist/es/persistReducer";

const persistConfig = {
	key: "persistedStoreData",
	storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = createStore(persistedReducer);

const persistor = persistStore(store);

// export default store;
export { persistor, store };
// export { persistedStore };

// export default () => {
// 	let store = createStore(persistedReducer);
// 	let persistor = persistStore(store);
// 	return { store, persistor };
// };
