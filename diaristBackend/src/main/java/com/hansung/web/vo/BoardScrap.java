package com.hansung.web.vo;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.hansung.web.vo.audit.DateAudit;
import com.fasterxml.jackson.annotation.JsonBackReference;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name="board_scrap")
public class BoardScrap extends DateAudit{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="bsid")
    private int bsid;

    private String title;

    private String username;

    private int boardid;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name="boid")
    private Board board;

    public BoardScrap(){

    }

    public BoardScrap(String username, String title, int boardid){
        this.title = title;
        this.username=username;
        this.boardid = boardid;
    }

}