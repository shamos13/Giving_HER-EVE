package com.givinghereve.service;

import com.givinghereve.model.Donation;
import com.givinghereve.repo.DonationRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.*;

@Service
public class DonationService {
    private final DonationRepository donationRepository;

    public DonationService(DonationRepository donationRepository) {
        this.donationRepository = donationRepository;
    }

    public Donation create(Donation donation) {
        if (donation.getCreatedAt() == null) {
            donation.setCreatedAt(OffsetDateTime.now());
        }
        return donationRepository.save(donation);
    }

    public List<Donation> findAll() {
        return donationRepository.findAll();
    }

    public Map<String, Object> analytics(OffsetDateTime start, OffsetDateTime end) {
        Map<String, Object> result = new HashMap<>();
        BigDecimal total = donationRepository.sumAllAmounts();
        long count = donationRepository.count();
        BigDecimal periodTotal = donationRepository.sumBetween(start, end);
        List<Object[]> daily = (start != null && end != null)
                ? donationRepository.dailyTotals(start, end)
                : Collections.emptyList();

        result.put("totalAmount", total);
        result.put("totalCount", count);
        result.put("periodAmount", periodTotal);

        // Convert daily rows to array of objects {date,total}
        result.put("daily", daily.stream().map(row -> {
            Map<String, Object> m = new HashMap<>();
            m.put("date", row[0]);
            m.put("total", row[1]);
            return m;
        }).toList());
        return result;
    }

    public List<Map<String, Object>> totalsBySource() {
        List<Object[]> rows = donationRepository.totalsBySource();
        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] row : rows) {
            Map<String, Object> m = new HashMap<>();
            m.put("source", row[0]);
            m.put("total", row[1]);
            result.add(m);
        }
        return result;
    }
}


