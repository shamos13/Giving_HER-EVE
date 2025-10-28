package com.givinghereve.service;

import com.givinghereve.model.Donation;
import com.givinghereve.repo.DonationRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    public Map<String, Object> analytics(OffsetDateTime start, OffsetDateTime end) {
        Map<String, Object> result = new HashMap<>();
        BigDecimal total = donationRepository.sumAllAmounts();
        long count = donationRepository.count();
        BigDecimal periodTotal = donationRepository.sumBetween(start, end);
        List<Object[]> daily = donationRepository.dailyTotals(start, end);

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
}


