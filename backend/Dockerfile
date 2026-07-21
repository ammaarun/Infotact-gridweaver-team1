# =============================================================================
# GridWeaver Backend — Multi-Stage Dockerfile
# =============================================================================
# Stage 1: Build with Maven + JDK 21
# Stage 2: Run with minimal JRE 21 runtime (Eclipse Temurin slim)
#
# Build:  docker build -t gridweaver-backend:latest .
# Run:    docker run -p 8080:8080 --env-file .env gridweaver-backend:latest
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1 — Builder
# -----------------------------------------------------------------------------
FROM eclipse-temurin:21-jdk-alpine AS builder

LABEL stage="builder"

WORKDIR /build

# Copy dependency manifests first — Docker layer caching:
# Only re-downloads dependencies when pom.xml changes
COPY pom.xml .
COPY .mvn/ .mvn/
COPY mvnw .

# Make the Maven wrapper executable
RUN chmod +x mvnw

# Download dependencies without building (warm up cache layer)
RUN ./mvnw dependency:go-offline -B -q

# Copy source code and build
COPY src/ src/

RUN ./mvnw package -B -q -DskipTests \
    && java -Djarmode=layertools -jar target/*.jar extract --destination target/extracted

# -----------------------------------------------------------------------------
# Stage 2 — Runtime
# -----------------------------------------------------------------------------
FROM eclipse-temurin:21-jre-alpine AS runtime

LABEL maintainer="GridWeaver Engineering <engineering@gridweaver.com>"
LABEL description="GridWeaver Backend — Production Runtime"
LABEL version="1.0.0"

WORKDIR /app

# Create non-root user for security (never run as root in production)
RUN addgroup -S gridweaver && adduser -S gridweaver -G gridweaver

# Copy layered JAR layers in order (least → most frequently changing)
# Layered JARs improve Docker caching significantly
COPY --from=builder --chown=gridweaver:gridweaver /build/target/extracted/dependencies/          ./
COPY --from=builder --chown=gridweaver:gridweaver /build/target/extracted/spring-boot-loader/    ./
COPY --from=builder --chown=gridweaver:gridweaver /build/target/extracted/snapshot-dependencies/ ./
COPY --from=builder --chown=gridweaver:gridweaver /build/target/extracted/application/           ./

# Switch to non-root user
USER gridweaver

# Expose application port
EXPOSE 8080

# Health check — waits 30s for startup, then checks every 10s
HEALTHCHECK --interval=10s \
            --timeout=5s \
            --start-period=30s \
            --retries=3 \
    CMD wget -qO- http://localhost:8080/actuator/health | grep -q '"status":"UP"' || exit 1

# JVM tuning for containers:
#   -XX:+UseContainerSupport       → respect cgroup CPU/memory limits
#   -XX:MaxRAMPercentage=75.0      → use 75% of container RAM for heap
#   -Djava.security.egd            → faster SecureRandom for UUID generation
ENV JAVA_OPTS="-XX:+UseContainerSupport \
               -XX:MaxRAMPercentage=75.0 \
               -Djava.security.egd=file:/dev/./urandom \
               -Dspring.profiles.active=prod"

# Entry point using Spring Boot's LayerTools loader
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS org.springframework.boot.loader.launch.JarLauncher"]
