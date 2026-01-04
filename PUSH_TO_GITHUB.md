# Guide pour envoyer les modifications vers GitHub

## URL du dépôt GitHub
```
https://github.com/mykmiv/stock-master.git
```

## Commandes pour envoyer vos modifications

### 1. Voir les fichiers modifiés
```bash
git status
```

### 2. Ajouter les fichiers modifiés
```bash
# Ajouter tous les fichiers modifiés
git add .

# OU ajouter un fichier spécifique
git add nom-du-fichier
```

### 3. Créer un commit avec un message
```bash
git commit -m "Description de vos modifications"
```

### 4. Envoyer vers GitHub
```bash
git push origin main
```

## Exemple complet

```bash
# 1. Voir ce qui a changé
git status

# 2. Ajouter tous les changements
git add .

# 3. Créer un commit
git commit -m "Ajout de nouvelles fonctionnalités"

# 4. Envoyer vers GitHub
git push origin main
```

## Commandes rapides (tout en une fois)

```bash
git add . && git commit -m "Votre message" && git push origin main
```

## Note importante

- Git ne pousse pas automatiquement les changements
- Vous devez toujours faire `git add`, `git commit`, puis `git push`
- Cela vous donne le contrôle sur ce qui est envoyé
- Les fichiers temporaires (comme `node_modules`) sont ignorés grâce à `.gitignore`

