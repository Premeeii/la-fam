# Stage 1: Builder stage to compile the application
FROM maven:3.9.6-eclipse-temurin-21 AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the pom.xml file
COPY pom.xml .

# Download all the dependencies
RUN mvn dependency:go-offline -B

# Copy the rest of the source code
COPY src ./src

# Package the application without tests
RUN mvn clean package -DskipTests -B

# Stage 2: Production stage to run the application
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Create the application user and switch to it
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Copy the packaged jar file from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose the port the application runs on
EXPOSE 8080

# Set the entry point to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
