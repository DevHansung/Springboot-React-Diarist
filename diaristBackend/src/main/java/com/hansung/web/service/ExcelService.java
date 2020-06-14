package com.hansung.web.service;

import java.io.ByteArrayOutputStream;
import java.util.List;

import org.apache.poi.hssf.util.HSSFColor.HSSFColorPredefined;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import com.hansung.web.vo.EventApply;

@Service
public class ExcelService {
	public ByteArrayOutputStream createExcelByEventApply(List<EventApply> list) throws Exception {
		ByteArrayOutputStream os = new ByteArrayOutputStream();
		try {
			// 워크북 생성
			XSSFWorkbook wb = new XSSFWorkbook();
			XSSFSheet sheet = wb.createSheet("mySheet");
			XSSFRow row = null;
			XSSFCell cell = null;
			int rowNo = 0;

			// 테이블 헤더 스타일
			CellStyle headStyle = wb.createCellStyle();

			// 가는 경계선
			headStyle.setBorderTop(BorderStyle.THIN);
			headStyle.setBorderBottom(BorderStyle.THIN);
			headStyle.setBorderLeft(BorderStyle.THIN);
			headStyle.setBorderRight(BorderStyle.THIN);

			// 헤더 배경색
			headStyle.setFillForegroundColor(HSSFColorPredefined.YELLOW.getIndex());
			headStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

			// 데이터 가운데 정렬
			headStyle.setAlignment(HorizontalAlignment.CENTER);

			// 데이터용 경계 스타일 테두리 지정
			CellStyle bodyStyle = wb.createCellStyle();
			bodyStyle.setBorderTop(BorderStyle.THIN);
			bodyStyle.setBorderBottom(BorderStyle.THIN);
			bodyStyle.setBorderLeft(BorderStyle.THIN);
			bodyStyle.setBorderRight(BorderStyle.THIN);

			// 테이블 헤더
			row = sheet.createRow(rowNo++);
			cell = row.createCell(0);
			cell.setCellStyle(headStyle);
			cell.setCellValue("접수번호");
			cell = row.createCell(1);
			cell.setCellStyle(headStyle);
			cell.setCellValue("이름");
			cell = row.createCell(2);
			cell.setCellStyle(headStyle);
			cell.setCellValue("연락처");
			cell = row.createCell(3);
			cell.setCellStyle(headStyle);
			cell.setCellValue("Email");
			cell = row.createCell(4);
			cell.setCellStyle(headStyle);
			cell.setCellValue("주소");

			// 데이터 들어가는 부분
			for (EventApply eventApply : list) {
				row = sheet.createRow(rowNo++);
				cell = row.createCell(0);
				cell.setCellStyle(bodyStyle);
				cell.setCellValue(eventApply.getEaid());
				cell = row.createCell(1);
				cell.setCellStyle(bodyStyle);
				cell.setCellValue(eventApply.getName());
				cell = row.createCell(2);
				cell.setCellStyle(bodyStyle);
				cell.setCellValue(eventApply.getPhone());
				cell = row.createCell(3);
				cell.setCellStyle(bodyStyle);
				cell.setCellValue(eventApply.getEmail());
				cell = row.createCell(4);
				cell.setCellStyle(bodyStyle);
				cell.setCellValue(eventApply.getAddress());
			}
			wb.write(os);
			os.close();
			System.out.println(os.toByteArray());
			return os;
		} catch (Exception e) {
			throw new Exception(e.getMessage());
		} finally {
			if (os != null) {
				os.close();
			}
			if (os != null) {
				os.close();
			}
		}
	}
}