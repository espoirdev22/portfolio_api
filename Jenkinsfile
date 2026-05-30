pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    stages {

        stage('Clone Repo') {
            steps {
                git branch: 'master', url: 'https://github.com/espoirdev22/portfolio_api.git'
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
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    withCredentials([string(credentialsId: 'sonarqube-token', variable: 'SONAR_TOKEN')]) {
                          sh '''
                            /opt/sonar-scanner/bin/sonar-scanner \
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
                sh 'docker build -t espoirdev22/portfolio_api_espress .'
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
                    sh 'docker push espoirdev22/portfolio_api_espress'
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh 'kubectl rollout restart deployment/portfolio-api -n portfolio'
                sh 'kubectl rollout status deployment/portfolio-api -n portfolio'
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
    }
}
