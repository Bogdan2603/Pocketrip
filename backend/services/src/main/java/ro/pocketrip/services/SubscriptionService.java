package ro.pocketrip.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.pocketrip.models.Plan;
import ro.pocketrip.models.Subscription;
import ro.pocketrip.models.User;
import ro.pocketrip.repositories.PlanRepository;
import ro.pocketrip.repositories.SubscriptionRepository;
import ro.pocketrip.repositories.UserRepository;
import ro.pocketrip.services.exceptions.PlanNotFoundException;
import ro.pocketrip.services.exceptions.SubscriptionNotFoundException;
import ro.pocketrip.services.exceptions.UserNotFoundException;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class SubscriptionService
{
    private final UserRepository user;
    private final PlanRepository plan;
    private final SubscriptionRepository sub;

    public SubscriptionService(UserRepository user, PlanRepository plan, SubscriptionRepository sub)
    {
        this.user = user;
        this.plan = plan;
        this.sub = sub;
    }

    public List<Subscription> getAll()
    {
        return sub.findAll();
    }

    public Optional<Subscription> getById(Long id)
    {
        return sub.findById(id);
    }

    public Subscription create(Long userId, Long planId, Subscription s)
    {
        User util = user.findById(userId).orElseThrow(() -> new UserNotFoundException(userId));
        Plan pl = plan.findById(planId).orElseThrow(() -> new PlanNotFoundException(planId));

        s.setUser(util);
        s.setPlan(pl);

        if(s.getStartDate()==null)
            s.setStartDate(LocalDate.now());
        if(s.getStatus()==null)
            s.setStatus("ACTIVE");

        return sub.save(s);
    }

    public void delete(Long id)
    {
        if(!sub.existsById(id))
            throw new SubscriptionNotFoundException(id);
        sub.deleteById(id);
    }

    public Subscription update(Long id, Long userId, Long planId, Subscription nou)
    {
        Subscription existent  = sub.findById(id).orElseThrow( () -> new SubscriptionNotFoundException(id));
        User util = user.findById(userId).orElseThrow(() -> new UserNotFoundException(id));
        Plan pl = plan.findById(planId).orElseThrow(() -> new PlanNotFoundException(id));

        existent.setUser(util);
        existent.setPlan(pl);
        if(nou.getStartDate()!=null)
            existent.setStartDate(nou.getStartDate());
        existent.setEndDate(nou.getEndDate());
        if(nou.getStatus()!=null)
            existent.setStatus(nou.getStatus());

        return sub.save(existent);
    }

    @Transactional
    public Subscription changePlan(Long userId, Long newPlanId)
    {
        User util = user.findById(userId).orElseThrow( () -> new UserNotFoundException(userId));
        Plan pl = plan.findById(newPlanId).orElseThrow( () -> new PlanNotFoundException(newPlanId));

        sub.findByUserIdAndStatus(userId, "ACTIVE")
                .ifPresent(old -> old.setStatus("CANCELLED"));
        sub.flush();

        Subscription newOne = new Subscription();
        newOne.setUser(util);
        newOne.setPlan(pl);
        newOne.setStartDate(LocalDate.now());
        newOne.setStatus("ACTIVE");

        return sub.save(newOne);
    }
}
