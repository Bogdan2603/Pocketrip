package ro.pocketrip.services;

import org.springframework.stereotype.Service;
import ro.pocketrip.models.Plan;
import ro.pocketrip.repositories.PlanRepository;
import ro.pocketrip.services.exceptions.PlanNotFoundException;

import java.util.List;
import java.util.Optional;

@Service
public class PlanService
{
    private final PlanRepository planRepository;

    public PlanService(PlanRepository planRepository)
    {
        this.planRepository = planRepository;
    }

    public List<Plan> getAll()
    {
        return planRepository.findAll();
    }

    public Optional<Plan> getById(Long id)
    {
        return planRepository.findById(id);
    }

    public Plan create(Plan plan)
    {
        return planRepository.save(plan);
    }

    public void delete(Long id)
    {
        if(!planRepository.existsById(id))
            throw new PlanNotFoundException(id);
        else
            planRepository.deleteById(id);
    }

    public Plan update(Long id,Plan plan)
    {
        Plan found = planRepository.findById(id)
                .orElseThrow(() -> new PlanNotFoundException(id));

        found.setName(plan.getName());
        found.setPrice(plan.getPrice());
        found.setMaxUsesPerDay(plan.getMaxUsesPerDay());
        found.setMaxUsesPerMonth(plan.getMaxUsesPerMonth());
        found.setMapEnabled(plan.isMapEnabled());
        found.setPdfExportEnabled(plan.isPdfExportEnabled());
        found.setExtraPrice(plan.getExtraPrice());

        return planRepository.save(found);
    }

}
