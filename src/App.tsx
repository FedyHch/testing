import { useState } from 'react'
import TaskManager from './components/TaskManager'

function App() {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Gestionnaire de Tâches</h1>
      <TaskManager />
    </div>
  )
}

export default App
