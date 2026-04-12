import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useUser } from '../../entities/user'
import { generateId } from '../../shared/lib/id'
import { Card } from '../../shared/ui/card'
import { Input } from '../../shared/ui/input'
import { Button } from '../../shared/ui/button'
import { ROUTES } from '../../shared/config/routes'
import styles from './index.module.scss'

export const QuickStartPage = () => {
  const { user, saveUser } = useUser()
  const navigate = useNavigate()

  const [stableId] = useState<string>(() => user?.id ?? generateId())
  const [displayName, setDisplayName] = useState('')
  const [pictureUrl, setPictureUrl] = useState('')
  const [nameError, setNameError] = useState<string | undefined>()

  if (user?.displayName) {
    return <Navigate to={ROUTES.home} replace />
  }

  const handleSubmit = () => {
    if (!displayName.trim()) {
      setNameError('Nome é obrigatório')
      return
    }

    saveUser(displayName.trim(), pictureUrl.trim(), stableId)
    navigate(ROUTES.home, { replace: true })
  }

  return (
    <div className={styles.page}>
      <Card>
        <h1 className={styles.title}>Identifique-se para continuar</h1>
        <p className={styles.uid}>UID: {stableId}</p>
        <div className={styles.fields}>
          <Input
            placeholder="Informe seu nome"
            value={displayName}
            onChange={setDisplayName}
            required
            error={nameError}
          />
          <Input
            placeholder="URL da imagem de perfil"
            value={pictureUrl}
            onChange={setPictureUrl}
            type="url"
          />
        </div>
        <Button type="button" onClick={handleSubmit}>
          Salvar
        </Button>
      </Card>
    </div>
  )
}
