import { useRouter } from 'next/router'
import { useState } from 'react'
import styles from '../styles/Error.module.css'

export default function Error404() {
    const [left, setLeft] = useState(5)
    const router = useRouter()
    setTimeout(() => {
        if (left <= 1) router.push('/')
        setLeft(left - 1)
    }, 1000)

    return (
        <div className={styles.main}>
            <img width={270} src="/404error.png"/>
            <span className={styles.headline}>Страница не найдена</span>
            <span className={styles.hl}>
            Мы вернём вас домой через {left} секунд.
            </span>
        </div>
    )
}