import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import useSWR from 'swr'
import styles from '../styles/Home.module.css'

const fetcher = (...args) => fetch(...args).then(res => res.json()).then((data) => {
  let chat = []
  data.messages.forEach(msg => {
    chat.push(<p><span className={styles.author}>{msg.sender}</span>: <div className={styles.messageblue}>{msg.content}</div></p>)
  })
  return chat
})



export default function Home() {
  const [message, setMessage] = useState("")
  const [username, setUsername] = useState("user" + Math.floor(Math.random() * 1000))
  const { data, ferror } = useSWR('/api/messages', fetcher, { refreshInterval: 1000 })

  let error = ""
  let canSend = true;

  if (username == "") {
    error = 'Отсутствует имя пользователя. Введите его в поле "Имя пользователя".'
    canSend = false
  } else {
    if (message == "") {
      error = 'Отсутствует сообщение. Введите его в поле "Сообщение".'
      canSend = false
    }
    error = ''
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>54degree5 Messenger</title>
        <meta name="description" content="54degree5 — это безинтернетный, полностью и анонимный мессенджер!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
      <center><h1>54degree5 — это безинтернетный, полнустью анонимный мессенджер!</h1></center>
      <div className={styles.messagebox}>{data}</div>
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
            //setData([...data, (<p key="as">{username}: {message}</p>)]);
          }}>
            <div className={styles.sendcontainer}>
              <input className={styles.username} onChange={(e) => {
                setUsername(e.target.value)
              }} placeholder="Имя пользователя" value={username} />
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