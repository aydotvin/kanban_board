import { signupApi, signinApi, generateAccessToken, checkDuplicateSignup } from "../model/userManagement";
import { validateData, deleteObjectProperties, validateEmail } from "../helper/utility_methods";
import bcrypt from "bcryptjs";

const signupService = (data = {}) => {
	return new Promise((resolve, reject) => {
		let signupValidations = {
			name: {
				required: true,
				minLength: 3,
				maxLength: 32,
				regex: "",
			},
			username: {
				required: true,
				minLength: 3,
				maxLength: 32,
				regex: "%5E%5Ba-z0-9%5D%2B%24",
			},
			email: {
				required: true,
				minLength: 3,
				maxLength: 50,
				regex: "",
			},
			password: {
				required: true,
				minLength: 7,
				maxLength: 20,
			},
			contact: {
				regex: "%5Ed%2B%24",
			},
		};

		let validateResponse = validateData(signupValidations, data);
		if (validateResponse.status === false) {
			let errors = validateResponse.error;
			for (const error in errors) {
				document.querySelector(`#signup_form input[name="${error}"] + span.error`).textContent = errors[error];
				document.querySelector(`#signup_form input[name="${error}"] + span.error`).style.display = "block";
			}
			reject({ status: false, code: 412, data: { message: window.lang.responseMessages.validationError } });
		} else {
			let password = data.password;
			let salt = bcrypt.genSaltSync(10);
			password = bcrypt.hashSync(password, salt);
			data["hashedPassword"] = password;
			delete data.password;
			delete data.showSubmitButtonLoader;
			checkDuplicateSignup(data).then((response) => {
				const usernameResponse = response[0];
				const emailResponse = response[1];
				if (usernameResponse.data.length > 0) {
					reject({ status: false, data: { message: window.lang.responseMessages.userAuth.duplicateUsername } });
				} else if (emailResponse.data.length > 0) {
					reject({ status: false, data: { message: window.lang.responseMessages.userAuth.duplicateEmail } });
				} else {
					signupApi(data)
						.then((userData) => {
							resolve({ status: true, data: { message: window.lang.responseMessages.userAuth.signupSuccess } });
						})
						.catch((error) => {
							console.log(error);
							console.log("^error caught in signupService()");
							reject({ status: false, data: { error, message: window.lang.responseMessages.userAuth.signupFailure } });
						});
				}
			});
		}
	});
};

const signinService = (data = {}) => {
	return new Promise((resolve, reject) => {
		let signinValidations = {
			email_or_username: {
				required: true,
			},
			password: {
				required: true,
			},
		};
		let validateResponse = validateData(signinValidations, data);
		if (validateResponse.status === false) {
			let errors = validateResponse.error;
			for (const error in errors) {
				document.querySelector(`#signin_form input[name="${error}"] + span.error`).textContent = errors[error];
				document.querySelector(`#signin_form input[name="${error}"] + span.error`).style.display = "block";
			}
			reject({ status: false, code: 412, data: { message: window.lang.responseMessages.validationError } });
		} else {
			if (validateEmail(data.email_or_username)) {
				data["signinQuery"] = `email=${data.email_or_username}`;
			} else {
				data["signinQuery"] = `username=${data.email_or_username}`;
			}
			signinApi(data)
				.then((response) => {
					if (response.length > 0) {
						let userObject = response[0];
						const hashedPassword = userObject.hashedPassword;
						const textPassword = data.password;
						const isUserValidated = bcrypt.compareSync(textPassword, hashedPassword);
						if (!isUserValidated) {
							reject({ status: false, data: { message: window.lang.responseMessages.userAuth.wrongCredentials } });
						}
						userObject = deleteObjectProperties(userObject, ["hashedPassword", "username"]);
						userObject["isUserValidated"] = isUserValidated;
						const fakeJWT = generateAccessToken(userObject);
						resolve({ status: isUserValidated, data: { userData: userObject, jwt: fakeJWT, message: window.lang.responseMessages.userAuth.signinSuccess } });
					} else {
						reject({ status: false, data: { message: window.lang.responseMessages.userAuth.userNotFound } });
					}
				})
				.catch((error) => {
					console.log(error);
					console.log("^error caught in signinService()");
					reject({ status: false, data: { error, message: window.lang.responseMessages.userAuth.signinFailure } });
				});
		}
	});
};

const authenticateUser = (data, next = () => {}) => {
	if (typeof window !== "undefined") {
		localStorage.setItem("jwt", data);
		next();
	}
};

const isAuthenticated = () => {
	let returnValue = {};
	if (typeof window !== "undefined" && localStorage.getItem("jwt")) {
		returnValue = JSON.parse(window.atob(localStorage.getItem("jwt")));
	}
	return returnValue;
};

export { signupService, signinService, authenticateUser, isAuthenticated };
