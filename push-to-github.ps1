# Script pour envoyer les modifications vers GitHub
# Usage: .\push-to-github.ps1 "Message de votre commit"

param(
    [string]$message = "Mise à jour du code"
)

Write-Host "📤 Envoi des modifications vers GitHub..." -ForegroundColor Cyan

# Vérifier s'il y a des changements
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "⚠️  Aucun changement détecté." -ForegroundColor Yellow
    exit 0
}

# Afficher les changements
Write-Host "`n📝 Fichiers modifiés :" -ForegroundColor Green
git status --short

# Ajouter tous les fichiers
Write-Host "`n➕ Ajout des fichiers..." -ForegroundColor Cyan
git add .

# Créer le commit
Write-Host "💾 Création du commit..." -ForegroundColor Cyan
git commit -m $message

if ($LASTEXITCODE -eq 0) {
    # Pousser vers GitHub
    Write-Host "🚀 Envoi vers GitHub..." -ForegroundColor Cyan
    git push origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ Succès! Vos modifications ont été envoyées vers GitHub." -ForegroundColor Green
        Write-Host "🔗 https://github.com/mykmiv/stock-master" -ForegroundColor Blue
    } else {
        Write-Host "`n❌ Erreur lors de l'envoi vers GitHub." -ForegroundColor Red
    }
} else {
    Write-Host "`n❌ Erreur lors de la création du commit." -ForegroundColor Red
}

