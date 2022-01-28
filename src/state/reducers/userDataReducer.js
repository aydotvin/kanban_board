const userDataInitialState = { isSignedIn: false, userData: {} };
const userDataReducer = (state = userDataInitialState, action = {}) => {
	switch (action.type) {
		case "SET_USER_DATA":
			let isSignedIn = action.payload.isSignedIn || false;
			let userData = action.payload.userData || {};
			state = { ...state, isSignedIn, userData };
			break;
		case "RESET_USER_DATA":
			state = userDataInitialState;
			break;
	}
	return state;
};

export default userDataReducer;
