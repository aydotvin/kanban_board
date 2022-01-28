const tasksInitialState = {
	tasks: {},
	isTaskUpdated: false,
	showConfirmationModal: false,
	showAddEditModal: false,
	showLoadingModal: false,
	currentTaskData: {},
	modalType: "",
	updateTasksMethod: () => {},
	confirmModalData: {},
};
const tasksReducer = (state = tasksInitialState, action = {}) => {
	switch (action.type) {
		case "SET_ALL_TASK_DATA":
			state = { ...state, tasks: { ...action.payload } };
			break;
		case "RESET_TASK_DATA":
			state = { ...tasksInitialState, updateTasksMethod: state.updateTasksMethod };
			break;
		case "SET_TASK_UPDATED_FLAG":
			state = { ...state, isTaskUpdated: action.payload.isTaskUpdated };
			break;
		case "SET_SHOW_CONFIRMATION_MODAL":
			state = { ...state, showConfirmationModal: true };
			break;
		case "SET_SELECTED_TASK_DATA":
			state = { ...state, currentTaskData: action.payload.currentTaskData };
			break;
		case "SET_SHOW_LOADING_MODAL":
			state = { ...state, showLoadingModal: true };
			break;
		case "SET_MODAL_TYPE":
			state = { ...state, modalType: action.payload.modalType };
			break;
		case "RESET_SELECTED_TASK_DATA":
			state = { ...state, showConfirmationModal: false, showLoadingModal: false, showAddEditModal: false, currentTaskData: {}, modalType: "" };
			break;
		case "SET_UPDATE_TASK_METHOD":
			state = { ...state, updateTasksMethod: action.payload.updateTasksMethod };
			break;
		case "SET_CONFIRM_MODAL_DATA":
			state = { ...state, confirmModalData: action.payload.confirmModalData };
			break;
		case "SET_SHOW_ADD_EDIT_TASK_MODAL":
			state = { ...state, showAddEditModal: true };
			break;
		default:
			return state;
	}
	return state;
};

const addTaskInitialState = { taskFormData: { task_name: "", task_priority: "", task_stage: "0", task_deadline: "" }, handlerForAddEditConfirm: () => {}, addEditUpdateType: "" };

const addTaskReducer = (state = addTaskInitialState, action = {}) => {
	switch (action.type) {
		case "UPDATE_ADD_NEW_TASK_FORM_DATA":
			state = { ...state, taskFormData: { ...state.taskFormData, ...action.payload } };
			break;
		case "SET_ADD_EDIT_CONFIRM_HANDLER":
			state = { ...state, handlerForAddEditConfirm: action.payload.handlerForAddEditConfirm };
			break;
		case "SET_ADD_EDIT_UPDATE_TYPE":
			state = { ...state, addEditUpdateType: action.payload.addEditUpdateType };
			break;
		case "RESET_ADD_NEW_TASK_FORM_DATA":
			state = { ...state, taskFormData: addTaskInitialState.taskFormData };
			break;

		default:
			break;
	}
	return state;
};

const taskUpdateFlagsInitialState = { deleteTask: false, moveTask: false, addTask: false, editTask: false, isTaskDragged: false };

const taskUpdateFlagsReducer = (state = taskUpdateFlagsInitialState, action = {}) => {
	switch (action.type) {
		case "SET_TASK_UPDATE_FLAG":
			state = { ...state, ...action.payload };
			break;
		case "SET_TASK_DRAGGED_FLAG":
			state = { ...state, isTaskDragged: action.payload.isTaskDragged };
			break;
		case "RESET_TASK_UPDATE_FLAGS":
			state = taskUpdateFlagsInitialState;
			break;

		default:
			break;
	}
	return state;
};

export { tasksReducer, addTaskReducer, taskUpdateFlagsReducer };
