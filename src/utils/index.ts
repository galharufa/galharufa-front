import { toast, ToastOptions } from 'react-toastify';
import { formatarData, formatarMoeda } from './formatters';
import buildToastMessage from './toastMessage';
export * from './constants';
export * from './countriesList';
export * from './toastMessage';

export { formatarData, formatarMoeda };
// export const successToast = (message: string) => {
//   toast.success(message, {
//     position: 'top-right',
//     autoClose: 5000,
//     hideProgressBar: false,
//     closeOnClick: true,
//     pauseOnHover: true,
//     draggable: true,
//   });
// };

// export const errorToast = (message: string) => {
//   toast.error(message, {
//     position: 'top-right',
//     autoClose: 5000,
//     hideProgressBar: false,
//     closeOnClick: true,
//     pauseOnHover: true,
//     draggable: true,
//   });
// };

// export const warningToast = (message: string) => {
//   toast.warning(message, {
//     position: 'top-right',
//     autoClose: 5000,
//     hideProgressBar: false,
//     closeOnClick: true,
//     pauseOnHover: true,
//     draggable: true,
//   });
// };

// export const infoToast = (message: string) => {
//   toast.info(message, {
//     position: 'top-right',
//     autoClose: 5000,
//     hideProgressBar: false,
//     closeOnClick: true,
//     pauseOnHover: true,
//     draggable: true,
//   });
// };

const defaultOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const successToast = (message: string, title?: string) =>
  toast.success(
    buildToastMessage(title ?? message, title ? message : undefined),
    defaultOptions,
  );

export const errorToast = (message: string, title?: string) =>
  toast.error(
    buildToastMessage(title ?? message, title ? message : undefined),
    defaultOptions,
  );

export const warningToast = (message: string, title?: string) =>
  toast.warning(
    buildToastMessage(title ?? message, title ? message : undefined),
    defaultOptions,
  );

export const infoToast = (message: string, title?: string) =>
  toast.info(
    buildToastMessage(title ?? message, title ? message : undefined),
    defaultOptions,
  );
