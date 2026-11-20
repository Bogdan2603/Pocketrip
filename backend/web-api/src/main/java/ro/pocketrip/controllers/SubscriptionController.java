package ro.pocketrip.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.pocketrip.dto.SubscriptionDto;
import ro.pocketrip.mappers.SubscriptionMapper;
import ro.pocketrip.models.Subscription;
import ro.pocketrip.services.SubscriptionService;

import java.util.List;

@RestController
@RequestMapping("api/subscriptions")
public class SubscriptionController
{
    private final SubscriptionService service;
    private final SubscriptionMapper mapper;

    public SubscriptionController(SubscriptionService service, SubscriptionMapper mapper)
    {
        this.service = service;
        this.mapper = mapper;
    }

    @GetMapping
    public List<SubscriptionDto> getAll()
    {
        return service.getAll().stream().map(mapper::toDto).toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubscriptionDto> getById(@PathVariable Long id)
    {
        return service.getById(id)
                .map(mapper::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<SubscriptionDto> create(@RequestBody SubscriptionDto dto)
    {
        Subscription saved = service.create(dto.userId(), dto.planId(), mapper.toEntity(dto));
        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.toDto(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SubscriptionDto> update(@PathVariable Long id,@RequestBody SubscriptionDto dto)
    {
        Subscription updated = service.update(id, dto.userId(), dto.planId(), mapper.toEntity(dto));
        return ResponseEntity.ok(mapper.toDto(updated));

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id)
    {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
