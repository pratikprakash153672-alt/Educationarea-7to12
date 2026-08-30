# Security Specification & Threat Model

## 1. Data Invariants
1. **User Identity & Boundary**: A student can only access, create, read, and mutate their own profile and records (`userId == request.auth.uid`). No student can read or update another student's profile or learning stats.
2. **Subcollection Relational Guard (Master Gate)**: All `classRecords` and `testLogs` reside as subcollections of `/users/{userId}`. Creation requires that the parent user document exists and that the user owns the parent resource.
3. **Field Immutability**: Critical identifiers (`userId`, `classId`, `id`) and creation timestamps (`createdAt`) cannot be modified after initial write.
4. **Temporal Server Validation**: All write operations require server timestamps (`request.time`) for `createdAt` and `updatedAt`. Client-skewed timestamps are rejected.
5. **Type & Bounds Integrity**: Accuracy, test scores, class grade levels (7-12), and streak counters are bounded by strict numeric intervals. Document IDs and string fields are strictly length-capped and regex-guarded.

## 2. The Dirty Dozen Payloads (Adversarial Security Test Cases)

1. **Spoofed User Creation (Ghost Identity)**:
   Attempting to create a user profile with `userId: "attacker_id"` while authenticated as `victim_id`.
   *Expected*: PERMISSION_DENIED (Violates `incoming().userId == request.auth.uid`).

2. **Shadow Field Injection**:
   Attempting to insert a shadow field `isAdmin: true` or `bypassed: true` into `/users/{userId}`.
   *Expected*: PERMISSION_DENIED (Violates exact keys length and schema check).

3. **Client-Forced Timestamp Manipulation**:
   Attempting to create a test log with past or future `createdAt: "2020-01-01T00:00:00Z"` instead of `request.time`.
   *Expected*: PERMISSION_DENIED (Violates `incoming().createdAt == request.time`).

4. **Cross-Tenant Test Log Insertion**:
   Authenticated User A attempts to write a test log directly into User B's `/users/{userB}/testLogs/log123`.
   *Expected*: PERMISSION_DENIED (Violates `isOwner(userId)`).

5. **Cross-Tenant Assessment Reading (PII/Score Leak)**:
   Authenticated User A attempts to query or read `/users/{userB}/testLogs`.
   *Expected*: PERMISSION_DENIED (Violates `isOwner(userId)`).

6. **Out-of-Bounds Grade Level Manipulation**:
   Attempting to set `classLevel: 15` or `currentClass: 4` to corrupt curricular routing.
   *Expected*: PERMISSION_DENIED (Violates `currentClass >= 7 && currentClass <= 12`).

7. **Negative Score / Overflow Attack**:
   Submitting a test result with `score: -5` or `percent: 99999`.
   *Expected*: PERMISSION_DENIED (Violates score boundary bounds `0 <= score <= 10` and `0 <= percent <= 100`).

8. **ID Poisoning / Denial-of-Wallet Attack**:
   Attempting to create a document with a 50KB corrupted path ID containing invalid characters or scripts.
   *Expected*: PERMISSION_DENIED (Violates `isValidId()` regex and length cap of 128 chars).

9. **Orphaned Class Record Write**:
   Writing to `/users/{userId}/classRecords/class_7` when the parent `/users/{userId}` document does not exist.
   *Expected*: PERMISSION_DENIED (Violates `exists(/databases/$(database)/documents/users/$(userId))`).

10. **Immutable Field Tampering on Update**:
    Attempting an update on a user record that modifies `createdAt` or changes `userId`.
    *Expected*: PERMISSION_DENIED (Violates `incoming().userId == existing().userId` and `incoming().createdAt == existing().createdAt`).

11. **Unauthenticated Access to Academic History**:
    Unauthenticated guest attempts to read `/users/{userId}/classRecords`.
    *Expected*: PERMISSION_DENIED (Violates `isSignedIn()`).

12. **Broad Unscoped Listing**:
    Authenticated user attempts to execute a collection group query or blanket read on all `/users`.
    *Expected*: PERMISSION_DENIED (Global default deny + no root user listing rule).
