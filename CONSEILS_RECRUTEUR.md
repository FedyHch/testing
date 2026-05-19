# Conseils pour l'Administration de l'Exercice

## Préparation

### Avant l'entretien
1. Clonez ce repository et testez que `npm install && npm run dev` fonctionne
2. Familiarisez-vous avec les problèmes intentionnels (voir `EVALUATION_GUIDE.md`)
3. Préparez un environnement où le candidat peut partager son écran

### Temps recommandé
- **Sur place:** 2h30 - 3h
- **À la maison:** 3-4h (plus flexible)

---

## Déroulement Suggéré

### Phase 1: Présentation (10 min)
1. Expliquez le contexte: "Vous rejoignez une équipe, ce code fonctionne mais a des problèmes"
2. Clarifiez les objectifs: performance, testabilité, DX
3. Précisez que les `console.log` sont là pour aider à visualiser les problèmes
4. Indiquez qu'ils peuvent créer de nouveaux fichiers si nécessaire

### Phase 2: Analyse (30-45 min)
- Laissez le candidat explorer le code
- Observez sa méthodologie:
  - ✅ Lance l'application pour voir le comportement
  - ✅ Ouvre les devtools React
  - ✅ Regarde les console.logs pour identifier les re-renders
  - ✅ Lit le code de manière structurée

**Questions à poser pendant l'analyse:**
- "Qu'avez-vous remarqué?"
- "Quels problèmes vous semblent prioritaires?"
- "Comment comptez-vous mesurer les améliorations?"

### Phase 3: Implémentation (1h-1h30)
- Laissez le candidat travailler de manière autonome
- Intervenez uniquement si bloqué > 10 min
- Notez l'ordre des améliorations (priorise-t-il bien?)

**Signes positifs:**
- ✅ Commence par les problèmes critiques
- ✅ Teste ses changements au fur et à mesure
- ✅ Utilise les devtools pour valider les améliorations
- ✅ Crée une architecture logique (dossiers, fichiers)
- ✅ Commente ses choix

**Signes négatifs:**
- ❌ Change tout sans comprendre pourquoi
- ❌ Ajoute des dépendances lourdes sans justification
- ❌ Ne teste pas ses modifications
- ❌ Ignore les types TypeScript

### Phase 4: Tests (30 min)
- Observez la stratégie de test:
  - ✅ Tests unitaires pour la logique pure
  - ✅ Tests de hooks personnalisés
  - ✅ Tests de composants avec Testing Library
  - ✅ Mocks appropriés pour les effets de bord

### Phase 5: Revue de code (30 min)
Demandez au candidat de présenter:
1. Les problèmes identifiés
2. Les solutions apportées
3. Les décisions techniques prises
4. Ce qu'il aurait fait avec plus de temps

---

## Questions Orales Complémentaires

### Sur les Pure Components
**Q:** "Expliquez-moi ce qu'est un Pure Component en React."

**Réponse attendue:**
- Composant qui retourne toujours le même output pour les mêmes props/state
- Permet à React d'optimiser en sautant le re-render si les props n'ont pas changé
- React.memo pour les composants fonctionnels
- Comparaison shallow par défaut, possibilité de custom comparator

**Approfondissement:**
- "Quand est-ce qu'un objet/array change en JavaScript?"
- "Pourquoi React utilise la comparaison shallow par défaut?"
- "Quels sont les pièges de la mémoisation?"

---

### Sur la Performance
**Q:** "Comment identifieriez-vous un problème de performance dans une vraie application?"

**Réponses attendues:**
- React DevTools Profiler
- Librairies: why-did-you-render
- Performance API du navigateur
- Lighthouse
- Monitoring en production (Web Vitals)

**Approfondissement:**
- "Quelle est la différence entre memo, useMemo et useCallback?"
- "Peut-on sur-optimiser? Donnez des exemples."

---

### Sur la Testabilité
**Q:** "Qu'est-ce qui rend un composant difficile à tester?"

**Réponses attendues:**
- Logique métier couplée à la présentation
- Effets de bord non isolés (API, localStorage)
- Dépendances globales
- Props complexes et interdépendantes
- Absence de séparation des responsabilités

