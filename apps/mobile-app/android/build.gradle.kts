allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

val newBuildDir: Directory =
    rootProject.layout.buildDirectory
        .dir("../../build")
        .get()
rootProject.layout.buildDirectory.value(newBuildDir)

subprojects {
    val newSubprojectBuildDir: Directory = newBuildDir.dir(project.name)
    project.layout.buildDirectory.value(newSubprojectBuildDir)
}
subprojects {
    project.evaluationDependsOn(":app")
}

// Align JVM targets across all plugins. Some (e.g. receive_sharing_intent)
// default their Java tasks to 1.8 while Kotlin compiles to a newer target,
// which Gradle rejects as inconsistent. Pin both to 17 everywhere.
subprojects {
    // Align JVM targets across every plugin module. Some (e.g.
    // receive_sharing_intent) hard-set Java to 1.8 while Kotlin uses a newer
    // target, which Gradle rejects as inconsistent. Register these hooks during
    // configuration (via plugin-application callbacks) so they apply before the
    // module is evaluated.
    plugins.withId("org.jetbrains.kotlin.android") {
        tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile>().configureEach {
            compilerOptions {
                jvmTarget.set(org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_17)
            }
        }
    }
    plugins.withId("com.android.library") {
        extensions.configure<com.android.build.gradle.LibraryExtension>("android") {
            compileOptions {
                sourceCompatibility = JavaVersion.VERSION_17
                targetCompatibility = JavaVersion.VERSION_17
            }
        }
    }
}

tasks.register<Delete>("clean") {
    delete(rootProject.layout.buildDirectory)
}
