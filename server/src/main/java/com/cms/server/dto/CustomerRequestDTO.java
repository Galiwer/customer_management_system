package com.cms.server.dto;

import java.time.LocalDate;
import java.util.List;

public class CustomerRequestDTO {
    private String name;
    private LocalDate dob;
    private String nic;

    private List<String> mobiles;

    private List<AddressDTO> AddressDTOS;

    private List<Long> familyMemberIds;
}
