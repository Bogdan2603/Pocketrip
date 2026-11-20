package ro.pocketrip.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.pocketrip.services.GenerationOutcome;
import ro.pocketrip.services.GenerationResult;
import ro.pocketrip.services.GenerationService;

@RestController
@RequestMapping("/api/users")
public class GenerationController
{
    private final GenerationService service;

    public GenerationController(GenerationService service)
    {
        this.service = service;
    }

    @GetMapping("/{userId}/can-generate")
    public boolean canGenerate(@PathVariable Long userId)
    {
        return service.canGeneratForFree(userId);
    }

    @PostMapping("/{userId}/generations")
    public ResponseEntity<GenerationResult> generate(@PathVariable Long userId,
                                                     @RequestBody GenerationRequest request)
    {
        GenerationResult result = service.requestGeneration(userId, request.documentsCount(),
                request.acceptExtra());
        if(result.outcome() == GenerationOutcome.LIMIT_REACHED)
            return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED).body(result);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }
}
