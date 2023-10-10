import { takeLatest, put, all, call, take } from "redux-saga/effects";


import { USER_ACTION_TYPES } from "./user.types";

import { signInSuccess, signInFailed, signOutSuccess, signOutFailed, signUpSuccess, signUpFailed } from "./user.action";
import { createUserDocumentFromAuth, signInWithGooglePopup, createAuthUserWithEmailAndPassword, getCurrentUser, signOutUser, signInAuthUserWithEmailAndPassword } from "../../utils/firebase/firebase.utils";

export function* getSnapshotFromUserAuth(userAuth, additionalData) {
    try {
        const userSnapshot = yield call(createUserDocumentFromAuth, userAuth, additionalData);

        yield put(signInSuccess({ id: userSnapshot.id, ...userSnapshot.data() }));
    } catch (error) {
        yield put(signInFailed(error));
    }
}
export function* signInWithGoogle() {
    try {
        const { user } = yield call(signInWithGooglePopup);
        if (!user) {
            console.log("no user")
            return
        };
        console.log(user);
        yield call(getSnapshotFromUserAuth, user);
    } catch (error) {
        yield put(signInFailed(error));
    }
}
export function* isUserAuth() {
    try {
        const userAuth = yield call(getCurrentUser);
        if (!userAuth) {
            console.log("no user")
            return
        };
        console.log(userAuth)
        yield call(getSnapshotFromUserAuth, userAuth);
    } catch (error) {
        yield put(signInFailed(error));
    }
}
export function* signInWithEmailAndPassword({ payload: { email, password } }) {
    try {

        const { user } = yield call(signInAuthUserWithEmailAndPassword, email, password);
        yield call(getSnapshotFromUserAuth, user);
    } catch (error) {
        yield put(signInFailed(error));
    }
};
export function* signOutUserStart() {
    try {
        yield call(signOutUser);
        yield put(signOutSuccess());
    } catch (error) {
        yield put(signOutFailed(error));
    }
}
export function* SignUpStart({ payload: { email, password, displayName } }) {
    try {
        console.log(email, password, displayName)
        const { user } = yield call(createAuthUserWithEmailAndPassword, email, password);
        const auth = { ...user, displayName: displayName }
        console.log(auth)
        yield call(getSnapshotFromUserAuth, auth);

    } catch (error) {
        yield put(signUpFailed(error));
    }
}
export function* onSignUpStart() {
    yield takeLatest(USER_ACTION_TYPES.SIGN_UP_START, SignUpStart);
}
export function* onEmailSignInStart() {
    yield takeLatest(USER_ACTION_TYPES.EMAIL_SIGN_IN_START, signInWithEmailAndPassword);
}
export function* onGoogleSignInStart() {
    yield takeLatest(USER_ACTION_TYPES.GOOGLE_SIGN_IN_START, signInWithGoogle);
}
export function* onCheckUserSession() {
    yield takeLatest(USER_ACTION_TYPES.CHECK_USER_SESSION, isUserAuth);
}
export function* onSignOutStart() {
    yield takeLatest(USER_ACTION_TYPES.SIGN_OUT_START, signOutUserStart);
}
export function* userSaga() {
    yield all([call(onCheckUserSession), call(onGoogleSignInStart), call(onEmailSignInStart), call(onSignOutStart), call(onSignUpStart)]);
}