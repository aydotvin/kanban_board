const InputFile = (props = {}) => {
	let {
		text = "",
		classForInput = "",
		classForLabel = "",
		classForError = "",
		classForElementContainer = "",
		inputType = "file",
		fieldName = "",
		onChangeHandler = () => {},
	} = props.data || {};

	classForLabel = `form-label text-muted ${classForLabel}`;
	classForInput = `form-control ${classForInput}`;
	classForError = `error ${classForError}`;
	classForElementContainer = `form-group ${classForElementContainer}`;

	return (
		<div className={classForElementContainer}>
			<label className={classForLabel}>{text}</label>
			<input className={classForInput} type={inputType} name={fieldName} onChange={onChangeHandler(fieldName)} />
			<span className={classForError} style={{ display: "none" }}></span>
		</div>
	);
};

export default InputFile;
