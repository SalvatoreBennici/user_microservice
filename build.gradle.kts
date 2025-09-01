import com.github.gradle.node.npm.task.NpmTask
import io.github.andreabrighi.gradle.gitsemver.conventionalcommit.ConventionalCommit

plugins {
    base
    alias(libs.plugins.node)
    alias(libs.plugins.gitSemVer)
}

buildscript {
    dependencies {
        classpath(
            "io.github.andreabrighi:conventional-commit-strategy-for-git-sensitive-semantic-versioning-gradle-plugin:1.0.0"
        )
    }
}

gitSemVer {
    commitNameBasedUpdateStrategy(ConventionalCommit::semanticVersionUpdate)
    assignGitSemanticVersion()
}

node {
    version.set("22.19.0")
    download.set(true)
    nodeProjectDir.set(file(project.projectDir))
}

// Clean task
tasks.named<Delete>("clean") {
    description = "Remove node_modules and dist directories"
    delete("node_modules", "dist")
}

tasks.register<Delete>("cleanBuild") {
    group = "build"
    description = "Remove build output directories"
    delete("dist", "build")
}

// npmCi task
val npmCi = tasks.register<NpmTask>("npmCi") {
    group = "npm"
    description = "Install npm dependencies cleanly"
    args.set(listOf("ci"))
}

// Build task
val npmBuild = tasks.register<NpmTask>("npmBuild") {
    group = "build"
    description = "Build npm"
    dependsOn(npmCi)
    args.set(listOf("run", "build"))
}

tasks.named("build") {
    dependsOn(npmBuild)
}

// Test task
tasks.register<NpmTask>("test") {
    group = "verification"
    description = "Run tests"
    dependsOn(tasks.named("build"))
    args.set(listOf("run", "test"))
}

// Development tasks
tasks.register<NpmTask>("startDev") {
    group = "application"
    description = "Start development server"
    dependsOn(tasks.named("build"))
    args.set(listOf("run", "start:dev"))
}

tasks.register("devAll") {
    group = "application"
    description = "Clean, build, test and start dev server"
    dependsOn("cleanBuild", tasks.named("build"), "test")
    finalizedBy("startDev")
}

// Lint tasks
tasks.register<NpmTask>("lint") {
    group = "verification"
    description = "Run linting"
    dependsOn(tasks.named("npmCi"))
    args.set(listOf("run", "lint"))
}

tasks.register<NpmTask>("lintFix") {
    group = "verification"
    description = "Fix linting issues automatically"
    dependsOn(tasks.named("npmCi"))
    args.set(listOf("run", "lint:fix"))
}

// Documentation task
tasks.register<NpmTask>("docs") {
    group = "documentation"
    description = "Generate project documentation"
    dependsOn(npmCi)
    args.set(listOf("run", "docs"))
}

// Production dependencies task
tasks.register<NpmTask>("installProdDependencies") {
    group = "npm"
    description = "Install only production dependencies for Docker"
    args.set(listOf("install", "--omit=dev"))
}
