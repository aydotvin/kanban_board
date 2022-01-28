import { getTasksOfUserApi, deleteTaskByIDApi, moveTaskStageApi, addNewTaskApi } from "../model/taskManagement";
import { validateData } from "../helper/utility_methods";

const getTasksDataService = (data = {}) => {
	return new Promise((resolve, reject) => {
		let finalTasksObject = {};
		const userID = data.userID;
		if (!!userID) {
			data["query"] = `userId=${userID}`;
			getTasksOfUserApi(data)
				.then((response) => {
					let backlogTasks = [];
					let todoTasks = [];
					let onGoingTasks = [];
					let completedTasks = [];
					finalTasksObject["totalTaskCount"] = response.length;
					finalTasksObject["allTasks"] = response;
					finalTasksObject["pendingTasks"] = response.filter((eachTask) => {
						switch (eachTask.task_stage.toString()) {
							case "0":
								backlogTasks.push(eachTask);
								break;
							case "1":
								todoTasks.push(eachTask);
								break;
							case "2":
								onGoingTasks.push(eachTask);
								break;
							case "3":
								completedTasks.push(eachTask);
								break;
							default:
								break;
						}
						if (eachTask.task_stage != "3") {
							return eachTask;
						}
					});
					finalTasksObject[window.enums.taskStageText.BACKLOG] = backlogTasks;
					finalTasksObject[window.enums.taskStageText.TO_DO] = todoTasks;
					finalTasksObject[window.enums.taskStageText.ON_GOING] = onGoingTasks;
					finalTasksObject[window.enums.taskStageText.COMPLETE] = completedTasks;
					resolve({ status: true, data: { taskData: finalTasksObject } });
				})
				.catch((error) => {
					reject({ status: false, data: { error, message: window.lang.responseMessages.taskManagement.errorInGettingTasks } });
				});
		} else {
			reject({ status: false, data: { message: window.lang.responseMessages.taskManagement.userIdRequiredForGettingTasks } });
		}
	});
};

const deleteTaskService = (data = {}) => {
	return new Promise((resolve, reject) => {
		if (!!data.taskID) {
			deleteTaskByIDApi(data)
				.then((response) => {
					resolve({ status: true, data: { message: "Delete successful." } });
				})
				.catch((error) => {
					reject({ status: false, data: { error, message: "Delete failed." } });
				});
		} else {
			reject({ status: false, data: { message: "Task ID is required to delete a task." } });
		}
	});
};

const moveTaskStageService = (data = {}) => {
	return new Promise((resolve, reject) => {
		let newTaskData = { ...data, task_stage: data.nextStage };
		delete newTaskData.nextStage;
		if (!!newTaskData.id) {
			moveTaskStageApi(newTaskData)
				.then((response) => {
					resolve({ status: true });
				})
				.catch((error) => {
					reject({ status: false, data: error });
				});
		} else {
			reject({ status: false, data: { message: "Task ID is required to move a task." } });
		}
	});
};

const addNewTaskService = (data = {}) => {
	return new Promise((resolve, reject) => {
		const formData = data.taskFormData;
		const addEditUpdateType = data.addEditUpdateType;
		let newTaskValidations = {
			task_name: {
				required: true,
			},
			task_priority: {
				required: true,
			},
			task_deadline: {
				required: true,
			},
		};
		let validateResponse = validateData(newTaskValidations, formData);

		if (validateResponse.status === false) {
			let errors = validateResponse.error;
			for (const error in errors) {
				document.querySelector(`#add_edit_task .form-control[name="${error}"] + span.error`).textContent = errors[error];
				document.querySelector(`#add_edit_task .form-control[name="${error}"] + span.error`).style.display = "block";
			}
			reject({ status: false });
		} else {
			const queryForTaskNameDuplicateCheck = `userId=${formData.userId}&task_name=${formData.task_name}`;
			getTasksOfUserApi({ query: queryForTaskNameDuplicateCheck })
				.then((response) => {
					if (response.length > 0 && addEditUpdateType == "NEW") {
						reject({ status: false, code: 409, data: { message: window.lang.responseMessages.taskManagement.duplicateTaskName } });
					} else {
						let apiEndpoint = "tasks_list";
						let apiMethod = "POST";
						if (addEditUpdateType == "EDIT") {
							apiEndpoint = `tasks_list/${formData.id}`;
							apiMethod = "PUT";
						}
						addNewTaskApi({ formData, apiEndpoint, apiMethod })
							.then((response) => {
								resolve({ status: true, data: { message: window.lang.responseMessages.taskManagement.taskUpdateSuccessText } });
							})
							.catch((error) => {
								reject({ status: false, data: { error, message: window.lang.responseMessages.taskManagement.taskUpdateFailText } });
							});
					}
				})
				.catch((error) => {
					reject({ status: false, data: { message: window.lang.responseMessages.taskManagement.taskUpdateFailText } });
				});
		}
	});
};

export { getTasksDataService, deleteTaskService, moveTaskStageService, addNewTaskService };
