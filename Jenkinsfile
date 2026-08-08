pipeline {
    agent any

    environment {
        AWS_REGION = "eu-north-1"
        ECR = "247661383205.dkr.ecr.eu-north-1.amazonaws.com"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Login to ECR') {
            steps {
                withCredentials([
                    [
                        $class: 'AmazonWebServicesCredentialsBinding',
                        credentialsId: 'aws-ecr'
                    ]
                ]) {
                    sh '''
                    aws ecr get-login-password --region $AWS_REGION \
                    | docker login \
                    --username AWS \
                    --password-stdin $ECR
                    '''
                }
            }
        }

        stage('Build Images') {
            steps {
                sh '''
                docker-compose -f docker-compose.prod.yml build
                '''
            }
        }

        stage('Push Images') {
            steps {
                sh '''
                docker compose -f docker-compose.prod.yml push
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                docker compose -f docker-compose.prod.yml pull

                docker compose -f docker-compose.prod.yml up -d --remove-orphans
                '''
            }
        }
    }
}