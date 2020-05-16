package com.hansung.web.dao;

import java.util.Collection;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.hansung.web.vo.Follow;

public interface FollowDao extends JpaRepository<Follow, Integer>{
    @Query(value= "SELECT followid FROM follow f WHERE f.username = ?1 and f.target_username = ?2", nativeQuery = true)
	String findFollowByUsername(String username, String followname);

    @Query(value= "SELECT * FROM follow f WHERE f.username = ?1", nativeQuery = true)
    Collection<Follow> findByUsername(String username);
}
