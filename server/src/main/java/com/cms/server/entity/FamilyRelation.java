package com.cms.server.entity;

import javax.persistence.*;

@Entity
@Table(name = "family_relation")
public class FamilyRelation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "family_member_id")
    private Customer familyMember;

    public FamilyRelation() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public Customer getFamilyMember() {
        return familyMember;
    }

    public void setFamilyMember(Customer familyMember) {
        this.familyMember = familyMember;
    }
}
