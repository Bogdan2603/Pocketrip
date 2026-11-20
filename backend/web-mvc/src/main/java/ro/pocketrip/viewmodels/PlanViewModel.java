package ro.pocketrip.viewmodels;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter @Setter
public class PlanViewModel {

    @NotBlank(message = "Numele este obligatoriu")
    @Size(max = 50)
    private String name;

    @NotNull
    @PositiveOrZero
    private BigDecimal price;

    @Positive
    private Integer maxUsesPerDay;

    @Positive
    private Integer maxUsesPerMonth;

    private boolean mapEnabled;
    private boolean pdfExportEnabled;

    @NotNull @PositiveOrZero
    private BigDecimal extraPrice;
}