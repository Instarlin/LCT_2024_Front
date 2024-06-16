#!/bin/sh
docker build --tag washingtonsilverstorage.cr.cloud.ru/washingtonsilver_frontend . --platform linux/amd64
docker push washingtonsilverstorage.cr.cloud.ru/washingtonsilver_frontend:latest
