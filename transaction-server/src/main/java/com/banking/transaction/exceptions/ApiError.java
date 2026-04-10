package com.banking.transaction.exceptions;

public class ApiError {
    private final String timestamp;
    private final int status;
    private final String message;
    private final Object details;

    public ApiError(String timestamp, int status, String message, Object details) {
        this.timestamp = timestamp;
        this.status = status;
        this.message = message;
        this.details = details;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public int getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }

    public Object getDetails() {
        return details;
    }
}
