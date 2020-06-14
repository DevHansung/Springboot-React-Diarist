package com.hansung.web.controller;

import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.hansung.web.dao.EventApplyDao;
import com.hansung.web.dao.EventDao;
import com.hansung.web.dao.EventImageDao;
import com.hansung.web.dto.ApiResponse;
import com.hansung.web.service.EventImageService;
import com.hansung.web.service.ExcelService;
import com.hansung.web.vo.Event;
import com.hansung.web.vo.EventApply;
import com.hansung.web.vo.EventImage;

@RestController
@RequestMapping("/api") // 이벤트 관련 컨트롤러
public class EventController {

	@Autowired
	private EventImageService eventImageService;

	@Autowired
	private ExcelService excelService;

	@Autowired
	private EventDao eventDao;

	@Autowired
	private EventImageDao eventImageDao;

	@Autowired
	private EventApplyDao eventApplyDao;

	// 이벤트 전체 조회
	@RequestMapping(value = "/event", method = RequestMethod.GET)
	public ResponseEntity<?> loadEvent() {
		List<Event> result = eventDao.findAll();
		return ResponseEntity.ok().body(result);
	}

	// 이벤트 상세보기
	@RequestMapping(value = "/eventdetail/{eventid}", method = RequestMethod.GET)
	public Optional<Event> geteEventById(@PathVariable int eventid) {
		return eventDao.findById(eventid);
	}

	// 이벤트 등록
	@PreAuthorize("hasRole('ADMIN') or hasRole('TOPADMIN')")
	@RequestMapping(value = "/event", method = RequestMethod.POST, consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
	public ResponseEntity<?> uploadEvent(@RequestParam("writer") String writer, @RequestParam("title") String title,
			@RequestParam("text") String text, @RequestParam("image") MultipartFile image) {
		Event event = new Event(title, writer, text);
		EventImage eventImage = eventImageService.saveEventImage(image);
		event.setEventImage(eventImage);
		eventImage.setEvent(event);
		Event result = eventDao.save(event);
		return ResponseEntity.ok().body(result);
	}

	// 이벤트 이미지 수정
	@PreAuthorize("hasRole('ADMIN') or hasRole('TOPADMIN')")
	@RequestMapping(value = "/eventimage/{eventid}", method = RequestMethod.PUT, consumes = {
			MediaType.MULTIPART_FORM_DATA_VALUE })
	public ResponseEntity<?> editEventImage(@PathVariable("eventid") int eventid, @RequestParam("writer") String writer,
			@RequestParam("title") String title, @RequestParam("text") String text,
			@RequestParam("image") MultipartFile image) {
		Event event = eventDao.findById(eventid).get();
		event.setTitle(title);
		event.setText(text);
		// 전송된 이미지가 있다면 아래 조건문
		if (!image.equals(null)) {
			EventImage eventOriginImage = eventImageDao.getEventImage(eventid).get();
			String originImageName = eventOriginImage.getFileName();
			EventImage eventImage = eventImageService.updateEventImage(image, originImageName);
			event.setEventImage(eventImage);
			eventImage.setEvent(event);
		}
		// 전송된 이미지가 없다면 이미지를 변경하지 않는것으로 간주하고 바로 저장.
		Event result = eventDao.save(event);
		return ResponseEntity.ok().body(result);
	}

	// 이벤트 수정
	@PreAuthorize("hasRole('ADMIN') or hasRole('TOPADMIN')")
	@RequestMapping(value = "/event/{eventid}", method = RequestMethod.PUT)
	public ResponseEntity<?> editEvent(@PathVariable("eventid") int eventid, 
			@RequestBody Map<String, Object> param) {
		String title = (String) param.get("title");
		String text = (String) param.get("text");
		Event event = eventDao.findById(eventid).get();
		event.setTitle(title);
		event.setText(text);
		Event result = eventDao.save(event);
		return ResponseEntity.ok().body(result);
	}

	// 이벤트 삭제
	@PreAuthorize("hasRole('ADMIN') or hasRole('TOPADMIN')")
	@RequestMapping(value = "/event/{eventid}", method = RequestMethod.DELETE)
	public Optional<Event> deleteEventById(@PathVariable int eventid) {
		EventImage eventImage = eventImageDao.getEventImage(eventid).get();
		String fileName = eventImage.getFileName();
		eventImageService.deleteEventImage(fileName);
		eventDao.deleteById(eventid);
		return eventDao.findById(eventid);
	}

	
	// 이벤트 접수자조회
	@PreAuthorize("hasRole('ADMIN') or hasRole('TOPADMIN')")
	@RequestMapping(value = "/eventapplys/{eventid}", method = RequestMethod.GET)
	public ResponseEntity<?> getEventApplyById(@PathVariable int eventid) {
		return ResponseEntity.ok().body(eventApplyDao.findEventApplyByEventid(eventid));
	}

	// 이벤트 접수
	@RequestMapping(value = "/eventapply/{eventid}", method = RequestMethod.POST)
	public ResponseEntity<?> eventApply(@PathVariable int eventid, @RequestBody EventApply eventApply) {
		if(eventApplyDao.findUserByUsername(eventid, eventApply.getUsername())==null){
			Event event = eventDao.findById(eventid).get();
			eventApply.setEvent(event);
			event.getEventApplys().add(eventApply);
			eventDao.save(event);
			return ResponseEntity.ok().body(new ApiResponse(true, "successfully"));
		}
		return ResponseEntity.badRequest().body(new ApiResponse(false, "It's a duplicate apply."));
	}

	// 이벤트 접수자 명단 엑셀파일 생성&&다운로드
	@PreAuthorize("hasRole('ADMIN') or hasRole('TOPADMIN')")
	@RequestMapping(value = "/exceldown/{eventid}", method = RequestMethod.GET)
	public ResponseEntity<?> excelDown(@PathVariable("eventid") int eventid) throws Exception {
		try {
			// 게시판 목록조회
			List<EventApply> list = eventApplyDao.findEventApplyByEventid(eventid);
			String downRileNm = "tests.xlxs";
			String contentType = "application/vnd.ms-excel";
			ByteArrayOutputStream os = excelService.createExcelByEventApply(list);
			return ResponseEntity.ok().contentType(MediaType.parseMediaType(contentType))
					.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + downRileNm + "\"")
					.body(os.toByteArray());
		} catch (Exception e) {
			throw new Exception(e.getMessage());
		}
	}

}
