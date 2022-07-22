import { useEffect, useState } from 'react';
import styles from '../styles/modal.module.css';

interface HelpModalProps {
  success: boolean;
  tries: number;
}

const pad = (n: number): string => {
  return n < 10 ? `0${n}` : `${n}`;
};

const Clock: React.FunctionComponent = () => {
  const [hours, setHours] = useState('00');
  const [minutes, setMinutes] = useState('00');
  const [seconds, setSeconds] = useState('00');

  useEffect(() => {
    const id = setInterval(() => {
      const date = new Date();
      setHours(pad(23 - date.getHours()));
      setMinutes(pad(59 - date.getMinutes()));
      setSeconds(pad(59 - date.getSeconds()));
    });
    return () => clearInterval(id);
  }, []);

  return (
    <div className={styles.countdown}>
      {hours}:{minutes}:{seconds}
    </div>
  );
};

const EndingModal: React.FunctionComponent<HelpModalProps> = ({
  success,
  tries,
}) => {
  const text = success ? (
    `You won in ${tries} ${tries > 1 ? 'tries' : 'try'}, nice job!`
  ) : (
    <span>
      You lost today, but fear not:{'\n'}
      <p>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://www.youtube.com/watch?v=Nc6EfuSc-Fo"
        >
          &quot;There&apos;s always tomorrow&quot;
        </a>{' '}
        - Clarice the Reindeer
      </p>
      <span style={{ fontSize: '1rem' }}>
        Or just like clear your cookies and try again...
      </span>
    </span>
  );
  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <h2 className={styles.mainHeading}>{text}</h2>
        <h3 className={styles.alignCenter}>Next Aggregle in:</h3>
        <Clock />
      </div>
    </div>
  );
};

export default EndingModal;
