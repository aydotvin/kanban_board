const InputSelect = (props = {}) => {
	let {
		text = "",
		classForSelect = "",
		classForOption = "",
		classForLabel = "",
		classForError = "",
		classForElementContainer = "",
		inputType = "",
		fieldName = "",
		onChangeHandler = () => {},
		optionsData = [],
		commonOptionAttributes = {},
		selectAttributes = {},
		selectedOptionValue = "",
	} = props.data || {};

	const styles = {
		padding: "5px 10px",
	};

	classForLabel = `form-label text-muted ${classForLabel}`;
	classForSelect = `form-control ${classForSelect}`;
	classForError = `error ${classForError}`;
	classForElementContainer = `form-group ${classForElementContainer}`;

	return (
		<div className={classForElementContainer}>
			<label className={classForLabel}>{text}</label>
			<select className={classForSelect} type={inputType} name={fieldName} value={selectedOptionValue} onChange={onChangeHandler(fieldName)} {...selectAttributes}>
				<option className={classForOption} {...commonOptionAttributes} style={styles} value="">
					Select an option
				</option>
				{optionsData.map((eachOption, index) => {
					return (
						<option key={index} value={eachOption.value} className={classForOption} {...commonOptionAttributes} {...(eachOption.attributes || {})} style={styles}>
							{eachOption.text}
						</option>
					);
				})}
			</select>
			<span className={classForError} style={{ display: "none" }}></span>
		</div>
	);
};

export default InputSelect;
