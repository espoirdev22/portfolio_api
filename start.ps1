Write-Host "Demarrage Portfolio API..." -ForegroundColor Green

$ns = kubectl get namespace portfolio 2>$null
if ($LASTEXITCODE -ne 0) {
    kubectl create namespace portfolio
    Write-Host "Namespace portfolio cree" -ForegroundColor Green
}

Write-Host "Application des fichiers Kubernetes..." -ForegroundColor Yellow
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml

Write-Host "Attente du demarrage..." -ForegroundColor Yellow
kubectl rollout status deployment/portfolio-api -n portfolio --timeout=120s

Write-Host "Portfolio API demarree !" -ForegroundColor Green
Write-Host "API       : http://localhost:30300" -ForegroundColor Cyan
Write-Host "Metriques : http://localhost:30300/metrics" -ForegroundColor Cyan