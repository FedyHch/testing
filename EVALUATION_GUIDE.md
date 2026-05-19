# Guide d'Évaluation - Exercice React

## Vue d'ensemble

Ce guide vous aide à évaluer les compétences du candidat sur 3 axes principaux :
1. **Performance & Pure Components** (40%)
2. **Testabilité** (30%)
3. **Qualité de vie développeur (DX)** (30%)

---

## Problèmes Intentionnels du Code

### 🔴 Critiques (doivent être identifiés par un senior)

#### 1. Re-renders inutiles des composants
**Fichier:** `TaskManager.tsx`, `TaskList.tsx`

**Problème:**
- Aucun composant n'utilise `React.memo()`
- `TaskStats`, `TaskList`, `TaskItem` se re-rendent à chaque changement du parent
- Les `console.log` permettent de visualiser ces re-renders

**Solution attendue:**
```typescript
const TaskStats = memo(({ stats }: TaskStatsProps) => {
  // ...
})

const TaskList = memo(({ tasks, onToggle, onDelete }: TaskListProps) => {
  // ...
})
```

**Points à scorer:**
- ✅ Identifie le problème (2 pts)
- ✅ Utilise `React.memo()` correctement (3 pts)
- ✅ Explique quand memo est nécessaire vs overkill (bonus 2 pts)

---

#### 2. Fonctions recréées à chaque render
**Fichier:** `TaskManager.tsx:24, 32, 37`

**Problème:**
```typescript
const handleAddTask = () => { ... }  // Recréée à chaque render
const handleToggleTask = (id) => { ... }  // Recréée à chaque render
```

**Solution attendue:**
```typescript
const handleAddTask = useCallback(() => {
  if (newTaskTitle.trim()) {
    setTasks(prev => [...prev, newTask])
    setNewTaskTitle('')
  }
}, [newTaskTitle])

const handleToggleTask = useCallback((id: number) => {
  setTasks(prev => prev.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  ))
}, [])
```

**Points à scorer:**
- ✅ Identifie que les callbacks changent à chaque render (2 pts)
- ✅ Utilise `useCallback` (3 pts)
- ✅ Utilise la forme fonctionnelle de setState pour éviter les dépendances (3 pts)
- ✅ Explique l'impact sur les composants enfants mémorisés (2 pts)

---

#### 3. Calculs non mémorisés
**Fichier:** `TaskManager.tsx:42, 51`

**Problème:**
```typescript
const filteredTasks = tasks.filter(...)  // Recalculé à chaque render
const stats = { ... }  // Recréé à chaque render
```

**Solution attendue:**
```typescript
const filteredTasks = useMemo(() =>
  tasks.filter(task => {
    if (filter === 'completed') return task.completed
    if (filter === 'active') return !task.completed
    return true
  }),
  [tasks, filter]
)

const stats = useMemo(() => ({
  total: tasks.length,
  completed: tasks.filter(t => t.completed).length,
  active: tasks.filter(t => !t.completed).length,
  highPriority: tasks.filter(t => t.priority === 'high' && !t.completed).length
}), [tasks])
```

**Points à scorer:**
- ✅ Utilise `useMemo` pour filteredTasks (2 pts)
- ✅ Utilise `useMemo` pour stats (2 pts)
- ✅ Identifie que stats est un objet donc échoue la comparaison référentielle (3 pts)

---

#### 4. Types faibles (any)
**Fichier:** `TaskManager.tsx:4`, `TaskList.tsx`

**Problème:**
```typescript
const [tasks, setTasks] = useState<any[]>([])
function TaskList({ tasks, onToggle, onDelete }: any)
```

**Solution attendue:**
```typescript
interface Task {
  id: number
  title: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
}

interface TaskListProps {
  tasks: Task[]
  onToggle: (id: number) => void
  onDelete: (id: number) => void
}
```

**Points à scorer:**
- ✅ Crée des interfaces/types appropriés (2 pts)
- ✅ Utilise des types stricts partout (2 pts)
- ✅ Utilise des unions littérales pour priority (1 pt)

---

### 🟡 Importantes (bon à identifier)

#### 5. Logique métier dans le composant
**Fichier:** `TaskManager.tsx:9-20`

**Problème:**
- Appel API simulé directement dans useEffect
- Logique de filtrage dans le composant
- Pas de séparation des responsabilités

**Solution attendue:**
```typescript
// hooks/useTasks.ts
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTasks().then(data => {
      setTasks(data)
      setLoading(false)
    })
  }, [])

  const addTask = useCallback((title: string) => { ... }, [])
  const toggleTask = useCallback((id: number) => { ... }, [])
  const deleteTask = useCallback((id: number) => { ... }, [])

  return { tasks, loading, addTask, toggleTask, deleteTask }
}

// utils/taskFilters.ts
export function filterTasks(tasks: Task[], filter: FilterType) { ... }
export function calculateTaskStats(tasks: Task[]) { ... }
```

