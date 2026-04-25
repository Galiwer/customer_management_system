package com.cms.server.service;

import com.cms.server.dto.CustomerRequestDTO;
import com.cms.server.dto.CustomerResponseDTO;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

public interface CustomerService {
    CustomerResponseDTO getCustomerById(Long id);
    List<CustomerResponseDTO> getAllCustomers();
    CustomerResponseDTO createCustomer(CustomerRequestDTO request);
    CustomerResponseDTO updateCustomer(Long id, CustomerRequestDTO request);
    void uploadCustomers(MultipartFile file) throws IOException;
}
