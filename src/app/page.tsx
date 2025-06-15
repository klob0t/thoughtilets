import Line from "@/app/components/Line";
import styles from "./page.module.css";
import PoemsList from "@/app/components/PoemsList";
import ScribbleHR from "@/app/components/Line/Horizontal";

export default function Home() {
  return (
    // The main page container
    <div className={styles.page}>
      
      {/* The header remains as it was */}
      <div className={styles.header}>
        <h1>thoughtilets.</h1>
        <h4>—thcl</h4>
      </div>
      <div style={{ margin: '2rem 0' }}>
        <ScribbleHR />
      </div>

      {/* This new wrapper creates the two-column layout */}
      <div className={styles.contentWrapper}>
        
        {/* Column 1: The scrolling list of poems */}
        <div className={styles.poemsColumn}>
          <PoemsList />
        </div>

        {/* Column 2: The sticky line art */}
        <div className={styles.lineColumn}>
          <Line />
        </div>
        
      </div>

    </div>
  )
}
