package ro.pocketrip.services.events;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
public class EmailPlanListener {
    private static final Logger log = LoggerFactory.getLogger(EmailPlanListener.class);

    @TransactionalEventListener
    public void onPlanChanged(PlanChangedEvent e) {
        log.info("[EMAIL] Trimis confirmare catre user {}: planul tau este acum {}",
                e.userId(), e.newPlanId());
    }
}