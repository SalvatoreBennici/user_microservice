plugins {
    id("org.danilopianini.gradle-pre-commit-git-hooks") version "2.0.28"
}

gitHooks {
    preCommit {
        tasks("lint")
        tasks("format")
    }
    commitMsg { conventionalCommits() }
    createHooks(true)
}

rootProject.name = "user_microservice"