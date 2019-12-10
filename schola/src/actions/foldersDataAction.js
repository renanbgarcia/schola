import { UPDATE_FOLDERS_DATA } from "./types";

export const updateFoldersData = (data) => ({
    type: UPDATE_FOLDERS_DATA,
    categories: data
});