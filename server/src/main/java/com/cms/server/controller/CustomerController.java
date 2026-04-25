package com.cms.server.controller;

import com.cms.server.dto.CustomerRequestDTO;
import com.cms.server.dto.CustomerResponseDTO;
import com.cms.server.service.CustomerService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping("/{id}")
    public CustomerResponseDTO getCustomerById(@PathVariable Long id) {
        return customerService.getCustomerById(id);
    }

    @GetMapping
    public List<CustomerResponseDTO> getAllCustomers() {
        return customerService.getAllCustomers();
    }

    @PostMapping
    public CustomerResponseDTO create(@RequestBody CustomerRequestDTO request) {
        return customerService.createCustomer(request);
    }

    @PutMapping("/{id}")
    public CustomerResponseDTO update(@PathVariable Long id, @RequestBody CustomerRequestDTO request) {
        return customerService.updateCustomer(id, request);
    }

    @PostMapping("/upload")
    public void upload(@RequestParam("file") MultipartFile file) throws IOException {
        customerService.uploadCustomers(file);
    }
}
