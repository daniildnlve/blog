import { Link } from 'react-router-dom'

import styles from './Header.module.scss'

const Header = () => {

  return (
    <header className={styles.header}>
      <Link className={styles.header__title} to='/'>Realworld Blog</Link>
      <button className='btn'>Sign In</button>     
      <button className='btn-success btn-lg-border'>Sign Up</button>     
    </header>
  )
}

export default Header