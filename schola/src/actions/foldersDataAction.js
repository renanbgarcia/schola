import { UPDATE_FOLDERS_DATA, UPDATE_ACTUAL_VIEW, INVALIDATE_FOLDERS_DATA, REQUEST_FOLDERS_DATA } from "./types";

export const updateFoldersData = (data) => ({
    type: UPDATE_FOLDERS_DATA,
    items: data
});

export const invalidateFoldersData = () => ({
    type: INVALIDATE_FOLDERS_DATA,
});

export const requestFoldersData = () => ({
    type: REQUEST_FOLDERS_DATA,
});

export const updateActualView = (data) => ({
    type: UPDATE_ACTUAL_VIEW,
    actualView: data
})