---

### Sur l'Architecture
**Q:** "Comment organiseriez-vous une grosse application React?"

**Bonnes réponses mentionnent:**
- Séparation par features ou par couches
- Hooks personnalisés pour la logique réutilisable
- Composants présentationnels vs conteneurs
- Context API pour l'état global si nécessaire
- Pas de prop drilling excessif

---

## Grille d'Observation (Notes pour vous)

### Soft Skills

| Comportement | Observé | Notes |
|--------------|---------|-------|
| Pose des questions pertinentes | ☐ | |
| Communique sa démarche | ☐ | |
| Gère son temps efficacement | ☐ | |
| Reste calme face aux bugs | ☐ | |
| Accepte les feedbacks | ☐ | |
| Justifie ses choix techniques | ☐ | |

### Hard Skills

| Compétence | Niveau | Notes |
|------------|--------|-------|
| React (hooks, lifecycle) | ☐ Faible ☐ Moyen ☐ Bon ☐ Expert | |
| TypeScript | ☐ Faible ☐ Moyen ☐ Bon ☐ Expert | |
| Performance & optimisation | ☐ Faible ☐ Moyen ☐ Bon ☐ Expert | |
| Testing | ☐ Faible ☐ Moyen ☐ Bon ☐ Expert | |
| Architecture & patterns | ☐ Faible ☐ Moyen ☐ Bon ☐ Expert | |

---

## Variantes de l'Exercice

### Pour Senior+ / Lead
Ajoutez ces challenges:
1. "Implémentez un système d'undo/redo"
2. "Ajoutez la persistance localStorage avec debounce"
3. "Rendez l'application accessible (a11y)"
4. "Ajoutez un mode drag & drop pour réordonner"

### Pour Mid-Level (si besoin)
Simplifiez:
1. Fournissez une liste des problèmes à corriger
2. Donnez des indices sur les hooks à utiliser
3. Concentrez-vous sur 2-3 problèmes majeurs seulement

---

## Red Flags à Surveiller

🚩 **Disqualificatifs:**
- Ne connaît pas React.memo, useMemo, useCallback
- N'a jamais utilisé React DevTools
- Ne sait pas écrire des tests de composants
- Modifie le code sans comprendre l'impact
- Refuse d'utiliser TypeScript correctement
- Aucune notion d'architecture/organisation

⚠️ **Points de vigilance:**
- Sur-optimise tout sans discernement
- Complexifie inutilement (over-engineering)
- Ignore les warnings TypeScript
- Ne documente rien
- Tests inutiles ou mal conçus

---

## Après l'Exercice

### Débriefing interne
1. Remplissez `EVALUATION_GUIDE.md` immédiatement
2. Notez vos observations pendant que c'est frais
3. Comparez avec d'autres évaluateurs si exercice en binôme

### Feedback au candidat
Même si refusé, donnez un feedback constructif:
- Points forts observés
- Axes d'amélioration
- Ressources recommandées

---

## Ressources pour Aller Plus Loin

Si le candidat est prometteur mais a des lacunes, recommandez:
- React Docs (nouvelle version): https://react.dev
- Kent C. Dodds Blog: Testing, Performance
- React DevTools Profiler: guides officiels
- Patterns.dev: Patterns React avancés
- "Inside React" series

---

## FAQ Recruteur

**Q: Le candidat utilise une librairie que je ne connais pas (Zustand, React Query, etc.)**
R: C'est OK si il justifie le choix et que ça résout réellement un problème. Notez-le et renseignez-vous après.

**Q: Le candidat n'a pas fini dans le temps**
R: Demandez-lui d'expliquer ce qu'il aurait fait. La méthodologie compte autant que le code.

**Q: Le candidat trouve des problèmes que je n'avais pas vus**
R: Excellent signe! Notez-les et discutez-en.

**Q: Le candidat dit "dans un vrai projet je ferais X mais là je fais Y"**
R: Demandez pourquoi. S'il justifie bien = bon signe de pragmatisme.

**Q: Faut-il lui dire qu'il y a X problèmes intentionnels?**
R: Non, laissez-le découvrir. Mais si bloqué après 45min d'analyse, donnez un hint.
