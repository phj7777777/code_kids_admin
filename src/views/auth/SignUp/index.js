import React from 'react'
import SignUpForm from './SignUpForm'
import {t} from "i18next";

const SignUp = () => {
	return (
		<>
			<div className="mb-8">
				<h3 className="mb-1"> {t('auth.sign_up')}</h3>
				<p> {t('auth.sign_up_desc')}</p>
			</div>
			<SignUpForm disableSubmit={false} />
		</>
		
	)
}

export default SignUp