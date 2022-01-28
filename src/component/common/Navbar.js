import { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getTasksDataService } from "../../service/taskManagement";

import { NAV_LINKS_POST_LOGIN as postLoginNavLinks, NAV_LINKS_PRE_LOGIN as preLoginNavLinks } from "./../../config";

const Navbar = (props) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const location = useLocation();

	const userDataInState = useSelector((state) => {
		return state.userData || {};
	});
	const isSignedIn = userDataInState.isSignedIn || false;

	useEffect(() => {
		dispatch({ type: "SET_UPDATE_TASK_METHOD", payload: { updateTasksMethod: updateTasksMethod } });
	}, []);

	const styles = {
		backgroundColor: "#007bff",
	};

	const navLinkToShow = () => {
		if (!isSignedIn) {
			return (
				<>
					{preLoginNavLinks.map((eachNavLink, index) => {
						const thePath = `/${eachNavLink}`;
						if (thePath != location.pathname) {
							return (
								<Link to={thePath} className="nav-link d-inline h6" key={index}>
									{window.lang.navbarLinkText[eachNavLink]}
								</Link>
							);
						}
					})}
				</>
			);
		} else {
			return (
				<>
					{postLoginNavLinks.map((eachNavLink, index) => {
						const thePath = `/${eachNavLink}`;
						if (thePath != location.pathname && !preLoginNavLinks.includes(location.pathname.replace("/", ""))) {
							return (
								<Link to={thePath} className="nav-link d-inline h6" key={index}>
									{window.lang.navbarLinkText[eachNavLink]}
								</Link>
							);
						}
					})}
					<Link to="#" onClick={handleSignout} className="nav-link d-inline h6">
						{window.lang.signout.buttonText}
					</Link>
				</>
			);
		}
	};

	const handleSignout = () => {
		localStorage.removeItem("jwt");
		localStorage.removeItem("persist:persistedStoreData");
		dispatch({ type: "RESET_USER_DATA" });
		dispatch({ type: "RESET_TASK_DATA" });
		// return navigate("/signin");
	};

	const updateTasksMethod = (data = {}) => {
		//	Delay to simulate API call to server.
		setTimeout(() => {
			getTasksDataService(data)
				.then((response) => {
					if (response.status) {
						dispatch({ type: "SET_ALL_TASK_DATA", payload: response.data.taskData });
						dispatch({ type: "SET_TASK_UPDATED_FLAG", payload: { isTaskUpdated: false } });
						dispatch({ type: "RESET_SELECTED_TASK_DATA" });
					}
				})
				.catch((error) => {
					console.log(`Navbar component: updateTasksMethod() - ${error.data.message}`);
				});
		}, 5000);
	};

	return (
		<div className="row justify-content-center" id="navbar" style={styles}>
			<div className="col-xl-8 col-lg-8 col-md-8 col-sm-12 col-12 py-3 px-4">
				<div className="row">
					<div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12 d-flex align-items-center justify-content-lg-start justify-content-center">
						<Link to="/" className="text-white h3 font-weight-bold m-0">
							{window.lang.application.logoText}
						</Link>
					</div>
					<div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12 d-flex align-items-center justify-content-lg-end justify-content-center">{navLinkToShow()}</div>
				</div>
			</div>
		</div>
	);
};

export default Navbar;
