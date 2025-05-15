package com.example.web_restaurant.service;

import com.example.web_restaurant.dto.request.AuthenticationRequest;
import com.example.web_restaurant.dto.request.IntrospectRequest;
import com.example.web_restaurant.dto.request.LogoutRequest;
import com.example.web_restaurant.dto.request.RefreshRequest;
import com.example.web_restaurant.dto.response.AuthenticationResponse;
import com.example.web_restaurant.dto.response.IntrospectResponse;
import com.example.web_restaurant.entity.InvalidatedToken;
import com.example.web_restaurant.entity.Role;
import com.example.web_restaurant.entity.User;
import com.example.web_restaurant.exception.AppException;
import com.example.web_restaurant.exception.ErrorCode;
import com.example.web_restaurant.repository.InvalidatedRepository;
import com.example.web_restaurant.repository.UserRepository;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationContextException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.StringJoiner;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationService {
    UserRepository userRepository;
    InvalidatedRepository invalidatedRepository;

    @NonFinal
    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;

    @NonFinal
    @Value("${jwt.valid-duration}")
    protected long VALID_DURATION;

    @NonFinal
    @Value("${jwt.refreshable-duration}")
    protected long REFRESHABLE_DURATION;


    public IntrospectResponse introspect(IntrospectRequest request){
        if (request == null || request.getToken() == null || request.getToken().trim().isEmpty()) {
            return IntrospectResponse.builder().valid(false).build();
        }

        boolean isValid = true;

        try {
            validateTokenNotEmpty(request.getToken(), "Token Introspection");
            verifyToken(request.getToken(), false);
        } catch (AppException | JOSEException | ParseException e) {
            isValid = false;
        }
        return IntrospectResponse.builder().valid(isValid).build();
    }

    @Transactional
    public AuthenticationResponse authenticate(AuthenticationRequest request){
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        var user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.USER_EXISTED));

        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPassword());
        if(!authenticated) throw new AppException(ErrorCode.UNAUTHORIZED);
        var token = generateToken(user);
        return AuthenticationResponse.builder().token(token).authenticated(true).build();
    }

    private SignedJWT verifyToken(String token, boolean isRefresh) throws JOSEException, ParseException{
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes())
;
        SignedJWT signedJWT = SignedJWT.parse(token);

        Date expiryTime = (isRefresh)
                ? new Date(signedJWT
                .getJWTClaimsSet()
                .getIssueTime()
                .toInstant()
                .plus(REFRESHABLE_DURATION, ChronoUnit.SECONDS)
                .toEpochMilli())
                : signedJWT.getJWTClaimsSet().getExpirationTime();

        var verified = signedJWT.verify(verifier);

        if(!(verified && expiryTime.after(new Date()))) throw new AppException(ErrorCode.UNAUTHORIZED);

        if(invalidatedRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID())){
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        return signedJWT;
    }

    public void logout(LogoutRequest request) throws ParseException, JOSEException {
        if (request == null || request.getToken() == null || request.getToken().trim().isEmpty()) {
            log.info("Logout attempted with null or empty token");
            return;
        }

        try {
            var signToken = verifyToken(request.getToken(), true);
            String jit = signToken.getJWTClaimsSet().getJWTID();
            Date expiryTime = signToken.getJWTClaimsSet().getExpirationTime();
            invalidateToken(jit, expiryTime);
        } catch (AppException exception) {
            log.info("Token already expired");
        }
    }



    private String generateToken(User user){
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        Date now = new Date();
        Date expiration = new Date(Instant.now().plus(VALID_DURATION, ChronoUnit.SECONDS).toEpochMilli());

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getUsername())
                .issuer("webrestaurant.com")
                .issueTime(now)
                .expirationTime(expiration)
                .jwtID(UUID.randomUUID().toString())
                .claim("scope", buildScope(user))
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(header, payload);

        try{
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        }catch (JOSEException e){
            log.error("Cannot create token", e);
            throw new ApplicationContextException(e.getMessage());
        }
    }

    private String buildScope(User user){
        StringJoiner stringJoiner = new StringJoiner(" ");

        if (!CollectionUtils.isEmpty(user.getRoles())){
            for (Role role : user.getRoles()) {
                stringJoiner.add("ROLE_" + role.getRoleName());
                if (!CollectionUtils.isEmpty(role.getPermissions())) {
                    role.getPermissions().forEach(permission -> stringJoiner.add(permission.getPermissionName()));
                }
            }
        }
        return stringJoiner.toString();
    }

    public AuthenticationResponse refresh(RefreshRequest request) throws ParseException, JOSEException {
        if (request == null || request.getToken() == null || request.getToken().trim().isEmpty()) {
            log.info("Refresh attempted with null or empty token");
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        var signedJWT = verifyToken(request.getToken(), true);
        var jit = signedJWT.getJWTClaimsSet().getJWTID();
        var expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();

        invalidateToken(jit, expiryTime);

        var username = signedJWT.getJWTClaimsSet().getSubject();
        var user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));
        var token = generateToken(user);

        return AuthenticationResponse.builder()
                .token(token)
                .authenticated(true)
                .build();
    }

    private void validateTokenNotEmpty(String token, String methodName) {
        if (token == null || token.trim().isEmpty()) {
            log.info("{} attempted with null or empty token", methodName);
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
    }

    private void invalidateToken(String jit, Date expiryTime) {
        // First check if token already exists
        if (!invalidatedRepository.existsById(jit)) {
            try {
                InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                        .id(jit)
                        .expiryTime(expiryTime)
                        .build();
                invalidatedRepository.save(invalidatedToken);
                log.debug("Token {} invalidated successfully", jit);
            } catch (org.springframework.orm.ObjectOptimisticLockingFailureException e) {
                // Another thread already invalidated this token
                log.info("Token {} was already invalidated by another transaction", jit);
            }
        } else {
            log.info("Token {} already exists in invalidated tokens", jit);
        }
    }

}
