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
  Access request for fetch actuator prometheus endpoint on `SecurityConfig.java`
  ```java
  .requestMatchers("/actuator/health", "/actuator/prometheus").permitAll()
  ```
## Prometheus.yml
  Promethus image for setting scrape interval and path to send data request from target.
  ```yml
    global:
      scrape_interval: 15s     # ดึงข้อมูลทุก 15 วินาที
      evaluation_interval: 15s

    scrape_configs:
      - job_name: 'lafam-backend'
        metrics_path: '/actuator/prometheus'
        scrape_interval: 5s     # ปรับเป็น 5s ได้เมื่อรัน Load Test เพื่อดูผลแบบเรียลไทม์
        static_configs:
          - targets: ['backend:8080'] # หรือ 127.0.0.1:8080
  ```
  