**Points à scorer:**
- ✅ Extrait la logique dans des hooks personnalisés (3 pts)
- ✅ Crée des fonctions utilitaires pures (2 pts)
- ✅ Sépare présentation et logique (2 pts)

---

#### 6. Inline styles créés à chaque render
**Fichier:** Partout

**Problème:**
```typescript
<div style={{ padding: '12px', backgroundColor: '#f0f0f0' }}>
```

**Solution attendue:**
```typescript
const styles = {
  container: { padding: '12px', backgroundColor: '#f0f0f0' },
  // ...
} as const

// Ou mieux, utiliser CSS modules, styled-components, etc.
```

**Points à scorer:**
- ✅ Identifie le problème (1 pt)
- ✅ Propose une solution (styles constants, CSS-in-JS, etc.) (2 pts)

---

#### 7. Testabilité difficile
**Problème:**
- Logique couplée au composant
- Effets de bord (localStorage, API) non mockables facilement
- Pas de séparation des responsabilités

**Solution attendue:**
- Extraction de la logique dans des hooks/fonctions pures
- Injection de dépendances
- Composants présentationnels vs conteneurs

**Points à scorer:**
- ✅ Crée des tests unitaires pour les utilitaires (2 pts)
- ✅ Crée des tests pour les hooks personnalisés (2 pts)
- ✅ Crée des tests pour les composants avec MSW ou mocks (3 pts)
- ✅ Démontre une bonne couverture de tests (3 pts)

---

## Grille d'Évaluation

### Performance & Pure Components (40 points)

| Critère | Points | Notes |
|---------|--------|-------|
| Identifie les re-renders inutiles | /5 | |
| Utilise React.memo correctement | /5 | |
| Utilise useCallback approprié | /8 | |
| Utilise useMemo pour calculs coûteux | /7 | |
| Comprend la comparaison référentielle | /5 | |
| Explique les trade-offs (over-optimization) | /5 | |
| Utilise React DevTools Profiler | /5 | |

**Total Performance:** ___/40

### Testabilité (30 points)

| Critère | Points | Notes |
|---------|--------|-------|
| Sépare logique et présentation | /7 | |
| Crée des fonctions pures testables | /5 | |
| Écrit des tests unitaires pertinents | /8 | |
| Tests de composants avec Testing Library | /5 | |
| Couverture et qualité des tests | /5 | |

**Total Testabilité:** ___/30

### Qualité de Vie Développeur (30 points)

| Critère | Points | Notes |
|---------|--------|-------|
| Types TypeScript stricts et pertinents | /8 | |
| Organisation du code (dossiers, fichiers) | /5 | |
| Nommage clair et conventions | /4 | |
| Documentation et commentaires | /4 | |
| Gestion des erreurs | /3 | |
| Code maintenable et extensible | /6 | |

**Total DX:** ___/30

---

## Score Final

**Total: ___/100**

### Interprétation

- **85-100:** Excellent - Senior confirmé, très bonnes pratiques
- **70-84:** Bon - Niveau senior, quelques points à améliorer
- **55-69:** Moyen - Connaissances correctes mais lacunes sur les optimisations
- **< 55:** Insuffisant - Pas de niveau senior

---

## Questions Bonus à Poser (Oral)

1. **Quand faut-il utiliser memo vs useMemo vs useCallback?**
   - Réponse attendue: Comprend les différences et les cas d'usage

2. **Comment détecter les problèmes de performance dans une app React?**
   - Réponse attendue: React DevTools Profiler, why-did-you-render, etc.

3. **Qu'est-ce qu'un Pure Component et pourquoi c'est important?**
   - Réponse attendue: Composant qui retourne toujours le même output pour les mêmes props/state

4. **Comment tester un composant qui fait des appels API?**
   - Réponse attendue: MSW, mocks, injection de dépendances

5. **Quels sont les trade-offs de sur-optimiser avec memo/useMemo/useCallback?**
   - Réponse attendue: Complexité, mémoire, comparaisons elles-mêmes coûteuses

---

## Red Flags

⚠️ **Disqualificatifs potentiels:**
- N'identifie aucun problème de performance
- Ne connaît pas React.memo, useMemo, ou useCallback
- N'écrit aucun test
- Utilise any partout sans justification
- Ne comprend pas les Pure Components
- Propose des solutions qui empirent les problèmes

---

## Points Bonus

🌟 **Démontre une expertise avancée:**
- Utilise React DevTools Profiler pour démontrer les améliorations
- Propose une architecture avec hooks personnalisés bien pensée
- Implémente un système de design avec composants réutilisables
- Utilise des patterns avancés (render props, compound components, etc.)
- Configure ESLint avec règles de performance React
- Ajoute des benchmarks de performance
- Documentation technique exemplaire
