import { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { CAPTCHA_SITE_KEY } from "../../config";
import { signinService, authenticateUser } from "../../service/userManagement";
import { clearAlertMessages, clearErrorSpans } from "../../helper/utility_methods";

import Loader from "../common/Loader";
import InputText from "../input_helper/InputText";
import InputPassword from "../input_helper/InputPassword";
import InputButton from "../input_helper/InputButton";

const Signin = () => {
	console.log("Sign In rendered.");

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const captchaElement = useRef("");

	const userDataInState = useSelector((state) => {
		return state.userData || {};
	});
	const signinFormData = useSelector((state) => {
		return state.userSignin;
	});

	useEffect(() => {
		// clearAlertMessages("#signin_form");
		// clearErrorSpans("#signin_form");
		dispatch({ type: "RESET_SIGNIN_FORM_DATA" });
		performRedirect();
	}, []);
	// useEffect(() => {
	// 	// performRedirect();
	// }, [userDataInState]);

	const performRedirect = () => {
		if (userDataInState.isSignedIn) {
			console.log("Signin component: performRedirect() - User already signed in. Redirecting to dashboard.");
			return navigate("/dashboard");
		}
	};

	const handleCaptchaChange = () => {
		dispatch({ type: "UPDATE_CAPTCHA_STATUS", payload: { isCaptchaVerified: true } });
	};
	const handleCaptchaExpiry = () => {
		dispatch({ type: "UPDATE_CAPTCHA_STATUS", payload: { isCaptchaVerified: false } });
	};
	const handleChange = (fieldName) => async (ev) => {
		let value = ev.target.value;
		dispatch({ type: "UPDATE_SIGNIN_FORM_DATA", payload: { [fieldName]: value } });
		document.querySelector(`#signin_form input[name="${fieldName}"] + span.error`).textContent = "";
		document.querySelector(`#signin_form input[name="${fieldName}"] + span.error`).style.display = "none";
	};
	const handleFormSubmit = (ev) => {
		clearErrorSpans("#signin_form");
		clearAlertMessages("#signin_form");
		dispatch({ type: "SET_SIGNIN_SUBMIT_BUTTON_LOADER", payload: { showSubmitButtonLoader: true } });
		//	Delay to simulate server response time..
		setTimeout(() => {
			signinService(signinFormData)
				.then((response) => {
					if (response.status) {
						authenticateUser(response.data.jwt);
						dispatch({ type: "SET_USER_DATA", payload: { isSignedIn: response.status, userData: response.data.userData } });
						document.querySelector(`#signin_form div.alert-success`).textContent = response.data.message;
						document.querySelector(`#signin_form div.alert-success`).style.display = "block";
						setTimeout(() => {
							dispatch({ type: "RESET_SIGNIN_FORM_DATA" });
							return navigate("/dashboard");
						}, 3000);
					}
				})
				.catch((error) => {
					dispatch({ type: "SET_SIGNIN_SUBMIT_BUTTON_LOADER", payload: { showSubmitButtonLoader: false } });
					document.querySelector(`#signin_form div.alert-danger`).textContent = error.data.message;
					document.querySelector(`#signin_form div.alert-danger`).style.display = "block";
				});
		}, 3000);
	};

	const showSubmitButtonOrLoader = () => {
		if (signinFormData.showSubmitButtonLoader) {
			return <Loader></Loader>;
		} else {
			return (
				<InputButton
					data={{
						text: window.lang.signin.buttonText,
						onClickHandler: handleFormSubmit,
						classForElementContainer: "d-flex justify-content-center",
						classForButton: "btn btn-primary px-5",
						fieldName: "signin_submit",
						additionalAttributes: {
							disabled: !signinFormData.isCaptchaVerified,
						},
					}}
				/>
			);
		}
	};
	const signinForm = () => {
		return (
			<div className="col-xl-4 col-lg-6 col-md-8 col-sm-12 col-12 py-3 px-4">
				<h2 className="text-center mb-4">{window.lang.signin.pageHeading}</h2>
				<div className="alert alert-danger" style={{ display: "none" }}></div>
				<div className="alert alert-success" style={{ display: "none" }}></div>
				<form>
					<div className="row">
						<div className="col-md-12">
							<InputText
								data={{
									text: window.lang.signin.form.username,
									fieldName: "email_or_username",
									onChangeHandler: handleChange,
									inputValue: signinFormData.email_or_username,
								}}
							/>
						</div>
					</div>
					<div className="row">
						<div className="col-md-12">
							<InputPassword
								data={{ text: window.lang.signin.form.password, fieldName: "password", onChangeHandler: handleChange, inputValue: signinFormData.password }}
							/>
						</div>
					</div>
					<div className="row">
						<div className="col-md-12 d-flex justify-content-center mb-3">
							<ReCAPTCHA ref={captchaElement} sitekey={CAPTCHA_SITE_KEY} onChange={handleCaptchaChange} onExpired={handleCaptchaExpiry} />
						</div>
					</div>
					<div className="row">
						<div className="col-md-12 d-flex justify-content-center">{showSubmitButtonOrLoader()}</div>
					</div>
				</form>
				<div className="d-flex justify-content-center">
					<span className="pr-2">{window.lang.signin.form.noAccountHelpText}</span>
					<Link to="/signup" className="d-inline">
						{window.lang.signup.buttonText}
					</Link>
				</div>
			</div>
		);
	};

	return (
		<div className="row justify-content-center align-items-center h-100" id="signin_form">
			{signinForm()}
		</div>
	);
};

export default Signin;
