import { API } from "./../config";

const getTasksOfUserApi = (data = {}) => {
	return fetch(`${API}/tasks_list?${data.query}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => {
			console.log(err);
		});
};

const deleteTaskByIDApi = (data = {}) => {
	return fetch(`${API}/tasks_list/${data.taskID}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => {
			console.log(err);
		});
};

const moveTaskStageApi = (data = {}) => {
	return fetch(`${API}/tasks_list/${data.id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => {
			console.log(err);
		});
};

const addNewTaskApi = (data = {}) => {
	const formData = data.formData;
	const apiEndpoint = data.apiEndpoint;
	const apiMethod = data.apiMethod;
	return fetch(`${API}/${apiEndpoint}`, {
		method: apiMethod,
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(formData),
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => {
			console.log(err);
		});
};

export { getTasksOfUserApi, deleteTaskByIDApi, moveTaskStageApi, addNewTaskApi };
