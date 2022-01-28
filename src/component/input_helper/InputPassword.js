const InputPassword = (props = {}) => {
	let {
		text = "",
		classForInput = "",
		classForLabel = "",
		classForError = "",
		classForElementContainer = "",
		inputType = "password",
		fieldName = "",
		inputValue = "",
		onChangeHandler = () => {},
	} = props.data || {};

	classForLabel = `form-label text-muted ${classForLabel}`;
	classForInput = `form-control ${classForInput}`;
	classForError = `error ${classForError}`;
	classForElementContainer = `form-group ${classForElementContainer}`;

	return (
		<div className={classForElementContainer}>
			<label className={classForLabel}>{text}</label>
			<input className={classForInput} type={inputType} name={fieldName} onChange={onChangeHandler(fieldName)} value={inputValue} />
			<span className={classForError} style={{ display: "none" }}></span>
		</div>
	);
};

export default InputPassword;
