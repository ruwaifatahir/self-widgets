def getProjectName() {
  return env.JOB_NAME.split('/')[0]
}

def buildFailure = false

pipeline {
  agent any

  options {
    timeout(time: 1, unit: 'HOURS')
  }

  triggers {
    pollSCM('H/2 * * * *')
  }

  environment {
    PROJECT_NAME = getProjectName()
  }

  stages {
    stage('Prepare by cleaning') {
      steps {
        slackSend(color: '#f1c40f', message: "Running job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (<http://92.66.177.117:8080/blue/organizations/jenkins/${env.PROJECT_NAME}/detail/${env.JOB_BASE_NAME}/${env.BUILD_NUMBER}/pipeline|Open Jenkins>)")

		// Kill all never-killed Jest processes.
        sh '(ps aux | grep jest | grep .bin | awk "{print $2}" | xargs kill -9) || true'

        sh 'git checkout . && git clean -f'

        // Remove test screenshots + logs for app-web.
        sh 'rm -rf -d app-web/test/output/*.jpg'
        sh 'rm -rf -d app-web/test/output/*.log'

        // Remove logs.
        sh 'rm -f scripts/parallel-tests-output.log || echo "Nothing to remove"'

        // Remove coverage
        sh 'rm -rf app-web/.nyc_output/ || echo "Nothing to remove"'
      }
    }

    stage('Set .env') {
      steps {
        //sh '(cd app-engine && cp .env.jenkins .env)'
        sh '(cd app-web && cp .env.jenkins .env)'
        sh 'cp .env.jenkins .env'
      }
    }

	/*
	stage('Create engine JWT key') {
      steps {
        sh 'cd app-engine && ([ ! -f "jwt.key" ] && (ssh-keygen -P "" -t rsa -b 4096 -m pem -f jwt.key && openssl rsa -in jwt.key -pubout -outform PEM -out jwt.key.pub) || echo "Key already exists")'
      }
    }
    */

	stage('Install NPM') {
	  environment {
		NODE_ENV = 'development'
	  }
	  steps {
		sh 'printenv'
		sh './scripts/install.sh'
	  }
	}

	stage('Check builds') {

	  // Test if everything will build. We don't use it's /dist dirs for testing
	  steps {
		//sh 'cd app-engine; rm -rf dist/; npm run build'
		sh 'cd app-web && npm run build'
	  }
	}

	stage('Start test parallel services') {
	  steps {
		sh '(cd scripts && screen -dmS self-widgets-test-services bash -c \"npm run startParallelTestServices -- --withoutWatching > parallel-tests-output.log\")'

		// Wait for services to be started
		sh 'sleep 20'
	  }
	}

    /*stage('Build Maizzle') {
	  steps {
		sh '(cd app-engine/maizzle && npm run build)'
	  }
	}*/

    stage('Link Forge to Jenkins') {
      steps {
        // Remove existing forge dir or symlink
        sh 'rm -rf /home/forge/self-widgets.test.laveto.nl'

        // Symlink forge folder to jenkins folder
        sh 'ln -sf "$(pwd)" /home/forge/self-widgets.test.laveto.nl'

        // Give all files group permissions (recursive) to read/write/execute
        sh 'chmod -f g+rwx -R /home/forge/self-widgets.test.laveto.nl || true'

        // Setup mask permission for newly created files/directories
        /*
        sh 'setfacl -Rdm m::rwx ./app-engine || true'
        sh 'setfacl -Rdm d:m::rwx ./app-engine || true'
        */
        sh 'setfacl -Rdm m::rwx ./app-web || true'
		sh 'setfacl -Rdm d:m::rwx ./app-web || true'

        // Setup group permission for newly created files/directories
        /*
        sh 'setfacl -Rdm g::rwx ./app-engine || true'
        sh 'setfacl -Rdm d:g::rwx ./app-engine || true'
        */
		sh 'setfacl -Rdm g::rwx ./app-web || true'
		sh 'setfacl -Rdm d:g::rwx ./app-web || true'

        // Setup group permission for newly created files/directories
        /*
        sh 'setfacl -Rdm u::rwx ./app-engine || true'
        sh 'setfacl -Rdm d:u::rwx ./app-engine || true'
        */
        sh 'setfacl -Rdm u::rwx ./app-web || true'
		sh 'setfacl -Rdm d:u::rwx ./app-web || true'
      }
    }

	stage('Typecheck webapp') {
		steps {
			sh 'cd app-web && ((npm run typecheck > test/output/typecheck-errors.log) || echo "Has type errors")'
		}
	}

    stage('Test') {
      environment {
        XAUTHORITY = '/home/forge/.Xauthority'
        DISPLAY = ':0'
      }
      steps {
        script {

          /*
		  try {
		    sh '(cd app-engine && NODE_OPTIONS=--max-old-space-size=10000 npm run test)'
		  } catch(e) {
		    echo e.toString()
		    buildFailure = true
		  }
		  */

		  try {
			sh '(cd app-web && npm run test)'
		  } catch(e) {
			echo e.toString()
			buildFailure = true
		  }

		  if (buildFailure) {
		    sh 'exit 1'
		  }
		}
	  }
    }
  }

  post {
    success {
      script {
        slackSend(color: '#2ecc71', message: "Successful job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (<http://92.66.177.117:8080/blue/organizations/jenkins/${env.PROJECT_NAME}/detail/${env.JOB_BASE_NAME}/${env.BUILD_NUMBER}/pipeline|Open Jenkins>)")
        sh 'git fetch --tags'
        sh 'git tag $(php -r "echo \'passed-$BRANCH_NAME-\' . (@explode(\'passed-$BRANCH_NAME-\', explode(PHP_EOL, shell_exec(\'git tag -l --sort=-v:refname | grep passed-$BRANCH_NAME-\'))[0])[1] + 1);")'
        sh 'git push origin --tags'
      }
    }

    failure {

      /*
      dir('app-engine/html-report') {
		archiveArtifacts artifacts: 'app-engine-report.html', fingerprint: true, allowEmptyArchive: true
	  }
	  */

	  dir('app-web/html-report') {
		archiveArtifacts artifacts: 'app-web-report.html', fingerprint: true, allowEmptyArchive: true
	  }

      script {
        slackSend(color: '#c0392b', message: "Failed job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (<http://92.66.177.117:8080/blue/organizations/jenkins/${env.PROJECT_NAME}/detail/${env.JOB_BASE_NAME}/${env.BUILD_NUMBER}/pipeline|Open Jenkins>) (<http://92.66.177.117:8080/job/${env.PROJECT_NAME}/job/${env.JOB_BASE_NAME}/${env.BUILD_NUMBER}/artifact/*zip*/archive.zip|Download Results>)")
      }
    }

    unstable {
      script {
        slackSend(color: '#34495e', message: "Unstable job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (<http://92.66.177.117:8080/blue/organizations/jenkins/${env.PROJECT_NAME}/detail/${env.JOB_BASE_NAME}/${env.BUILD_NUMBER}/pipeline|Open Jenkins>)")
      }
    }

    always {

	  archiveArtifacts artifacts: 'app-web/test/output/*', fingerprint: true, allowEmptyArchive: true
	  archiveArtifacts artifacts: 'scripts/parallel-tests-output.log', fingerprint: true

      script {
        // Stop (possible) running processes
        sh '((lsof -t -i:8000) && kill -9 $(lsof -t -i:8000)) || true'
        sh 'killall chromedriver-linux || true'
        sh 'killall chrome || true'
        sh 'killall ngrok || true'

        // Kill all never-killed Jest processes.
		sh '(ps aux | grep jest | grep .bin | awk "{print $2}" | xargs kill -9) || true'

        // Stop parallel services
        sh 'screen -S self-widgets-test-services -X quit'

        // Merge app web code coverage
        //sh 'node scripts/mergeAppWebNycOutputs.js && cd app-web && rsync -a ./.nyc_output/test-*/* ./.nyc_output && npx nyc report --reporter=html --reporter=text'
      }

	  archiveArtifacts artifacts: 'app-web/.nyc_output/*', fingerprint: true, allowEmptyArchive: true
      archiveArtifacts artifacts: 'app-web/coverage/*', fingerprint: true, allowEmptyArchive: true

    }
  }
}
