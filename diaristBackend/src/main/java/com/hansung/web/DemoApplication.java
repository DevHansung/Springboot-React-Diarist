package com.hansung.web;

import java.util.TimeZone;

import javax.annotation.PostConstruct;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.data.jpa.convert.threeten.Jsr310JpaConverters;

import com.hansung.web.config.EventImageConfig;
import com.hansung.web.config.FileStorageConfig;


@SpringBootApplication
@EntityScan(basePackageClasses = {DemoApplication.class, Jsr310JpaConverters.class})
@EnableConfigurationProperties({
	EventImageConfig.class, FileStorageConfig.class
})
public class DemoApplication {
	@PostConstruct
	void init(){
		TimeZone.setDefault(TimeZone.getTimeZone("Asia/Seoul"));
	}
	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

}
