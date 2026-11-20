package ro.pocketrip.controllers;

import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ro.pocketrip.models.Plan;
import ro.pocketrip.services.exceptions.PlanNotFoundException;
import ro.pocketrip.services.PlanService;
import ro.pocketrip.viewmodels.PlanViewModel;

@Controller
@RequestMapping("/plans")
public class PlansController
{
    private final PlanService service;

    public PlansController(PlanService service)
    {
        this.service = service;
    }

    @GetMapping
    public String index(Model model)
    {
        model.addAttribute("plans",service.getAll());
        return "plans/index";
    }

    @GetMapping("{id}")
    public String details(@PathVariable Long id, Model model)
    {
        return service.getById(id)
                .map( plan -> {
                    model.addAttribute("plan",plan);
                    return "plan/details";
                })
                .orElse("redirect/plans");
    }

    @GetMapping("/create")
    public String createForm(Model model) {
        model.addAttribute("plan", new PlanViewModel());
        return "plans/create";
    }

    @PostMapping("/create")
    public String create(@Valid @ModelAttribute("plan") PlanViewModel vm,
                         BindingResult result) {
        if (result.hasErrors()) {
            return "plans/create";
        }
        service.create(toEntity(vm));
        return "redirect:/plans";
    }

    @GetMapping("/{id}/edit")
    public String editForm(@PathVariable Long id, Model model) {
        return service.getById(id)
                .map(plan -> {
                    model.addAttribute("plan", toViewModel(plan));
                    model.addAttribute("planId", id);
                    return "plans/edit";
                })
                .orElse("redirect:/plans");
    }

    @PostMapping("/{id}/edit")
    public String edit(@PathVariable Long id,
                       @Valid @ModelAttribute("plan") PlanViewModel vm,
                       BindingResult result,
                       Model model) {
        if (result.hasErrors()) {
            model.addAttribute("planId", id);
            return "plans/edit";
        }
        try {
            service.update(id, toEntity(vm));
        } catch (PlanNotFoundException e) {
            return "redirect:/plans";
        }
        return "redirect:/plans";
    }

    @PostMapping("/{id}/delete")
    public String delete(@PathVariable Long id) {
        try {
            service.delete(id);
        } catch (PlanNotFoundException e) {
            // deja șters, mergem mai departe
        }
        return "redirect:/plans";
    }

    private Plan toEntity(PlanViewModel vm) {
        Plan p = new Plan();
        p.setName(vm.getName());
        p.setPrice(vm.getPrice());
        p.setMaxUsesPerDay(vm.getMaxUsesPerDay());
        p.setMaxUsesPerMonth(vm.getMaxUsesPerMonth());
        p.setMapEnabled(vm.isMapEnabled());
        p.setPdfExportEnabled(vm.isPdfExportEnabled());
        p.setExtraPrice(vm.getExtraPrice());
        return p;
    }

    private PlanViewModel toViewModel(Plan p) {
        PlanViewModel vm = new PlanViewModel();
        vm.setName(p.getName());
        vm.setPrice(p.getPrice());
        vm.setMaxUsesPerDay(p.getMaxUsesPerDay());
        vm.setMaxUsesPerMonth(p.getMaxUsesPerMonth());
        vm.setMapEnabled(p.isMapEnabled());
        vm.setPdfExportEnabled(p.isPdfExportEnabled());
        vm.setExtraPrice(p.getExtraPrice());
        return vm;
    }
}
