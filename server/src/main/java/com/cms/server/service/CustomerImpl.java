package com.cms.server.service;

import com.cms.server.dto.*;
import com.cms.server.entity.*;
import com.cms.server.repository.CityRepository;
import com.cms.server.repository.CountryRepository;
import com.cms.server.repository.CustomerRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Service
public class CustomerImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final CityRepository cityRepository;
    private final CountryRepository countryRepository;

    public CustomerImpl(CustomerRepository customerRepository, 
                        CityRepository cityRepository, 
                        CountryRepository countryRepository) {
        this.customerRepository = customerRepository;
        this.cityRepository = cityRepository;
        this.countryRepository = countryRepository;
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
            resultList.add(mapToDTO(c));
        }
        return resultList;
    }

    @Override
    @Transactional
    public CustomerResponseDTO createCustomer(CustomerRequestDTO request) {
        Customer customer = new Customer();
        mapRequestToEntity(request, customer);
        Customer savedCustomer = customerRepository.save(customer);
        return mapToDTO(savedCustomer);
    }

    @Override
    @Transactional
    public CustomerResponseDTO updateCustomer(Long id, CustomerRequestDTO request) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found!"));
        
        customer.getMobiles().clear();
        customer.getAddresses().clear();
        customer.getFamilyMembers().clear();

        mapRequestToEntity(request, customer);
        Customer savedCustomer = customerRepository.save(customer);
        return mapToDTO(savedCustomer);
    }

    @Override
    @Transactional
    public void uploadCustomers(MultipartFile file) throws IOException {
        try (InputStream is = file.getInputStream(); Workbook workbook = new XSSFWorkbook(is)) {
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rows = sheet.iterator();

            // Skip Header row
            if (rows.hasNext()) {
                rows.next();
            }

            while (rows.hasNext()) {
                Row row = rows.next();
                
                // Read columns
                String name = getCellValue(row, 0);
                String dobStr = getCellValue(row, 1); // Expected as String or Date
                String nic = getCellValue(row, 2);
                String mobilesStr = getCellValue(row, 3);
                String line1 = getCellValue(row, 4);
                String cityStr = getCellValue(row, 5);
                String countryStr = getCellValue(row, 6);

                if (nic == null || nic.isEmpty()) continue;

                // Check if customer exists
                Customer customer = customerRepository.findByNic(nic)
                        .orElse(new Customer());
                
                customer.getMobiles().clear();
                customer.getAddresses().clear();

                customer.setName(name);
                customer.setNic(nic);
                
                // Handle Date
                if (dobStr != null && !dobStr.isEmpty()) {
                    customer.setDob(LocalDate.parse(dobStr));
                }

                // Handle Mobiles
                if (mobilesStr != null) {
                    for (String mNum : mobilesStr.split(",")) {
                        Mobile m = new Mobile();
                        m.setMobile(mNum.trim());
                        m.setCustomer(customer);
                        customer.getMobiles().add(m);
                    }
                }

                // Handle Address
                Address addr = new Address();
                addr.setLine1(line1);
                addr.setCustomer(customer);

                if (cityStr != null) {
                    City city = cityRepository.findByName(cityStr)
                            .orElseGet(() -> {
                                City c = new City();
                                c.setName(cityStr);
                                return cityRepository.save(c);
                            });
                    addr.setCity(city);
                }

                if (countryStr != null) {
                    Country country = countryRepository.findByName(countryStr)
                            .orElseGet(() -> {
                                Country c = new Country();
                                c.setName(countryStr);
                                return countryRepository.save(c);
                            });
                    addr.setCountry(country);
                }
                customer.getAddresses().add(addr);

                customerRepository.save(customer);
            }
        }
    }

    private String getCellValue(Row row, int cellIndex) {
        Cell cell = row.getCell(cellIndex);
        if (cell == null) return null;
        switch (cell.getCellType()) {
            case STRING: return cell.getStringCellValue();
            case NUMERIC: return String.valueOf((long)cell.getNumericCellValue());
            default: return null;
        }
    }

    private void mapRequestToEntity(CustomerRequestDTO request, Customer customer) {
        customer.setName(request.getName());
        customer.setDob(request.getDob());
        customer.setNic(request.getNic());

        if (request.getMobiles() != null) {
            for (String mobileNum : request.getMobiles()) {
                Mobile m = new Mobile();
                m.setMobile(mobileNum);
                m.setCustomer(customer);
                customer.getMobiles().add(m);
            }
        }

        if (request.getAddresses() != null) {
            for (AddressDTO ad : request.getAddresses()) {
                Address a = new Address();
                a.setLine1(ad.getLine1());
                a.setLine2(ad.getLine2());

                if (ad.getCityId() != null) {
                    cityRepository.findById(ad.getCityId()).ifPresent(a::setCity);
                }
                if (ad.getCountryId() != null) {
                    countryRepository.findById(ad.getCountryId()).ifPresent(a::setCountry);
                }

                a.setCustomer(customer);
                customer.getAddresses().add(a);
            }
        }

        if (request.getFamilyMemberIds() != null) {
            for (Long fid : request.getFamilyMemberIds()) {
                customerRepository.findById(fid).ifPresent(relative -> {
                    FamilyRelation fr = new FamilyRelation();
                    fr.setCustomer(customer);
                    fr.setFamilyMember(relative);
                    customer.getFamilyMembers().add(fr);
                });
            }
        }
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