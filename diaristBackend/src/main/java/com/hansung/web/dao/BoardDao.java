package com.hansung.web.dao;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

//spring jdbc -> Hibernate

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.hansung.web.vo.Board;

@Repository
public interface BoardDao extends CrudRepository<Board, Integer> {
    @Modifying(clearAutomatically = true)
    @Transactional
    @Query(value= "DELETE FROM board b WHERE  b.category = ?1", nativeQuery = true)
	void deleteByCategory(String category);

    @Query(value= "SELECT * FROM board b WHERE b.writer = ?1", nativeQuery = true)
	List<Board> findBoardByUsername(String username);
}
