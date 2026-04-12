import { createRoot } from 'react-dom/client'
import { App } from './app'
import '../shared/ui/global.scss'

createRoot(document.getElementById('root')!).render(
  <App />,
)
