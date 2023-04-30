import React, {useState} from 'react'
import {Input, Button, FormItem, FormContainer, Alert} from 'components/ui'
import {ActionLink} from 'components/shared'
import {apiForgotPassword} from 'services/AuthService'
import useTimeOutMessage from 'utils/hooks/useTimeOutMessage'
import {Field, Form, Formik} from 'formik'
import * as Yup from 'yup'
import {t} from "i18next";

const validationSchema = Yup.object().shape({
    email: Yup.string().required('Please enter your email'),
})

const ForgotPasswordForm = props => {

    const {disableSubmit = false, className, signInUrl = '/sign-in'} = props

    const [emailSent, setEmailSent] = useState(false)

    const [message, setMessage] = useTimeOutMessage()

    const onSendMail = async (values, setSubmitting) => {

        setSubmitting(true)
        try {
            await apiForgotPassword(values)
            setSubmitting(false)
            setEmailSent(true)

        } catch (errors) {
            setMessage(errors?.response?.data?.message || errors.toString())
            setSubmitting(false)
        }
    }

    return (
        <div className={className}>
            <div className="mb-6">
                {
                    emailSent ?
                        <>
                            <h3 className="mb-1">{t('auth.check_your_email')}</h3>
                            <p>{t('auth.check_your_email_desc')}</p>
                        </>
                        :
                        <>
                            <h3 className="mb-1">{t('auth.forget_password')}</h3>
                            <p>{t('auth.forget_password_desc')}</p>
                        </>
                }
            </div>
            {message && <Alert className="mb-4" type="danger" showIcon>{message}</Alert>}
            <Formik
                initialValues={{
                    email: 'admin@mail.com',
                }}
                validationSchema={validationSchema}
                onSubmit={(values, {setSubmitting}) => {
                    if (!disableSubmit) {
                        onSendMail(values, setSubmitting)
                    } else {
                        setSubmitting(false)
                    }
                }}
            >
                {({touched, errors, isSubmitting}) => (
                    <Form>
                        <FormContainer>
                            <div className={emailSent ? 'hidden' : ''}>
                                <FormItem
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
                            </div>
                            <Button block loading={isSubmitting} variant="solid" type="submit">
                                {emailSent ? t('common.resend_email') : t('common.send_email')}
                            </Button>
                            <div className="mt-4 text-center">
                                <span>Back to </span>
                                <ActionLink to={signInUrl}>
                                    {t('common.sign_in')}
                                </ActionLink>
                            </div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default ForgotPasswordForm