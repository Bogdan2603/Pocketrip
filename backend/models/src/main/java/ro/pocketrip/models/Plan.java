package ro.pocketrip.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name ="plans")
@Getter @Setter
public class Plan
{
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private BigDecimal price;
    private Integer maxUsesPerDay;
    private Integer maxUsesPerMonth;
    private boolean mapEnabled;
    private boolean pdfExportEnabled;
    private BigDecimal extraPrice;
}
