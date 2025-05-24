# Backend Deployment Guide

This guide provides instructions for deploying the backend application using Docker.

## Prerequisites

- **Docker:** Ensure you have Docker installed and running on your system. You can download and install Docker from [https://www.docker.com/get-started](https://www.docker.com/get-started).

## Building the Docker Image

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Build the Docker image:**
    ```bash
    docker build -t backend-app .
    ```
    This command builds a Docker image tagged as `backend-app` using the `Dockerfile` in the current directory (`backend`).

## Running the Docker Container

1.  **Run the Docker container:**
    ```bash
    docker run -p 3000:3000 backend-app
    ```
    This command runs the `backend-app` image as a container.
    -   `-p 3000:3000` maps port 3000 of the host machine to port 3000 of the container.
    -   The backend application inside the container runs on port 3000.

    You should now be able to access the backend application at `http://localhost:3000`.
