package com.cms.server.service;

import com.cms.server.dto.CustomerRequestDTO;
import com.cms.server.dto.CustomerResponseDTO;
import java.util.List;

public interface CustomerService {
    CustomerResponseDTO getCustomerById(Long id);
    List<CustomerResponseDTO> getAllCustomers();
    CustomerResponseDTO createCustomer(CustomerRequestDTO request);
    CustomerResponseDTO updateCustomer(Long id, CustomerRequestDTO request);
}
