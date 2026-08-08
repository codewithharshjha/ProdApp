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
        stage('Prepare Environment') {
    steps {
        sh '''
            echo "===== USER ====="
            whoami
            id

            echo "===== WORKSPACE ====="
            pwd

            echo "===== PERMISSIONS ====="
            ls -ld .
            ls -ld apps
            ls -ld apps/product-service

            echo "===== TEST WRITE ====="
            touch apps/product-service/test-file.txt
            ls -l apps/product-service/test-file.txt
            rm -f apps/product-service/test-file.txt
        '''

        withCredentials([
            file(credentialsId: 'product-service-env', variable: 'PRODUCT_ENV'),
            file(credentialsId: 'user-service-env', variable: 'USER_ENV'),
            file(credentialsId: 'order-service-env', variable: 'ORDER_ENV'),
            file(credentialsId: 'payment-service-env', variable: 'PAYMENT_ENV'),
            file(credentialsId: 'api-gateway-env', variable: 'GATEWAY_ENV'),
            file(credentialsId: 'client-env', variable: 'CLIENT_ENV')
        ]) {
            sh '''
                echo "===== COPYING ENV FILES ====="

                cp "$PRODUCT_ENV" apps/product-service/.env
                cp "$USER_ENV" apps/user-service/.env
                cp "$ORDER_ENV" apps/order-service/.env
                cp "$PAYMENT_ENV" apps/payment-service/.env
                cp "$GATEWAY_ENV" apps/api-gateway/.env
                cp "$CLIENT_ENV" apps/client/.env

                echo "===== ENV FILES CREATED ====="

                ls -l apps/product-service/.env
                ls -l apps/user-service/.env
                ls -l apps/order-service/.env
                ls -l apps/payment-service/.env
                ls -l apps/api-gateway/.env
                ls -l apps/client/.env
            '''
        }
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
                docker-compose -f docker-compose.prod.yml push
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                docker-compose -f docker-compose.prod.yml pull

                docker-compose -f docker-compose.prod.yml up -d --remove-orphans
                '''
            }
        }
    }
}