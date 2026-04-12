import styles from './input.module.scss'

interface InputProps {
  placeholder?: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'url'
  required?: boolean
  error?: string
}

export const Input = ({ placeholder, value, onChange, type = 'text', required = false, error }: InputProps) => {
  return (
    <div className={styles.wrapper}>
      <input
        className={`${styles.input}${error ? ` ${styles.hasError}` : ''}`}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  )
}
