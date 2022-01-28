import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { isAuthenticated } from "./service/userManagement";

// IMPORT COMPONENTS START
import App from "./component/App";
import Signup from "./component/userManagement/Signup";
import Signin from "./component/userManagement/Signin";
import Dashboard from "./component/dashboard/Dashboard";
import TaskManagement from "./component/taskManagement/TaskManagement";
// IMPORT COMPONENTS END

const RoutesManager = () => {
	const dispatch = useDispatch();
	const userData = isAuthenticated();
	const userDataInState = useSelector((state) => {
		return state.userData || {};
	});
	if (userData.isUserValidated && !userDataInState.isSignedIn) {
		dispatch({ type: "SET_USER_DATA", payload: { isSignedIn: true, userData: userData } });
	}

	return (
		<Router>
			<Routes>
				<Route path="/" element={<App />}></Route>
				<Route
					path="/signup"
					element={
						<App>
							<Signup />
						</App>
					}
				></Route>
				<Route
					path="/signin"
					element={
						<App>
							<Signin />
						</App>
					}
				></Route>
				<Route
					path="/dashboard"
					element={
						<App>
							<Dashboard />
						</App>
					}
				></Route>
				<Route
					path="/task_manager"
					element={
						<App>
							<TaskManagement />
						</App>
					}
				></Route>
			</Routes>
		</Router>
	);
};

export default RoutesManager;
