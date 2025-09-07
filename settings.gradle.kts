plugins {
    id("org.danilopianini.gradle-pre-commit-git-hooks") version "2.0.28"
}

gitHooks {
    preCommit {
        tasks("preCommit")
    }
    commitMsg { conventionalCommits() }
    createHooks(true)
}

rootProject.name = "user_microservice"