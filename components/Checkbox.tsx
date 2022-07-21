import styles from '../styles/Checkbox.module.css';

export type CheckboxVariant = 'empty' | 'correct' | 'incorrect';

interface CheckboxProps {
  variant: CheckboxVariant;
}

const Checkbox: React.FunctionComponent<CheckboxProps> = ({ variant }) => {
  const className =
    variant === 'empty'
      ? styles.checkboxEmpty
      : variant === 'correct'
      ? styles.checkboxCorrect
      : styles.checkboxIncorrect;

  return <div className={className} />;
};

export default Checkbox;
