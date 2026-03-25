import axios from 'axios';

export type NetworkErrorKind = 'timeout' | 'http' | 'offline' | 'unknown';

export interface AppNetworkError {
  kind: NetworkErrorKind;
  message: string;
  status?: number;
}

export const isAppNetworkError = (error: unknown): error is AppNetworkError => {
  if (!error || typeof error !== 'object') {
    return false;
  }

  return 'kind' in error && 'message' in error;
};

export const getNetworkErrorMessage = (error: unknown): string => {
  if (isAppNetworkError(error)) {
    return error.message;
  }

  return 'No se pudo completar la operacion. Intentalo de nuevo.';
};

export const mapAxiosError = (error: unknown): AppNetworkError => {
  if (!axios.isAxiosError(error)) {
    return { kind: 'unknown', message: 'Error inesperado de red.' };
  }

  if (error.code === 'ECONNABORTED') {
    return { kind: 'timeout', message: 'La solicitud tardo demasiado. Intentalo de nuevo.' };
  }

  if (error.response) {
    return {
      kind: 'http',
      status: error.response.status,
      message: `Error HTTP ${error.response.status}.`,
    };
  }

  if (error.request) {
    return { kind: 'offline', message: 'No hay conexion con el servidor.' };
  }

  return { kind: 'unknown', message: 'Error de red no identificado.' };
};
