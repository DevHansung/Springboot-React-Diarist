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
import com.hansung.web.vo.audit.DateAudit;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name="board_reply")
public class BoardReply extends DateAudit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    @Column(name ="reid")
    private int reid;

    private String user;

    private String reply;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="boid")
    private Board board;

    public BoardReply(){
    }

    public BoardReply(String user, String reply){
        this.user= user;
        this.reply = reply;
    }
}