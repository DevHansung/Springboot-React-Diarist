package com.hansung.web.vo;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonBackReference;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name="follow")
public class Follow{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="followid")
    private int followid;

    private String username;
    
    @Column(name="target_username")
    private String followname;
    
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="target_userid")
    private User user;

    public Follow(){
    }
 
    public Follow(String name, String followname){
        this.username= name;
        this.followname= followname;
    }
}