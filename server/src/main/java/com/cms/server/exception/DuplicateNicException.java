package com.cms.server.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class DuplicateNicException extends RuntimeException {
    public DuplicateNicException(String nic) {
        super("A customer with NIC '" + nic + "' already exists.");
    }
}
