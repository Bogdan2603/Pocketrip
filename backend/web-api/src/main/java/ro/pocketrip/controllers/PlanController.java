package ro.pocketrip.controllers;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.pocketrip.dto.PlanDto;
import ro.pocketrip.mappers.PlanMapper;
import ro.pocketrip.models.Plan;
import ro.pocketrip.services.PlanService;

import java.util.List;

@RestController
@RequestMapping("/api/plans")
public class PlanController
{
    private final PlanService planService;
    private final PlanMapper mapper;

    public PlanController(PlanService planService, PlanMapper mapper)
    {
        this.planService = planService;
        this.mapper = mapper;
    }

    @GetMapping
    public List<PlanDto> getAll()
    {
        return planService.getAll()
                .stream()
                .map(mapper::toDto)
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlanDto> getById(@PathVariable Long id) {
        return planService.getById(id)
                .map(mapper::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<PlanDto> create(@RequestBody PlanDto dto)
    {
        Plan saved = planService.create(mapper.toEntity(dto));
        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.toDto(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlanDto> update(@PathVariable Long id, @RequestBody PlanDto dto)
    {
        Plan updated = planService.update(id, mapper.toEntity(dto));
        return ResponseEntity.ok(mapper.toDto(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id)
    {
        planService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
