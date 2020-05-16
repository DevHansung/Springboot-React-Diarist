package com.hansung.web.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.hansung.web.vo.BoardCategory;

public interface BoardCategoryDao extends JpaRepository<BoardCategory, Integer>{
    @Query(value= "Select * from board_category c where c.enabled=1", nativeQuery = true)
	List<BoardCategory> findByEnabled();
}
