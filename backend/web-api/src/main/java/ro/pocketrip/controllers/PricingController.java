package ro.pocketrip.controllers;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ro.pocketrip.dto.PlanDto;
import ro.pocketrip.mappers.PlanMapper;
import ro.pocketrip.services.PlanService;

import java.util.List;

@RestController
@RequestMapping("/api/pricing")
public class PricingController
{
    private final PlanService service;
    private final PlanMapper mapper;

    public PricingController(PlanService service, PlanMapper mapper)
    {
        this.service = service;
        this.mapper = mapper;
    }

    @GetMapping
    @Cacheable("plans")
    public List<PlanDto> getAllPlans()
    {
        return service.getAll().stream().map(mapper::toDto).toList();
    }
}
