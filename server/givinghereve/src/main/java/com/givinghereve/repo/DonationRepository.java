package com.givinghereve.repo;

import com.givinghereve.model.Donation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

public interface DonationRepository extends JpaRepository<Donation, Long> {

    @Query("select coalesce(sum(d.amount),0) from Donation d")
    BigDecimal sumAllAmounts();

    @Query("select coalesce(sum(d.amount),0) from Donation d where d.createdAt between :start and :end")
    BigDecimal sumBetween(@Param("start") OffsetDateTime start, @Param("end") OffsetDateTime end);

    @Query("select function('date', d.createdAt) as day, coalesce(sum(d.amount),0) as total from Donation d where d.createdAt between :start and :end group by function('date', d.createdAt) order by day")
    List<Object[]> dailyTotals(@Param("start") OffsetDateTime start, @Param("end") OffsetDateTime end);
}


