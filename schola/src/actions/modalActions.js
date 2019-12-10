import { HIDE_CREATELESSON_MODAL, SHOW_CREATELESSON_MODAL, HIDE_CREATECOURSE_MODAL, SHOW_CREATECOURSE_MODAL } from './types';

export const hideCreateLessonModal = () => ({
    type: HIDE_CREATELESSON_MODAL,
    isOpen: false
});

export const showCreateLessonModal = () => ({
    type: SHOW_CREATELESSON_MODAL,
    isOpen: true
});

export const hideCreateCourseModal = () => ({
    type: HIDE_CREATECOURSE_MODAL,
    isOpen: false
});

export const showCreateCourseModal = () => ({
    type: SHOW_CREATECOURSE_MODAL,
    isOpen: true
});