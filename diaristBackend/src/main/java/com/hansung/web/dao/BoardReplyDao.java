package com.hansung.web.dao;

import java.util.Collection;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.hansung.web.vo.BoardReply;

public interface BoardReplyDao extends JpaRepository<BoardReply, Integer> {
    @Query(value="Select * from board_reply r where r.boid = ?1", nativeQuery = true)
    Collection<BoardReply> getReplys(int id);
    
    @Query(value="Select * from board_reply r where r.boid = ?1 and r.user = ?2 ORDER BY r.reid DESC LIMIT 1", nativeQuery = true)
    BoardReply getReply(int id, String username);
}
