import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RegisterPage } from '../pages/register'
import { RoomListPage } from '../pages/room-list'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RoomListPage />
  </StrictMode>,
)
