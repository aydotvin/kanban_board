import { useDispatch } from "react-redux";

const Task = (props) => {
	const dispatch = useDispatch();
	const {
		taskName = "",
		taskPriority = "",
		taskDeadline = "",
		additionalAttributes = {},
		handleBackButton = () => {},
		handleEditButton = () => {},
		handleDeleteButton = () => {},
		handleForwardButton = () => {},
	} = props.data || {};

	const allowBackButton = window.enums.taskStage[additionalAttributes.data_task_stage] != window.enums.taskStageText.BACKLOG;
	const allowForwardButton = window.enums.taskStage[additionalAttributes.data_task_stage] != window.enums.taskStageText.COMPLETE;

	const TaskUI = () => {
		return (
			<div className="row mb-3 px-2 py-3">
				<div className="col-md-12 d-flex flex-column justify-content-center align-items-cente1r">
					<span className="pb-3 task-name h6 text-center">{taskName}</span>
					<span className="pb-3 task-name text-muted">{window.lang.taskManagement.taskCard.priorityText.replace(":PRIORITY", taskPriority)}</span>
					<span className="pb-3 task-name text-muted">{window.lang.taskManagement.taskCard.dueOnText.replace(":DEADLINE", taskDeadline)}</span>
				</div>
				<div className="col-md-12 d-flex justify-content-around align-items-center">
					<div className="row justify-content-between">
						{allowBackButton ? (
							<div className="col-3 d-flex justify-content-center align-items-center cursor-pointer each-task-button-container" onClick={handleBackButton}>
								<span className="p-2 each-task-button back-icon">&nbsp;</span>
							</div>
						) : (
							""
						)}
						<div className="col-3 d-flex justify-content-center align-items-center cursor-pointer each-task-button-container" onClick={handleEditButton}>
							<span className="p-2 each-task-button edit-icon">&nbsp;</span>
						</div>
						<div className="col-3 d-flex justify-content-center align-items-center cursor-pointer each-task-button-container" onClick={handleDeleteButton}>
							<span className="p-2 each-task-button delete-icon">&nbsp;</span>
						</div>
						{allowForwardButton ? (
							<div className="col-3 d-flex justify-content-center align-items-center cursor-pointer each-task-button-container" onClick={handleForwardButton}>
								<span className="p-2 each-task-button forward-icon">&nbsp;</span>
							</div>
						) : (
							""
						)}
					</div>
				</div>
			</div>
		);
	};

	return (
		<div
			className="row"
			draggable="true"
			onDragStart={(ev) => {
				let draggedTaskData = ev.target.querySelector(".each-task-container").getAttribute("data_task_json") || "{}";
				ev.dataTransfer.setData("draggedTaskData", draggedTaskData);
				dispatch({ type: "SET_TASK_DRAGGED_FLAG", payload: { isTaskDragged: true } });
			}}
			onDragEnd={(ev) => {
				dispatch({ type: "SET_TASK_DRAGGED_FLAG", payload: { isTaskDragged: false } });
			}}
		>
			<div className="col-md-12">
				<div className="each-task-container noselect rounded" {...additionalAttributes}>
					{TaskUI()}
				</div>
			</div>
		</div>
	);
};

export default Task;
