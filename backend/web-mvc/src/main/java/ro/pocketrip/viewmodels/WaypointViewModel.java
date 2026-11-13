package ro.pocketrip.viewmodels;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import ro.pocketrip.models.Waypoint;

/**
 * Modelul folosit de pagini: exact câmpurile din formular, cu regulile de validare.
 * Entitatea Waypoint nu ajunge direct în pagini.
 */
public class WaypointViewModel {

    private Long id;

    @NotBlank(message = "Numele e obligatoriu")
    @Size(max = 255, message = "Numele are cel mult 255 de caractere")
    private String name;

    @Size(max = 100, message = "Orașul are cel mult 100 de caractere")
    private String city;

    @Pattern(regexp = "^[A-Za-z]{2}$", message = "Codul țării are exact 2 litere, de exemplu IT")
    private String countryCode;

    /** Entitate -> model pentru pagină. */
    public static WaypointViewModel fromEntity(Waypoint w) {
        WaypointViewModel vm = new WaypointViewModel();
        vm.id = w.getId();
        vm.name = w.getName();
        vm.city = w.getCity();
        vm.countryCode = w.getCountryCode();
        return vm;
    }

    /** Model din formular -> entitate nouă (pentru Create). */
    public Waypoint toEntity() {
        Waypoint w = new Waypoint();
        applyTo(w);
        return w;
    }

    /** Copiază câmpurile formularului peste o entitate existentă (pentru Edit). */
    public void applyTo(Waypoint w) {
        w.setName(name);
        w.setCity(city);
        w.setCountryCode(countryCode == null ? null : countryCode.toUpperCase());
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getCountryCode() { return countryCode; }
    public void setCountryCode(String countryCode) { this.countryCode = countryCode; }
}
