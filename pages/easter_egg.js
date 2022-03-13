import styles from '../styles/Easter.module.css'
import { FullScreen, useFullScreenHandle } from "react-full-screen";

export default function Poop() {
  const handle = useFullScreenHandle();
  return (
    <div>
      <button onClick={handle.enter} className={styles.button}>
        ЕЩЕ НЕ ПОЗДНО 
        <br></br>
        НЕ НАЖИМАЙ НА ЭКРАН!!!
      </button>
      <FullScreen handle={handle} className={styles.hacked}>
        <img src="/YOUWEREHACKED.png"></img>
      </FullScreen>
    </div>
  )
}