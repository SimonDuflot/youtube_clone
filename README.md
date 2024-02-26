# youtube_clone

## Objectifs du projet ##

Premiers pas avec Docker, Express et WSL (Windows Subsystem for Linux).
Utilisation de Docker via WSL (il paraît que Docker est plus stable sur une distribution Linux, nous allons utiliser la version installée de base -Ubuntu 22.04 à l'heure ou j'écris ces lignes - vous pouvez vérifier la version de votre distribution Ubuntu en utilisant la commande lsb_release -a).
Amélioration de mes connaissances en System Design.

## Description du projet ##

Nous allons utiliser Linux sur Windows grâce à Windows Subsystem for Linux (que nous nommerons WSL dorénavant). Nous allons donc utiliser des commandes Windows et Linux. Aucune commande pour macOS ne sera recommandée lors de ce projet. Veuillez vous référer aux documentations respectives si vous avez besoin de ces commandes.

## System Design ##

Création d'un répertoire sur Github.

Pour ce projet, nous allons utiliser pour la premiere fois WSL.
WSL nous permet [rapide définition du pourquoi de WSL]

## Mise en place du projet ##

Nous allons utiliser nodejs, Docker et git. Si vous vous demandez si ces dépendances sont déjà installée sur votre machine vous pouvez utiliser ces commandes, ce sont les mêmes pour Windows et Linux:
Pour nodejs: node -v
Pour docker: docker version
Pour git: git --version
Sinon téléchargez les : 
# Node js #
Depuis un installeur: https://nodejs.org/en/download
Depuis un package manager: https://nodejs.org/en/download/package-manager

# Docker #
https://docs.docker.com/engine/install/
ou via la CLI si vous utilisez WSL et la distribution Ubuntu
sudo apt install podman-docker  # version 3.4.4+ds1-1ubuntu1.22.04.1


## Windows Subsystem for Linux (WSL) ##

[section comment mettre en place WSL]

Documentation: https://learn.microsoft.com/en-us/windows/wsl/install

# Installer WSL et choisir sa distribution #

Installation de WSL via PowerShell en administrateur: 
wsl --install

Par défaut la distribution Linux qui sera installée est Ubuntu.
Pour choisir une distribution spécifique utilisez la commande d'installation suivante: 
wsl --install -d <Nom de la distribution>
Remplacer <Nom de la distribution> par la distribution que vous voulez installer.

Pour voir une liste des distributions compatibles avec WSL tapez:
wsl --list --online 
ou bien :
wsl -l -o

Redémarrage de l'ordinateur pour compléter l'installation.
