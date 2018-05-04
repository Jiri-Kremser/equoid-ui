package io.radanalytics.equoid.domain;


import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.Objects;

/**
 * A Handler.
 */
@Entity
@Table(name = "handler")
public class Handler implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Min(value = 0)
    @Column(name = "seconds", nullable = false)
    private Integer seconds;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getSeconds() {
        return seconds;
    }

    public Handler seconds(Integer seconds) {
        this.seconds = seconds;
        return this;
    }

    public void setSeconds(Integer seconds) {
        this.seconds = seconds;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Handler handler = (Handler) o;
        if (handler.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), handler.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Handler{" +
            "id=" + getId() +
            ", seconds=" + getSeconds() +
            "}";
    }
}
