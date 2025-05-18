// import { toast, ToastOptions } from 'react-toastify';

const buildToastMessage = (
  titleOrMessage: string,
  maybeMessage?: string,
): React.ReactNode => {
  if (maybeMessage) {
    // Caso em que foi passado title + message
    return (
      <div>
        <strong>{titleOrMessage}</strong>
        <div>{maybeMessage}</div>
      </div>
    );
  }

  // Caso em que só foi passado message
  return titleOrMessage;
};

export default buildToastMessage;
