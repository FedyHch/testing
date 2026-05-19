# Solution de Référence (Pour le Recruteur)

⚠️ **Ce fichier ne doit PAS être partagé avec le candidat**

Cette référence montre une solution possible. Un candidat senior peut proposer des solutions différentes mais tout aussi valables.

---

## Structure Améliorée Proposée

```
src/
├── components/
│   ├── TaskManager/
│   │   ├── TaskManager.tsx          # Composant principal
│   │   ├── TaskStats.tsx            # Composant de stats (mémorisé)
│   │   ├── TaskFilters.tsx          # Composant de filtres
│   │   └── index.ts
│   └── TaskList/
│       ├── TaskList.tsx             # Liste mémorisée
│       ├── TaskItem.tsx             # Item mémorisé
│       ├── TaskItem.module.css      # Styles extraits
│       └── index.ts
├── hooks/
│   ├── useTasks.ts                  # Logique de gestion des tâches
│   └── useTaskFilters.ts            # Logique de filtrage
├── types/
│   └── task.ts                      # Types centralisés
├── utils/
│   ├── taskUtils.ts                 # Fonctions pures
│   └── taskFilters.ts               # Logique de filtrage
└── __tests__/
    ├── components/
    │   ├── TaskList.test.tsx
    │   └── TaskItem.test.tsx
    ├── hooks/
    │   └── useTasks.test.ts
    └── utils/
        └── taskUtils.test.ts
```

---

## 1. Types Stricts (`src/types/task.ts`)

```typescript
export type TaskPriority = 'low' | 'medium' | 'high'

export type TaskFilter = 'all' | 'active' | 'completed'

export interface Task {
  id: number
  title: string
  completed: boolean
  priority: TaskPriority
}

export interface TaskStats {
  total: number
  completed: number
  active: number
  highPriority: number
}

export interface TaskListProps {
  tasks: Task[]
  onToggle: (id: number) => void
  onDelete: (id: number) => void
}

export interface TaskItemProps {
  task: Task
  onToggle: (id: number) => void
  onDelete: (id: number) => void
}
```

---

## 2. Utilitaires Purs (`src/utils/taskUtils.ts`)

```typescript
import { Task, TaskStats, TaskPriority } from '../types/task'

export function calculateTaskStats(tasks: Task[]): TaskStats {
  return {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    active: tasks.filter(t => !t.completed).length,
    highPriority: tasks.filter(t => t.priority === 'high' && !t.completed).length,
  }
}

export function getPriorityEmoji(priority: TaskPriority): string {
  const emojiMap: Record<TaskPriority, string> = {
    high: '🔴',
    medium: '🟡',
    low: '🟢',
  }
  return emojiMap[priority]
}

export function createTask(title: string, priority: TaskPriority = 'medium'): Task {
  return {
    id: Date.now(),
    title,
    completed: false,
    priority,
  }
}
```

### Tests (`src/utils/taskUtils.test.ts`)

```typescript
import { describe, it, expect } from 'vitest'
import { calculateTaskStats, getPriorityEmoji, createTask } from './taskUtils'
import { Task } from '../types/task'

describe('taskUtils', () => {
  describe('calculateTaskStats', () => {
    it('should calculate stats correctly', () => {
      const tasks: Task[] = [
        { id: 1, title: 'Task 1', completed: true, priority: 'high' },
        { id: 2, title: 'Task 2', completed: false, priority: 'high' },
        { id: 3, title: 'Task 3', completed: false, priority: 'low' },
      ]

      const stats = calculateTaskStats(tasks)

      expect(stats).toEqual({
        total: 3,
        completed: 1,
        active: 2,
        highPriority: 1,
      })
    })

    it('should handle empty array', () => {
      const stats = calculateTaskStats([])
      expect(stats.total).toBe(0)
    })
  })

  describe('getPriorityEmoji', () => {
    it('should return correct emoji for each priority', () => {
      expect(getPriorityEmoji('high')).toBe('🔴')
      expect(getPriorityEmoji('medium')).toBe('🟡')
      expect(getPriorityEmoji('low')).toBe('🟢')
    })
  })
})
```

