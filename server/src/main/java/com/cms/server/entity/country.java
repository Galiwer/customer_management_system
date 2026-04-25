package com.cms.server.entity;

import javax.persistence.*;

@Entity
@Table(name = "country")
public class country {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String name;
}
