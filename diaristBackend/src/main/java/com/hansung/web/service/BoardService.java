package com.hansung.web.service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hansung.web.dao.BoardCountUserDao;
import com.hansung.web.dao.BoardDao;
import com.hansung.web.vo.Board;
import com.hansung.web.vo.BoardCountUser;
import com.hansung.web.vo.BoardReply;

@Service
public class BoardService {

	@Autowired
	private BoardDao boardDao;

	@Autowired
	private BoardCountUserDao boardUserCountDao;

	public List<Board> getBoards() {
		return (List<Board>) boardDao.findAll();
	}

	public Board boardDetailandCount(int boid, String username) {
		Board fetchedBoard = boardDao.findById(boid)
				.orElseThrow(() -> new IllegalArgumentException("해당 사용자가 없습니다. id=" + boid));
		if (fetchedBoard == null) {
			return null;
		}
		if (boardUserCountDao.getUserByIdAndUsername(boid, username) == null) {
			BoardCountUser bcu = new BoardCountUser(username);
			bcu.setBoard(fetchedBoard);
			fetchedBoard.getBoardCountUsers().add(bcu);
			fetchedBoard.setCount(fetchedBoard.getCount() + 1);
			boardDao.save(fetchedBoard);			
			return fetchedBoard;
		} else {
			boardDao.save(fetchedBoard);			
			return fetchedBoard;
		}
	}

	public Board getBoardByBoardId(int boid) {
		return boardDao.findById(boid).orElseThrow(() -> new IllegalArgumentException("해당 사용자가 없습니다. id=" + boid));
	}

	public Board addBoard(Board board) {
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm");
		Date time = new Date();
		String getTime = format.format(time);
		System.out.println(getTime);
		board.setDate(getTime);
		return boardDao.save(board);
	}

	public Board updateBoard(int boardId, Board board) {
		Board fetchedBoard = boardDao.findById(boardId)
				.orElseThrow(() -> new IllegalArgumentException("해당 사용자가 없습니다. id=" + boardId));
		if (fetchedBoard == null) {
			return null;
		}
		fetchedBoard.setTitle(board.getTitle());
		fetchedBoard.setText(board.getText());
		fetchedBoard.setWriter(board.getWriter());
		boardDao.save(fetchedBoard);
		return fetchedBoard;
	}

	public Boolean deleteBoard(int boardId) {
		final Board fetchedBoard = boardDao.findById(boardId)
				.orElseThrow(() -> new IllegalArgumentException("해당 사용자가 없습니다. id=" + boardId));
		if (fetchedBoard == null) {
			return false;
		} else {
			boardDao.delete(fetchedBoard);
			return true;
		}
	}

}