package com.cms.server.dto;

import java.time.LocalDate;
import java.util.List;

public class CustomerRequestDTO {
    @javax.validation.constraints.NotBlank(message = "Name is mandatory")
    private String name;
    @javax.validation.constraints.NotNull(message = "Date of birth is mandatory")
    private LocalDate dob;
    @javax.validation.constraints.NotBlank(message = "NIC is mandatory")
    private String nic;
    private List<String> mobiles;
    private List<AddressDTO> addresses;
    private List<Long> familyMemberIds;

    public CustomerRequestDTO() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getDob() {
        return dob;
    }

    public void setDob(LocalDate dob) {
        this.dob = dob;
    }

    public String getNic() {
        return nic;
    }

    public void setNic(String nic) {
        this.nic = nic;
    }

    public List<String> getMobiles() {
        return mobiles;
    }

    public void setMobiles(List<String> mobiles) {
        this.mobiles = mobiles;
    }

    public List<AddressDTO> getAddresses() {
        return addresses;
    }

    public void setAddresses(List<AddressDTO> addresses) {
        this.addresses = addresses;
    }

    public List<Long> getFamilyMemberIds() {
        return familyMemberIds;
    }

    public void setFamilyMemberIds(List<Long> familyMemberIds) {
        this.familyMemberIds = familyMemberIds;
    }
}
