package com.hansung.web.controller;

import java.net.URI;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.web.util.UriComponentsBuilder;

import com.hansung.web.dao.BoardCategoryDao;
import com.hansung.web.dao.BoardDao;
import com.hansung.web.dao.BoardLikeDao;
import com.hansung.web.dao.BoardReplyDao;
import com.hansung.web.dao.BoardScrapDao;
import com.hansung.web.dto.ApiResponse;
import com.hansung.web.service.BoardService;
import com.hansung.web.vo.Board;
import com.hansung.web.vo.BoardCategory;
import com.hansung.web.vo.BoardLike;
import com.hansung.web.vo.BoardReply;
import com.hansung.web.vo.BoardScrap;

@RestController
@RequestMapping("/api") // 게시판 관련 컨트롤러
public class BoardController {

	// boardService 의존성 주입
	@Autowired
	private BoardService boardService;

	@Autowired
	private BoardDao boardDao;

	@Autowired
	private BoardReplyDao boardReplyDao;

	@Autowired
	private BoardLikeDao boardLikeDao;

	@Autowired
	private BoardScrapDao boardScrapDao;

	@Autowired
	private BoardCategoryDao boardCategoryDao;

	// 게시글 전체 조회
	@RequestMapping(value = "/board", method = RequestMethod.GET)
	public ResponseEntity<List<Board>> getAllBoard() {

		List<Board> board = boardService.getBoards();
		return new ResponseEntity<List<Board>>(board, HttpStatus.OK);
	}
	
	@RequestMapping(value = "/board/{username}", method = RequestMethod.GET)
	public ResponseEntity<List<Board>> getBoardByUsername(@PathVariable("username") String username) {

		List<Board> board = boardDao.findBoardByUsername(username);
		return new ResponseEntity<List<Board>>(board, HttpStatus.OK);
	}

