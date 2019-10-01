import { GET_USER } from './types';

export const getUser = (nome) => ({
    type: GET_USER,
    nome: nome
  });