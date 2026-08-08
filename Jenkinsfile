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
        withCredentials([
            file(credentialsId: 'product-service-env', variable: 'PRODUCT_ENV'),
            file(credentialsId: 'user-service-env', variable: 'USER_ENV'),
            file(credentialsId: 'order-service-env', variable: 'ORDER_ENV'),
            file(credentialsId: 'payment-service-env', variable: 'PAYMENT_ENV'),
            file(credentialsId: 'api-gateway-env', variable: 'GATEWAY_ENV'),
            file(credentialsId: 'client-env', variable: 'CLIENT_ENV')
        ]) {
            sh '''
                rm -f apps/product-service/.env
                rm -f apps/user-service/.env
                rm -f apps/order-service/.env
                rm -f apps/payment-service/.env
                rm -f apps/api-gateway/.env
                rm -f apps/client/.env

                cp "$PRODUCT_ENV" apps/product-service/.env
                cp "$USER_ENV" apps/user-service/.env
                cp "$ORDER_ENV" apps/order-service/.env
                cp "$PAYMENT_ENV" apps/payment-service/.env
                cp "$GATEWAY_ENV" apps/api-gateway/.env
                cp "$CLIENT_ENV" apps/client/.env

                echo "All environment files created successfully."
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