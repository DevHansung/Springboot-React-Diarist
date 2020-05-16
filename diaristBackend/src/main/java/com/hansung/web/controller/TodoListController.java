package com.hansung.web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.hansung.web.dao.TodoListDao;
import com.hansung.web.dto.ApiResponse;
import com.hansung.web.vo.TodoList;

@RestController
@RequestMapping("/api") // TodoList 관련 컨트롤러
public class TodoListController {

	@Autowired
	private TodoListDao todoListDao;
	
	// 할일 목록 조회
	@RequestMapping(value = "/todolist/{username}", method = RequestMethod.GET)
	public ResponseEntity<?> getTodoList(@PathVariable("username") String username) {
		return ResponseEntity.ok().body(todoListDao.findByUsername(username));
	}

	// 새 코멘트 등록
	@RequestMapping(value = "/todolist", method = RequestMethod.POST)
	public ResponseEntity<?> createTodoList(@RequestBody TodoList todoList) {
		
		return ResponseEntity.ok().body(todoListDao.save(todoList));
	}

	// 체크리스트 체크
	@RequestMapping(value = "/checktodo/{todoid}", method = RequestMethod.PUT)
	public ResponseEntity<?> checkedToDoList(@PathVariable int todoid) {
		//Optional<TodoList> todoList = todoListDao.findById(todoid);
		TodoList todoList = todoListDao.findById(todoid).get();

		todoList.setChecked(1);
		return ResponseEntity.ok().body(todoListDao.save(todoList));
	}
	
	// 체크리스트 해제
	@RequestMapping(value = "/unchecktodo/{todoid}", method = RequestMethod.PUT)
	public ResponseEntity<?> unCheckedToDoList(@PathVariable int todoid) {
		TodoList todoList = todoListDao.findById(todoid).get();

		todoList.setChecked(0);
		return ResponseEntity.ok().body(todoListDao.save(todoList));
	}

	//할일 삭제
	@RequestMapping(value = "/todolist/{todoid}", method = RequestMethod.DELETE)
	public ResponseEntity<ApiResponse> deleteTodoList(@PathVariable("todoid") int todoid) {
		todoListDao.deleteById(todoid);
		return ResponseEntity.ok().body(new ApiResponse(true, "successfully"));
	}
}
