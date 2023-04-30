import React, { useState } from 'react'
import { Button, FormItem, FormContainer, Alert } from 'components/ui'
import { PasswordInput, ActionLink } from 'components/shared'
import { apiResetPassword } from 'services/AuthService'
import useTimeOutMessage from 'utils/hooks/useTimeOutMessage'
import { useNavigate } from 'react-router-dom'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import {t} from "i18next";

const validationSchema = Yup.object().shape({
	password: Yup.string().required(t('auth.error_password')),
	confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], t('auth.error_password_not_match'))
})

const ResetPasswordForm = props => {
	
	const { disableSubmit = false, className, signInUrl = '/sign-in' } = props

	const [ resetComplete, setResetComplete ] = useState(false)

	const [ message, setMessage ] = useTimeOutMessage()

	const navigate = useNavigate()

	const onSubmit = async (values, setSubmitting) => {
		const { password } = values
		setSubmitting(true)
		try {
			const resp = await apiResetPassword({ password })
			if (resp) {
				setSubmitting(false)
				setResetComplete(true)
			}
		} catch (errors) {
			setMessage(errors?.response?.data?.message || errors.toString())
			setSubmitting(false)
		}
	}

	const onContinue = () => {
		navigate('/sign-in')
	}

	return (
		<div className={className}>
			<div className="mb-6">
				{
					resetComplete ? 
					<>
						<h3 className="mb-1">{t('auth.reset_done')}</h3>
						<p>{t('auth.reset_done_desc')}</p>
					</>
					:
					<>
						<h3 className="mb-1">{t('auth.set_new_password')}</h3>
						<p>{t('auth.set_new_password_desc')}</p>
					</>
				}
			</div>
			{message && <Alert className="mb-4" type="danger" showIcon>{message}</Alert>}
			<Formik
				initialValues={{
					password: '123Qwe1', 
					confirmPassword: '123Qwe1',
				}}
				validationSchema={validationSchema}
				onSubmit={(values, { setSubmitting }) => {
					if(!disableSubmit) {
						onSubmit(values, setSubmitting)
					} else {
						setSubmitting(false)
					}
				}}
			>
				{({touched, errors, isSubmitting}) => (
					<Form>
						<FormContainer>
							{
								!resetComplete ? (
									<>
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
											{ isSubmitting ? t('auth.submitting') : t('auth.submit') }
										</Button>
									</>
								)
								:
								(
									<Button 
										block 
										variant="solid" 
										type="button"
										onClick={onContinue}
									>
										{t('auth.continue')}
									</Button>
								)
							}
							
							<div className="mt-4 text-center">
								<span>{t('auth.back_to')}</span>
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

export default ResetPasswordForm