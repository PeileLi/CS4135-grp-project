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

RUN --mount=type=cache,target=/root/.m2 mvn dependency:go-offline -pl delivery-service -am -q || true

COPY common/ common/
COPY delivery-service/ delivery-service/
RUN --mount=type=cache,target=/root/.m2 mvn package -pl delivery-service -am -DskipTests -q

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/delivery-service/target/*.jar app.jar
EXPOSE 8085
ENTRYPOINT ["java", "-jar", "app.jar"]
