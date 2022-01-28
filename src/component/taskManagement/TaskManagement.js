import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { deleteTaskService, moveTaskStageService, addNewTaskService } from "../../service/taskManagement";
import { getKeyByValue, clearErrorSpans } from "../../helper/utility_methods";

import { taskStages } from "../../config";
import defaultProfilePlaceholder from "./../../asset/profile_placeholder.png";
import dragDelete from "./../../asset/delete_64.png";

import Task from "./Task";
import ModalBox from "../common/Modal";
import AddEditTask from "./AddEditTask";

const TaskManagement = (props) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const userDataInState = useSelector((state) => {
		return state.userData || {};
	});

	const taskDataInState = useSelector((state) => {
		return state.taskData || {};
	});

	const taskAddEditData = useSelector((state) => {
		return state.taskAddEditData || {};
	});
	const taskFormData = taskAddEditData.taskFormData || {};

	const taskUpdateFlagsData = useSelector((state) => {
		return state.taskUpdateFlagsData || {};
	});

	const tasks = taskDataInState.tasks || {};
	const showConfirmationModal = taskDataInState.showConfirmationModal || false;
	const showLoadingModal = taskDataInState.showLoadingModal || false;
	const showTaskUpdateConfirmationModal = showConfirmationModal || showLoadingModal;
	const showAddEditModal = taskDataInState.showAddEditModal || false;
	const modalType = taskDataInState.modalType || "";
	const currentTaskData = taskDataInState.currentTaskData || {};
	const updateTasksMethod = taskDataInState.updateTasksMethod || (() => {});
	const confirmModalData = taskDataInState.confirmModalData || {};

	const deleteTask = taskUpdateFlagsData.deleteTask;
	const moveTask = taskUpdateFlagsData.moveTask;
	const addTask = taskUpdateFlagsData.addTask;
	const editTask = taskUpdateFlagsData.editTask;

	useEffect(() => {
		performRedirect(userDataInState);
	}, [userDataInState]);

	useEffect(() => {
		dispatch({ type: "RESET_ADD_NEW_TASK_FORM_DATA" });
		dispatch({ type: "RESET_SELECTED_TASK_DATA" });
		// clearErrorSpans("#add_edit_task");
	}, []);

	useEffect(() => {
		if (moveTask) {
			handleTaskStageUpdate();
		} else if (deleteTask) {
			handleDeleteTaskModalConfirm();
		} else if (addTask) {
			handleAddEditTaskModalConfirm();
		} else if (editTask) {
			handleAddEditTaskModalConfirm();
		}
	}, [deleteTask, moveTask, addTask, editTask]);

	const performRedirect = (userObject) => {
		if (!userObject.isSignedIn) {
			console.log("Dashboard component: performRedirect() - User not signed in. Redirecting to signin.");
			return navigate("/signin");
		}
	};

	const handleHardRefresh = () => {
		dispatch({ type: "SET_TASK_UPDATED_FLAG", payload: { isTaskUpdated: true } });
		dispatch({ type: "SET_SHOW_LOADING_MODAL" });
		dispatch({ type: "SET_MODAL_TYPE", payload: { modalType: window.enums.modalType.LOADING_MODAL } });
		updateTasksMethod({ userID: userDataInState.userData.id });
	};

	const handleDeleteTaskModalOpen = () => {
		console.log("modal opened");
	};
	const handleTaskUpdateModalClose = () => {
		console.log("modal closed");
		dispatch({ type: "RESET_SELECTED_TASK_DATA" });
		dispatch({ type: "SET_CONFIRM_MODAL_DATA", payload: { confirmModalData: {} } });
	};

	//	MODAL CONFIRMATION HANDLERS START
	const handleDeleteTaskModalConfirm = () => {
		dispatch({ type: "RESET_TASK_UPDATE_FLAGS" });
		if (currentTaskData.id) {
			deleteTaskService({ taskID: currentTaskData.id })
				.then((response) => {
					if (response.status) {
						dispatch({ type: "RESET_SELECTED_TASK_DATA" });
						dispatch({ type: "SET_SHOW_LOADING_MODAL" });
						dispatch({ type: "SET_MODAL_TYPE", payload: { modalType: window.enums.modalType.LOADING_MODAL } });
						handleHardRefresh();
						dispatch({ type: "SET_TASK_UPDATE_FLAG", payload: { deleteTask: false } });
					}
				})
				.catch((error) => {
					console.log(error);
				});
		}
	};

	const handleTaskStageUpdate = () => {
		dispatch({ type: "RESET_TASK_UPDATE_FLAGS" });
		moveTaskStageService(currentTaskData)
			.then((response) => {
				if (response.status) {
					dispatch({ type: "RESET_SELECTED_TASK_DATA" });
					dispatch({ type: "SET_SHOW_LOADING_MODAL" });
					dispatch({ type: "SET_MODAL_TYPE", payload: { modalType: window.enums.modalType.LOADING_MODAL } });
					handleHardRefresh();
					dispatch({ type: "SET_TASK_UPDATE_FLAG", payload: { moveTask: false } });
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const handleAddEditTaskModalConfirm = () => {
		dispatch({ type: "RESET_TASK_UPDATE_FLAGS" });
		addNewTaskService({
			taskFormData: { ...taskFormData, userId: userDataInState.userData.id },
			addEditUpdateType: taskAddEditData.addEditUpdateType,
			allTasks: tasks.allTasks,
		})
			.then((response) => {
				if (response.status) {
					dispatch({ type: "RESET_SELECTED_TASK_DATA" });
					dispatch({ type: "SET_SHOW_LOADING_MODAL" });
					dispatch({ type: "SET_MODAL_TYPE", payload: { modalType: window.enums.modalType.LOADING_MODAL } });
					dispatch({ type: "RESET_ADD_NEW_TASK_FORM_DATA" });
					handleHardRefresh();
					dispatch({ type: "SET_TASK_UPDATE_FLAG", payload: { addTask: false } });
					dispatch({ type: "SET_TASK_UPDATE_FLAG", payload: { editTask: false } });
				}
			})
			.catch((error) => {
				if (error.code == 409) {
					document.querySelector(`#add_edit_task .form-control[name="task_name"] + span.error`).textContent = error.data.message;
					document.querySelector(`#add_edit_task .form-control[name="task_name"] + span.error`).style.display = "block";
				} else {
					document.querySelector(`#signin_form div.alert-danger`).textContent = error.data.message;
					document.querySelector(`#signin_form div.alert-danger`).style.display = "block";
				}
				console.log(error);
			});
	};
	//	MODAL CONFIRMATION HANDLERS END

	//	TASK BUTTON HANDLERS START
	const handleBackButton = (e) => {
		const taskContainer = e.target.closest(".each-task-container");
		if (taskContainer) {
			const taskData = JSON.parse(taskContainer.getAttribute("data_task_json") || "{}");
			const taskEnum = taskContainer.getAttribute("data_task_stage_enum") || "";
			const currentTaskNumber = getKeyByValue(window.enums.taskStage, taskEnum);
			const currentTaskStage = window.lang.taskStageHeadings[taskEnum] || "";
			const nextTaskStage = window.lang.taskStageHeadings[window.enums.taskStage[+currentTaskNumber - 1]] || "";
			taskData["nextStage"] = +currentTaskNumber - 1;
			let dataForconfirmModal = {
				modalTitleText: taskData.task_name,
				modalTitleClass: "text-center",
				modalBodyText: `Are you sure you want to move this task from ${currentTaskStage} to ${nextTaskStage}?`,
				confirmButtonText: "Yes",
				cancelButtonText: "No",
				classForCancelButton: "btn-outline-primary ",
				classForConfirmButton: "btn-primary ",
				handlerForCancelButton: handleTaskUpdateModalClose,
				handlerForConfirmButton: () => {
					dispatch({ type: "SET_TASK_UPDATE_FLAG", payload: { moveTask: true } });
				},
			};
			dispatch({ type: "SET_CONFIRM_MODAL_DATA", payload: { confirmModalData: dataForconfirmModal } });
			dispatch({ type: "SET_SELECTED_TASK_DATA", payload: { currentTaskData: taskData } });
			dispatch({ type: "SET_MODAL_TYPE", payload: { modalType: window.enums.modalType.CONFIRM_MODAL } });
			dispatch({ type: "SET_SHOW_CONFIRMATION_MODAL" });
		}
	};
	const handleEditButton = (e) => {
		const taskContainer = e.target.closest(".each-task-container");
		if (taskContainer) {
			const taskData = JSON.parse(taskContainer.getAttribute("data_task_json") || "{}");
			dispatch({ type: "SET_SHOW_ADD_EDIT_TASK_MODAL" });
			dispatch({ type: "UPDATE_ADD_NEW_TASK_FORM_DATA", payload: taskData });
			dispatch({
				type: "SET_ADD_EDIT_CONFIRM_HANDLER",
				payload: {
					handlerForAddEditConfirm: () => {
						dispatch({ type: "SET_TASK_UPDATE_FLAG", payload: { editTask: true } });
					},
				},
			});
			dispatch({
				type: "SET_ADD_EDIT_UPDATE_TYPE",
				payload: { addEditUpdateType: "EDIT" },
			});
		}
	};
	const handleDeleteButton = (e) => {
		const taskContainer = e.target.closest(".each-task-container");
		if (taskContainer) {
			const taskData = JSON.parse(taskContainer.getAttribute("data_task_json") || "{}");
			setStateDataForTaskDelete({ taskData });
		}
	};
	const setStateDataForTaskDelete = (data = {}) => {
		const { taskData } = data;
		let dataForconfirmModal = {
			modalTitleText: taskData.task_name,
			modalTitleClass: "text-center",
			modalBodyText: `Are you sure you want to delete this task?`,
			confirmButtonText: "Yes",
			cancelButtonText: "No",
			classForCancelButton: "btn-outline-primary ",
			classForConfirmButton: "btn-danger ",
			handlerForConfirmButton: () => {
				dispatch({ type: "SET_TASK_UPDATE_FLAG", payload: { deleteTask: true } });
			},
			handlerForCancelButton: handleTaskUpdateModalClose,
		};
		dispatch({ type: "SET_CONFIRM_MODAL_DATA", payload: { confirmModalData: dataForconfirmModal } });
		dispatch({ type: "SET_SELECTED_TASK_DATA", payload: { currentTaskData: taskData } });
		dispatch({ type: "SET_MODAL_TYPE", payload: { modalType: window.enums.modalType.CONFIRM_MODAL } });
		dispatch({ type: "SET_SHOW_CONFIRMATION_MODAL" });
	};
	const handleForwardButton = (e) => {
		const taskContainer = e.target.closest(".each-task-container");
		if (taskContainer) {
			const taskData = JSON.parse(taskContainer.getAttribute("data_task_json") || "{}");
			const taskEnum = taskContainer.getAttribute("data_task_stage_enum") || "";
			const currentTaskNumber = getKeyByValue(window.enums.taskStage, taskEnum);
			const currentTaskStage = window.lang.taskStageHeadings[taskEnum] || "";
			const nextTaskStage = window.lang.taskStageHeadings[window.enums.taskStage[+currentTaskNumber + 1]] || "";
			taskData["nextStage"] = +currentTaskNumber + 1;
			let dataForconfirmModal = {
				modalTitleText: taskData.task_name,
				modalTitleClass: "text-center",
				modalBodyText: `Are you sure you want to move this task from ${currentTaskStage} to ${nextTaskStage}?`,
				confirmButtonText: "Yes",
				cancelButtonText: "No",
				classForCancelButton: "btn-outline-primary ",
				classForConfirmButton: "btn-primary ",
				handlerForCancelButton: handleTaskUpdateModalClose,
				handlerForConfirmButton: () => {
					dispatch({ type: "SET_TASK_UPDATE_FLAG", payload: { moveTask: true } });
				},
			};
			dispatch({ type: "SET_CONFIRM_MODAL_DATA", payload: { confirmModalData: dataForconfirmModal } });
			dispatch({ type: "SET_SELECTED_TASK_DATA", payload: { currentTaskData: taskData } });
			dispatch({ type: "SET_MODAL_TYPE", payload: { modalType: window.enums.modalType.CONFIRM_MODAL } });
			dispatch({ type: "SET_SHOW_CONFIRMATION_MODAL" });
		}
	};
	const handleAddNewTask = (e) => {
		dispatch({ type: "SET_SHOW_ADD_EDIT_TASK_MODAL" });
		dispatch({
			type: "SET_ADD_EDIT_CONFIRM_HANDLER",
			payload: {
				handlerForAddEditConfirm: () => {
					dispatch({ type: "SET_TASK_UPDATE_FLAG", payload: { addTask: true } });
				},
			},
		});
		dispatch({
			type: "SET_ADD_EDIT_UPDATE_TYPE",
			payload: { addEditUpdateType: "NEW" },
		});
		dispatch({ type: "RESET_ADD_NEW_TASK_FORM_DATA" });
	};
	const handleDragNDropOfTask = (data = {}) => {
		const { draggedTaskData, newStageNumber } = data;
		const currentStage = window.enums.taskStage[draggedTaskData.task_stage];
		const targetStage = window.enums.taskStage[newStageNumber];
		const currentTaskStageText = window.lang.taskStageHeadings[currentStage];
		const nextTaskStageText = window.lang.taskStageHeadings[targetStage];
		draggedTaskData["nextStage"] = newStageNumber;
		if (currentStage != targetStage) {
			let dataForconfirmModal = {
				modalTitleText: draggedTaskData.task_name,
				modalTitleClass: "text-center",
				modalBodyText: `Are you sure you want to move this task from ${currentTaskStageText} to ${nextTaskStageText}?`,
				confirmButtonText: "Yes",
				cancelButtonText: "No",
				classForCancelButton: "btn-outline-primary ",
				classForConfirmButton: "btn-primary ",
				handlerForCancelButton: handleTaskUpdateModalClose,
				handlerForConfirmButton: () => {
					dispatch({ type: "SET_TASK_UPDATE_FLAG", payload: { moveTask: true } });
				},
			};
			dispatch({ type: "SET_CONFIRM_MODAL_DATA", payload: { confirmModalData: dataForconfirmModal } });
			dispatch({ type: "SET_SELECTED_TASK_DATA", payload: { currentTaskData: draggedTaskData } });
			dispatch({ type: "SET_MODAL_TYPE", payload: { modalType: window.enums.modalType.CONFIRM_MODAL } });
			dispatch({ type: "SET_SHOW_CONFIRMATION_MODAL" });
		}
	};

	const handleDragAndDeleteOfTask = (data = {}) => {
		setStateDataForTaskDelete(data);
	};
	//	TASK BUTTON HANDLERS END

	const TaskManagementUI = () => {
		return (
			<div className="col-xl-8 col-lg-8 col-md-8 col-sm-12 col-12 py-3 px-4">
				<div className="row my-4">
					<div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12 mb-lg-0 mb-sm-3 d-flex align-items-center justify-content-lg-start justify-content-around">
						<div className="profile-picture-container mr-4">
							<img className="rounded" src={userDataInState.userData.profile_picture || defaultProfilePlaceholder} />
						</div>
						<h2>{userDataInState.userData.name}</h2>
					</div>
				</div>
				<div className="row">
					<div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12 d-flex align-items-center justify-content-lg-start justify-content-center">
						<h3>Here's the list of all your tasks</h3>
					</div>
					<div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12 d-flex  justify-content-lg-end justify-content-around align-items-center">
						<Link to="#" onClick={handleAddNewTask} className="redirection-link d-inline h6">
							Add New Task
						</Link>
						<Link to="#" onClick={handleHardRefresh} className="redirection-link d-inline h6">
							Refresh List
						</Link>
					</div>
					<div className="col-md-12 d-flex justify-content-between align-items-center"></div>
				</div>

				<div className="row tasks-container rounded m-0 mt-3">
					<div className="col-md-12">
						<div className="row">
							{taskStages.map((eachStage) => {
								if (tasks[eachStage] != undefined) {
									return (
										<div
											className="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12 d-flex flex-column justify-content-start align-items-center custom-border-right task-status-header drop_target"
											key={eachStage}
											data_stage_enum={eachStage}
											onDrop={(ev) => {
												let droppedStageContainer = ev.target.closest(".drop_target");
												const taskEnum = droppedStageContainer.getAttribute("data_stage_enum");
												const newStageNumber = getKeyByValue(window.enums.taskStage, taskEnum);
												let draggedTaskData = JSON.parse(ev.dataTransfer.getData("draggedTaskData"));
												handleDragNDropOfTask({ draggedTaskData, newStageNumber });
											}}
											onDragOver={(ev) => {
												ev.stopPropagation();
												ev.preventDefault();
											}}
										>
											<div className="row">
												<div className="col-md-12">
													<h4 className="p-3 stage_heading">{window.lang.taskStageHeadings[eachStage]}</h4>
												</div>
											</div>
											{tasks[eachStage].length == 0 ? (
												<div className="row custom-border-top pt-3 w-100">
													<div className="col-md-12 text-center mb-3 px-2 py-3">No tasks</div>
												</div>
											) : (
												<div className="row custom-border-top pt-3 w-100">
													<div className="col-md-12">
														{tasks[eachStage].map((eachTask) => {
															return (
																<Task
																	key={eachTask.id}
																	data={{
																		taskName: eachTask.task_name,
																		taskPriority: window.lang.taskPriorityText[eachTask.task_priority],
																		taskDeadline: eachTask.task_deadline,
																		additionalAttributes: {
																			data_task_name: eachTask.task_name,
																			data_task_stage: eachTask.task_stage,
																			data_task_priority: eachTask.task_priority,
																			data_task_deadline: eachTask.task_deadline,
																			data_task_id: eachTask.taskId,
																			data_actual_id: eachTask.id,
																			data_user_id: eachTask.userId,
																			data_task_json: JSON.stringify(eachTask),
																			data_task_stage_enum: eachStage,
																		},
																		handleBackButton,
																		handleEditButton,
																		handleDeleteButton,
																		handleForwardButton,
																	}}
																></Task>
															);
														})}
													</div>
												</div>
											)}
										</div>
									);
								}
							})}
						</div>
					</div>
				</div>
				{dragAndDeleteUI()}
			</div>
		);
	};

	const dragAndDeleteUI = () => {
		let dragAndDeleteUI = "";
		if (taskUpdateFlagsData.isTaskDragged) {
			dragAndDeleteUI = (
				<div
					className="drag-delete-container"
					onDrop={(ev) => {
						let draggedTaskData = JSON.parse(ev.dataTransfer.getData("draggedTaskData"));
						handleDragAndDeleteOfTask({ taskData: draggedTaskData });
					}}
					onDragOver={(ev) => {
						ev.stopPropagation();
						ev.preventDefault();
					}}
				>
					<div className="text-center drag-icon-container rounded">
						<img src={dragDelete} alt="delete icon" className="drag-delete-icon py-4" />
					</div>
				</div>
			);
		}
		return dragAndDeleteUI;
	};

	return (
		<div className="row justify-content-center" id="task_manager">
			{TaskManagementUI()}
			<ModalBox
				data={{
					isOpen: showTaskUpdateConfirmationModal,
					onAfterOpen: handleDeleteTaskModalOpen,
					onRequestClose: handleTaskUpdateModalClose,
					contentLabel: "Confirmation modal",
					modalType: modalType,
					modalData: {
						modalID: confirmModalData.modalID,
						modalTitleText: confirmModalData.modalTitleText,
						modalTitleClass: confirmModalData.modalTitleClass,
						modalBodyText: confirmModalData.modalBodyText,
						modalBodyClass: confirmModalData.modalBodyClass,
						confirmButtonText: confirmModalData.confirmButtonText,
						confirmButtonClass: confirmModalData.classForConfirmButton,
						confirmButtonName: confirmModalData.nameForConfirmButton,
						cancelButtonText: confirmModalData.cancelButtonText,
						cancelButtonClass: confirmModalData.classForCancelButton,
						cancelButtonName: confirmModalData.nameForCancelButton,
						loadingMessage: confirmModalData.loadingMessage,
						handlerForCancelButton: confirmModalData.handlerForCancelButton,
						handlerForConfirmButton: confirmModalData.handlerForConfirmButton,
					},
				}}
			></ModalBox>
			<AddEditTask
				data={{
					isOpen: showAddEditModal,
					onAfterOpen: handleDeleteTaskModalOpen,
					onRequestClose: handleTaskUpdateModalClose,
					contentLabel: "Add/Update new task",
					handlerForCancelButton: handleTaskUpdateModalClose,
					handlerForConfirmButton: taskAddEditData.handlerForAddEditConfirm,
					updateType: taskAddEditData.addEditUpdateType,
				}}
			></AddEditTask>
		</div>
	);
};

export default TaskManagement;
