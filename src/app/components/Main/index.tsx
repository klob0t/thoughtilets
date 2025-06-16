'use client'
import Line from "@/app/components/Line";
import styles from "./index.module.css";
import PoemsList from "@/app/components/PoemsList";
import ScribbleHR from "@/app/components/Line/Horizontal"
import Socials from "@/app/components/SocialLinks";
import { useLoadingStore } from "@/app/lib/store/loadingStore";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function MainPage() {
   const isAppLoading = useLoadingStore(state => state.activeLoaders > 0)
   const pageRef = useRef<HTMLDivElement>(null)
   const { finishLoading } = useLoadingStore()

   useEffect(() => {
      finishLoading('Initial Page Load')
   }, [finishLoading])


   useGSAP(() => {
      const page = pageRef.current

      if (!isAppLoading) {
         gsap.fromTo(page, {
            opacity: 0,
         }, {
            opacity: 1,
            duration: 1,
         })
      }
   }, {dependencies: [isAppLoading]})


   return (
      <main className={styles.page} ref={pageRef} style={{ opacity: 0}}>
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
