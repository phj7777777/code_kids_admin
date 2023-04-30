import ApiService from './ApiService'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
    signInWithPopup,
    reauthenticateWithCredential,

    updateProfile,
    updatePassword,
    GoogleAuthProvider, EmailAuthProvider

} from "firebase/auth";
import { auth } from "../firebase-config";


export async function apiSignIn (data) {
    return signInWithEmailAndPassword(auth, data.email, data.password);
}

export async function apiSignUp (data) {
    return createUserWithEmailAndPassword(auth, data.email, data.password);

}

export async function apiSignOut () {
    return signOut(auth);
}

export async function apiForgotPassword (values) {
    return sendPasswordResetEmail(auth,values.email)
}

export async function apiResetPassword (oldPassword, newPassword) {

    try{
        const credential = EmailAuthProvider.credential(
            auth.currentUser.email,
            oldPassword
        );
        if(credential){
            await reauthenticateWithCredential(auth.currentUser, credential);

            await updatePassword(auth.currentUser, newPassword);

            return {'result': 'success'}
        }
        return null;
    }catch (e){
        return null;
    }

}

export async function apiUpdateUserInfo (data) {

    try{
        if(auth.currentUser.displayName != data.userName || auth.currentUser.photoURL != data.avatar){
            await updateProfile(auth.currentUser, {
                displayName: data.userName,
                photoURL: data.avatar,
            });
            return {'result': 'success', 'data':data}
        }else{
            return {'result': 'success', 'data': null}
        }
        return null;
    }catch (e){
        return null;
    }

}

export async function apiGoogleSignIn (data) {
    const googleProvider = new GoogleAuthProvider();

    return await signInWithPopup(auth, googleProvider);

}

