import { SHOW_MENU, HIDE_MENU } from "./types";

export const showMenu = () => ({
    type: SHOW_MENU,
    isMenuVisible: true
});

export const hideMenu = () => ({
    type: HIDE_MENU,
    isMenuVisible: false
});