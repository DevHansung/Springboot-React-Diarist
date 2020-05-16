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
@Table(name="board_count")
public class BoardCountUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="bcid")
    private int bcid;

    private String username;
    
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="boid")
    private Board board;

    public BoardCountUser(){
    }

    public BoardCountUser(String username){
        this.username= username;
    }
}