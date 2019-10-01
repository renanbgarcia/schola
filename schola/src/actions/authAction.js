import { SIGNUP_SUCCESS, SIGNUP_ERROR, SIGNIN_SUCCESS, SIGNIN_ERROR } from "./types";

export const userSignedIn = (user) => ({
    type: SIGNIN_SUCCESS,
    user: user
});