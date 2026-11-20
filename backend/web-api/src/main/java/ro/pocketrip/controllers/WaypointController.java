package ro.pocketrip.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.pocketrip.dto.WaypointDto;
import ro.pocketrip.mappers.WaypointMapper;
import ro.pocketrip.models.Waypoint;
import ro.pocketrip.repositories.WaypointRepository;

import java.util.List;

@RestController
@RequestMapping("/api/waypoints")
public class WaypointController
{
    private final WaypointRepository waypointRepository;
    private final WaypointMapper mapper;

    public WaypointController(WaypointRepository waypointRepository, WaypointMapper mapper)
    {
        this.waypointRepository = waypointRepository;
        this.mapper = mapper;
    }

    @GetMapping
    public List<WaypointDto> getAll()
    {
        return waypointRepository.findAll()
                .stream()
                .map(mapper::toDto)
                .toList();
    }

    @PostMapping
    public WaypointDto create(@RequestBody WaypointDto dto)
    {
        Waypoint saved = waypointRepository.save(mapper.toEntity(dto));
        return mapper.toDto(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<WaypointDto> getById(@PathVariable Long id)
    {
        return waypointRepository.findById(id)
                .map(mapper::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("{id}")
    public ResponseEntity <WaypointDto> update (@PathVariable Long id, @RequestBody Waypoint dto)
    {
        return waypointRepository.findById(id)
                .map( point ->
                {
                    point.setName(dto.getName());
                    point.setCity(dto.getCity());
                    point.setCountryCode(dto.getCountryCode());
                    return ResponseEntity.ok(mapper.toDto(waypointRepository.save(point)));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("{id}")
    public ResponseEntity <Void> delete(@PathVariable Long id)
    {
        if(!waypointRepository.existsById(id))
            return ResponseEntity.notFound().build();
        else
        {
            waypointRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
    }
}
