#!/bin/bash

# ConfigMap
kubectl create -f environment.configmap.yaml

# APIs
kubectl apply -f mongo.deployment.yaml
kubectl apply -f kyso-api.deployment.yaml
