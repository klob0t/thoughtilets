import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { library } from '@fortawesome/fontawesome-svg-core'
import { faInstagram, faXTwitter, faMedium } from '@fortawesome/free-brands-svg-icons'
import styles from './index.module.css'

library.add(faInstagram, faXTwitter, faMedium)

const socials = [
   { href: 'https://instagram.com/thoughtilets', icon: 'instagram' as const },
   { href: 'https://x.com/thoughtilets', icon: 'x-twitter' as const },
   { href: 'https://medium.com/@thiacial', icon: 'medium' as const }
]

export default function Socials() {
   return (
      <div className={styles.social}>
         {socials.map(link => (
            <Link
               key={link.href}
               href={link.href}
               aria-label={`Follow me on ${link.icon}`} 
               className={styles.socialLink}
               target='_blank' 
               >
               <FontAwesomeIcon icon={['fab', link.icon] as IconProp} />
            </Link>
         ))}
      </div>
   )
}