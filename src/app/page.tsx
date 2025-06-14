import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>thoughtilets.</h1>
          <h4>—thcl</h4>
        </div>
        <hr />
      </div>
    </div>
  );
}
