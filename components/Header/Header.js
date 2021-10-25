import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={`${styles.header} flex-center justify-between`}>
      <div>Crypto Utilitybia</div>
      <button>Connect Wallet</button>
    </header>
  )
}
