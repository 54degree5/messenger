import Head from 'next/head'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import useSWR from 'swr'
import styles from '../styles/Home.module.css'
import { useCookies } from "react-cookie"
import { useRouter } from 'next/router'


const fetcher = (...args) => fetch(...args).then(res => res.json()).then((data) => {
  let chat = []
  data.messages.forEach(msg => {
    chat.push(<div key={msg._id}><span className={styles.author}>{msg.sender}</span>: <div className={styles.messageblue}>{msg.content}</div></div>)
  })
  return chat
})

export default function Home() {
  const [message, setMessage] = useState("")
  const [username, setUsername] = useState("")
  const [cookie, setCookie] = useCookies(["username", "message"])
  const { data, ferror } = useSWR('/api/messages', fetcher, { refreshInterval: 100 })
  const router = useRouter()
  const messagesEnd = useRef(null)

  const MAX_AGE = 60 * 60 * (Math.random() * 999)
  let error = ""
  let canSend = true;

  useEffect(() => {
    if (username == '' && Boolean(cookie.username)) {
      setUsername(cookie.username)
    }
    if (message == '' && Boolean(cookie.message)) {
      setMessage(cookie.message)
    }
    messagesEnd.current.scrollIntoView({ behavior: "smooth" })
  }, [message, cookie.message, username, cookie.username])

  if (!Boolean(username) || String(username).replace(/ /gi, '').replace(/​/gi, '').replace(/ /gi, '') == "") {
    error = 'Отсутствует имя пользователя. Введите его в поле "Имя пользователя".'
    canSend = false
  }
  if (Boolean(username) && String(username).length > 16) {
    error = 'Имя пользователя слишком большое, оно должно быть не больше 16 символов.'
    canSend = false
  }

  if (!Boolean(message) || String(message).replace(/ /gi, '').replace(/​/gi, '').replace(/ /gi, '') == "") {
    canSend = false
  }

  if (!Boolean(error) && Boolean(ferror)) {
    error = "Не удалось получить сообщения"
    canSend = false
    console.log(ferror)
  }

  return (
    <div className={styles.container}>
      <button onClick={() => router.push("/easter_egg")}>Пасхалка)</button>
      <Head>
        <title>54degree5 Messenger</title>
        <meta name="description" content="54degree5 — это безинтернетный, полностью и анонимный мессенджер!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <center><h1>54degree5 Messenger — это <span className={styles.bluecol}>безинтернетный</span>, полностью <span className={styles.bluecol}>анонимный</span> мессенджер!</h1></center>
        <center><h3>Сайт сделан <span className={styles.bluecollink}><Link href={"https://github.com/54degree5"}>
          <a>
            Сухоцким Александром
          </a>
        </Link></span></h3></center>
        <div className={styles.messagebox}>{data}<div ref={messagesEnd} /></div>
        <main className={styles.main}>
          <div className={styles.form}>
            <form className={styles.sendcontainer} onSubmit={(e) => {
              e.preventDefault()
              setMessage("")
              setCookie("message", "", {
                path: "/",
                maxAge: MAX_AGE,
                sameSite: true,
              });
              fetch('/api/send', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  sender: username,
                  content: message
                })
              });
            }}>
              <input className={styles.username} onChange={(e) => {
                setCookie("username", e.target.value, {
                  path: "/",
                  maxAge: MAX_AGE,
                  sameSite: true,
                })
                setUsername(e.target.value)
              }} placeholder="Имя пользователя" value={username} />
              <input className={styles.msgbox} onChange={(e) => {
                setMessage(e.target.value);
                setCookie("message", e.target.value, {
                  path: "/",
                  maxAge: MAX_AGE,
                  sameSite: true,
                });
              }} value={message} placeholder="Сообщение" />
              <button className={styles.send} type="submit" disabled={!canSend}>
                {'>'}
              </button>
            </form>
            {error != '' && <p className={styles.error}>{error}</p>}
          </div>
        </main>
      </div>
    </div>
  )
}