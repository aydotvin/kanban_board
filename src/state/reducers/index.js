import { combineReducers } from "redux";
import userDataReducer from "./userDataReducer";
import { tasksReducer, addTaskReducer, taskUpdateFlagsReducer } from "./tasksReducer";
import { userSignupReducer, userSigninReducer } from "./userAuthenticationReducer";

const reducers = combineReducers({
	userData: userDataReducer,
	userSignup: userSignupReducer,
	userSignin: userSigninReducer,
	taskData: tasksReducer,
	taskAddEditData: addTaskReducer,
	taskUpdateFlagsData: taskUpdateFlagsReducer,
});

export default reducers;
