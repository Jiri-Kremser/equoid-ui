package io.radanalytics.equoid.repository;

import io.radanalytics.equoid.domain.Handler;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the Handler entity.
 */
@SuppressWarnings("unused")
@Repository
public interface HandlerRepository extends JpaRepository<Handler, Long> {

}
