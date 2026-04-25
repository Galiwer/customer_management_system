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
}
