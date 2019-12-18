import { UPDATE_FOLDERS_DATA, UPDATE_ACTUAL_VIEW } from "./types";

export const updateFoldersData = (data) => ({
    type: UPDATE_FOLDERS_DATA,
    categories: data
});

export const updateActualView = (data) => ({
    type: UPDATE_ACTUAL_VIEW,
    actualView: data
})