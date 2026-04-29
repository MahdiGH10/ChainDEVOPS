# Rapport Technique – Projet Chainedevops

## 1. Description du Projet

Chainedevops est une application full-stack composée d’un backend Node.js/Express et d’un frontend React. L’objectif est de démontrer la mise en place d’une chaîne DevOps complète, de la CI/CD à la livraison automatisée sur Kubernetes via GitOps (ArgoCD).

## 2. Architecture DevOps

- **CI/CD** : GitHub Actions pour lint, tests, build, push images Docker.
- **Conteneurisation** : Docker pour backend et frontend.
- **Orchestration** : Kubernetes (Minikube local).
- **GitOps** : ArgoCD pour déploiement automatisé depuis le repo Git.
- **Branches** : `main`, `dev`, `feature/*` (workflow avancé).

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

## 3. Choix Techniques

- **Node.js/Express** pour l’API backend (simplicité, rapidité de prototypage).
- **React** pour le frontend (modernité, SPA).
- **Vite** pour le build frontend (rapide, moderne).
- **ESLint** pour la qualité du code (lint dans CI).
- **SonarCloud** pour l’analyse de code.
- **Trivy** pour le scan de vulnérabilités Docker.
- **ArgoCD** pour GitOps (déploiement auto depuis Git).
- **Minikube** pour un cluster Kubernetes local.

## 4. Explication des Pipelines CI/CD

### CI (GitHub Actions)
- **Lint** : Vérifie la qualité du code (`npm run lint`).
- **Test** : Exécute les tests unitaires.
- **Build** : Construit les images Docker pour backend et frontend.
- **Push** : Pousse les images sur le registre Docker local.
- **Analyse** : SonarCloud + Trivy.

### CD (ArgoCD)
- **Sync** : ArgoCD surveille la branche `dev` (ou `main`) et applique automatiquement les manifests Kubernetes dès qu’un commit est poussé.
- **Rollback** : Possible via l’interface ArgoCD.

## 5. Commandes pour Captures Réelles

- **CI/CD Pipeline (GitHub Actions)** :
  - Capturez l’exécution du workflow sur GitHub (onglet Actions).
- **Build Docker local** :
  - `docker images | grep chainedevops`
- **Déploiement K8s** :
  - `kubectl get pods -A`
  - `kubectl get svc -A`
  - `kubectl get deployments -A`
- **ArgoCD** :
  - Interface Web : `kubectl port-forward svc/argocd-server -n argocd 8080:443`
  - Capturez l’état de l’application dans l’UI ArgoCD.
- **Logs** :
  - `kubectl logs <pod-name> -n <namespace>`

## 6. Problèmes Rencontrés

- **Erreur CSS** : Blocage du build frontend à cause d’une erreur de syntaxe CSS.
- **Connexion ArgoCD** : Problèmes de CRDs manquantes et de port-forwarding.
- **Image Pull Error** : Backend ne démarrait pas (image non trouvée dans Minikube).
- **ESLint** : Mauvaise config (plugin React inutile côté backend).

## 7. Solutions Apportées

- **Correction CSS** : Fix du fichier CSS pour débloquer le build.
- **ArgoCD** : Réinstallation des CRDs et redémarrage Minikube.
- **Docker/Minikube** : Build local de l’image backend dans le Docker de Minikube.
- **ESLint** : Nettoyage de la config pour Node.js uniquement.

---

> **Annexes** :
> - Ajoutez ici vos captures d’écran réelles selon les commandes ci-dessus.
> - Limitez le rapport à 10 pages max (ce template fait ~2 pages sans captures).
