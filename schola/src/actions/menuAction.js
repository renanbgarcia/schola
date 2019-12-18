import { SHOW_MENU,
        HIDE_MENU, SHOW_POPMENU,
        HIDE_POPMENU,
        UPDATE_POPMENU_POSITION,
        UPDATE_POPMENU_TARGET } from "./types";

export const showMenu = () => ({
    type: SHOW_MENU,
    isMenuVisible: true
});

export const hideMenu = () => ({
    type: HIDE_MENU,
    isMenuVisible: false
});

export const showPopMenu = () => ({
    type: SHOW_POPMENU,
    isPopMenuVisible: true
});

export const hidePopMenu = () => ({
    type: HIDE_POPMENU,
    isPopMenuVisible: false
});

export const updatePopMenuPosition = (x, y) => ({
    type: UPDATE_POPMENU_POSITION,
    popMenuPositionX: x,
    popMenuPositionY: y
});

export const updatePopMenuTarget = (target) => ({
    type: UPDATE_POPMENU_TARGET,
    popMenuTarget: target
});