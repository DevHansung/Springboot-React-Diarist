package com.hansung.web.vo;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.hansung.web.vo.audit.DateAudit;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Entity
@Table(name = "event")
public class Event extends DateAudit{

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int eventid;

	private String title;

	private String writer;

	private String text; 

    @JsonManagedReference
    @OneToOne(fetch=FetchType.LAZY,
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            mappedBy = "event")
    private EventImage eventImage;
	
	@JsonManagedReference
	@OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, mappedBy = "event")
	private Set<EventApply> eventApplys = new HashSet<>();
	
    public Event(){
    }
    
	public Event(String title, String writer, String text) {
		this.title=title;
		this.writer=writer;
		this.text=text;
	}
}