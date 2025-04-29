import { showNotification } from '@mantine/notifications';

type ToastType = 'success' | 'error';

const toast = ({
  title,
  message,
  type,
}: {
  title: string;
  message: string;
  type: ToastType;
}) => {
  showNotification({
    autoClose: 5000,
    title,
    message,
    color: type === 'success' ? 'green' : 'red',
  });
};

export const successToast = (message: string, title = 'Sucesso') => {
  toast({ type: 'success', title, message });
};

export const errorToast = (
  message = 'Houve um erro, tente novamente.',
  title = 'Erro',
) => {
  toast({ type: 'error', title, message });
};
