# Explication : Pourquoi les variables VITE_ sont nécessaires même si Supabase est connecté

## 🤔 La question

"Pourquoi dois-je configurer `VITE_SUPABASE_URL` et `VITE_SUPABASE_PUBLISHABLE_KEY` alors que Supabase est déjà connecté dans Lovable ?"

## 💡 La réponse

Même si Supabase est **connecté** dans Lovable (dans la section Connectors), cela signifie seulement que :
- ✅ Lovable **sait** quel projet Supabase utiliser
- ✅ Lovable peut injecter automatiquement certaines variables pour les **Edge Functions** (backend)
- ❌ Mais Lovable **n'injecte PAS automatiquement** les variables pour le **frontend React/Vite**

## 🔐 Sécurité Vite : Le préfixe VITE_

Dans Vite (le build tool utilisé), **seules les variables qui commencent par `VITE_`** sont accessibles dans le code client (React). C'est une mesure de sécurité.

- ❌ `SUPABASE_URL` → **NON** accessible dans React (même si Lovable l'injecte)
- ✅ `VITE_SUPABASE_URL` → **OUI** accessible dans React

Votre code utilise :
```typescript
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
```

Donc il **doit** y avoir des variables nommées `VITE_SUPABASE_URL` et `VITE_SUPABASE_PUBLISHABLE_KEY`.

## ✅ La solution

Vous devez **ajouter manuellement** ces variables dans **Project Settings → Environment Variables** :

```
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=votre-cle-publique
```

Vous pouvez utiliser les **mêmes valeurs** que celles de votre projet Supabase "Trading learning app" qui est déjà connecté.

## 📝 En résumé

| Élément | Statut | Action nécessaire |
|---------|--------|-------------------|
| Supabase connecté dans Lovable | ✅ Oui | Aucune |
| Variables pour Edge Functions | ✅ Automatiques | Aucune |
| Variables `VITE_*` pour React | ❌ Manquantes | **À ajouter manuellement** |

Même si c'est le même Supabase, les variables `VITE_*` doivent être définies explicitement pour être accessibles dans votre code React.

