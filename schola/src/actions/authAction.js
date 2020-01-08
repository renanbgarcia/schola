import { SIGNIN_SUCCESS, SIGNOUT_SUCCESS, UPDATE_USER } from "./types";

export const userSignedIn = (user) => ({
    type: SIGNIN_SUCCESS,
    user: user
});

export const userSignedOut = () => ({
    type: SIGNOUT_SUCCESS,
    user: 'Loading'
});

export const updateUser = (updatedUser) => ({
    type: UPDATE_USER,
    user: updatedUser
});