FROM gcr.io/distroless/java17-debian11

WORKDIR /app

COPY target/payment-gatway-server-0.0.1-SNAPSHOT.jar payment-gatway-server.jar


EXPOSE 8089

CMD ["payment-gatway-server.jar"]
