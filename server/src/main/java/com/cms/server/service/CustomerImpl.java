import com.cms.server.dto.AddressDTO;
import com.cms.server.dto.CustomerResponseDTO;
import com.cms.server.dto.FamilyMemberDTO;
import com.cms.server.dto.MobileDTO;
import com.cms.server.entity.Customer;
import com.cms.server.repository.CustomerRepository;
import com.cms.server.service.CustomerService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomerImpl implements CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerServiceImpl(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    public CustomerResponseDTO getCustomerById(Long id) {

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));

        return mapToDTO(customer);
    }

    // simple manual mapper for now (we will later move to Mapper class)
    private CustomerResponseDTO mapToDTO(Customer c) {

        CustomerResponseDTO dto = new CustomerResponseDTO();
        dto.setId(c.getId());
        dto.setName(c.getName());
        dto.setDob(c.getDob());
        dto.setNic(c.getNic());

        // mobiles
        List<MobileDTO> mobiles = c.getMobiles().stream()
                .map(m -> {
                    MobileDTO md = new MobileDTO();
                    md.setId(m.getId());
                    md.setMobile(m.getMobile());
                    return md;
                }).collect(Collectors.toList());

        dto.setMobiles(mobiles);

        // addresses
        List<AddressDTO> addresses = c.getAddresses().stream()
                .map(a -> {
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

                    return ad;
                }).collect(Collectors.toList());

        dto.setAddresses(addresses);

        // family members
        List<FamilyMemberDTO> family = c.getFamilyMembers().stream()
                .map(f -> {
                    FamilyMemberDTO fm = new FamilyMemberDTO();
                    fm.setId(f.getFamilyMember().getId());
                    fm.setName(f.getFamilyMember().getName());
                    fm.setNic(f.getFamilyMember().getNic());
                    return fm;
                }).collect(Collectors.toList());

        dto.setFamilyMembers(family);

        return dto;
    }
}