import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={`${styles.footer} flex-center flex-wrap justify-center`}>
      © {new Date().getFullYear()}; Crypto Utilitybia
    </footer>
  )
}
