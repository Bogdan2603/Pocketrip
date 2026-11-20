package ro.pocketrip.services;

import java.math.BigDecimal;

public record GenerationResult(GenerationOutcome outcome, BigDecimal price, Long generationId)
{
}
