package ro.pocketrip.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.pocketrip.models.Generation;
import ro.pocketrip.models.Plan;
import ro.pocketrip.models.User;
import ro.pocketrip.repositories.GenerationRepository;
import ro.pocketrip.repositories.SubscriptionRepository;
import ro.pocketrip.repositories.UserRepository;
import ro.pocketrip.services.exceptions.NoActiveSubscriptionException;
import ro.pocketrip.services.exceptions.UserNotFoundException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class GenerationService
{
    private final GenerationRepository generations;
    private final SubscriptionRepository subscriptions;
    private final UserRepository users;

    public GenerationService(GenerationRepository generations, SubscriptionRepository subscriptions, UserRepository users)
    {
        this.generations = generations;
        this.subscriptions = subscriptions;
        this.users = users;
    }

    private boolean withinLimit(Integer limit, long used)
    {
        return limit == null || used < limit;
    }

    private Plan planOf(Long userId) {
        return subscriptions.findByUserIdAndStatus(userId, "ACTIVE")
                .orElseThrow(() -> new NoActiveSubscriptionException(userId))
                .getPlan();
    }

    public boolean canGeneratForFree(Long userId)
    {
        Plan plan = subscriptions.findByUserIdAndStatus(userId, "ACTIVE")
                .orElseThrow( () -> new NoActiveSubscriptionException(userId))
                .getPlan();

        LocalDateTime startZi = LocalDate.now().atStartOfDay();
        LocalDateTime acum = LocalDateTime.now();
        LocalDateTime startLuna = LocalDate.now().withDayOfMonth(1).atStartOfDay();

        long azi = generations.countByUserIdAndStatusAndExtraFalseAndCreatedAtBetween(userId, "SUCCESS", startZi, acum);
        long luna = generations.countByUserIdAndStatusAndExtraFalseAndCreatedAtBetween(userId, "SUCCESS", startLuna, acum);

        return withinLimit(plan.getMaxUsesPerDay(), azi) &&
                withinLimit(plan.getMaxUsesPerMonth(), luna);
    }


    @Transactional
    public GenerationResult requestGeneration(Long userId, int documentsCount, boolean acceptExtra)
    {
        User user = users.findById(userId).orElseThrow( () -> new UserNotFoundException(userId));
        Plan plan = planOf(userId);

        if( canGeneratForFree(userId))
        {
            Generation g = save(user, documentsCount, false);
            return new GenerationResult(GenerationOutcome.FREE, BigDecimal.ZERO, g.getId());
        }

        if(acceptExtra)
        {
            Generation g = save(user, documentsCount, true);
            return new GenerationResult(GenerationOutcome.EXTRA, plan.getExtraPrice(), g.getId());
        }

        return new GenerationResult(GenerationOutcome.LIMIT_REACHED, plan.getExtraPrice(), null);
    }


    private Generation save(User user, int documentCount, boolean extra)
    {
        Generation g = new Generation();
        g.setUser(user);
        g.setDocumentsCount(documentCount);
        g.setStatus("SUCCESS");
        g.setExtra(extra);
        g.setCreatedAt(LocalDateTime.now());
        return generations.save(g);
    }
}
