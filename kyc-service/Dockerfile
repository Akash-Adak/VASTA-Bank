FROM gcr.io/distroless/java17-debian11

WORKDIR /app

COPY target/kyc-service-0.0.1-SNAPSHOT.jar kyc-service.jar


EXPOSE 8087

CMD ["kyc-service.jar"]
