import Link from 'next/link'
import { getEllipsis } from 'utils/helpers'
import styles from './Header.module.css'

export default function Header({ account, onLogout }) {
  return (
    <header className={styles.container}>
      <Link href="/">
        <img className={styles.logo} src="/images/logo_black.png" alt="Logo" />
      </Link>
      <div className={styles.account}>
        <Link href="/wallet">{getEllipsis(account.address)}</Link>
        <i className="fa fa-sign-out cursor" onClick={onLogout}></i>
      </div>
    </header>
  )
}
