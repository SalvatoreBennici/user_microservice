import com.github.gradle.node.npm.task.NpmTask
import io.github.andreabrighi.gradle.gitsemver.conventionalcommit.ConventionalCommit

plugins {
    base
    alias(libs.plugins.node)
    alias(libs.plugins.gitSemVer)
}

buildscript {
    dependencies {
        classpath("io.github.andreabrighi:conventional-commit-strategy-for-git-sensitive-semantic-versioning-gradle-plugin:1.0.0")
    }
}

gitSemVer {
    commitNameBasedUpdateStrategy(ConventionalCommit::semanticVersionUpdate)
    assignGitSemanticVersion()
}

node {
    version.set("20.17.0")
    npmVersion.set("10.2.4")
    download.set(true)
    nodeProjectDir.set(file(project.projectDir))
}

val npmCi = tasks.register<NpmTask>("npmCi") {
    group = "npm"
    description = "Installs dependencies from package-lock.json"
    dependsOn(tasks.named("npmSetup"))
    args.set(listOf("ci"))
}

val npmBuild = tasks.register<NpmTask>("npmBuild") {
    group = "build"
    description = "Builds the TypeScript project"
    dependsOn(npmCi)
    inputs.dir("src")
    outputs.dir("dist")
    args.set(listOf("run", "build"))
}

tasks.register<NpmTask>("runDev") {
    group = "application"
    description = "Runs the application in development mode"

    args.set(listOf("run", "dev"))
}

tasks.named("build") {
    dependsOn(npmBuild)
}

tasks.named<Delete>("clean") {
    description = "Deletes node_modules, dist, and .gradle directories"
    delete("node_modules", "dist", ".gradle")
}