package com.hansung.web.dao;


import java.util.Collection;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.hansung.web.vo.Event;

@Repository
public interface EventDao extends JpaRepository<Event, Integer> {
    
    @Query(value="Select * from event e where e.eventid = ?1", nativeQuery = true)
    Collection<Event> getEvent(Integer id);
}