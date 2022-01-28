import Modal from "react-modal";
import InputButton from "../input_helper/InputButton";
import Loader from "./Loader";

const ModalBox = (props = {}) => {
	const defaultStyles = {
		content: {
			top: "50%",
			left: "50%",
			right: "auto",
			bottom: "auto",
			transform: "translate(-50%, -50%)",
		},
	};
	const { isOpen = false, onAfterOpen = () => {}, onRequestClose = () => {}, styles = {}, contentLabel = "", modalType = "", modalData = {} } = props.data || {};

	const getModalContent = () => {
		if (modalType == window.enums.modalType.CONFIRM_MODAL) {
			const {
				modalID = "confirm_modal",
				modalTitleText = "",
				modalBodyText = "",
				confirmButtonText = "Confirm",
				confirmButtonName = "confirm",
				confirmButtonClass = "btn-primary",
				cancelButtonText = "Cancel",
				cancelButtonName = "cancel",
				cancelButtonClass = "btn-outline-primary",
				modalTitleClass = "",
				modalBodyClass = "",
				handlerForCancelButton = () => {},
				handlerForConfirmButton = () => {},
				additionalAttributesForCancelButton = {},
				additionalAttributesForConfirmButton = {},
			} = modalData;
			return (
				<div className="row" id={modalID}>
					<div className="col-md-12">
						<div className="row modal-header pt-0">
							<div className="col-md-12">
								<h4 className={`modal-title ${modalTitleClass}`}>{modalTitleText}</h4>
							</div>
						</div>
						<div className="row modal-body">
							<div className="col-md-12">
								<p className={modalBodyClass}>{modalBodyText}</p>
							</div>
						</div>
						<div className="row modal-footer pb-0">
							<div className="col-md-12 d-flex justify-content-around">
								<InputButton
									data={{
										text: cancelButtonText,
										onClickHandler: handlerForCancelButton,
										classForElementContainer: "d-inline m-0 mr-3",
										classForButton: `btn px-5 ${cancelButtonClass}`,
										fieldName: cancelButtonName,
										additionalAttributes: additionalAttributesForCancelButton,
									}}
								/>
								<InputButton
									data={{
										text: confirmButtonText,
										onClickHandler: handlerForConfirmButton,
										classForElementContainer: "d-inline m-0",
										classForButton: `btn px-5 ${confirmButtonClass}`,
										fieldName: confirmButtonName,
										additionalAttributes: additionalAttributesForConfirmButton,
									}}
								/>
							</div>
						</div>
					</div>
				</div>
			);
		} else if (modalType == window.enums.modalType.LOADING_MODAL) {
			const { loadingMessage = "Loading... Please wait..." } = modalData;
			return (
				<>
					<Loader></Loader>
					{loadingMessage}
				</>
			);
		} else if (modalType == window.enums.modalType.CUSTOM_MODAL) {
			return props.children;
		}
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

export default ModalBox;
