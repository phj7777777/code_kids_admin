import React from 'react'
import {Input, Button, FormItem, FormContainer, Alert} from 'components/ui'
import {PasswordInput, ActionLink} from 'components/shared'
import {onSignInSuccess} from 'store/auth/sessionSlice'
import {setUser} from 'store/auth/userSlice'
import {apiSignUp} from 'services/AuthService'
import appConfig from 'configs/app.config'
import useTimeOutMessage from 'utils/hooks/useTimeOutMessage'
import {useNavigate} from 'react-router-dom'
import {useDispatch} from 'react-redux'
import {Field, Form, Formik} from 'formik'
import * as Yup from 'yup'
import {t} from "i18next";

const validationSchema = Yup.object().shape({
	userName: Yup.string().required(t('auth.error_username')),
	email: Yup.string().email(t('auth.error_invalid_email')).required(t('auth.error_email_required')),
	password: Yup.string().required(t('auth.error_password')),
	confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], t('auth.error_password_not_match'))
})

const SignUpForm = props => {

	const {disableSubmit = false, className, signInUrl = '/sign-in'} = props

	const dispatch = useDispatch()

	const navigate = useNavigate()

	const [message, setMessage] = useTimeOutMessage()

	const onSignUp = async (values, setSubmitting) => {
		const {userName, password, email} = values
		setSubmitting(true)
		try {
			const resp = await apiSignUp({userName, password, email})
			if (resp?.user) {
				setSubmitting(false)
				const token = await resp.user.getIdToken();
				dispatch(onSignInSuccess(token))
				if (resp.user) {
					dispatch(setUser({
						avatar: resp.user.photoURL,
						userName: resp.user.displayName,
						authority: ['ADMIN'],
						email: resp.user.email
					} || {
						avatar: '',
						userName: t('auth.guest'),
						authority: ['USER'],
						email: ''
					}))
				}
				navigate(appConfig.tourPath)
			}
		} catch (errors) {
			if(errors.toString().includes("firebase")){
				setMessage(t('common.something_error'))
			}else{
				setMessage(errors?.response?.data?.message || errors.toString())
			}
			setSubmitting(false)
		}
	}

	return (
		<div className={className}>
			{message && <Alert className="mb-4" type="danger" showIcon>{message}</Alert>}
			<Formik
				initialValues={{
					userName: 'admin1',
					password: ' ',
					confirmPassword: '123Qwe1',
					email: 'test@testmail.com'
				}}
				validationSchema={validationSchema}
				onSubmit={(values, {setSubmitting}) => {
					if (!disableSubmit) {
						onSignUp(values, setSubmitting)
					} else {
						setSubmitting(false)
					}
				}}
			>
				{({touched, errors, isSubmitting}) => (
					<Form>
						<FormContainer>
							<FormItem
								label={t('auth.username')}
								invalid={errors.userName && touched.userName}
								errorMessage={errors.userName}
							>
								<Field
									type="text"
									autoComplete="off"
									name="userName"
									placeholder={t('auth.username')}
									component={Input}
								/>
							</FormItem>
							<FormItem
								label={t('common.email')}
								invalid={errors.email && touched.email}
								errorMessage={errors.email}
							>
								<Field
									type="email"
									autoComplete="off"
									name="email"
									placeholder={t('common.email')}
									component={Input}
								/>
							</FormItem>
							<FormItem
								label={t('auth.password')}
								invalid={errors.password && touched.password}
								errorMessage={errors.password}
							>
								<Field
									autoComplete="off"
									name="password"
									placeholder={t('auth.password')}
									component={PasswordInput}
								/>
							</FormItem>
							<FormItem
								label={t('auth.confirm_password')}
								invalid={errors.confirmPassword && touched.confirmPassword}
								errorMessage={errors.confirmPassword}
							>
								<Field
									autoComplete="off"
									name="confirmPassword"
									placeholder={t('auth.confirm_password')}
									component={PasswordInput}
								/>
							</FormItem>
							<Button
								block
								loading={isSubmitting}
								variant="solid"
								type="submit"
							>
								{isSubmitting ? t('auth.creating_account') : t('auth.sign_up')}
							</Button>
							<div className="mt-4 text-center">
								<span>{t('auth.already_have_account')}</span>
								<ActionLink to={signInUrl}>
									{t('auth.sign_in')}
								</ActionLink>
							</div>
						</FormContainer>
					</Form>
				)}
			</Formik>
		</div>
	)
}

export default SignUpForm