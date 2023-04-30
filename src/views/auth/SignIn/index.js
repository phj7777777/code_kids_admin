import React from 'react'
import SignInForm from './SignInForm'
import {t} from "i18next";

const SignIn = () => {
	return (
		<>
			<div className="mb-8">
				<h3 className="mb-1">{t('auth.welcome_back')}</h3>
				<p>{t('auth.welcome_back_desc')}</p>
			</div>
			<SignInForm disableSubmit={false} />
		</>
	)
}

export default SignIn