package com.hansung.web.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.hansung.web.config.EventImageConfig;
import com.hansung.web.exception.FileStorageException;
import com.hansung.web.vo.EventImage;

@Service
public class EventImageService {

	private final Path eventImageLocation;

	@Autowired
	public EventImageService(EventImageConfig eventImageConfig) {
		this.eventImageLocation = Paths.get(eventImageConfig.getUploadDir()).toAbsolutePath().normalize();

		try {
			Files.createDirectories(this.eventImageLocation);
		} catch (Exception ex) {
			throw new FileStorageException("파일을 업로드할 디렉토리를 생성하지 못했습니다.", ex);
		}
	}

	// 파일 저장
	public EventImage saveEventImage(MultipartFile image) {
		// 원본 파일 이름
		String originalFileName = StringUtils.cleanPath(image.getOriginalFilename());
		// 저장될 파일 이름(현재시간+파일 이름)
		String fileName = System.currentTimeMillis() + "-" + originalFileName;
		String fileUri = ServletUriComponentsBuilder.fromCurrentContextPath().path("/eventimages/").path(fileName)
				.toUriString();
		try {
			if (fileName.contains("..")) {
				throw new FileStorageException("파일명에 부적합 문자가 포함되어 있습니다. " + fileName);
			}
			Path targetLocation = this.eventImageLocation.resolve(fileName);
			Files.copy(image.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
			EventImage eventImage = new EventImage(fileName, image.getContentType(), fileUri, image.getSize());
			return eventImage;

		} catch (IOException ex) {
			throw new FileStorageException("Could not store file " + fileName + ". Please try again!", ex);
		}
	}

	public void deleteEventImage(String fileName) {
		Path savePath = this.eventImageLocation.resolve(fileName);
		if (Files.exists(savePath)) {
			try {
				Files.delete(savePath);
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

	public EventImage updateEventImage(MultipartFile image, String originImageName) {
		String updateFileName = StringUtils.cleanPath(image.getOriginalFilename());
		String fileName = System.currentTimeMillis() + "-" + updateFileName;
		String fileUri = ServletUriComponentsBuilder.fromCurrentContextPath().path("/eventimages/").path(fileName)
				.toUriString();
		try {
			if (fileName.contains("..")) {
				throw new FileStorageException("파일명에 부적합 문자가 포함되어 있습니다. " + fileName);
			}
			Path originLocation = this.eventImageLocation.resolve(originImageName);
			if (Files.exists(originLocation)) {
				try {
					Files.delete(originLocation);
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
			Path targetLocation = this.eventImageLocation.resolve(fileName);
			Files.copy(image.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
			EventImage eventImage = new EventImage(fileName, image.getContentType(), fileUri, image.getSize());
			return eventImage;
		} catch (IOException ex) {
			throw new FileStorageException("Could not store file " + fileName + ". Please try again!", ex);
		}
	}

}