package com.cms.server.entity;

import javax.persistence.*;

@Entity
@Table(name = "customer_mobile")
public class Mobile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String mobile;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    public Mobile() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }

    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }
}