---

## 3. Hook Personnalisé (`src/hooks/useTasks.ts`)

```typescript
import { useState, useCallback, useEffect } from 'react'
import { Task } from '../types/task'
import { createTask } from '../utils/taskUtils'

// Mock API - dans un vrai projet, ce serait dans un service séparé
async function fetchInitialTasks(): Promise<Task[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, title: 'Apprendre React', completed: false, priority: 'high' },
        { id: 2, title: 'Faire les courses', completed: true, priority: 'low' },
        { id: 3, title: 'Préparer la réunion', completed: false, priority: 'medium' },
      ])
    }, 500)
  })
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInitialTasks().then((data) => {
      setTasks(data)
      setLoading(false)
    })
  }, [])

  // Utilisation de la forme fonctionnelle pour éviter les dépendances
  const addTask = useCallback((title: string) => {
    const newTask = createTask(title)
    setTasks((prev) => [...prev, newTask])
  }, [])

  const toggleTask = useCallback((id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }, [])

  const deleteTask = useCallback((id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }, [])

  return {
    tasks,
    loading,
    addTask,
    toggleTask,
    deleteTask,
  }
}
```

### Tests (`src/hooks/useTasks.test.ts`)

```typescript
import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useTasks } from './useTasks'

describe('useTasks', () => {
  it('should load initial tasks', async () => {
    const { result } = renderHook(() => useTasks())

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.tasks).toHaveLength(3)
  })

  it('should add a task', async () => {
    const { result } = renderHook(() => useTasks())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    act(() => {
      result.current.addTask('New Task')
    })

    expect(result.current.tasks).toHaveLength(4)
    expect(result.current.tasks[3].title).toBe('New Task')
  })

  it('should toggle a task', async () => {
    const { result } = renderHook(() => useTasks())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    const firstTaskId = result.current.tasks[0].id
    const initialCompletedState = result.current.tasks[0].completed

    act(() => {
      result.current.toggleTask(firstTaskId)
    })

    expect(result.current.tasks[0].completed).toBe(!initialCompletedState)
  })

  it('should delete a task', async () => {
    const { result } = renderHook(() => useTasks())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    const firstTaskId = result.current.tasks[0].id

    act(() => {
      result.current.deleteTask(firstTaskId)
    })

    expect(result.current.tasks).toHaveLength(2)
    expect(result.current.tasks.find(t => t.id === firstTaskId)).toBeUndefined()
  })
})
```

---

## 4. Hook de Filtrage (`src/hooks/useTaskFilters.ts`)

```typescript
import { useMemo, useState, useCallback } from 'react'
import { Task, TaskFilter } from '../types/task'

function filterTasks(tasks: Task[], filter: TaskFilter): Task[] {
  switch (filter) {
    case 'completed':
      return tasks.filter(task => task.completed)
    case 'active':
      return tasks.filter(task => !task.completed)
    default:
      return tasks
  }
}

export function useTaskFilters(tasks: Task[]) {
  const [filter, setFilter] = useState<TaskFilter>('all')

  const filteredTasks = useMemo(
    () => filterTasks(tasks, filter),
    [tasks, filter]
  )

  const setFilterCallback = useCallback((newFilter: TaskFilter) => {
    setFilter(newFilter)
  }, [])

  return {
    filter,
    filteredTasks,
    setFilter: setFilterCallback,
  }
}
```

---

## 5. Composants Optimisés

### TaskItem.tsx (Mémorisé)

```typescript
import { memo } from 'react'
import { TaskItemProps } from '../../types/task'
import { getPriorityEmoji } from '../../utils/taskUtils'
import styles from './TaskItem.module.css'

const TaskItem = memo(({ task, onToggle, onDelete }: TaskItemProps) => {
  return (
    <div className={styles.item} data-completed={task.completed}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        className={styles.checkbox}
      />
      <span className={styles.title}>
        {getPriorityEmoji(task.priority)} {task.title}
      </span>
      <button
        onClick={() => onDelete(task.id)}
        className={styles.deleteButton}
        aria-label={`Supprimer ${task.title}`}
      >
        Supprimer
      </button>
    </div>
  )
})

TaskItem.displayName = 'TaskItem'

export default TaskItem
```

