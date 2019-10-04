import { SIGNIN_SUCCESS, SIGNOUT_SUCCESS } from "./types";

export const userSignedIn = (user) => ({
    type: SIGNIN_SUCCESS,
    user: user
});

export const userSignedOut = () => ({
    type: SIGNOUT_SUCCESS,
    user: 'Loading'
});