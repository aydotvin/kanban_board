import InputText from "./InputText";

const InputDate = (props) => {
	return <InputText data={{ ...props.data, inputType: "date", additionalAttributes: { min: new Date().toISOString().split("T")[0] } }}></InputText>;
};

export default InputDate;
