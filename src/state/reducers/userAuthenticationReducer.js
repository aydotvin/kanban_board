const signupInitialState = { name: "", username: "", email: "", password: "", contact: "", profile_picture: "", showSubmitButtonLoader: false };
const userSignupReducer = (state = signupInitialState, action = {}) => {
	switch (action.type) {
		case "UPDATE_SIGNUP_FORM_DATA":
			state = { ...state, ...action.payload };
			break;
		case "RESET_SIGNUP_FORM_DATA":
			state = signupInitialState;
			break;
		case "SET_SIGNUP_SUBMIT_BUTTON_LOADER":
			state = { ...state, showSubmitButtonLoader: action.payload.showSubmitButtonLoader };
			break;
		default:
			return state;
	}
	return state;
};

const signinInitialState = { email_or_username: "", password: "", isCaptchaVerified: false, showSubmitButtonLoader: false };
const userSigninReducer = (state = signinInitialState, action = {}) => {
	switch (action.type) {
		case "UPDATE_SIGNIN_FORM_DATA":
			state = { ...state, ...action.payload };
			break;
		case "UPDATE_CAPTCHA_STATUS":
			state = { ...state, isCaptchaVerified: action.payload.isCaptchaVerified };
			break;
		case "SET_SIGNIN_SUBMIT_BUTTON_LOADER":
			state = { ...state, showSubmitButtonLoader: action.payload.showSubmitButtonLoader };
			break;
		case "RESET_SIGNIN_FORM_DATA":
			state = signinInitialState;
			break;
		default:
			return state;
	}
	return state;
};

export { userSignupReducer, userSigninReducer };
