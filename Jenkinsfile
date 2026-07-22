pipeline {
    agent any

    environment {
        AWS_REGION = "ap-south-1"
        ECR = "123456789012.dkr.ecr.ap-south-1.amazonaws.com"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Login ECR') {
            steps {
                sh '''
                aws ecr get-login-password --region $AWS_REGION \
                | docker login \
                --username AWS \
                --password-stdin $ECR
                '''
            }
        }

        stage('Build') {
            steps {
                sh 'docker compose build'
            }
        }

        stage('Push') {
            steps {
                sh 'docker compose push'
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                docker compose pull
                docker compose up -d --remove-orphans
                '''
            }
        }
    }
}