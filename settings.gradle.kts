plugins {
    id("org.danilopianini.gradle-pre-commit-git-hooks") version "2.0.28"
}

gitHooks {
    commitMsg { conventionalCommits() }
    createHooks()
}

rootProject.name = "user_microservice"