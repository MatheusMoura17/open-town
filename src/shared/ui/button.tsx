import type { ReactNode } from 'react'
import styles from './button.module.scss'

interface ButtonProps {
  children: ReactNode
  type?: 'button' | 'submit'
  onClick?: () => void
  disabled?: boolean
}

export const Button = ({ children, type = 'button', onClick, disabled = false }: ButtonProps) => {
  return (
    <button
      className={styles.button}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
