import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signupService } from "../../service/userManagement";
import { getBase64StringOfImage, clearAlertMessages, clearErrorSpans } from "../../helper/utility_methods";

import Loader from "../common/Loader";
import InputText from "../input_helper/InputText";
import InputPassword from "../input_helper/InputPassword";
import InputFile from "../input_helper/InputFile";
import InputButton from "../input_helper/InputButton";

const Signup = () => {
	console.log("Sign Up rendered.");

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const userDataInState = useSelector((state) => {
		return state.userData || {};
	});
	const signupFormData = useSelector((state) => {
		return state.userSignup;
	});

	useEffect(() => {
		dispatch({ type: "RESET_SIGNUP_FORM_DATA" });
		performRedirect();
	}, []);

	const performRedirect = () => {
		if (userDataInState.isSignedIn) {
			console.log("Signup component: performRedirect() - User already signed in. Redirecting to dashboard.");
			return navigate("/dashboard");
		}
	};

	const handleChange = (fieldName) => async (ev) => {
		let value = fieldName === "profile_picture" ? ev.target.files[0] : ev.target.value;
		if (fieldName === "profile_picture") {
			//	Convert image to base64 to store in db.json
			getBase64StringOfImage(value).then((base64Image) => {
				dispatch({ type: "UPDATE_SIGNUP_FORM_DATA", payload: { [fieldName]: base64Image } });
			});
		} else {
			dispatch({ type: "UPDATE_SIGNUP_FORM_DATA", payload: { [fieldName]: value } });
		}
		document.querySelector(`#signup_form input[name="${fieldName}"] + span.error`).textContent = "";
		document.querySelector(`#signup_form input[name="${fieldName}"] + span.error`).style.display = "none";
	};
	const handleFormSubmit = (ev) => {
		clearErrorSpans("#signup_form");
		clearAlertMessages("#signup_form");
		dispatch({ type: "SET_SIGNUP_SUBMIT_BUTTON_LOADER", payload: { showSubmitButtonLoader: true } });
		//	Delay to simulate server response time..
		setTimeout(() => {
			signupService(signupFormData)
				.then((response) => {
					if (response.status) {
						document.querySelector(`#signup_form div.alert-success`).textContent = response.data.message;
						document.querySelector(`#signup_form div.alert-success`).style.display = "block";
						setTimeout(() => {
							dispatch({ type: "RESET_SIGNUP_FORM_DATA" });
							return navigate("/signin");
						}, 3000);
					}
				})
				.catch((error) => {
					dispatch({ type: "SET_SIGNUP_SUBMIT_BUTTON_LOADER", payload: { showSubmitButtonLoader: false } });
					if (error.code != 412) {
						document.querySelector(`#signup_form div.alert-danger`).textContent = error.data.message;
						document.querySelector(`#signup_form div.alert-danger`).style.display = "block";
					}
				});
		}, 3000);
	};

	const showSubmitButtonOrLoader = () => {
		if (signupFormData.showSubmitButtonLoader) {
			return <Loader></Loader>;
		} else {
			return (
				<InputButton
					data={{
						text: window.lang.signup.buttonText,
						onClickHandler: handleFormSubmit,
						classForElementContainer: "d-flex justify-content-center",
						classForButton: "btn btn-primary px-5",
						fieldName: "signup_submit",
					}}
				/>
			);
		}
	};
	const signupForm = () => {
		return (
			<div className="col-xl-6 col-lg-8 col-md-10 col-sm-12 col-12 py-3 px-4">
				<h2 className="text-center mb-4">{window.lang.signup.pageHeading}</h2>
				<div className="alert alert-danger" style={{ display: "none" }}></div>
				<div className="alert alert-success" style={{ display: "none" }}></div>
				<form>
					<div className="row">
						<div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
							<InputText data={{ text: window.lang.signup.form.name, fieldName: "name", onChangeHandler: handleChange, inputValue: signupFormData.name }} />
						</div>
						<div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
							<InputText
								data={{ text: window.lang.signup.form.username, fieldName: "username", onChangeHandler: handleChange, inputValue: signupFormData.username }}
							/>
						</div>
					</div>
					<div className="row">
						<div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
							<InputText
								data={{
									text: window.lang.signup.form.email,
									inputType: "email",
									fieldName: "email",
									onChangeHandler: handleChange,
									inputValue: signupFormData.email,
								}}
							/>
						</div>
						<div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
							<InputPassword
								data={{ text: window.lang.signup.form.password, fieldName: "password", onChangeHandler: handleChange, inputValue: signupFormData.password }}
							/>
						</div>
					</div>
					<div className="row">
						<div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
							<InputText
								data={{
									text: window.lang.signup.form.contact,
									classForLabel: "optional-input",
									fieldName: "contact",
									onChangeHandler: handleChange,
									inputValue: signupFormData.contact,
								}}
							/>
						</div>
						<div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
							<InputFile
								data={{
									text: window.lang.signup.form.profilePicture,
									classForLabel: "optional-input",
									fieldName: "profile_picture",
									onChangeHandler: handleChange,
								}}
							/>
						</div>
					</div>
					<div className="row">
						<div className="col-md-12 d-flex justify-content-center">{showSubmitButtonOrLoader()}</div>
					</div>
				</form>
				<div className="d-flex justify-content-center">
					<span className="pr-2">{window.lang.signup.form.haveAccountHelpText}</span>
					<Link to="/signin" className="d-inline">
						{window.lang.signin.buttonText}
					</Link>
				</div>
			</div>
		);
	};

	return (
		<div className="row justify-content-center align-items-center h-100" id="signup_form">
			{signupForm()}
		</div>
	);
};

export default Signup;
