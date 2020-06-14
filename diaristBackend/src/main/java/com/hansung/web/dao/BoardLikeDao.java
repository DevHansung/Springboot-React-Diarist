package com.hansung.web.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.hansung.web.vo.BoardLike;

@Repository
public interface BoardLikeDao extends JpaRepository<BoardLike, Integer>{
    @Query(value= "Select likeid from board_like l where l.boid = ?1 and l.username = ?2", nativeQuery = true)
    String getLikeidByBoid(int boid, String username);
    
    @Query(value= "Select username from board_like l where l.boid = ?1 and l.username = ?2", nativeQuery = true)
    String getLikeByUsername(int id, String user);

    @Query(value="Select count(username) from board_like where boid = ?1", nativeQuery = true)
    int getCountLike(int id);
    
    @Query(value="Select likeid from board_like where likeid = ?1", nativeQuery = true)
    String getLikeidByLikeid(int id);
}