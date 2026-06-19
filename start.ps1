Write-Host "Demarrage Portfolio API..." -ForegroundColor Green

$ns = kubectl get namespace portfolio 2>$null
if ($LASTEXITCODE -ne 0) {
    kubectl create namespace portfolio
    Write-Host "Namespace portfolio cree" -ForegroundColor Green
}

$ns2 = kubectl get namespace monitoring 2>$null
if ($LASTEXITCODE -ne 0) {
    kubectl create namespace monitoring
    Write-Host "Namespace monitoring cree" -ForegroundColor Green
}

Write-Host "Application des fichiers Kubernetes..." -ForegroundColor Yellow
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/monitoring/prometheus.yaml
kubectl apply -f k8s/monitoring/grafana.yaml

Write-Host "Attente du demarrage API..." -ForegroundColor Yellow
kubectl rollout status deployment/portfolio-api -n portfolio --timeout=120s

Write-Host "Tout est disponible !" -ForegroundColor Green
Write-Host "API        : http://localhost:30300" -ForegroundColor Cyan
Write-Host "Metriques  : http://localhost:30300/metrics" -ForegroundColor Cyan
Write-Host "Prometheus : http://localhost:30090" -ForegroundColor Cyan
Write-Host "Grafana    : http://localhost:30030" -ForegroundColor Cyan