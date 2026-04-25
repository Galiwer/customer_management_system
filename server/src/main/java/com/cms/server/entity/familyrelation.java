package com.cms.server.entity;

import javax.persistence.*;

@Entity
@Table(name = "family_relation")
public class familyrelation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Owner customer
    @ManyToOne
    @JoinColumn(name = "customer_id")
    private customer customer;

    // Family member (also a customer)
    @ManyToOne
    @JoinColumn(name = "family_member_id")
    private customer familyMember;
}
