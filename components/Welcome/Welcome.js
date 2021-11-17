import { useEffect, useState } from 'react'
import styles from './Welcome.module.css'

export default function Welcome({ onConnect }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(true)
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.windows}>
        <div className={styles.window} />
        <div className={styles.center}>
          <img className={styles.logo} src="/images/logo_black.png" alt="Logo" />
        </div>
        <div className={styles.window} />
      </div>
      <div className={`${styles.windows} ${styles.main}`}>
        <div className={styles.window} />
        <div className={`${styles.center} ${open && styles.open}`}>
          <div className={`${styles.door} ${styles.left}`}>
            <img src="/images/logo.png" alt="Logo" />
          </div>
          <div className={`${styles.door} ${styles.right}`}>
            <img src="/images/logo.png" alt="Logo" />
          </div>
          <button className={styles.connect} onClick={onConnect}>
            Connect Wallet
          </button>
        </div>
        <div className={styles.window} />
      </div>
    </div>
  )
}
