package ro.pocketrip.dto;

import java.math.BigDecimal;

public record PlanDto(Long id, String name, BigDecimal price, Integer maxUsesPerDay, Integer maxUsesPerMonth
, boolean mapEnabled, boolean pdfExportEnabled, BigDecimal extraPrice)
{
}
