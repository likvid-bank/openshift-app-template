# 🚀 Your Application on OpenShift

This repository was created by the **meshStack OpenShift Starterkit**. It contains a small Node.js
application, the OpenShift manifests to run it and a GitHub Actions workflow that deploys it to one
OpenShift project per stage.

## 📁 Layout

| Path | Content |
|---|---|
| `app/` | Node.js application and its `Dockerfile` |
| `openshift/` | `Deployment`, `Service` and `Route` |
| `.github/workflows/openshift-deploy.yml` | Builds the image and deploys it |

## 🔄 How deployments work

| Branch | GitHub environment | OpenShift project |
|---|---|---|
| `main` | `dev` | your dev project |
| `release` | `prod` | your prod project |

Every push to `main` deploys to dev. Merge `main` into `release` to deploy to prod. You can protect
the `prod` environment in the repository settings, for example with required reviewers.

The workflow builds the image from `app/`, pushes it to the cluster's internal registry and applies
the manifests in `openshift/`. meshStack sets up each environment with:

| Name | Kind | Content |
|---|---|---|
| `KUBECONFIG` | secret | access to the stage's project |
| `OPENSHIFT_REGISTRY_TOKEN` | secret | password for the internal registry |
| `OPENSHIFT_NAMESPACE` | variable | the project name |
| `OPENSHIFT_REGISTRY` | variable | host of the internal registry route |
| `APP_HOSTNAME` | variable | hostname of the app's route |

## ⚠️ OpenShift specifics

- Containers run with an **arbitrary, non-root UID** (`restricted-v2` security context
  constraint). Files the app writes to must be group-writable for group `0`; see `app/Dockerfile`.
- The app must listen on an unprivileged port; this one uses `8080`.
