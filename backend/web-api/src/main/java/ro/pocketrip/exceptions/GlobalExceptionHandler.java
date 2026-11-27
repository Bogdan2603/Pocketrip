package ro.pocketrip.exceptions;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import ro.pocketrip.services.exceptions.NoActiveSubscriptionException;
import ro.pocketrip.services.exceptions.PlanNotFoundException;
import ro.pocketrip.services.exceptions.SubscriptionNotFoundException;
import ro.pocketrip.services.exceptions.UserNotFoundException;

@RestControllerAdvice
public class GlobalExceptionHandler
{
    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler({PlanNotFoundException.class,
            UserNotFoundException.class,
        SubscriptionNotFoundException.class,
            NoActiveSubscriptionException.class})
    public ResponseEntity<String> handleNotFound(RuntimeException ex)
    {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<String> handleConflict(DataIntegrityViolationException ex) {
        log.warn("Conflict: {}", ex.getMostSpecificCause().getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body("Operația încalcă o regulă a bazei de date (duplicat sau legătură existentă).");
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleOther(Exception ex) {
        log.error("Eroare neasteptata", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("A aparut o eroare pe server.");
    }
}
