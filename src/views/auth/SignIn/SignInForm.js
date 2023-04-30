import React, {useState} from 'react'
import {Input, Button, Checkbox, FormItem, FormContainer, Alert} from 'components/ui'
import {PasswordInput, ActionLink} from 'components/shared'
import useTimeOutMessage from 'utils/hooks/useTimeOutMessage'
import {Field, Form, Formik} from 'formik'
import * as Yup from 'yup'
import useAuth from 'utils/hooks/useAuth'
import { FcGoogle } from "react-icons/fc";
import {t} from "i18next";
const validationSchema = Yup.object().shape({
    email: Yup.string().required('Please enter your user name'),
    password: Yup.string().required('Please enter your password'),
    rememberMe: Yup.bool()
})

const SignInForm = props => {

    const {
        disableSubmit = false, className, forgotPasswordUrl = '/forgot-password', signUpUrl = '/sign-up'
    } = props

    const [message, setMessage] = useTimeOutMessage()
    const [loading, setLoading] = useState(false)

    const {signIn, signInWithGoogle} = useAuth()

    const onSignIn = async (values, setSubmitting) => {
        const {email, password} = values
        setSubmitting(true)

        const result = await signIn({email, password})

        if (result.status === 'failed') {
            setMessage(result.message)
        }

        setSubmitting(false)
    }

    const onSignInWithGoogle = async () => {
        setLoading(true)
        const result = await signInWithGoogle()

        if (result.status === 'failed') {
            setMessage(result.message)
        }

        setLoading(false)
    }

    return (<div className={className}>
        {message && <Alert className="mb-4" type="danger" showIcon>{message}</Alert>}
        <Formik
            // Remove this initial value
            initialValues={{
                email: 'admin', password: '123Qwe', rememberMe: true
            }}
            validationSchema={validationSchema}
            onSubmit={(values, {setSubmitting}) => {
                if (!disableSubmit) {
                    onSignIn(values, setSubmitting)
                } else {
                    setSubmitting(false)
                }
            }}
        >
            {({touched, errors, isSubmitting}) => (<Form>
                <FormContainer>
                    <FormItem
                        label={t('auth.username')}
                        invalid={errors.email && touched.email}
                        errorMessage={errors.email}
                    >
                        <Field
                            type="text"
                            autoComplete="off"
                            name="email"
                            placeholder={t('auth.username')}
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
                    <div className="flex justify-between mb-6">
                        <Field className="mb-0" name="rememberMe" component={Checkbox} children="Remember Me"/>
                        <ActionLink to={forgotPasswordUrl}>
                            {t('auth.forget_password')}?
                        </ActionLink>
                    </div>
                    <Button block loading={isSubmitting} variant="solid" type="submit">
                        {isSubmitting ?  t('auth.signing_in'): t('auth.sign_in')}
                    </Button>

                    <div className="my-3 text-center"><span> {t('auth.or')} </span></div>
                    <Button type="button" block onClick={onSignInWithGoogle} loading={loading} icon={<FcGoogle/>}>
                        <span className="pl-2">
                            <span>{t('auth.continue_with_google')}</span>
                        </span>
                    </Button>

                    <div className="mt-4 text-center">
                        <span> {t('auth.dont_have_account')}</span>
                        <ActionLink to={signUpUrl}>
                            {t('auth.sign_up')}
                        </ActionLink>
                    </div>
                </FormContainer>
            </Form>)}
        </Formik>


    </div>)
}

export default SignInForm