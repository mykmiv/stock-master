# Configuration pour Lovable

## ⚠️ Pourquoi le visuel est différent dans Lovable ?

L'application a besoin de **variables d'environnement Supabase** pour fonctionner correctement. Sans elles, l'application ne peut pas se connecter à la base de données et certaines fonctionnalités ne marchent pas.

## 🔧 Comment configurer les variables dans Lovable

### ✅ Si Supabase est déjà lié (comme dans votre cas)

Lovable peut automatiquement injecter certaines variables, mais il faut vérifier qu'elles sont bien configurées :

1. Ouvrez votre projet dans [Lovable](https://lovable.dev)
2. Allez dans **Project Settings** → **Environment Variables** (ou **Settings** → **Environment**)
3. Vérifiez que ces variables existent :
   - `VITE_SUPABASE_URL` (doit commencer par `https://`)
   - `VITE_SUPABASE_PUBLISHABLE_KEY` (longue chaîne de caractères)

4. **Si elles n'existent pas**, ajoutez-les manuellement :
   - Allez sur votre [dashboard Supabase](https://app.supabase.com)
   - Sélectionnez votre projet "Trading learning app"
   - Allez dans **Settings** → **API**
   - Copiez :
     - **Project URL** → pour `VITE_SUPABASE_URL`
     - **anon/public key** → pour `VITE_SUPABASE_PUBLISHABLE_KEY`

5. **Important** : Les variables doivent commencer par `VITE_` pour être accessibles dans Vite/React
6. Sauvegardez et redémarrez l'application dans Lovable

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
- **Important** : Même si Supabase est "Enabled" dans Lovable, vérifiez que les variables `VITE_SUPABASE_URL` et `VITE_SUPABASE_PUBLISHABLE_KEY` sont bien définies dans les Environment Variables du projet
- Lovable peut injecter automatiquement `SUPABASE_URL` et `SUPABASE_ANON_KEY`, mais l'application a besoin de `VITE_SUPABASE_URL` et `VITE_SUPABASE_PUBLISHABLE_KEY` (avec le préfixe `VITE_`)

