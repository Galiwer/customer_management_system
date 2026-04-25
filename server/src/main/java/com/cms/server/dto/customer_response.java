package com.cms.server.dto;

import java.time.LocalDate;
import java.util.List;

public class customer_response {
    private Long id;
    private String name;
    private LocalDate dob;
    private String nic;

    private List<mobile> mobiles;

    private List<address> addresses;

    private List<family_member> familyMembers;
}
