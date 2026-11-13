package ro.pocketrip.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "waypoints")
@Getter
@Setter
public class Waypoint
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String name;
    private String city;
    private String countryCode;

}
