import styles from '../styles/modal.module.css';

interface HelpModalProps {
  onClose: () => void;
}

const HelpModal: React.FunctionComponent<HelpModalProps> = ({ onClose }) => {
  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <img
          src="/close.svg"
          alt="close-icon"
          className={styles.closeIcon}
          onClick={onClose}
        />
        <h2 className={styles.mainHeading}>How to Play</h2>
        <p>
          The main goal is to transform the{' '}
          <b className={styles.greenText}>input</b> set of documents into the{' '}
          <b className={styles.greenText}>output</b> set of documents by writing
          an aggregation <b className={styles.greenText}> pipeline</b>.
        </p>
        <h3 className={styles.greenText}>Input</h3>
        <p>
          Treat this as the collection to run the aggregation pipeline on. It
          may help to this of this as a collection called{' '}
          <code className={styles.greenText}>input</code>.
        </p>
        <h3 className={styles.greenText}>Pipeline</h3>
        <p>
          This is where you write an{' '}
          <a
            target="_blank"
            rel="noreferrer"
            href="https://www.mongodb.com/docs/manual/core/aggregation-pipeline/"
          >
            Aggregation Pipeline
          </a>{' '}
          to transform the input into the output. This is what would be passed
          as an argument if we were to call{' '}
          <code className={styles.greenText}>{'input.aggregate'}</code>.
        </p>
        <p>
          <b>Please note that this must be formatted as valid JSON.</b>
        </p>

        <h3 className={styles.greenText}>Output</h3>
        <p>
          This is the desired result of processing the{' '}
          <code className={styles.greenText}>input</code> collection through the
          pipeline that you build. The goal is to have{' '}
          <code className={styles.greenText}>
            {'input.aggregate(<pipeline>)'}
          </code>{' '}
          result in this set of documents.
        </p>
      </div>
    </div>
  );
};

export default HelpModal;
