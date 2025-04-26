package com.example.web_restaurant.configuration;

import com.example.web_restaurant.constant.PredefinedRole;
import com.example.web_restaurant.entity.Role;
import com.example.web_restaurant.entity.User;
import com.example.web_restaurant.repository.RoleRepository;
import com.example.web_restaurant.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;

@Configuration
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ApplicationInitConfig {

    PasswordEncoder passwordEncoder;

    @NonFinal
    static final String ADMIN_USER_NAME = "admin";

    @NonFinal
    static final String ADMIN_PASSWORD = "admin";

    @Bean
    @ConditionalOnProperty(
            prefix = "spring",
            value = "datasource.driverClassName",
            havingValue = "com.mysql.cj.jdbc.Driver")
    ApplicationRunner applicationRunner(UserRepository userRepository, RoleRepository roleRepository){
        log.info("Initializing application ....");
        return args -> {
            if (userRepository.findByUsername(ADMIN_USER_NAME).isEmpty()){
                roleRepository.save(Role.builder()
                        .roleName(PredefinedRole.EMPLOYEE_ROLE)
                        .description("Employee role")
                        .build());

                Role adminRole = roleRepository.save(Role.builder()
                        .roleName(PredefinedRole.ADMIN_ROLE)
                        .description("Admin role")
                        .build());

                var roles = new HashSet<Role>();
                roles.add(adminRole);

                User user = User.builder()
                        .username(ADMIN_USER_NAME)
                        .password(passwordEncoder.encode(ADMIN_PASSWORD))
                        .roles(roles)
                        .build();

                user = userRepository.save(user);


                log.warn("admin user has been created with username: admin and password: admin");

            }
            log.info("Application initialization completed");
        };
    }
}
