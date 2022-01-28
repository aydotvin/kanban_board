const validateData = (config = {}, data = {}) => {
	let result = { status: true, error: {} };

	for (const field in data) {
		if (config[field] !== undefined) {
			//	If error found in one validation, do not check further validations for the same field. So break fieldsLoop;
			fieldsLoop: for (const validation in config[field]) {
				switch (validation) {
					case "required":
						if (config[field][validation] === true) {
							if (data[field].trim().length === 0) {
								let errorMessage = window.lang.validationMessage.required[field] || window.lang.validationMessage.required["generic"].replace(":FIELD", field);
								result["status"] = false;
								result.error[field] = errorMessage;
								break fieldsLoop;
							}
						}
						break;

					case "minLength":
						if (data[field].trim().length < config[field][validation]) {
							let errorMessage = window.lang.validationMessage.minLength[field].replace(":MIN_LENGTH", config[field][validation]);
							result["status"] = false;
							result.error[field] = errorMessage;
							break fieldsLoop;
						}
						break;

					case "maxLength":
						if (data[field].trim().length > config[field][validation]) {
							let errorMessage = window.lang.validationMessage.maxLength[field].replace(":MAX_LENGTH", config[field][validation]);
							result["status"] = false;
							result.error[field] = errorMessage;
							break fieldsLoop;
						}
						break;

					case "regex":
						const regex = new RegExp(decodeURIComponent(config[field][validation] || ""));
						if (!!data[field] && !data[field].match(regex)) {
							let errorMessage = window.lang.validationMessage.regex[field] || window.lang.validationMessage.required["generic"].replace(":FIELD", field);
							result["status"] = false;
							result.error[field] = errorMessage;
							break fieldsLoop;
						}
						break;

					default:
						break;
				}
			}
		}
	}

	return result;
};

const getBase64StringOfImage = (imageFile) => {
	return new Promise((resolve, reject) => {
		let base64String = "";
		if (!!imageFile) {
			const reader = new FileReader();
			reader.readAsDataURL(imageFile);
			reader.onload = function () {
				base64String = reader.result;
				resolve(base64String);
			};
			reader.onerror = function (error) {
				console.log("Error at image to base64 conversion..");
				console.log(error);
				reject(error);
			};
		}
	});
};

const deleteObjectProperties = (parentObject = {}, propertiesToDelete = []) => {
	propertiesToDelete.forEach((property) => {
		delete parentObject[property];
	});
	return parentObject;
};

const clearAlertMessages = (selector = "") => {
	document.querySelectorAll(`${selector} div.alert`).forEach((alertBox) => {
		alertBox.style.display = "none";
		alertBox.textContent = "";
	});
};

const clearErrorSpans = (selector = "") => {
	document.querySelectorAll(`${selector} .form-control + span.error`).forEach((errorSpan) => {
		errorSpan.style.display = "none";
		errorSpan.textContent = "";
	});
};

const getKeyByValue = (object, value) => {
	return Object.keys(object).find((key) => object[key] === value);
};

const validateEmail = (emailAddress) => {
	let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	return !!emailAddress.match(regexEmail);
};

export { validateData, getBase64StringOfImage, deleteObjectProperties, clearAlertMessages, clearErrorSpans, getKeyByValue, validateEmail };
