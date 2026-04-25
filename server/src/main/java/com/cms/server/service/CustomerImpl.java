package com.cms.server.service;

import com.cms.server.dto.*;
import com.cms.server.entity.*;
import com.cms.server.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CustomerImpl implements CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerImpl(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    public CustomerResponseDTO getCustomerById(Long id) {

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));

        return mapToDTO(customer);
    }

    @Override
    public List<CustomerResponseDTO> getAllCustomers() {

        List<Customer> allCustomers = customerRepository.findAll();

        List<CustomerResponseDTO> resultList = new ArrayList<>();

        for (Customer c : allCustomers) {
            CustomerResponseDTO dto = mapToDTO(c);
            resultList.add(dto);
        }

        return resultList;
    }

    private CustomerResponseDTO mapToDTO(Customer c) {
        CustomerResponseDTO dto = new CustomerResponseDTO();
        dto.setId(c.getId());
        dto.setName(c.getName());
        dto.setDob(c.getDob());
        dto.setNic(c.getNic());

        List<MobileDTO> mobiles = new ArrayList<>();
        if (c.getMobiles() != null) {
            for (Mobile m : c.getMobiles()) {
                mobiles.add(new MobileDTO(m.getId(), m.getMobile()));
            }
        }
        dto.setMobiles(mobiles);

        List<AddressDTO> addresses = new ArrayList<>();
        if (c.getAddresses() != null) {
            for (Address a : c.getAddresses()) {
                AddressDTO ad = new AddressDTO();
                ad.setId(a.getId());
                ad.setLine1(a.getLine1());
                ad.setLine2(a.getLine2());

                if (a.getCity() != null) {
                    ad.setCityId(a.getCity().getId());
                    ad.setCityName(a.getCity().getName());
                }

                if (a.getCountry() != null) {
                    ad.setCountryId(a.getCountry().getId());
                    ad.setCountryName(a.getCountry().getName());
                }
                addresses.add(ad);
            }
        }
        dto.setAddresses(addresses);

        List<FamilyMemberDTO> family = new ArrayList<>();
        if (c.getFamilyMembers() != null) {
            for (FamilyRelation f : c.getFamilyMembers()) {
                Customer relative = f.getFamilyMember();
                if (relative != null) {
                    FamilyMemberDTO fm = new FamilyMemberDTO();
                    fm.setId(relative.getId());
                    fm.setName(relative.getName());
                    fm.setNic(relative.getNic());
                    family.add(fm);
                }
            }
        }
        dto.setFamilyMembers(family);

        return dto;
    }
}