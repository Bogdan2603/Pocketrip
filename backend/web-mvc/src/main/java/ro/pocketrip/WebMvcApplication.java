package ro.pocketrip;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Aplicația MVC (pagini HTML). Pornește la http://localhost:8081.
 * E în pachetul rădăcină ro.pocketrip, deci găsește singură entitățile din models
 * și repository-urile din repositories (sunt subpachete ale lui).
 */
@SpringBootApplication
public class WebMvcApplication {

    public static void main(String[] args) {
        SpringApplication.run(WebMvcApplication.class, args);
    }
}
