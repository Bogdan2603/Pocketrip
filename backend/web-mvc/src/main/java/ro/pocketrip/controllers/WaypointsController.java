package ro.pocketrip.controllers;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.beans.propertyeditors.StringTrimmerEditor;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import ro.pocketrip.models.Waypoint;
import ro.pocketrip.repositories.WaypointRepository;
import ro.pocketrip.viewmodels.WaypointViewModel;

/**
 * Controller MVC: întoarce pagini HTML (spre deosebire de @RestController, care întoarce JSON).
 *
 *   GET  /waypoints             Index:   lista tuturor punctelor
 *   GET  /waypoints/{id}        Details: detaliile unui punct
 *   GET  /waypoints/create      Create:  formularul gol
 *   POST /waypoints/create      Create:  salvarea punctului nou
 *   GET  /waypoints/{id}/edit   Edit:    formularul completat
 *   POST /waypoints/{id}/edit   Edit:    salvarea modificărilor
 */
@Controller
@RequestMapping("/waypoints")
public class WaypointsController {

    private final WaypointRepository repository;

    public WaypointsController(WaypointRepository repository) {
        this.repository = repository;
    }

    /** Câmpurile text lăsate goale ajung null, nu "" (de exemplu codul țării, opțional). */
    @InitBinder
    void initBinder(WebDataBinder binder) {
        binder.registerCustomEditor(String.class, new StringTrimmerEditor(true));
    }

    // ---------------- Index și Details ----------------

    @GetMapping
    public String index(Model model) {
        List<WaypointViewModel> waypoints = repository.findAll(Sort.by("id")).stream()
                .map(WaypointViewModel::fromEntity)
                .toList();
        model.addAttribute("waypoints", waypoints);
        return "waypoints/index";
    }

    @GetMapping("/{id:\\d+}")
    public String details(@PathVariable Long id, Model model) {
        model.addAttribute("waypoint", WaypointViewModel.fromEntity(find(id)));
        return "waypoints/details";
    }

    // ---------------- Create ----------------

    @GetMapping("/create")
    public String createForm(Model model) {
        model.addAttribute("waypoint", new WaypointViewModel());
        return "waypoints/create";
    }

    @PostMapping("/create")
    public String create(@Valid @ModelAttribute("waypoint") WaypointViewModel waypoint,
                         BindingResult errors, RedirectAttributes redirect) {
        if (errors.hasErrors()) {
            return "waypoints/create";
        }
        Waypoint salvat = repository.save(waypoint.toEntity());
        redirect.addFlashAttribute("message", "Punctul „" + salvat.getName() + "” a fost adăugat.");
        return "redirect:/waypoints/" + salvat.getId();
    }

    // ---------------- Edit ----------------

    @GetMapping("/{id:\\d+}/edit")
    public String editForm(@PathVariable Long id, Model model) {
        model.addAttribute("waypoint", WaypointViewModel.fromEntity(find(id)));
        return "waypoints/edit";
    }

    @PostMapping("/{id:\\d+}/edit")
    public String edit(@PathVariable Long id,
                       @Valid @ModelAttribute("waypoint") WaypointViewModel waypoint,
                       BindingResult errors, RedirectAttributes redirect) {
        waypoint.setId(id);
        if (errors.hasErrors()) {
            return "waypoints/edit";
        }
        Waypoint existent = find(id);
        waypoint.applyTo(existent);
        repository.save(existent);
        redirect.addFlashAttribute("message", "Modificările au fost salvate.");
        return "redirect:/waypoints/" + id;
    }

    // ----------------------------------------------

    private Waypoint find(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nu există punctul " + id));
    }
}
