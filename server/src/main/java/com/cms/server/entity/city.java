package com.cms.server.entity;

import javax.persistence.*;

@Entity
@Table(name = "city")
public class city {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String name;
}
