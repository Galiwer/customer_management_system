package com.cms.server.dto;

import java.time.LocalDate;
import java.util.List;

public class CustomerResponseDTO {
    private Long id;
    private String name;
    private LocalDate dob;
    private String nic;

    private List<MobileDTO> MobileDTOS;

    private List<AddressDTO> AddressDTOS;

    private List<FamilyMemberDTO> familyMembers;



}
