import axios from "axios";
import { API } from "./../config";

const signupApi = (data = {}) => {
	return fetch(`${API}/users_list`, {
		method: "POST",
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

const signinApi = (data = {}) => {
	return fetch(`${API}/users_list?${data.signinQuery}`, {
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

const checkDuplicateSignup = (data = {}) => {
	const isDuplicateUsername = axios.get(`${API}/users_list?username=${data.username}`);
	const isDuplicateEmail = axios.get(`${API}/users_list?email=${data.email}`);
	return Promise.all([isDuplicateUsername, isDuplicateEmail]).then((response) => {
		return response;
	});
};

//	Return fake JWT as JWT creation is done only in server.
const generateAccessToken = (data = {}) => {
	return window.btoa(JSON.stringify(data));
};

export { signupApi, signinApi, generateAccessToken, checkDuplicateSignup };
