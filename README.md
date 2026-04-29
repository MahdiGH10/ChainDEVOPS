# Chainedevops

## Description

Chainedevops est une application full-stack démontrant une chaîne DevOps moderne :
- **Backend** : Node.js/Express (API REST)
- **Frontend** : React (Vite)
- **CI/CD** : GitHub Actions, Docker, Kubernetes, ArgoCD (GitOps)

L’objectif est d’illustrer un workflow complet de développement, test, build, déploiement automatisé et gestion d’infrastructure cloud-native.

---

## Architecture

```
[Dev/Feature Branches] -> [dev] -> [main]
				|                   |        |
				|                   |        |
				|                   v        v
				|               [CI/CD]   [CI/CD]
				|                   |        |
				|                   v        v
				|               [Docker Registry]
				|                   |
				|                   v
				|               [Kubernetes]
				|                   |
				|                   v
				|               [ArgoCD]
```

- **CI/CD** : GitHub Actions pour lint, tests, build, push images Docker.
- **Conteneurisation** : Docker pour backend et frontend.
- **Orchestration** : Kubernetes (Minikube local).
- **GitOps** : ArgoCD pour déploiement automatisé depuis le repo Git.

---

## Instructions de Lancement

### 1. Prérequis
- Docker
- Node.js (>=18)
- Minikube (ou cluster Kubernetes)
- kubectl
- Accès à GitHub et DockerHub

### 2. Installation & Lancement Local

#### Backend
```bash
cd backend
npm install
npm run lint
npm test
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
npm run lint
npm run dev
```

#### Build Docker (local)
```bash
docker build -t chaindevops-backend:latest -f docker/backend.Dockerfile .
docker build -t chaindevops-frontend:latest -f docker/frontend.Dockerfile .
```

### 3. Déploiement Kubernetes

- Démarrer Minikube :
	```bash
	minikube start
	eval $(minikube docker-env)
	```
- Appliquer les manifests :
	```bash
	kubectl apply -f k8s/
	```
- Accéder au frontend :
	```bash
	minikube service frontend-service
	```

### 4. GitOps avec ArgoCD

- Installer ArgoCD (voir doc officielle)
- Lancer le port-forward :
	```bash
	kubectl port-forward svc/argocd-server -n argocd 8080:443
	```
- Accéder à l’UI : http://localhost:8080
- Synchroniser l’application (auto ou manuellement)

### 5. CI/CD

- Les pipelines sont automatisés via GitHub Actions :
	- Lint, test, build, push images, analyse SonarCloud, scan Trivy
- Les images sont déployées automatiquement via ArgoCD dès qu’un commit est poussé sur `dev` ou `main`.

---

## Problèmes & Solutions

Voir le rapport technique pour le détail des problèmes rencontrés et des solutions apportées.

---

## Auteurs
- MahdiGH10


