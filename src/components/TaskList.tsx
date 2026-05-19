// Problème 1: Pas de memo, le composant se re-rend même si les props ne changent pas
function TaskList({ tasks, onToggle, onDelete }: any) {
  console.log('TaskList rendering...') // Permet de voir les re-renders inutiles

  return (
    <div>
      {tasks.length === 0 ? (
        <p style={{ color: '#888' }}>Aucune tâche à afficher</p>
      ) : (
        tasks.map((task: any) => (
          // Problème 2: TaskItem n'est pas mémorisé et reçoit des inline functions
          <TaskItem
            key={task.id}
            task={task}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  )
}

// Problème 3: Composant non mémorisé, se re-rend à chaque fois que TaskList se re-rend
function TaskItem({ task, onToggle, onDelete }: any) {
  console.log(`TaskItem ${task.id} rendering...`) // Permet de voir les re-renders inutiles

  // Problème 4: Création de style object à chaque render
  const itemStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '12px',
    marginBottom: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: task.completed ? '#f0f0f0' : 'white'
  }

  // Problème 5: Logique de formatage dans le composant de présentation
  const getPriorityEmoji = (priority: string) => {
    switch(priority) {
      case 'high': return '🔴'
      case 'medium': return '🟡'
      case 'low': return '🟢'
      default: return ''
    }
  }

  // Problème 6: Calcul effectué à chaque render
  const priorityEmoji = getPriorityEmoji(task.priority)

  return (
    <div style={itemStyle}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        style={{ marginRight: '12px' }}
      />
      <span style={{
        flex: 1,
        textDecoration: task.completed ? 'line-through' : 'none',
        color: task.completed ? '#888' : 'black'
      }}>
        {priorityEmoji} {task.title}
      </span>
      {/* Problème 7: Inline function créée à chaque render */}
      <button
        onClick={() => onDelete(task.id)}
        style={{
          padding: '4px 12px',
          backgroundColor: '#ff4444',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Supprimer
      </button>
    </div>
  )
}

export default TaskList
