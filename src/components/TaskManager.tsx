import { useState, useEffect } from 'react'
import TaskList from './TaskList'

// Problème 1: Type any, pas de types stricts
function TaskManager() {
  const [tasks, setTasks] = useState<any[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  // Problème 2: Logique métier directement dans le composant
  useEffect(() => {
    // Simulation d'un appel API
    setTimeout(() => {
      const initialTasks = [
        { id: 1, title: 'Apprendre React', completed: false, priority: 'high' },
        { id: 2, title: 'Faire les courses', completed: true, priority: 'low' },
        { id: 3, title: 'Préparer la réunion', completed: false, priority: 'medium' },
      ]
      setTasks(initialTasks)
      setLoading(false)
    }, 500)
  }, [])

  // Problème 3: Fonction créée à chaque render
  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      const newTask = {
        id: Date.now(),
        title: newTaskTitle,
        completed: false,
        priority: 'medium'
      }
      setTasks([...tasks, newTask])
      setNewTaskTitle('')
    }
  }

  // Problème 4: Fonction créée à chaque render
  const handleToggleTask = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  // Problème 5: Fonction créée à chaque render
  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  // Problème 6: Calcul effectué à chaque render même si filter ou tasks ne changent pas
  const filteredTasks = tasks.filter(task => {
    console.log('Filtering tasks...') // Permet de voir les re-calculs inutiles
    if (filter === 'completed') return task.completed
    if (filter === 'active') return !task.completed
    return true
  })

  // Problème 7: Calcul des stats à chaque render
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    active: tasks.filter(t => !t.completed).length,
    highPriority: tasks.filter(t => t.priority === 'high' && !t.completed).length
  }

  if (loading) {
    return <div>Chargement...</div>
  }

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        {/* Problème 8: Inline style créé à chaque render */}
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
          placeholder="Nouvelle tâche..."
          style={{ padding: '8px', marginRight: '8px', width: '300px' }}
        />
        <button onClick={handleAddTask} style={{ padding: '8px 16px' }}>
          Ajouter
        </button>
      </div>

      {/* Problème 9: Composant qui reçoit des props recréées à chaque render */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            marginRight: '8px',
            padding: '8px',
            fontWeight: filter === 'all' ? 'bold' : 'normal'
          }}
        >
          Toutes ({tasks.length})
        </button>
        <button
          onClick={() => setFilter('active')}
          style={{
            marginRight: '8px',
            padding: '8px',
            fontWeight: filter === 'active' ? 'bold' : 'normal'
          }}
        >
          Actives ({stats.active})
        </button>
        <button
          onClick={() => setFilter('completed')}
          style={{
            padding: '8px',
            fontWeight: filter === 'completed' ? 'bold' : 'normal'
          }}
        >
          Terminées ({stats.completed})
        </button>
      </div>

      {/* Problème 10: Stats passées comme objet créé à chaque render */}
      <TaskStats stats={stats} />

      {/* Problème 11: TaskList reçoit des fonctions recréées à chaque render */}
      <TaskList
        tasks={filteredTasks}
        onToggle={handleToggleTask}
        onDelete={handleDeleteTask}
      />
    </div>
  )
}

// Problème 12: Composant non mémorisé qui va se re-rendre même si stats ne change pas vraiment
function TaskStats({ stats }: { stats: any }) {
  console.log('TaskStats rendering...') // Permet de voir les re-renders inutiles

  return (
    <div style={{
      marginBottom: '20px',
      padding: '12px',
      backgroundColor: '#f0f0f0',
      borderRadius: '4px'
    }}>
      <strong>Statistiques:</strong> {stats.total} tâches totales, {stats.active} actives,
      {stats.highPriority > 0 && ` ${stats.highPriority} priorités hautes`}
    </div>
  )
}

export default TaskManager
