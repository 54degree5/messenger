import Link from 'next/link'
import styles from '../styles/Home.module.css'
export default function Poop() {
  return (
    <div>
      <div className={styles.main}>
        <div className={styles.card}>
          <b>пасхалка)</b>
        </div>
      </div>
      <div className={styles.form}>
        <b><Link href=".">На Главную</Link></b>
      </div>
    </div>
  )
}
