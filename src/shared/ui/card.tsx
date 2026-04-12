import type { ReactNode } from 'react'
import styles from './card.module.scss'

interface CardProps {
  children: ReactNode
}

export const Card = ({ children }: CardProps) => {
  return <div className={styles.card}>{children}</div>
}
