pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
        sonarQube 'SonarScanner'
    }

    environment {
        IMAGE_NAME = "espoirdev22/portfolio_api_espress"
        IMAGE_TAG  = "${BUILD_NUMBER}"
        NAMESPACE  = "portfolio"
    }

    stages {

        stage('Clone Repo') {
            steps {
                git branch: 'master',
                    url: 'https://github.com/espoirdev22/portfolio_api.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Basic Check') {
            steps {
                sh 'node -v'
                sh 'npm -v'
            }
        }

        stage('Tests') {
            steps {
                withCredentials([file(credentialsId: 'portfolio-env', variable: 'ENV_FILE')]) {
                    sh 'cp $ENV_FILE .env'
                    sh 'npm test'
                    sh 'rm -f .env'  // supprime après les tests
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    withCredentials([string(credentialsId: 'sonarqube-token', variable: 'SONAR_TOKEN')]) {
                        sh '''
                            /opt/sonar-scanner/bin/sonar-scanner \
                            -Dsonar.projectKey=portfolio-api \
                            -Dsonar.sources=. \
                            -Dsonar.exclusions=node_modules/**,coverage/** \
                            -Dsonar.host.url=http://sonarqube-service.devops.svc.cluster.local:9000 \
                            -Dsonar.token=$SONAR_TOKEN
                        '''
                    }
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 15, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Docker Build') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
                sh "docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${IMAGE_NAME}:latest"
            }
        }

        stage('Docker Push') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                    sh "docker push ${IMAGE_NAME}:${IMAGE_TAG}"
                    sh "docker push ${IMAGE_NAME}:latest"
                }
            }
        }

        stage('Prepare Kubernetes') {
            steps {
                sh """
                    kubectl get namespace ${NAMESPACE} || \
                    kubectl create namespace ${NAMESPACE}
                """
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh "kubectl set image deployment/portfolio-api portfolio-api=${IMAGE_NAME}:${IMAGE_TAG} -n ${NAMESPACE}"
                sh "kubectl rollout status deployment/portfolio-api -n ${NAMESPACE} --timeout=120s"
            }
        }
    }

    post {
        success {
            emailext(
                to: 'saloudiallo151@gmail.com',
                subject: "✅ Build SUCCESS - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """
                    Build #${env.BUILD_NUMBER} réussi !
                    Job      : ${env.JOB_NAME}
                    Build URL: ${env.BUILD_URL}
                    Image    : ${IMAGE_NAME}:${IMAGE_TAG}
                    ✅ Tests passés
                    ✅ SonarQube OK
                    ✅ Docker pushed
                    ✅ Kubernetes déployé
                """
            )
        }
        failure {
            emailext(
                to: 'saloudiallo151@gmail.com',
                subject: "❌ Build FAILED - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """
                    Build #${env.BUILD_NUMBER} a échoué !
                    Job      : ${env.JOB_NAME}
                    Build URL: ${env.BUILD_URL}
                    Vérifiez les logs pour plus de détails.
                """
            )
        }
        always {
            sh "docker rmi ${IMAGE_NAME}:${IMAGE_TAG} || true"
            sh 'docker logout'
        }
    }
}