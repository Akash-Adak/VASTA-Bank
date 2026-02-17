FROM gcr.io/distroless/java17-debian11

WORKDIR /app

COPY target/admin-server-0.0.1-SNAPSHOT.jar admin-server.jar


EXPOSE 8088

CMD ["admin-server.jar"]