### TaskList.tsx (Mémorisé)

```typescript
import { memo } from 'react'
import { TaskListProps } from '../../types/task'
import TaskItem from './TaskItem'

const TaskList = memo(({ tasks, onToggle, onDelete }: TaskListProps) => {
  if (tasks.length === 0) {
    return <p style={{ color: '#888' }}>Aucune tâche à afficher</p>
  }

  return (
    <div>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
})

TaskList.displayName = 'TaskList'

export default TaskList
```

### TaskStats.tsx (Mémorisé avec comparaison custom)

```typescript
import { memo } from 'react'
import { TaskStats as TaskStatsType } from '../../types/task'

interface TaskStatsProps {
  stats: TaskStatsType
}

// Comparaison custom pour éviter les re-renders si les valeurs sont identiques
function areStatsEqual(prev: TaskStatsProps, next: TaskStatsProps) {
  return (
    prev.stats.total === next.stats.total &&
    prev.stats.completed === next.stats.completed &&
    prev.stats.active === next.stats.active &&
    prev.stats.highPriority === next.stats.highPriority
  )
}

const TaskStats = memo(({ stats }: TaskStatsProps) => {
  return (
    <div
      style={{
        marginBottom: '20px',
        padding: '12px',
        backgroundColor: '#f0f0f0',
        borderRadius: '4px',
      }}
    >
      <strong>Statistiques:</strong> {stats.total} tâches totales, {stats.active} actives
      {stats.highPriority > 0 && `, ${stats.highPriority} priorités hautes`}
    </div>
  )
}, areStatsEqual)

TaskStats.displayName = 'TaskStats'

export default TaskStats
```

### TaskManager.tsx (Composant principal refactorisé)

```typescript
import { useState, useMemo } from 'react'
import { useTasks } from '../../hooks/useTasks'
import { useTaskFilters } from '../../hooks/useTaskFilters'
import { calculateTaskStats } from '../../utils/taskUtils'
import TaskList from '../TaskList/TaskList'
import TaskStats from './TaskStats'
import TaskFilters from './TaskFilters'

function TaskManager() {
  const { tasks, loading, addTask, toggleTask, deleteTask } = useTasks()
  const { filter, filteredTasks, setFilter } = useTaskFilters(tasks)
  const [newTaskTitle, setNewTaskTitle] = useState('')

  // Mémoisation des stats
  const stats = useMemo(() => calculateTaskStats(tasks), [tasks])

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addTask(newTaskTitle)
      setNewTaskTitle('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask()
    }
  }

  if (loading) {
    return <div>Chargement...</div>
  }

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Nouvelle tâche..."
          style={{ padding: '8px', marginRight: '8px', width: '300px' }}
        />
        <button onClick={handleAddTask} style={{ padding: '8px 16px' }}>
          Ajouter
        </button>
      </div>

      <TaskFilters
        currentFilter={filter}
        onFilterChange={setFilter}
        stats={stats}
      />

      <TaskStats stats={stats} />

      <TaskList
        tasks={filteredTasks}
        onToggle={toggleTask}
        onDelete={deleteTask}
      />
    </div>
  )
}

export default TaskManager
```

---

## 6. Tests de Composants

### TaskItem.test.tsx

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import TaskItem from './TaskItem'
import { Task } from '../../types/task'

