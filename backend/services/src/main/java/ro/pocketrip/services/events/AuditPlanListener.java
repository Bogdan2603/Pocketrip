package ro.pocketrip.services.events;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
public class AuditPlanListener
{
    private static final Logger log = LoggerFactory.getLogger(AuditPlanListener.class);

    @TransactionalEventListener
    public void onPlanChanged(PlanChangedEvent e)
    {
        log.info("[AUDIT] User {} a trecut de pe planul {} pe planul {}",
                e.userId(), e.oldPlanId(), e.newPlanId());
    }
}