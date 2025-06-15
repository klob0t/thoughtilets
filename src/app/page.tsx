import Line from "@/app/components/Line";
import styles from "./page.module.css";
import PoemsList from "@/app/components/PoemsList";
import ScribbleHR from "@/app/components/Line/Horizontal"
import Socials from "@/app/components/SocialLinks";

export default function Home() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.title}>
          <h1>thoughtilets.</h1>
          <h4>—thcl</h4>
        </div>
        <div className={styles.links}>
          <Socials />
        </div>
      </header>
      <div style={{ margin: '2rem 0' }}>
        <ScribbleHR />
      </div>
      <section className={styles.contentWrapper}>
        <div className={styles.poemsColumn}>
          <PoemsList />
        </div>
        <div className={styles.lineColumn}>
          <Line />
        </div>
      </section>
    </main>
  )
}
