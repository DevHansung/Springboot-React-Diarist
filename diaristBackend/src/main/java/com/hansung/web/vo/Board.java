package com.hansung.web.vo;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.ColumnDefault;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Entity
@Table(name = "board")
public class Board implements Serializable {

	private static final long serialVersionUID = -567117648902464025L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int boid;

	private String title;

	private String text;

	private String writer;

	private String date;

	private String category;

	@ColumnDefault(value = "0")
	private int count;

	@JsonManagedReference
	@OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, mappedBy = "board")
	private Set<BoardReply> replys = new HashSet<>();

	@JsonManagedReference
	@OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, mappedBy = "board")
	private Set<BoardLike> likes = new HashSet<>();

	@JsonManagedReference
	@OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, mappedBy = "board")
	private Set<BoardCountUser> boardCountUsers = new HashSet<>();

	@JsonManagedReference
	@OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, mappedBy = "board")
	private Set<BoardScrap> Scraps = new HashSet<>();

}