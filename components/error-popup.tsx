import styles from '../styles/error-popup.module.css';

interface ErrorPopupProps {
  message: string;
}

const ErrorPopup: React.FunctionComponent<ErrorPopupProps> = ({ message }) => {
  return <div className={styles.error}>{message}</div>;
};

export default ErrorPopup;
