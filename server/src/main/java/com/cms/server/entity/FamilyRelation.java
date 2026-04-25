package com.cms.server.entity;

import javax.persistence.*;

@Entity
@Table(name = "family_relation")
public class FamilyRelation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Owner customer
    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    // Family member (also a customer)
    @ManyToOne
    @JoinColumn(name = "family_member_id")
    private Customer familyMember;
}
