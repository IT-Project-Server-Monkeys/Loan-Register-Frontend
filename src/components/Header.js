import React from 'react'
import styles from '../styles/Header.module.scss'   // component scoped style


const Header = () => {
  return (
    <div className={`${styles.header} header-in-global-style`}>
      This is a Header
    </div>
  )
}

export default Header