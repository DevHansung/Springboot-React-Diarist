package com.hansung.web.vo;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.ColumnDefault;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Entity
@Table(name = "todolist")
public class TodoList implements Serializable {

	private static final long serialVersionUID = -567117648902464025L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int todoid;

	private String text;

	private String username;

	@ColumnDefault(value = "0")
	private int checked;



}