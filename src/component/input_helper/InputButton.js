const InputButton = (props = {}) => {
	let {
		text = "",
		classForButton = "",
		classForElementContainer = "",
		buttonType = "button",
		onClickHandler = () => {},
		fieldName = "",
		additionalAttributes = {},
	} = props.data || {};

	classForButton = `${classForButton}`;
	classForElementContainer = `form-group ${classForElementContainer}`;

	return (
		<div className={classForElementContainer}>
			<button type={buttonType} onClick={onClickHandler} className={classForButton} name={fieldName} {...additionalAttributes}>
				{text}
			</button>
		</div>
	);
};

export default InputButton;
