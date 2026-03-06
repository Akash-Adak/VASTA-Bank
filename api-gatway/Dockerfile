FROM gcr.io/distroless/java17-debian11

WORKDIR /app

COPY target/api-gatway-0.0.1-SNAPSHOT.jar api-gatway.jar

EXPOSE 8080

CMD ["api-gatway.jar"]