describe('TaskItem', () => {
  const mockTask: Task = {
    id: 1,
    title: 'Test Task',
    completed: false,
    priority: 'medium',
  }

  it('should render task correctly', () => {
    render(
      <TaskItem task={mockTask} onToggle={vi.fn()} onDelete={vi.fn()} />
    )

    expect(screen.getByText(/Test Task/)).toBeInTheDocument()
    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  it('should call onToggle when checkbox is clicked', async () => {
    const onToggle = vi.fn()
    const user = userEvent.setup()

    render(
      <TaskItem task={mockTask} onToggle={onToggle} onDelete={vi.fn()} />
    )

    await user.click(screen.getByRole('checkbox'))

    expect(onToggle).toHaveBeenCalledWith(1)
  })

  it('should call onDelete when delete button is clicked', async () => {
    const onDelete = vi.fn()
    const user = userEvent.setup()

    render(
      <TaskItem task={mockTask} onToggle={vi.fn()} onDelete={onDelete} />
    )

    await user.click(screen.getByText('Supprimer'))

    expect(onDelete).toHaveBeenCalledWith(1)
  })

  it('should show completed style when task is completed', () => {
    const completedTask = { ...mockTask, completed: true }

    render(
      <TaskItem task={completedTask} onToggle={vi.fn()} onDelete={vi.fn()} />
    )

    const item = screen.getByText(/Test Task/).closest('div')
    expect(item).toHaveAttribute('data-completed', 'true')
  })
})
```

---

## Points Clés de Cette Solution

### ✅ Performance
1. **React.memo** sur tous les composants feuilles
2. **useCallback** pour toutes les fonctions passées en props
3. **useMemo** pour les calculs coûteux (filtrage, stats)
4. Comparaison custom pour TaskStats (évite re-render si valeurs identiques)

### ✅ Testabilité
1. **Fonctions pures** extraites et testables unitairement
2. **Hooks personnalisés** testables indépendamment
3. **Composants présentationnels** faciles à tester
4. **Mocks** appropriés pour les effets de bord

### ✅ Qualité de Vie (DX)
1. **Types stricts** partout
2. **Séparation des responsabilités** claire
3. **Organisation** logique du code
4. **Réutilisabilité** (utils, hooks, components)

---

## Améliorations Bonus

Un candidat exceptionnel pourrait proposer:

```typescript
// 1. ESLint rules pour détecter les problèmes de performance
// .eslintrc.json
{
  "plugins": ["react-hooks"],
  "rules": {
    "react-hooks/exhaustive-deps": "error",
    "react/jsx-no-bind": "warn"
  }
}

// 2. Mesure de performance avec React Profiler API
import { Profiler } from 'react'

function onRenderCallback(
  id, phase, actualDuration, baseDuration, startTime, commitTime
) {
  console.log(`${id} (${phase}) took ${actualDuration}ms`)
}

<Profiler id="TaskList" onRender={onRenderCallback}>
  <TaskList />
</Profiler>

// 3. Custom hook pour debug re-renders
function useWhyDidYouUpdate(name: string, props: any) {
  const previousProps = useRef<any>()

  useEffect(() => {
    if (previousProps.current) {
      const allKeys = Object.keys({ ...previousProps.current, ...props })
      const changedProps: any = {}
      allKeys.forEach((key) => {
        if (previousProps.current[key] !== props[key]) {
          changedProps[key] = {
            from: previousProps.current[key],
            to: props[key],
          }
        }
      })

      if (Object.keys(changedProps).length > 0) {
        console.log('[why-did-you-update]', name, changedProps)
      }
    }

    previousProps.current = props
  })
}
```

---

## Checklist d'Évaluation Rapide

Utilisez cette checklist pendant que le candidat code:

### Doit avoir (Senior)
- [ ] Utilise React.memo sur les composants appropriés
- [ ] Utilise useCallback pour les handlers
- [ ] Utilise useMemo pour les calculs
- [ ] Crée des types TypeScript stricts
- [ ] Sépare logique et présentation
- [ ] Écrit au moins quelques tests

### Bon à avoir
- [ ] Extrait des hooks personnalisés
- [ ] Crée des fonctions utilitaires pures
- [ ] Organise le code en dossiers logiques
- [ ] Utilise des CSS modules ou styled-components
- [ ] Documente les choix techniques
- [ ] Tests avec bonne couverture

### Excellent (Bonus)
- [ ] Comparaison custom pour memo
- [ ] Tests de hooks personnalisés
- [ ] Architecture extensible et scalable
- [ ] Gestion d'erreurs
- [ ] Accessibilité (a11y)
- [ ] Performance monitoring
