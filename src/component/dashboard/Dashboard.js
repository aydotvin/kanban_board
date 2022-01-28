import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "./../common/Loader";
import defaultProfilePlaceholder from "./../../asset/profile_placeholder.png";

const Dashboard = (props) => {
	const navigate = useNavigate();
	const userDataInState = useSelector((state) => {
		return state.userData || {};
	});
	const taskDataInState = useSelector((state) => {
		return state.taskData || {};
	});

	const tasks = taskDataInState.tasks || {};
	const updateTasksMethod = taskDataInState.updateTasksMethod || (() => {});
	const name = userDataInState.userData.name || "";
	useEffect(() => {
		if (!!userDataInState.userData.id && (tasks["totalTaskCount"] == undefined || taskDataInState["isTaskUpdated"])) {
			updateTasksMethod({ userID: userDataInState.userData.id });
		}
	}, []);

	useEffect(() => {
		performRedirect();
	}, [userDataInState]);

	const performRedirect = () => {
		if (!userDataInState.isSignedIn) {
			console.log("Dashboard component: performRedirect() - User not signed in. Redirecting to signin.");
			return navigate("/signin");
		}
	};

	const dashboardUI = () => {
		return (
			<div className="col-xl-8 col-lg-8 col-md-8 col-sm-12 col-12 py-3 px-4">
				<div className="row my-4">
					<div className="col-12 mb-lg-0 mb-sm-3 d-flex align-items-center justify-content-lg-between justify-content-around">
						<div className="profile-picture-container">
							<img className="rounded" src={userDataInState.userData.profile_picture || defaultProfilePlaceholder} />
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col-12 d-flex align-items-center justify-content-lg-start justify-content-center">
						<h1>Welcome {name},</h1>
					</div>
					<div className="col-12 d-flex align-items-center justify-content-lg-start justify-content-center">
						<p>Here's the summary of your tasks</p>
					</div>
				</div>
				<div className="row tasks-count-container rounded m-0 mt-3">
					<div className="col-md-12">
						<div className="row total-count custom-border-bottom">
							<div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 d-flex flex-column justify-content-center align-items-center py-4">
								<span className="d-flex flex-column align-items-center">
									<h3>Total tasks</h3>
									<span className="task-count">{tasks["totalTaskCount"] != undefined ? tasks["totalTaskCount"] : <Loader></Loader>}</span>
								</span>
							</div>
							<div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 d-flex flex-column justify-content-center align-items-center py-4">
								{tasks["totalTaskCount"] != undefined ? (
									<span>
										<Link to="/task_manager" className="redirection-link d-inline h6">
											View all tasks
										</Link>
									</span>
								) : (
									<Loader></Loader>
								)}
							</div>
						</div>
						<div className="row">
							<div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 d-flex flex-column justify-content-center align-items-center py-4">
								<h3>Completed tasks</h3>
								<span className="task-count">
									{tasks[window.enums.taskStageText.COMPLETE] != undefined ? tasks[window.enums.taskStageText.COMPLETE].length : <Loader></Loader>}
								</span>
							</div>
							<div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 d-flex flex-column justify-content-center align-items-center py-4">
								<h3>Pending tasks</h3>
								<span className="task-count">{tasks["pendingTasks"] != undefined ? tasks["pendingTasks"].length : <Loader></Loader>}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className="row justify-content-center" id="dashboard">
			{dashboardUI()}
		</div>
	);
};

export default Dashboard;
