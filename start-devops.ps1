Write-Host "Demarrage des outils DevOps..." -ForegroundColor Green

$ns = kubectl get namespace devops-tools 2>$null
if ($LASTEXITCODE -ne 0) {
    kubectl create namespace devops-tools
    Write-Host "Namespace devops-tools cree" -ForegroundColor Green
}

Write-Host "Demarrage de Jenkins..." -ForegroundColor Yellow
kubectl apply -f k8s/devops/jenkins.yaml

Write-Host "Demarrage de SonarQube..." -ForegroundColor Yellow
kubectl apply -f k8s/devops/sonarqube.yaml

Write-Host "Attente de Jenkins..." -ForegroundColor Yellow
kubectl rollout status deployment/jenkins -n devops-tools --timeout=120s

Write-Host "Attente de SonarQube..." -ForegroundColor Yellow
kubectl rollout status deployment/sonarqube -n devops-tools --timeout=180s

Write-Host "Outils DevOps disponibles :" -ForegroundColor Green
Write-Host "Jenkins   : http://localhost:30080" -ForegroundColor Cyan
Write-Host "SonarQube : http://localhost:30900" -ForegroundColor Cyan