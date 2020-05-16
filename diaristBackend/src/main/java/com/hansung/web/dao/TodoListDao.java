package com.hansung.web.dao;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.hansung.web.vo.TodoList;

@Repository
public interface TodoListDao extends JpaRepository<TodoList, Integer>{
    @Query(value= "Select * from todolist t where t.username = ?1", nativeQuery = true)
	List<TodoList> findByUsername(String username);
  
}