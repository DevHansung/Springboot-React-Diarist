package com.hansung.web.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.hansung.web.vo.EventApply;

public interface EventApplyDao extends JpaRepository<EventApply, Integer>{
    @Query(value= "Select eaid from event_apply where eventid = ?1", nativeQuery = true)
	Boolean findIdByEventId(int eventid);
    
    @Query(value= "Select username from event_apply where eventid = ?1 and username=?2", nativeQuery = true)
	String findUserByUsername(int eventid, String phone);

    @Query(value= "Select * from event_apply where eventid = ?1", nativeQuery = true)
    List<EventApply> findEventApplyByEventid(int eventid);
}
