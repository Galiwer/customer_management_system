package com.cms.server.dto;

public class MobileDTO {
    private Long id;
    private String mobile;

    public MobileDTO() {
    }

    public MobileDTO(Long id, String mobile) {
        this.id = id;
        this.mobile = mobile;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }
}
