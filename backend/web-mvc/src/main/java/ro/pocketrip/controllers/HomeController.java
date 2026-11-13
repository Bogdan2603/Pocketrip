package ro.pocketrip.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/** Pagina de start trimite direct la lista de puncte. */
@Controller
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "redirect:/waypoints";
    }
}
