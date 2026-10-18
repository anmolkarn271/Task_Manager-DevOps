# 🚀 Task Manager — DevOps Project

A lightweight task management web application deployed on **AWS EC2** using Docker and an automated CI/CD pipeline with GitHub Actions.

This project demonstrates practical DevOps skills, including containerization, image publishing, cloud deployment, automated testing, health checks, and rollback handling.

## 🌐 Live Application

**Live URL:** `http://YOUR-EC2-PUBLIC-IP:3000`

> Replace `YOUR-EC2-PUBLIC-IP` with your actual EC2 public IP address.

## ✨ Features

* Add new tasks
* Mark tasks as completed
* Undo task completion
* Delete tasks
* View and manage tasks through a simple web interface
* Store task data in a JSON file
* Run the application inside a Docker container
* Deploy the application to AWS EC2 using GitHub Actions

## 🛠️ Tech Stack

| Technology            | Purpose                                    |
| --------------------- | ------------------------------------------ |
| HTML, CSS, JavaScript | Frontend                                   |
| Node.js               | JavaScript runtime                         |
| Express.js            | Backend server and REST API                |
| Docker                | Application containerization               |
| Docker Hub            | Docker image registry                      |
| AWS EC2               | Application hosting                        |
| Git & GitHub          | Version control and source code management |
| GitHub Actions        | CI/CD automation                           |
| Linux/Ubuntu          | Development and deployment environment     |

## 🏗️ Architecture

```text
Developer
    |
    | Git push
    v
GitHub Repository
    |
    v
GitHub Actions
    |
    +---- Install dependencies
    |
    +---- Run tests
    |
    +---- Build Docker image
    |
    +---- Push image to Docker Hub
    |
    v
AWS EC2 Instance
    |
    +---- Pull latest image
    |
    +---- Run Docker container
    |
    +---- Check application health
    |
    v
Task Manager Web Application
    |
    v
Browser — Port 3000
```

## 🔄 CI/CD Workflow

The GitHub Actions pipeline automates the deployment process when changes are pushed to the configured branch.

1. A developer pushes code to GitHub.
2. GitHub Actions installs dependencies.
3. Automated tests run.
4. A Docker image is built.
5. The image is pushed to Docker Hub.
6. GitHub Actions connects to the EC2 instance over SSH.
7. The new image is deployed as a Docker container.
8. A health check verifies that the application is responding.
9. If the deployment health check fails, the workflow attempts to restore the previous image.

**Security:** Deployment credentials are stored in GitHub Actions Secrets rather than hardcoded in the repository.

## 🐳 Run Locally

### Prerequisites

* Git
* Node.js 22
* npm

### 1. Clone the repository

```bash
git clone https://github.com/anmolkarn271/Task_Manager-DevOps.git
cd Task_Manager-DevOps
```

### 2. Install dependencies

```bash
npm ci
```

If the repository does not contain a `package-lock.json`, use:

```bash
npm install
```

### 3. Start the application

```bash
npm start
```

Open your browser:

```text
http://localhost:3000
```

> Use the start command defined in your `package.json` if it differs from `npm start`.

## 🐳 Run with Docker

Build the image:

```bash
docker build -t task-manager:local .
```

Run the container:

```bash
docker run -d \
  --name task-manager \
  -p 3000:3000 \
  -v task-manager-data:/app/data \
  task-manager:local
```

Open:

```text
http://localhost:3000
```

Check the container:

```bash
docker ps
```

View application logs:

```bash
docker logs task-manager
```

Stop the container:

```bash
docker stop task-manager
```

Start it again:

```bash
docker start task-manager
```

The named Docker volume is intended to preserve data stored under `/app/data` when the container is replaced. Confirm that the application writes its task file to this directory for persistence to work as expected.

## ☁️ AWS Deployment

The application runs inside a Docker container on an AWS EC2 Ubuntu instance.

Deployment requirements include:

* An EC2 instance with Docker installed
* A Docker Hub repository
* GitHub Actions enabled
* SSH access to the EC2 instance
* The required GitHub Actions Secrets configured

For this project, the application listens on port `3000`. Configure the EC2 security group to allow inbound traffic on that port if you want to access the application directly over HTTP.

**Production note:** For a production deployment, use HTTPS through a domain and reverse proxy, restrict SSH access, and avoid exposing application ports unnecessarily.

## 🔐 GitHub Actions Secrets

The deployment workflow uses secrets such as:

| Secret               | Purpose                        |
| -------------------- | ------------------------------ |
| `DOCKERHUB_USERNAME` | Docker Hub account username    |
| `DOCKERHUB_TOKEN`    | Docker Hub access token        |
| `EC2_HOST`           | EC2 public IP or hostname      |
| `EC2_USERNAME`       | EC2 SSH username               |
| `EC2_SSH_KEY`        | Private SSH key for deployment |

Never commit private SSH keys, access tokens, passwords, or other credentials to the repository.

## 🩺 Health Check

The application provides a health endpoint:

```text
/api/health
```

Check it locally:

```bash
curl http://localhost:3000/api/health
```

For the deployed application:

```bash
curl http://YOUR-EC2-PUBLIC-IP:3000/api/health
```

Replace the placeholder with your actual EC2 public IP.

## 📁 Project Structure

```text
devops-task-manager/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── data/
│   └── tasks.json
├── server.js
├── package.json
├── package-lock.json
├── Dockerfile
├── .dockerignore
└── README.md
```

The exact contents may vary depending on your current repository files.

## 🎯 DevOps Skills Demonstrated

* Linux command-line operations
* Git and GitHub workflows
* Node.js application deployment
* Docker image creation and container management
* Docker Hub image publishing
* AWS EC2 hosting
* GitHub Actions CI/CD automation
* SSH-based deployment
* GitHub Actions Secrets management
* Application health checks
* Deployment rollback handling
* Persistent Docker volumes

## 🚀 Future Improvements

* Add a custom domain and HTTPS
* Introduce Nginx as a reverse proxy
* Add structured logging and monitoring
* Move task storage from a JSON file to a database
* Improve automated test coverage
* Add deployment notifications
* Harden SSH host verification

## 👨‍💻 Author

**Anmol Karn**

* GitHub: [@anmolkarn271](https://github.com/anmolkarn271)

---

*Built as a hands-on project to practise DevOps tools and deployment workflows.*
