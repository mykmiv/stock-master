# Configuration pour Lovable

## ⚠️ Pourquoi le visuel est différent dans Lovable ?

L'application a besoin de **variables d'environnement Supabase** pour fonctionner correctement. Sans elles, l'application ne peut pas se connecter à la base de données et certaines fonctionnalités ne marchent pas.

## 🔧 Comment configurer les variables dans Lovable

### Étape 1: Obtenir vos clés Supabase

1. Allez sur votre [dashboard Supabase](https://app.supabase.com)
2. Sélectionnez votre projet
3. Allez dans **Settings** → **API**
4. Copiez :
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_PUBLISHABLE_KEY`

### Étape 2: Configurer dans Lovable

1. Ouvrez votre projet dans [Lovable](https://lovable.dev)
2. Allez dans **Settings** → **Environment Variables** (ou **Project Settings** → **Environment**)
3. Ajoutez ces deux variables :

```
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=votre-cle-publique-ici
```

4. **Important** : Remplacez `https://votre-projet.supabase.co` et `votre-cle-publique-ici` par vos vraies valeurs
5. Sauvegardez et redémarrez l'application dans Lovable

### Étape 3: Vérifier

Après avoir configuré les variables :
- L'application devrait se connecter à Supabase
- Les leçons devraient apparaître
- L'authentification devrait fonctionner

## 📝 Variables nécessaires

| Variable | Description | Où la trouver |
|----------|-------------|---------------|
| `VITE_SUPABASE_URL` | URL de votre projet Supabase | Supabase Dashboard → Settings → API → Project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Clé publique (anon) de Supabase | Supabase Dashboard → Settings → API → anon/public key |

## 🔍 Vérification locale

Sur votre machine locale, ces variables sont dans le fichier `.env` (qui n'est pas dans Git pour des raisons de sécurité).

Pour créer votre `.env` local :
1. Copiez `.env.example` en `.env`
2. Remplissez avec vos vraies valeurs
3. Redémarrez le serveur de développement

## ❓ Problèmes courants

### "Cannot connect to Supabase"
- Vérifiez que les variables d'environnement sont bien configurées dans Lovable
- Vérifiez que les valeurs sont correctes (pas d'espaces, URL complète)

### "Lessons not loading"
- Vérifiez la connexion Supabase
- Assurez-vous que les migrations sont appliquées dans votre projet Supabase
- Vérifiez les permissions RLS dans Supabase

### Le visuel est toujours différent
- Les variables d'environnement doivent être rechargées (redémarrer l'app dans Lovable)
- Vérifiez que vous utilisez le même projet Supabase

