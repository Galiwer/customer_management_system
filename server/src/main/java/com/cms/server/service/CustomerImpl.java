package com.cms.server.service;

import com.cms.server.dto.*;
import com.cms.server.entity.*;
import com.cms.server.repository.CityRepository;
import com.cms.server.repository.CountryRepository;
import com.cms.server.repository.CustomerRepository;
import com.monitorjbl.xlsx.StreamingReader;
import org.apache.poi.ss.usermodel.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.util.*;

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
    public void deleteCustomer(Long id) {
        if (!customerRepository.existsById(id)) {
            throw new RuntimeException("Customer not found!");
        }
        customerRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void uploadCustomers(MultipartFile file) throws IOException {
        String filename = file.getOriginalFilename();
        if (filename == null) return;

        Map<String, City> cityCache = new HashMap<>();
        Map<String, Country> countryCache = new HashMap<>();
        cityRepository.findAll().forEach(c -> cityCache.put(c.getName(), c));
        countryRepository.findAll().forEach(c -> countryCache.put(c.getName(), c));

        if (filename.toLowerCase().endsWith(".csv")) {
            processCsv(file, cityCache, countryCache);
        } else {
            processExcel(file, cityCache, countryCache);
        }
    }

    private void processCsv(MultipartFile file, Map<String, City> cityCache, Map<String, Country> countryCache) throws IOException {
        try (BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line;
            List<Customer> batch = new ArrayList<>();
            int count = 0;
            boolean isFirstLine = true;

            while ((line = br.readLine()) != null) {
                if (isFirstLine) {
                    isFirstLine = false;
                    continue; // Skip header
                }

                String[] cols = line.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)", -1);
                if (cols.length < 3) continue;

                String name = cols.length > 0 ? cols[0].replace("\"", "").trim() : null;
                String dobStr = cols.length > 1 ? cols[1].replace("\"", "").trim() : null;
                String nic = cols.length > 2 ? cols[2].replace("\"", "").trim() : null;
                String mobilesStr = cols.length > 3 ? cols[3].replace("\"", "").trim() : null;
                String line1 = cols.length > 4 ? cols[4].replace("\"", "").trim() : null;
                String cityStr = cols.length > 5 ? cols[5].replace("\"", "").trim() : null;
                String countryStr = cols.length > 6 ? cols[6].replace("\"", "").trim() : null;

                if (nic == null || nic.isEmpty()) continue;

                Customer customer = processRowData(nic, name, dobStr, mobilesStr, line1, cityStr, countryStr, cityCache, countryCache);
                batch.add(customer);

                if (++count % 500 == 0) {
                    customerRepository.saveAll(batch);
                    customerRepository.flush();
                    batch.clear();
                }
            }
            if (!batch.isEmpty()) {
                customerRepository.saveAll(batch);
            }
        }
    }

    private void processExcel(MultipartFile file, Map<String, City> cityCache, Map<String, Country> countryCache) throws IOException {
        try (InputStream is = file.getInputStream(); 
             Workbook workbook = StreamingReader.builder()
                .rowCacheSize(100)
                .bufferSize(4096)
                .open(is)) {
            
            Sheet sheet = workbook.getSheetAt(0);
            List<Customer> batch = new ArrayList<>();
            int count = 0;

            for (Row row : sheet) {
                if (row.getRowNum() == 0) continue; // Skip header

                String name = getCellValue(row, 0);
                String dobStr = getCellValue(row, 1);
                String nic = getCellValue(row, 2);
                String mobilesStr = getCellValue(row, 3);
                String line1 = getCellValue(row, 4);
                String cityStr = getCellValue(row, 5);
                String countryStr = getCellValue(row, 6);

                if (nic == null || nic.isEmpty()) continue;

                Customer customer = processRowData(nic, name, dobStr, mobilesStr, line1, cityStr, countryStr, cityCache, countryCache);
                batch.add(customer);

                if (++count % 500 == 0) {
                    customerRepository.saveAll(batch);
                    customerRepository.flush();
                    batch.clear();
                }
            }
            if (!batch.isEmpty()) {
                customerRepository.saveAll(batch);
            }
        }
    }

    private Customer processRowData(String nic, String name, String dobStr, String mobilesStr, String line1, String cityStr, String countryStr, Map<String, City> cityCache, Map<String, Country> countryCache) {
        Customer customer = customerRepository.findByNic(nic).orElse(new Customer());
        
        customer.getMobiles().clear();
        customer.getAddresses().clear();

        customer.setName(name);
        customer.setNic(nic);
        
        if (dobStr != null && !dobStr.isEmpty()) {
            try {
                customer.setDob(LocalDate.parse(dobStr));
            } catch (Exception e) {
                // Ignore invalid date
            }
        }

        if (mobilesStr != null && !mobilesStr.isEmpty()) {
            for (String mNum : mobilesStr.split(",")) {
                Mobile m = new Mobile();
                m.setMobile(mNum.trim());
                m.setCustomer(customer);
                customer.getMobiles().add(m);
            }
        }

        if (line1 != null && !line1.isEmpty()) {
            Address addr = new Address();
            addr.setLine1(line1);
            addr.setCustomer(customer);

            if (cityStr != null && !cityStr.isEmpty()) {
                City city = cityCache.computeIfAbsent(cityStr, k -> {
                    City c = new City();
                    c.setName(k);
                    return cityRepository.save(c);
                });
                addr.setCity(city);
            }

            if (countryStr != null && !countryStr.isEmpty()) {
                Country country = countryCache.computeIfAbsent(countryStr, k -> {
                    Country c = new Country();
                    c.setName(k);
                    return countryRepository.save(c);
                });
                addr.setCountry(country);
            }
            customer.getAddresses().add(addr);
        }
        return customer;
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
                } else if (ad.getCityName() != null && !ad.getCityName().trim().isEmpty()) {
                    String cName = ad.getCityName().trim();
                    City city = cityRepository.findByName(cName).orElseGet(() -> {
                        City newCity = new City();
                        newCity.setName(cName);
                        return cityRepository.save(newCity);
                    });
                    a.setCity(city);
                }

                if (ad.getCountryId() != null) {
                    countryRepository.findById(ad.getCountryId()).ifPresent(a::setCountry);
                } else if (ad.getCountryName() != null && !ad.getCountryName().trim().isEmpty()) {
                    String cName = ad.getCountryName().trim();
                    Country country = countryRepository.findByName(cName).orElseGet(() -> {
                        Country newCountry = new Country();
                        newCountry.setName(cName);
                        return countryRepository.save(newCountry);
                    });
                    a.setCountry(country);
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