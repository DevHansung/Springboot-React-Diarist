package com.hansung.web.dao;


import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.hansung.web.vo.EventImage;

@Repository
public interface EventImageDao extends JpaRepository<EventImage, Integer>{
    @Modifying(clearAutomatically = true)
    @Transactional
    @Query(value="delete from event_image where eventid = ?1",nativeQuery = true)
    void deleteEventImage(Integer id);

    @Query(value="select * from event_image where eventid=?1", nativeQuery = true)
    Optional<EventImage> getEventImage(Integer id);
}