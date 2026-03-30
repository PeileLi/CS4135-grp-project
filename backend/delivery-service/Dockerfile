# syntax=docker/dockerfile:1
FROM maven:3-eclipse-temurin-21 AS build
WORKDIR /app

COPY pom.xml .
COPY common/pom.xml common/
COPY eureka-server/pom.xml eureka-server/
COPY api-gateway/pom.xml api-gateway/
COPY user-service/pom.xml user-service/
COPY restaurant-service/pom.xml restaurant-service/
COPY order-service/pom.xml order-service/
COPY payment-service/pom.xml payment-service/
COPY delivery-service/pom.xml delivery-service/
COPY notification-service/pom.xml notification-service/

RUN --mount=type=cache,target=/root/.m2 \
    mvn dependency:go-offline -pl delivery-service -am -q -B

COPY common/src common/src
COPY delivery-service/src delivery-service/src

RUN --mount=type=cache,target=/root/.m2 \
    mvn package -pl delivery-service -am -DskipTests -q -B

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/delivery-service/target/*.jar app.jar
EXPOSE 8085
ENTRYPOINT ["java", "-jar", "app.jar"]
