package com.givinghereve.config;

import com.givinghereve.model.Donation;
import com.givinghereve.repo.DonationRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.Random;

@Configuration
public class DataSeeder {
    @Bean
    CommandLineRunner seedDonations(DonationRepository repo) {
        return args -> {
            if (repo.count() > 0) return;
            Random rnd = new Random(42);
            OffsetDateTime now = OffsetDateTime.now();
            for (int i = 0; i < 30; i++) {
                Donation d = new Donation();
                d.setAmount(BigDecimal.valueOf(10 + rnd.nextInt(90)));
                d.setCurrency("USD");
                d.setDonorName("Donor " + (i + 1));
                d.setDonorEmail("donor" + (i + 1) + "@example.com");
                d.setSource("web");
                d.setCreatedAt(now.minusDays(29 - i));
                repo.save(d);
            }
        };
    }
}


