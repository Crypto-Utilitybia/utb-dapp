import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.container}>
      <span>Copyright © Crypto Utilitybia</span>
      <div className={styles.links}>
        <a className={styles.link} href="https://github.com/Crypto-Utilitybia" target="_blank" rel="noreferrer">
          <img src="/brands/github.png" />
        </a>
        <a className={styles.link} href="https://medium.com/@crypto-utilitybia" target="_blank" rel="noreferrer">
          <img src="/brands/medium.png" />
        </a>
        <a className={styles.link} href="https://discord.gg/ykqmfzNH4m" target="_blank" rel="noreferrer">
          <img src="/brands/discord.png" />
        </a>
        <a className={styles.link} href="https://t.me/cryptoutilitybia" target="_blank" rel="noreferrer">
          <img src="/brands/telegram.svg" />
        </a>
        <a className={styles.link} href="https://twitter.com/CUtilitybia" target="_blank" rel="noreferrer">
          <img src="/brands/twitter.png" />
        </a>
      </div>
    </footer>
  )
}
