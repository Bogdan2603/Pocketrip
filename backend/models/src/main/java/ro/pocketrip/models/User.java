package ro.pocketrip.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter @Setter
public class User
{
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;
        private String email;
        private String passwordHash;
        private String role;
        private LocalDateTime emailVerifiedAt;
        private LocalDateTime createdAt;
        private String displayName;
        private String preferredLanguage;
}
