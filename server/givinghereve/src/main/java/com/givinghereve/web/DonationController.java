package com.givinghereve.web;

import com.givinghereve.model.Donation;
import com.givinghereve.service.DonationReportService;
import com.givinghereve.service.DonationService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.lowagie.text.DocumentException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/donations")
public class DonationController {
    private final DonationService donationService;
    private final DonationReportService donationReportService;

    public DonationController(DonationService donationService, DonationReportService donationReportService) {
        this.donationService = donationService;
        this.donationReportService = donationReportService;
    }

    @PostMapping
    public ResponseEntity<Donation> create(@RequestBody Donation donation) {
        return ResponseEntity.ok(donationService.create(donation));
    }

    @GetMapping
    public ResponseEntity<List<Donation>> listAll() {
        return ResponseEntity.ok(donationService.findAll());
    }

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> analytics(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime end
    ) {
        return ResponseEntity.ok(donationService.analytics(start, end));
    }

    @GetMapping("/by-source")
    public ResponseEntity<List<Map<String, Object>>> totalsBySource() {
        return ResponseEntity.ok(donationService.totalsBySource());
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> export(@RequestParam(defaultValue = "csv") String format) throws DocumentException, java.io.IOException {
        String lower = format.toLowerCase();
        byte[] bytes;
        String filename;
        MediaType mediaType;

        switch (lower) {
            case "xlsx" -> {
                bytes = donationReportService.exportExcel();
                filename = "donations-report.xlsx";
                mediaType = MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            }
            case "pdf" -> {
                bytes = donationReportService.exportPdf();
                filename = "donations-report.pdf";
                mediaType = MediaType.APPLICATION_PDF;
            }
            case "csv" -> {
                bytes = donationReportService.exportCsv();
                filename = "donations-report.csv";
                mediaType = MediaType.TEXT_PLAIN;
            }
            default -> throw new IllegalArgumentException("Invalid format: " + lower);

        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(mediaType)
                .body(bytes);
    }
}


