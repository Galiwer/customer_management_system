package com.cms.server.entity;

import javax.persistence.*;

@Entity
@Table (name = "address")
public class address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String line1;
    private String line2;

    @ManyToOne
    @JoinColumn(name = "city_id")
    private city city;

    @ManyToOne
    @JoinColumn(name = "country_id")
    private country country;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private customer customer;
}
