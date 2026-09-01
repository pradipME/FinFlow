package com.finflow.modules.profiles.domain;

import com.finflow.shared.domain.BaseAuditableEntity;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "user_profiles", schema = "finflow_profiles")
@EntityListeners({com.finflow.shared.domain.BaseEntityListener.class, org.springframework.data.jpa.domain.support.AuditingEntityListener.class})
public class UserProfile extends BaseAuditableEntity {

    @Column(name = "user_id", nullable = false, unique = true, length = 36)
    private String userId;

    @Column(name = "first_name", length = 100)
    private String firstName;

    @Column(name = "last_name", length = 100)
    private String lastName;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "address_line1", length = 255)
    private String addressLine1;

    @Column(name = "address_line2", length = 255)
    private String addressLine2;

    @Column(name = "city", length = 100)
    private String city;

    @Column(name = "state", length = 100)
    private String state;

    @Column(name = "postal_code", length = 20)
    private String postalCode;

    @Column(name = "country", length = 2)
    private String country;

    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;

    protected UserProfile() {}

    public UserProfile(String userId) {
        this.userId = userId;
    }

    public String getUserId() { return userId; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public String getAddressLine1() { return addressLine1; }
    public String getAddressLine2() { return addressLine2; }
    public String getCity() { return city; }
    public String getState() { return state; }
    public String getPostalCode() { return postalCode; }
    public String getCountry() { return country; }
    public String getAvatarUrl() { return avatarUrl; }

    public void setFirstName(String firstName) { this.firstName = firstName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    public void setAddressLine1(String addressLine1) { this.addressLine1 = addressLine1; }
    public void setAddressLine2(String addressLine2) { this.addressLine2 = addressLine2; }
    public void setCity(String city) { this.city = city; }
    public void setState(String state) { this.state = state; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }
    public void setCountry(String country) { this.country = country; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public void updateFrom(UpdateProfileData data) {
        if (data.firstName() != null) this.firstName = data.firstName();
        if (data.lastName() != null) this.lastName = data.lastName();
        if (data.dateOfBirth() != null) this.dateOfBirth = data.dateOfBirth();
        if (data.addressLine1() != null) this.addressLine1 = data.addressLine1();
        if (data.addressLine2() != null) this.addressLine2 = data.addressLine2();
        if (data.city() != null) this.city = data.city();
        if (data.state() != null) this.state = data.state();
        if (data.postalCode() != null) this.postalCode = data.postalCode();
        if (data.country() != null) this.country = data.country();
        if (data.avatarUrl() != null) this.avatarUrl = data.avatarUrl();
    }

    public record UpdateProfileData(
            String firstName,
            String lastName,
            LocalDate dateOfBirth,
            String addressLine1,
            String addressLine2,
            String city,
            String state,
            String postalCode,
            String country,
            String avatarUrl
    ) {}
}
