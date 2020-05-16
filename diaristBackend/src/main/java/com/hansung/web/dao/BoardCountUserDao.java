package com.hansung.web.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.hansung.web.vo.BoardCountUser;

public interface BoardCountUserDao extends JpaRepository<BoardCountUser, Integer> {
    @Query(value="Select username from board_count b where b.boid = ?1 and b.username = ?2", nativeQuery = true)
    String getUserByIdAndUsername(int id,String username);
}
