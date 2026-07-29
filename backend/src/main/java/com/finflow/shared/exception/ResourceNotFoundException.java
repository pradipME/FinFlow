package com.finflow.shared.exception;

public class ResourceNotFoundException extends FinFlowException {

    public ResourceNotFoundException(String resourceType, String resourceId) {
        super("RESOURCE_NOT_FOUND",
                String.format("%s with id '%s' not found", resourceType, resourceId),
                404,
                resourceType);
    }

    public ResourceNotFoundException(String message) {
        super("RESOURCE_NOT_FOUND", message, 404);
    }
}
