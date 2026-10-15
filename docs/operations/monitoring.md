# Monitoring 
  La FAM monitoring Performance Metrics through Prometheus for data collection system
  and Grafana for connect prometheus to show dashboard. 
## Prepare Spring Boot Setup
  ### Dependencies for use Micrometer
  ```xml
  <!-- Spring Boot Actuator -->
  <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-actuator</artifactId>
  </dependency>
  <!-- Prometheus Meter Registry -->
  <dependency>
      <groupId>io.micrometer</groupId>
      <artifactId>micrometer-registry-prometheus</artifactId>
  </dependency>
  ```
## Permission Prometheus
  access request for fetch actuator prometheus endpoint on `SecurityConfig.java`
  ```java
  .requestMatchers("/actuator/health", "/actuator/prometheus").permitAll()
  ```
  
