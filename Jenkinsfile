pipeline {
    agent any

    environment {
        AWS_REGION = "eu-north-1"
        ECR_REGISTRY = "247661383205.dkr.ecr.eu-north-1.amazonaws.com"
        COMPOSE_FILE = "docker-compose.prod.yml"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Login to Amazon ECR') {
            steps {
                withCredentials([
                    [
                        $class: 'AmazonWebServicesCredentialsBinding',
                        credentialsId: 'aws-ecr'
                    ]
                ]) {
                    sh '''
                    set -e

                    aws ecr get-login-password --region $AWS_REGION | \
                    docker login \
                    --username AWS \
                    --password-stdin $ECR_REGISTRY
                    '''
                }
            }
        }

        stage('Build Images') {
            steps {
                sh '''
                set -e

                docker compose -f $COMPOSE_FILE build
                '''
            }
        }

        stage('Push Images') {
            steps {
                sh '''
                set -e

                docker compose -f $COMPOSE_FILE push
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                set -e

                docker compose -f $COMPOSE_FILE pull

                docker compose -f $COMPOSE_FILE up -d --remove-orphans
                '''
            }
        }
    }

    post {

        success {
            echo 'Deployment completed successfully.'
        }

        failure {
            echo 'Pipeline failed.'
        }

        always {
            sh 'docker image prune -f || true'
        }
    }
}