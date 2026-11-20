package ro.pocketrip.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "generations")
@Getter @Setter
public class Generation
{
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private Integer documentsCount;
    private String status;
    @Column(name = "is_extra")
    private boolean extra;
    private String errorReason;
    private Integer processingMs;
    private LocalDateTime createdAt;
}
