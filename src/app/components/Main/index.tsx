'use client'
import Line from "@/app/components/Line";
import styles from "./index.module.css";
import PoemsList from "@/app/components/PoemsList";
import ScribbleHR from "@/app/components/Line/Horizontal"
import Socials from "@/app/components/SocialLinks";
import { useLoadingStore, usePrevious } from "@/app/lib/store/loadingStore";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function MainPage() {
   const isAppLoading = useLoadingStore(state => state.activeLoaders > 0)
   const pageRef = useRef<HTMLDivElement>(null)
   const prevIsAppLoading = usePrevious(isAppLoading)


   

   return (
      <main className={styles.page} ref={pageRef}>
         <header className={styles.header}>
            <div className={styles.title}>
               <h1>thoughtilets.</h1>
            </div>
            <div className={styles.links}>
               <Socials />
            </div>
         </header>
         <div>
            <ScribbleHR />
         </div>
         <section className={styles.contentWrapper}>
            <div className={styles.poemsColumn}>
               <PoemsList />
            </div>
            <div className={styles.lineColumn}>
               <Line />
               <h4>—thcl</h4>
            </div>
         </section>
      </main>
   )
}
