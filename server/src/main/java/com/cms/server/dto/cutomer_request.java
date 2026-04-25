package com.cms.server.dto;

import java.time.LocalDate;
import java.util.List;

public class cutomer_request {
    private String name;
    private LocalDate dob;
    private String nic;

    private List<String> mobiles;

    private List<address> addresses;

    private List<Long> familyMemberIds;
}
