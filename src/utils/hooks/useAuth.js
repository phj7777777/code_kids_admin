import { useSelector, useDispatch } from 'react-redux'
import { setUser, initialState } from 'store/auth/userSlice'
import {apiGoogleSignIn, apiSignIn, apiSignOut} from 'services/AuthService'
import { onSignInSuccess, onSignOutSuccess } from 'store/auth/sessionSlice'
import appConfig from 'configs/app.config'
import { REDIRECT_URL_KEY } from 'constants/app.constant'
import { useNavigate } from 'react-router-dom'
import useQuery from './useQuery'
import {ADMIN, USER} from "../../constants/roles.constant";


function useAuth() {

	const dispatch = useDispatch()

	const navigate = useNavigate()

	const query = useQuery()

	const { token, signedIn } = useSelector((state) => state.auth.session)

	const signIn = async ({  email, password }) => {
		try {
			const resp = await apiSignIn({ email, password })
			if (resp?.user) {
				const token = await resp.user.getIdToken();
				dispatch(onSignInSuccess(token))
				if(resp.user) {
					dispatch(setUser({
						avatar: resp.user.photoURL,
						userName: resp.user.displayName,
						authority: [ADMIN],
						email: resp.user.email
					}|| {
						avatar: '',
						userName: 'Anonymous',
						authority: [USER],
						email: ''
					}))
				}
				const redirectUrl = query.get(REDIRECT_URL_KEY)
				console.log(redirectUrl)
				navigate(redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath)
				return {
					status: 'success',
					message: ''
				}
			}
		} catch (errors) {
			return {
				status: 'failed',
				message: errors?.response?.data?.message || errors.toString()
			}
		}
	}


	const signInWithGoogle = async () => {
		try {
			const res = await apiGoogleSignIn();
			if (res.user) {
				const token = await res.user.getIdToken();
				dispatch(onSignInSuccess(token))
				if (res.user) {
					dispatch(setUser({
						avatar: res.user.photoURL,
						userName: res.user.displayName,
						authority: [ADMIN],
						email: res.user.email
					} || {
						avatar: '',
						userName: 'Anonymous',
						authority: [USER],
						email: ''
					}))
				}
				navigate(appConfig.tourPath)
			}
		} catch (err) {
			return {
				status: 'failed',
				message: err?.response?.data?.message || err.toString()
			}
		}
	};

	const handleSignOut = ()  => {
		dispatch(onSignOutSuccess())
		dispatch(setUser(initialState))
		navigate(appConfig.unAuthenticatedEntryPath)
	}

	const signOut = async () => {
		try {
			await apiSignOut()
			handleSignOut()
		} catch (errors) {
			handleSignOut()
		}
	}

	return {
		authenticated: token && signedIn,
		signIn,
		signOut,
		signInWithGoogle
	}
}

export default useAuth