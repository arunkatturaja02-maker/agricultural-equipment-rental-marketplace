@REM Maven Wrapper Batch Script for Windows
@echo off
setlocal

set DIRNAME=%~dp0
if "%DIRNAME%" == "" set DIRNAME=.

set MAVEN_PROJECTBASEDIR=%DIRNAME%

@REM Use pre-downloaded Maven binary or IntelliJ Maven if available
if exist "%DIRNAME%apache-maven-3.9.6\bin\mvn.cmd" (
    set "MAVEN_CMD=%DIRNAME%apache-maven-3.9.6\bin\mvn.cmd"
) else if exist "%USERPROFILE%\.m2\wrapper\dists\apache-maven-3.9.16-bin\5grr65jo27hi51sujmtcldfovl\apache-maven-3.9.16\bin\mvn.cmd" (
    set "MAVEN_CMD=%USERPROFILE%\.m2\wrapper\dists\apache-maven-3.9.16-bin\5grr65jo27hi51sujmtcldfovl\apache-maven-3.9.16\bin\mvn.cmd"
) else if exist "C:\Program Files\JetBrains\IntelliJ IDEA 2026.2.3\plugins\maven-plugin\lib\maven3\bin\mvn.cmd" (
    set "MAVEN_CMD=C:\Program Files\JetBrains\IntelliJ IDEA 2026.2.3\plugins\maven-plugin\lib\maven3\bin\mvn.cmd"
) else (
    set "MAVEN_CMD=mvn"
)

"%MAVEN_CMD%" %*
