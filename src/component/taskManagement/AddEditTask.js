import Modal from "react-modal";
import { useSelector, useDispatch } from "react-redux";
import InputButton from "../input_helper/InputButton";
import InputText from "../input_helper/InputText";
import InputSelect from "../input_helper/InputSelect";
import { taskPriorities } from "../../config";
import InputDate from "../input_helper/InputDate";
import { useEffect } from "react";
import { clearErrorSpans } from "../../helper/utility_methods";

const AddEditTask = (props = {}) => {
	const {
		isOpen = false,
		onAfterOpen = () => {},
		onRequestClose = () => {},
		styles = {},
		contentLabel = "",
		handlerForCancelButton = () => {},
		handlerForConfirmButton = () => {},
		updateType = "NEW",
	} = props.data || {};
	const modalTitleText = updateType == "NEW" ? window.lang.taskManagement.addEditTask.addTaskModalTitle : window.lang.taskManagement.addEditTask.editTaskModalTitle;

	const dispatch = useDispatch();

	const taskAddEditData = useSelector((state) => {
		return state.taskAddEditData || {};
	});
	const taskFormData = taskAddEditData.taskFormData || {};

	useEffect(() => {
		clearErrorSpans("#add_edit_task");
	}, []);

	const defaultStyles = {
		content: {
			top: "50%",
			left: "50%",
			right: "auto",
			bottom: "auto",
			transform: "translate(-50%, -50%)",
		},
	};
	const optionsData = taskPriorities.map((eachPriority) => {
		return { text: window.lang.taskPriorityText[eachPriority], value: eachPriority };
	});

	const handleChange = (fieldName) => async (ev) => {
		let value = ev.target.value;
		dispatch({ type: "UPDATE_ADD_NEW_TASK_FORM_DATA", payload: { [fieldName]: value } });
		document.querySelector(`#add_edit_task .form-control[name="${fieldName}"] + span.error`).textContent = "";
		document.querySelector(`#add_edit_task .form-control[name="${fieldName}"] + span.error`).style.display = "none";
	};

	const getModalContent = () => {
		return (
			<div className="row" id="add_edit_task">
				<div className="col-md-12">
					<div className="row modal-header pt-0">
						<div className="col-md-12">
							<h4 className="modal-title text-center">{modalTitleText}</h4>
						</div>
					</div>
					<div className="row mt-3">
						<div className="col-md-12">
							<div className="alert alert-danger m-0" style={{ display: "none" }}></div>
							<div className="alert alert-success m-0" style={{ display: "none" }}></div>
						</div>
					</div>
					<div className="row modal-body">
						<div className="col-md-12">
							<form>
								<div className="row">
									<div className="col-md-12">
										<InputText
											data={{
												text: window.lang.taskManagement.addEditTask.taskNameLabel,
												fieldName: "task_name",
												onChangeHandler: handleChange,
												inputValue: taskFormData.task_name,
											}}
										/>
									</div>
								</div>
								<div className="row">
									<div className="col-md-12">
										<InputSelect
											data={{
												text: window.lang.taskManagement.addEditTask.priorityLabel,
												fieldName: "task_priority",
												selectedOptionValue: taskFormData.task_priority,
												optionsData,
												onChangeHandler: handleChange,
											}}
										/>
									</div>
								</div>
								<div className="row">
									<div className="col-md-12">
										<InputDate
											data={{
												text: window.lang.taskManagement.addEditTask.dueDateLabel,
												fieldName: "task_deadline",
												onChangeHandler: handleChange,
												inputValue: taskFormData.task_deadline,
											}}
										/>
									</div>
								</div>
							</form>
						</div>
					</div>
					<div className="row modal-footer">
						<div className="col-md-12">
							<InputButton
								data={{
									text: window.lang.taskManagement.addEditTask.cancelButtonText,
									onClickHandler: handlerForCancelButton,
									classForElementContainer: "d-inline m-0 mr-3",
									classForButton: `btn btn-outline-primary px-5`,
									fieldName: "cancel",
								}}
							/>
							<InputButton
								data={{
									text: window.lang.taskManagement.addEditTask.confirmButtonText,
									onClickHandler: handlerForConfirmButton,
									classForElementContainer: "d-inline m-0 mr-3",
									classForButton: `btn btn-primary px-5`,
									fieldName: "save",
								}}
							/>
						</div>
					</div>
				</div>
			</div>
		);
	};

	return (
		<Modal
			isOpen={isOpen}
			onAfterOpen={onAfterOpen}
			onRequestClose={onRequestClose}
			style={{ ...defaultStyles, ...styles }}
			contentLabel={contentLabel}
			ariaHideApp={false}
			shouldCloseOnOverlayClick={false}
		>
			{getModalContent()}
		</Modal>
	);
};

export default AddEditTask;
