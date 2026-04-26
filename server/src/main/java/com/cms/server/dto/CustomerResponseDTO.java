package com.cms.server.dto;

import java.time.LocalDate;
import java.util.List;

public class CustomerResponseDTO {
    private Long id;
    private String name;
    private LocalDate dob;
    private String nic;
    private List<MobileDTO> mobiles;
    private List<AddressDTO> addresses;
    private List<FamilyMemberDTO> familyMembers;

    public CustomerResponseDTO() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public List<MobileDTO> getMobiles() {
        return mobiles;
    }

    public void setMobiles(List<MobileDTO> mobiles) {
        this.mobiles = mobiles;
    }

    public List<AddressDTO> getAddresses() {
        return addresses;
    }

    public void setAddresses(List<AddressDTO> addresses) {
        this.addresses = addresses;
    }

    public List<FamilyMemberDTO> getFamilyMembers() {
        return familyMembers;
    }

    public void setFamilyMembers(List<FamilyMemberDTO> familyMembers) {
        this.familyMembers = familyMembers;
    }
}
