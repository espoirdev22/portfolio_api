pipeline {
    agent any

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
                    sh '''
                        npx sonar-scanner \
                        -Dsonar.projectKey=portfolioApi \
                        -Dsonar.sources=. \
                        -Dsonar.host.url=http://sonarqube:9000
                    '''
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
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

        stage('Deploy to Render') {
            steps {
                withCredentials([string(credentialsId: 'render-api-key', variable: 'RENDER_KEY')]) {
                    sh '''
                        curl -X POST \
                        "https://api.render.com/v1/services/srv-d84i6t0js32c739s8eh0/deploys" \
                        -H "Authorization: Bearer $RENDER_KEY" \
                        -H "Content-Type: application/json" \
                        -d "{}"
                    '''
                }
            }
        }
    }

    post {
        success {
            mail to: 'saloudiallo151@gmail.com',
                 subject: "✅ Build SUCCESS - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                 body: "Build #${env.BUILD_NUMBER} réussi !\n\nVoir : ${env.BUILD_URL}"
        }
        failure {
            mail to: 'saloudiallo151@gmail.com',
                 subject: "❌ Build FAILED - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                 body: "Build #${env.BUILD_NUMBER} a échoué.\n\nVoir : ${env.BUILD_URL}"
        }
    }
}