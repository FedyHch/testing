# GitHub Actions Workflows

## Create Candidate Release

Ce workflow crée une release du projet pour les candidats, en excluant automatiquement les fichiers destinés aux recruteurs.

### Fichiers exclus de la release

- `EVALUATION_GUIDE.md` - Guide d'évaluation
- `CONSEILS_RECRUTEUR.md` - Conseils pour le recruteur
- `SOLUTION_REFERENCE.md` - Solution de référence
- `ANALYSIS.md` - Analyse du candidat (si présente)
- `IMPROVEMENTS.md` - Améliorations du candidat (si présentes)
- `.git/` et `.github/` - Fichiers Git
- `node_modules/` et `dist/` - Dépendances et build

### Fichiers inclus

- `README.md` - Instructions pour le candidat
- `package.json` - Dépendances
- `src/` - Code source à analyser
- Configuration (tsconfig, vite.config, etc.)

## Utilisation

### Méthode 1: Déclenchement manuel

1. Allez dans l'onglet **Actions** de votre repository
2. Sélectionnez **Create Candidate Release**
3. Cliquez sur **Run workflow**
4. Entrez la version (ex: `1.0.0`)
5. Cliquez sur **Run workflow**

### Méthode 2: Via un tag Git

```bash
# Créer et pousser un tag
git tag v1.0.0
git push origin v1.0.0
```

Le workflow se déclenchera automatiquement et créera la release.

## Résultat

Le workflow créera :
- Une release GitHub avec le tag spécifié
- Deux archives téléchargeables :
  - `recruitment-react-senior-vX.X.X.tar.gz`
  - `recruitment-react-senior-vX.X.X.zip`

Ces archives peuvent être directement envoyées aux candidats.

## Notes

- Le workflow nécessite les permissions `contents: write` (configuré automatiquement)
- Les releases sont publiques par défaut (changez `draft: true` si vous voulez les créer en brouillon)
- Vous pouvez modifier la liste des fichiers exclus dans le workflow
