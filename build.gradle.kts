import com.github.gradle.node.npm.task.NpmTask
import org.gradle.api.tasks.Delete
import org.gradle.api.tasks.Exec

plugins {
    base
    alias(libs.plugins.node)
}

node {
    version.set("20.11.1")
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
    args.set(listOf("run", "build"))
}

val npmTest = tasks.register<NpmTask>("npmTest") {
    group = "verification"
    description = "Runs the tests"
    dependsOn(npmBuild)
    args.set(listOf("run", "test"))
}

tasks.register<NpmTask>("runDev") {
    group = "application"
    description = "Builds and runs the application in development mode"
    dependsOn(npmBuild)
    args.set(listOf("run", "start:dev"))
}

tasks.named("build") {
    dependsOn(npmBuild)
}

tasks.named("check") {
    dependsOn(npmTest)
}

tasks.named<Delete>("clean") {
    description = "Deletes node_modules, dist, and .gradle directories"
    delete("node_modules", "dist", ".gradle")
}