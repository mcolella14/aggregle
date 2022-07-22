import { useState, useEffect } from 'react';
import axios from 'axios';
import type { GetServerSideProps, NextPage } from 'next';
import Cookies from 'js-cookie';

import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import styles from '../styles/Home.module.css';

import HelpModal from '../components/help-modal';
import EndingModal from '../components/ending-modal';
import ErrorPopup from '../components/error-popup';
import Checkbox from '../components/checkbox';
import type { CheckboxVariant } from '../components/checkbox';

import JSON5 from 'json5';

import useDidUpdate from '../hooks/use-did-update';
interface Problem {
  _id: string;
  input: object[];
  output: object[];
  date: string;
}
interface HomeProps {
  problem: Problem;
}

const Home: NextPage<HomeProps> = ({ problem }) => {
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [endingModalOpen, setEndingModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState<{ [key: number]: CheckboxVariant }>({
    1: 'empty',
    2: 'empty',
    3: 'empty',
    4: 'empty',
    5: 'empty',
  });
  const [currentTry, setCurrentTry] = useState<number>(1);
  const [solution, setSolution] = useState<string>('[\n\n]');
  const [succeeded, setSucceded] = useState(false);

  const errorMessage = (message: string, ms: number) => {
    setError(message);
    setTimeout(() => setError(null), ms);
  };

  const setStateCookie = () => {
    const state = {
      attempts,
      succeeded,
      solution,
      currentTry,
      date: problem.date,
    };
    const stateString = JSON.stringify(state);
    Cookies.set('aggregleState', stateString, { expires: 1 });
  };

  const onSubmit = async () => {
    if (currentTry > 5 || succeeded) {
      return;
    }

    // Validate the json string solution.
    let solutionObject;
    try {
      solutionObject = JSON5.parse(solution);
    } catch {
      errorMessage('Pipeline must be a valid JavaScript array.', 3000);
      return;
    }

    if (!Array.isArray(solutionObject)) {
      errorMessage('Pipeline must be a JavaScript array.', 3000);
      return;
    }

    if (!solutionObject.every(obj => typeof obj === 'object')) {
      errorMessage('Pipeline array must only contain objects.', 3000);
      return;
    }

    let result;
    setIsLoading(true);
    try {
      result = await axios.post<{ correct: boolean }>('/api/checkAnswer', {
        date: problem.date,
        solution,
      });
    } catch (err: any) {
      setIsLoading(false);
      errorMessage('Something went wrong, please try again', 3000);
      return;
    }
    setIsLoading(false);

    if (result.data.correct) {
      setAttempts({ ...attempts, [currentTry]: 'correct' });
      setSucceded(true);
      setEndingModalOpen(true);
      return;
    }

    setAttempts({ ...attempts, [currentTry]: 'incorrect' });
    setCurrentTry(currentTry + 1);
    if (currentTry === 5) {
      setEndingModalOpen(true);
    }
  };

  useEffect(() => {
    const stateString = Cookies.get('aggregleState');
    if (!stateString) {
      setHelpModalOpen(true);
      setStateCookie();
      return;
    }
    const { attempts, succeeded, solution, currentTry, date } =
      JSON5.parse(stateString);

    if (date !== problem.date) {
      setHelpModalOpen(true);
      setStateCookie();
      return;
    }

    setAttempts(attempts);
    setSucceded(succeeded);
    setSolution(solution);
    setCurrentTry(currentTry);

    if (succeeded || currentTry > 5) {
      setEndingModalOpen(true);
    }
  }, []);

  useDidUpdate(() => {
    setStateCookie();
  }, [attempts, succeeded, solution, currentTry, problem.date]);

  if (!problem) {
    return <h2 className={styles.text}>Sorry, no problem today /:</h2>;
  }

  return (
    <>
      <header className={styles.header}>
        <div className={styles.dummyTitleFlex} />
        <h1 className={styles.title}>Aggregle</h1>
        <img
          className={styles.infoIcon}
          src="/info-icon.svg"
          alt="Open help modal"
          onClick={() => setHelpModalOpen(true)}
        />
      </header>
      <div className={styles.grid}>
        <div>
          <h3 className={styles.text}>Input</h3>
          <CodeMirror
            value={JSON5.stringify(problem.input, null, 4)}
            extensions={[javascript()]}
            editable={false}
            className={styles.codeBox}
            height="500px"
          />
        </div>
        <div>
          <h3 className={styles.text}>Pipeline</h3>
          <CodeMirror
            value={solution}
            extensions={[javascript()]}
            className={styles.editableCodeBox}
            height="500px"
            autoFocus
            theme="dark"
            onChange={value => setSolution(value)}
          />
        </div>
        <div>
          <h3 className={styles.text}>Output</h3>
          <CodeMirror
            value={JSON5.stringify(problem.output, null, 4)}
            extensions={[javascript()]}
            editable={false}
            className={styles.codeBox}
            height="500px"
          />
        </div>
      </div>
      <footer className={styles.footer}>
        <div className={styles.checkboxFlex}>
          <Checkbox variant={attempts[1]} />
          <Checkbox variant={attempts[2]} />
          <Checkbox variant={attempts[3]} />
          <Checkbox variant={attempts[4]} />
          <Checkbox variant={attempts[5]} />
        </div>

        {isLoading ? (
          <div className={styles.backdrop}>
            <div className={styles.spinner} />
          </div>
        ) : (
          <button className={styles.submit} onClick={onSubmit}>
            Submit
          </button>
        )}
      </footer>
      {helpModalOpen && <HelpModal onClose={() => setHelpModalOpen(false)} />}
      {endingModalOpen && (
        <EndingModal tries={currentTry} success={succeeded} />
      )}
      {error && <ErrorPopup message={error} />}
    </>
  );
};

export const getServerSideProps: GetServerSideProps<{
  problem: Problem;
}> = async () => {
  const url = process.env['DATA_API_URL'];
  if (!url) {
    throw Error('DATA_API_URL is not defined');
  }
  const apiKey = process.env['DATA_API_KEY'];
  if (!apiKey) {
    throw Error('DATA_API_KEY is not defined');
  }

  const headers = { 'api-key': apiKey };

  const localDate = new Date();
  const date = localDate.toISOString().split('T')[0];
  const body = {
    dataSource: 'aggregle',
    database: 'aggregle',
    collection: 'problems',
    filter: { date },
  };
  const resp = await axios.post<{ document: Problem }>(
    `${url}/action/findOne`,
    body,
    { headers }
  );

  return { props: { problem: resp.data.document } };
};

export default Home;