	// 게시글 상세 조회
	@RequestMapping(value = "/board/{boid}/{username}", method = RequestMethod.GET)
	public ResponseEntity<Board> getBoardDetail(@PathVariable("boid") int boid,
			@PathVariable("username") String username) {
		Board boardDetail = boardService.boardDetailandCount(boid, username);
		System.out.println(boardDetail);
		if (boardDetail == null) {
			return new ResponseEntity<Board>(HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<Board>(boardDetail, HttpStatus.OK);
	}

	// 게시글 작성
	@RequestMapping(value = "/board", method = RequestMethod.POST)
	public ResponseEntity<?> addBoard(@RequestBody Board board, UriComponentsBuilder ucBuilder) {
		Board result = boardService.addBoard(board);

		URI location = ServletUriComponentsBuilder.fromCurrentContextPath().path("/board/{boid}")
				.buildAndExpand(result.getBoid()).toUri();
		return ResponseEntity.created(location).body(new ApiResponse(true, "User registered successfully"));
	}

	// 게시글 수정(모든 글 수정 가능)
	@PreAuthorize("hasRole('ADMIN') or hasRole('TOPADMIN')")
	@RequestMapping(value = "/board/{boid}", method = RequestMethod.PUT)
	public ResponseEntity<?> UpdateAdminBoard(@PathVariable("boid") int boid, @RequestBody Board board) {

		Board boardByBoardId = boardService.getBoardByBoardId(boid);
		if (boardByBoardId == null) {
			return new ResponseEntity<Board>(HttpStatus.NOT_FOUND);
		}
		board.setWriter(boardByBoardId.getWriter());
		Board result = boardService.updateBoard(boid, board);
		URI location = ServletUriComponentsBuilder.fromCurrentContextPath().path("/editList")
				.buildAndExpand(result.getBoid()).toUri();

		return ResponseEntity.created(location).body(new ApiResponse(true, "successfully"));
	}

	// 게시글 수정(본인이 작성한 글만 삭제 가능)
	@RequestMapping(value = "/board/{boid}/{username}", method = RequestMethod.PUT)
	public ResponseEntity<?> updateUserBoard(@PathVariable("boid") int boid, @PathVariable("username") String username,
			@RequestBody Board board) {

		Board boardByBoardId = boardService.getBoardByBoardId(boid);
		if (boardByBoardId == null) {
			return new ResponseEntity<Board>(HttpStatus.NOT_FOUND);
		} else if (boardByBoardId.getWriter().equals(username)) {
			board.setWriter(boardByBoardId.getWriter());
			Board result = boardService.updateBoard(boid, board);
			URI location = ServletUriComponentsBuilder.fromCurrentContextPath().path("/editList")
					.buildAndExpand(result.getBoid()).toUri();
			return ResponseEntity.created(location).body(new ApiResponse(true, "success"));
		}
		return ResponseEntity.badRequest().body(new ApiResponse(false, "error"));
	}

	// 글 삭제(모든 글 삭제 가능)
	@PreAuthorize("hasRole('ADMIN') or hasRole('TOPADMIN')")
	@RequestMapping(value = "/board/{boardId}", method = RequestMethod.DELETE)
	public ResponseEntity<?> DeleteaAdminBoard(@PathVariable int boardId) {

		Board board = boardService.getBoardByBoardId(boardId);
		if (board == null) {
			return ResponseEntity.badRequest().body(new ApiResponse(false, "error"));
		}
		boardService.deleteBoard(boardId);
		return ResponseEntity.ok().body(new ApiResponse(true, "successfully"));
	}

	// 글 삭제(본인이 작성한 글만 삭제 가능)
	@RequestMapping(value = "/board/{boid}/{username}", method = RequestMethod.DELETE)
	public ResponseEntity<ApiResponse> deleteUserBoard(@PathVariable("boid") int boid,
			@PathVariable("username") String username) {

		Board board = boardService.getBoardByBoardId(boid);
		if (board.getWriter().equals(username)) {
			boardService.deleteBoard(boid);
			return ResponseEntity.ok().body(new ApiResponse(true, "successfully"));
		}
		return ResponseEntity.badRequest().body(new ApiResponse(false, "error"));
	}

	// 댓글 조회
	@RequestMapping(value = "/reply/{boid}", method = RequestMethod.GET)
	public Collection<BoardReply> getReply(@PathVariable int boid) {
		return boardReplyDao.getReplys(boid);
	}

	// 댓글 등록
	@RequestMapping(value = "/reply/{boid}", method = RequestMethod.POST)
	public ResponseEntity<?> createReply(@PathVariable int boid, @RequestBody Map<String, Object> param) {
		String username = (String) param.get("username");
		String reply = (String) param.get("reply");
		Board board = boardService.getBoardByBoardId(boid);
		BoardReply boardReply = new BoardReply(username, reply);
		boardReply.setBoard(board);
		board.getReplys().add(boardReply);
		boardDao.save(board);
		BoardReply getReply = boardReplyDao.getReply(boid, username);
		return ResponseEntity.ok().body(getReply);
	}

	// 댓글 수정
	@RequestMapping(value = "/reply/{reid}", method = RequestMethod.PUT)
	public ResponseEntity<?> editReply(@PathVariable int reid, @RequestBody Map<String, Object> param) {
		String reply = (String) param.get("reply");
		BoardReply boardReply = boardReplyDao.findById(reid).get();
		boardReply.setReply(reply);
		// return boardReplyDao.save(boardReply);
		return ResponseEntity.ok().body(boardReplyDao.save(boardReply));
	}

	// 특정 댓글 삭제
	@RequestMapping(value = "/reply/{reid}", method = RequestMethod.DELETE)
	public ResponseEntity<ApiResponse> deleteReply(@PathVariable int reid) {
		boardReplyDao.deleteById(reid);
		return ResponseEntity.ok().body(new ApiResponse(true, "successfully"));
	}

	// Like 등록
	@RequestMapping(value = "/like/{boid}", method = RequestMethod.POST)
	public ResponseEntity<?> uploadLike(@PathVariable int boid, @RequestBody BoardLike boardlike) {
		if (boardLikeDao.getLikeByUsername(boid, boardlike.getUsername()) != null) {
			return ResponseEntity.badRequest().body(new ApiResponse(false, "error"));
		}
		Board board = boardService.getBoardByBoardId(boid);
		boardlike.setBoard(board);
		board.getLikes().add(boardlike);
		boardDao.save(board);
		return ResponseEntity.ok().body(boardLikeDao.getLikeidByBoid(boid, boardlike.getUsername()));
	}

	// 추천여부 확인
	@RequestMapping(value = { "/loadlike/{boid}/{username}" }, method = RequestMethod.GET)
	public ResponseEntity<?> fetchLike(@PathVariable("boid") int boid, @PathVariable("username") String username) {
		//String likeid = boardLikeDao.getLikeidByBoid(boid, username);
		return ResponseEntity.ok().body(boardLikeDao.getLikeidByBoid(boid, username));
	}

	// Like 취소
	@RequestMapping(value = "/like/{likeid}", method = RequestMethod.DELETE)
	public ResponseEntity<?> deleteLike(@PathVariable int likeid) {
		if (boardLikeDao.getLikeidByLikeid(likeid) == null) {
			return ResponseEntity.badRequest().body(new ApiResponse(false, "error"));
		}
		boardLikeDao.deleteById(likeid);
		return ResponseEntity.ok().body(new ApiResponse(true, "successfully"));
	}

	// Like 개수 조회
	@RequestMapping(value = "/countlike/{boid}", method = RequestMethod.GET)
	public ResponseEntity<?> getCountLike(@PathVariable int boid) {
		return ResponseEntity.ok().body(boardLikeDao.getCountLike(boid));
	}

	// 게시물의 스크랩여부 확인
	@RequestMapping(value = "/scrap/{boid}/{username}", method = RequestMethod.GET)
	public ResponseEntity<?> getScrap(@PathVariable("boid") int boid, @PathVariable("username") String username) {
		BoardScrap boardScrap = boardScrapDao.getScrapByBoid(boid, username);
		if (boardScrap == null) {
			return ResponseEntity.ok().body(null);
		}
		return ResponseEntity.ok().body(boardScrap.getBsid());
	}

	// 해당user의 스크랩 가져오기
	@RequestMapping(value = "/userscrap/{username}", method = RequestMethod.GET)
	public ResponseEntity<?> getScrap(@PathVariable("username") String username) {
		return ResponseEntity.ok().body(boardScrapDao.getScrapByUsername(username));
	}

	// 게시물 스크랩 등록
	@RequestMapping(value = "/scrap/{boid}", method = RequestMethod.POST)
	public ResponseEntity<?> saveScrap(@PathVariable int boid, @RequestBody Map<String, Object> param) {
		String username = (String) param.get("username");
		if (boardScrapDao.getScrapUsernameByBoid(boid, username) != null) {
			return ResponseEntity.badRequest().body(new ApiResponse(false, "error"));
		}
		Board board = boardService.getBoardByBoardId(boid);
		String title = board.getTitle();
		int boardid = board.getBoid();
		BoardScrap boardScrap = new BoardScrap(username, title, boardid);
		boardScrap.setBoard(board);
		board.getScraps().add(boardScrap);
		boardDao.save(board);
		int bsid = boardScrapDao.getScrapIdByBoid(boid, username);
		return ResponseEntity.ok().body(bsid);
	}

	// 해당 user 스크랩 전체 삭제
	@RequestMapping(value = "/scraps/{username}", method = RequestMethod.DELETE)
	public void deleteScrap(@PathVariable("username") String username) {
		boardScrapDao.deleteScrap(username);
	}

	// 해당 게시물의 스크랩 삭제
	@RequestMapping(value = "/scrap/{bsid}", method = RequestMethod.DELETE)
	public ResponseEntity<?> deleteScrapByBsid(@PathVariable("bsid") int bsid) {
		boardScrapDao.deleteById(bsid);
		return ResponseEntity.ok().body(new ApiResponse(true, "successfully"));
	}

	// 활성화 카테고리만 조회
	@RequestMapping(value = "/enabledcategory", method = RequestMethod.GET)
	public ResponseEntity<?> getEnabledCategory() {
		// System.out.println(boardCategoryDao.findAll());
		return ResponseEntity.ok().body(boardCategoryDao.findByEnabled());
	}
	
	// 게시판 카테고리 조회
	@PreAuthorize("hasRole('ADMIN') or hasRole('TOPADMIN')")
	@RequestMapping(value = "/category", method = RequestMethod.GET)
	public ResponseEntity<?> getCategory() {
		// System.out.println(boardCategoryDao.findAll());
		return ResponseEntity.ok().body(boardCategoryDao.findAll());
	}

	// 새 카테고리 등록
	@PreAuthorize("hasRole('ADMIN') or hasRole('TOPADMIN')")
	@RequestMapping(value = "/category", method = RequestMethod.POST)
	public ResponseEntity<?> createCategory( @RequestBody Map<String, Object> param) {
		String category = (String) param.get("category");
	
		BoardCategory boardCategory = new BoardCategory();
		boardCategory.setCategory(category);
		return ResponseEntity.ok().body(boardCategoryDao.save(boardCategory));
	}

	// 게시판 카테고리 활성상태 변경
	@PreAuthorize("hasRole('ADMIN') or hasRole('TOPADMIN')")
	@RequestMapping(value = "/category/{cateid}", method = RequestMethod.PUT)
	public ResponseEntity<?> updateCategory(@PathVariable("cateid") int cateid) {
		BoardCategory boardCategory = boardCategoryDao.findById(cateid).get();
		if (boardCategory.getEnabled() == 0) {
			boardCategory.setEnabled(1);
			return ResponseEntity.ok().body(boardCategoryDao.save(boardCategory));
		} else if (boardCategory.getEnabled() == 1) {
			boardCategory.setEnabled(0);
			return ResponseEntity.ok().body(boardCategoryDao.save(boardCategory));
		}
		return ResponseEntity.badRequest().body(new ApiResponse(false, "error"));
	}

	// 게시판 카테고리 삭제
	@PreAuthorize("hasRole('ADMIN') or hasRole('TOPADMIN')")
	@RequestMapping(value = "/category/{cateid}", method = RequestMethod.DELETE)
	public ResponseEntity<?> deleteCategoty(@PathVariable("cateid") int cateid) {
		BoardCategory boardCategory = boardCategoryDao.findById(cateid).get();
		String category = boardCategory.getCategory();
		boardDao.deleteByCategory(category);
		boardCategoryDao.deleteById(cateid);

		return ResponseEntity.ok().body(new ApiResponse(true, "successfully"));
	}

}