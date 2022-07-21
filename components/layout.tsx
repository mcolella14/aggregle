import styles from '../styles/Home.module.css';

const Layout: React.FC<{ children: JSX.Element }> = ({ children }) => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>{children}</main>
    </div>
  );
};

export default Layout;
