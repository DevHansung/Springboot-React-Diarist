package com.hansung.web.vo;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.ColumnDefault;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name="board_category")
public class BoardCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="cateid")
    private int cateid;

    private String category;
    
	@ColumnDefault(value = "1")
    private int enabled;
    
    public BoardCategory(){
    }

    public BoardCategory(String categoty, int enabled){
        this.category= categoty;
    }
}