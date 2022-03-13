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
    chat.push(<p><span className={styles.author}>{msg.sender}</span>: <div className={styles.messageblue}>{msg.content}</div></p>)
  })
  return chat
})

export default function Home() {
  const [message, setMessage] = useState("")
  const [username, setUsername] = useState("lolxdlolidkthisisaneasteregg")
  const { data, ferror } = useSWR('/api/messages', fetcher, { refreshInterval: 100 })
  const messagesEnd = useRef(null)
  let error = ""
  let canSend = true;
  const MAX_AGE = 60 * 60 * 999
  const [cookie, setCookie] = useCookies(["username"], ["message"])
  const [usernameCookie, setUsernameCookie] = useState(cookie.username)
  const rter = useRouter()

  if (username == 'lolxdlolidkthisisaneasteregg') {
    setUsername(usernameCookie)
  }
  if (username) {
    if (String(username).replace(/ /gi, '').replace(/​/gi, '').replace(/ /gi, '') == "") {
      error = 'Отсутствует имя пользователя. Введите его в поле "Имя пользователя".'
      canSend = false
    }
    if (String(username).length > 16) {
      error = 'Имя пользователя слишком большое, оно должно быть не больше 16 символов.'
      canSend = false
    }
  }
  if (username == "") {
    error = 'Отсутствует имя пользователя. Введите его в поле "Имя пользователя".'
      canSend = false
  }
  if (message.replace(/ /gi, '').replace(/​/gi, '').replace(/ /gi, '') == "") {
    canSend = false
  }
  useEffect(() =>
    messagesEnd.current.scrollIntoView({ behavior: "smooth" })
  )
  return (
    <div className={styles.container}>
      <button onClick={() => rter.push("/easter_egg")}>Пасхалка)</button>
      <Head>
        <title>54degree5 Messenger</title>
        <meta name="description" content="54degree5 — это безинтернетный, полностью и анонимный мессенджер!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <center><h1>54degree5 Messenger — это <span className={styles.bluecol}>безинтернетный</span>, полностью <span className={styles.bluecol}>анонимный</span> мессенджер!</h1></center>
        <center className><h3>Сайт сделан <span className={styles.bluecollink}><Link href={"https://github.com/54degree5"}>
          <a>
            Сухоцким Александром
          </a>
        </Link></span></h3></center>
        <div className={styles.messagebox}>{data}<div ref={messagesEnd} /></div>
        <main className={styles.main}>
          <form className={styles.form} onSubmit={(e) => {
            setMessage("")
            e.preventDefault()
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
            <div className={styles.sendcontainer}>
              <input className={styles.username} onChange={(e) => {
                setUsernameCookie(e.target.value)
                console.log(usernameCookie)
                try {
                  setCookie("username", e.target.value, {
                    path: "/",
                    maxAge: MAX_AGE,
                    sameSite: true,
                  })
                } catch (err) {
                  console.log(err)
                }
                setUsername(e.target.value)
              }} placeholder="Имя пользователя" value={usernameCookie} />
              <input className={styles.msgbox} onChange={(e) => { setMessage(e.target.value) }} value={message} placeholder="Сообщение" />
              <button className={styles.send} type="submit" disabled={!canSend}>
                {'>'}
              </button>
            </div>
            {error != '' && <p className={styles.error}>{error}</p>}
          </form>
        </main>
      </div>
    </div>
  )
}