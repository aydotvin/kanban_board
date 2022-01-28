const lang = {
	validationMessage: {
		required: {
			name: "Name is required.",
			email: "Email is required.",
			username: "Username is required.",
			password: "Password is required.",
			contact: "Contact Number is required.",
			email_or_username: "Email/Username is required.",
			task_name: "Task name is required.",
			task_priority: "Task priority is required.",
			task_deadline: "Task due date is required.",
			generic: ":FIELD is required.",
		},
		minLength: {
			name: "Minimum of :MIN_LENGTH characters are required for Name.",
			email: "Minimum of :MIN_LENGTH characters are required for Email ID.",
			username: "Minimum of :MIN_LENGTH characters are required for Username.",
			password: "Minimum of :MIN_LENGTH characters are required for Password.",
		},
		maxLength: {
			name: "Maximum of :MAX_LENGTH characters are allowed for Name.",
			email: "Maximum of :MAX_LENGTH characters are allowed for Email ID.",
			username: "Maximum of :MAX_LENGTH characters are allowed for Username.",
			password: "Maximum of :MAX_LENGTH characters are allowed for Password.",
		},
		regex: {
			name: "Invalid Name.",
			email: "Invalid Email ID.",
			username: "Invalid Username.",
			password: "Invalid Password.",
			contact: "Invalid Contact Number.",
			generic: "Invalid :FIELD.",
		},
	},
	responseMessages: {
		validationError: "Validation error.",
		userAuth: {
			wrongCredentials: "Entered username/email password is incorrect.",
			signinSuccess: "Sign In successful. Redirecting to dashboard.",
			signinFailure: "Sign In failed.",
			userNotFound: "Entered username/email password is incorrect.",
			signupSuccess: "Sign Up successful. Redirecting to login.",
			signupFailure: "Sign Up failed.",
			duplicateUsername: "This username is already taken, please enter a new username.",
			duplicateEmail: "This email is already used for an account, please enter a new email.",
		},
		taskManagement: {
			userIdRequiredForGettingTasks: "User ID required to get task list.",
			errorInGettingTasks: "There was an issue while getting tasks. Please try again later.",
			duplicateTaskName: "Task name already exist. Please use a different name.",
			taskUpdateSuccessText: "Task updated successfully.",
			taskUpdateFailText: "Task updated failed.",
		},
	},
	taskStageHeadings: {
		BACKLOG: "Backlog",
		TO_DO: "Todo",
		ON_GOING: "On Going",
		COMPLETE: "Completed",
	},
	navbarLinkText: {
		signup: "Sign Up",
		signin: "Sign In",
		dashboard: "Dashboard",
		task_manager: "Task Manager",
	},
	taskPriorityText: {
		HIGH: "High",
		MEDIUM: "Medium",
		LOW: "Low",
	},
	signin: {
		buttonText: "Sign In",
		pageHeading: "Sign In",
		form: {
			username: "Email/Username",
			password: "Password",
			noAccountHelpText: "Do not have an account yet?",
		},
	},
	signout: {
		buttonText: "Sign Out",
	},
	signup: {
		buttonText: "Sign Up",
		pageHeading: "Sign Up",
		form: {
			name: "Name",
			username: "Username",
			email: "Email",
			password: "Password",
			contact: "Contact Number",
			profilePicture: "Contact Number",
			haveAccountHelpText: "Already have an account?",
		},
	},
	application: {
		logoText: "KANBAN BOARD",
	},
	taskManagement: {
		taskCard: {
			priorityText: "Priority: :PRIORITY",
			dueOnText: "Due on: :DEADLINE",
		},
		addEditTask: {
			addTaskModalTitle: "Add new task",
			editTaskModalTitle: "Edit existing task",
			taskNameLabel: "Task Name",
			priorityLabel: "Priority",
			dueDateLabel: "Due Date",
			cancelButtonText: "Close",
			confirmButtonText: "Save",
		},
	},
};

export default lang;
