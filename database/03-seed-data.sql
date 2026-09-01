USE QLNT_TKYC;
GO

SET XACT_ABORT ON;
BEGIN TRANSACTION;

-- =========================================================
-- 1. STUDENT
-- =========================================================

INSERT INTO dbo.STUDENT
(
    student_code,
    full_name,
    date_of_birth,
    gender,
    email,
    phone,
    faculty,
    class_name,
    academic_status,
    sis_updated_at,
    created_at,
    updated_at
)
VALUES
('SV001', N'Nguyễn Văn An', '2005-03-15', 'MALE',
 'an.nguyen@student.edu.vn', '0901000001',
 N'Công nghệ thông tin', 'CNTT01', 'ACTIVE',
 GETDATE(), GETDATE(), GETDATE()),

('SV002', N'Trần Thị Bình', '2005-07-20', 'FEMALE',
 'binh.tran@student.edu.vn', '0901000002',
 N'Kinh tế', 'KT01', 'ACTIVE',
 GETDATE(), GETDATE(), GETDATE()),

('SV003', N'Lê Minh Châu', '2004-11-10', 'OTHER',
 'chau.le@student.edu.vn', '0901000003',
 N'Kỹ thuật', 'KTMT01', 'ACTIVE',
 GETDATE(), GETDATE(), GETDATE()),

('SV004', N'Phạm Quốc Dũng', '2005-01-25', 'MALE',
 'dung.pham@student.edu.vn', '0901000004',
 N'Công nghệ thông tin', 'CNTT02', 'ACTIVE',
 GETDATE(), GETDATE(), GETDATE()),

('SV005', N'Hoàng Ngọc Mai', '2005-09-05', 'FEMALE',
 'mai.hoang@student.edu.vn', '0901000005',
 N'Ngoại ngữ', 'NN01', 'ACTIVE',
 GETDATE(), GETDATE(), GETDATE());


-- =========================================================
-- 2. ROLE
-- =========================================================

INSERT INTO dbo.ROLE
(
    role_code,
    role_name,
    description,
    status
)
VALUES
('STUDENT', N'Sinh viên', N'Người dùng là sinh viên', 'ACTIVE'),
('OFFICER', N'Cán bộ', N'Cán bộ quản lý sinh viên ngoại trú', 'ACTIVE'),
('ADMIN', N'Quản trị viên', N'Quản trị toàn hệ thống', 'ACTIVE'),
('REVIEWER', N'Người xét duyệt', N'Người xử lý và xét duyệt hồ sơ', 'ACTIVE');


-- =========================================================
-- 3. PERMISSION
-- =========================================================

INSERT INTO dbo.PERMISSION
(
    permission_code,
    permission_name,
    description
)
VALUES
('REGISTRATION_VIEW', N'Xem đăng ký', N'Xem hồ sơ đăng ký ngoại trú'),
('REGISTRATION_CREATE', N'Tạo đăng ký', N'Tạo hồ sơ đăng ký ngoại trú'),
('REGISTRATION_APPROVE', N'Xét duyệt đăng ký', N'Phê duyệt hoặc từ chối đăng ký'),
('REQUEST_CREATE', N'Tạo yêu cầu', N'Tạo yêu cầu thay đổi thông tin'),
('REQUEST_PROCESS', N'Xử lý yêu cầu', N'Xử lý các yêu cầu của sinh viên'),
('DOCUMENT_MANAGE', N'Quản lý tài liệu', N'Quản lý tài liệu hồ sơ'),
('USER_MANAGE', N'Quản lý người dùng', N'Quản lý tài khoản người dùng'),
('SYSTEM_CONFIG', N'Cấu hình hệ thống', N'Quản lý cấu hình hệ thống');


-- =========================================================
-- 4. USER
-- =========================================================

INSERT INTO dbo.[USER]
(
    username,
    password_hash,
    full_name,
    email,
    phone,
    status,
    last_login_at,
    created_at,
    updated_at
)
VALUES
('student01', 'HASH_STUDENT_01',
 N'Nguyễn Văn An',
 'an.nguyen@student.edu.vn',
 '0901000001',
 'ACTIVE',
 NULL,
 GETDATE(),
 GETDATE()),

('student02', 'HASH_STUDENT_02',
 N'Trần Thị Bình',
 'binh.tran@student.edu.vn',
 '0901000002',
 'ACTIVE',
 NULL,
 GETDATE(),
 GETDATE()),

('officer01', 'HASH_OFFICER_01',
 N'Nguyễn Văn Cán Bộ',
 'officer01@university.edu.vn',
 '0902000001',
 'ACTIVE',
 NULL,
 GETDATE(),
 GETDATE()),

('reviewer01', 'HASH_REVIEWER_01',
 N'Trần Văn Xét Duyệt',
 'reviewer01@university.edu.vn',
 '0902000002',
 'ACTIVE',
 NULL,
 GETDATE(),
 GETDATE()),

('admin', 'HASH_ADMIN_01',
 N'Quản trị hệ thống',
 'admin@university.edu.vn',
 '0902000003',
 'ACTIVE',
 NULL,
 GETDATE(),
 GETDATE());


-- =========================================================
-- 5. USER_ROLE
-- =========================================================

INSERT INTO dbo.USER_ROLE
(
    user_id,
    role_id,
    assigned_at,
    assigned_by
)
SELECT
    u.user_id,
    r.role_id,
    GETDATE(),
    NULL
FROM dbo.[USER] u
JOIN dbo.ROLE r
    ON
    (u.username IN ('student01','student02') AND r.role_code = 'STUDENT')
    OR
    (u.username = 'officer01' AND r.role_code = 'OFFICER')
    OR
    (u.username = 'reviewer01' AND r.role_code = 'REVIEWER')
    OR
    (u.username = 'admin' AND r.role_code = 'ADMIN');


-- =========================================================
-- 6. ROLE_PERMISSION
-- =========================================================

-- Sinh viên
INSERT INTO dbo.ROLE_PERMISSION
(
    role_id,
    permission_id,
    granted_at,
    granted_by
)
SELECT
    r.role_id,
    p.permission_id,
    GETDATE(),
    NULL
FROM dbo.ROLE r
CROSS JOIN dbo.PERMISSION p
WHERE r.role_code = 'STUDENT'
AND p.permission_code IN
(
    'REGISTRATION_VIEW',
    'REGISTRATION_CREATE',
    'REQUEST_CREATE'
);


-- Cán bộ
INSERT INTO dbo.ROLE_PERMISSION
(
    role_id,
    permission_id,
    granted_at,
    granted_by
)
SELECT
    r.role_id,
    p.permission_id,
    GETDATE(),
    NULL
FROM dbo.ROLE r
CROSS JOIN dbo.PERMISSION p
WHERE r.role_code = 'OFFICER'
AND p.permission_code IN
(
    'REGISTRATION_VIEW',
    'REGISTRATION_APPROVE',
    'REQUEST_PROCESS',
    'DOCUMENT_MANAGE'
);


-- Người xét duyệt
INSERT INTO dbo.ROLE_PERMISSION
(
    role_id,
    permission_id,
    granted_at,
    granted_by
)
SELECT
    r.role_id,
    p.permission_id,
    GETDATE(),
    NULL
FROM dbo.ROLE r
CROSS JOIN dbo.PERMISSION p
WHERE r.role_code = 'REVIEWER'
AND p.permission_code IN
(
    'REGISTRATION_VIEW',
    'REGISTRATION_APPROVE',
    'REQUEST_PROCESS'
);


-- Admin
INSERT INTO dbo.ROLE_PERMISSION
(
    role_id,
    permission_id,
    granted_at,
    granted_by
)
SELECT
    r.role_id,
    p.permission_id,
    GETDATE(),
    NULL
FROM dbo.ROLE r
CROSS JOIN dbo.PERMISSION p
WHERE r.role_code = 'ADMIN';


-- =========================================================
-- 7. LANDLORD
-- =========================================================

INSERT INTO dbo.LANDLORD
(
    full_name,
    phone,
    identity_number,
    email,
    note,
    created_at,
    updated_at
)
VALUES
(N'Nguyễn Văn Hùng', '0911000001', '001100000001',
 'hung.landlord@gmail.com',
 N'Chủ nhà trọ khu vực Quận 10',
 GETDATE(), GETDATE()),

(N'Trần Thị Lan', '0911000002', '001100000002',
 'lan.landlord@gmail.com',
 N'Chủ nhà trọ gần trường',
 GETDATE(), GETDATE()),

(N'Lê Văn Thành', '0911000003', '001100000003',
 'thanh.landlord@gmail.com',
 N'Nhà trọ sinh viên',
 GETDATE(), GETDATE());


-- =========================================================
-- 8. REGISTRATION
-- =========================================================

INSERT INTO dbo.REGISTRATION
(
    student_id,
    registration_code,
    status,
    submitted_at,
    approved_at,
    rejected_at,
    rejection_reason,
    start_date,
    expiry_date,
    terminated_at,
    created_at,
    updated_at
)
SELECT
    s.student_id,
    'REG001',
    'APPROVED',
    DATEADD(DAY, -20, GETDATE()),
    DATEADD(DAY, -18, GETDATE()),
    NULL,
    NULL,
    '2026-08-01',
    '2027-07-31',
    NULL,
    GETDATE(),
    GETDATE()
FROM dbo.STUDENT s
WHERE s.student_code = 'SV001';

INSERT INTO dbo.REGISTRATION
(
    student_id,
    registration_code,
    status,
    submitted_at,
    approved_at,
    rejected_at,
    rejection_reason,
    start_date,
    expiry_date,
    terminated_at,
    created_at,
    updated_at
)
SELECT
    s.student_id,
    'REG002',
    'UNDER_REVIEW',
    DATEADD(DAY, -5, GETDATE()),
    NULL,
    NULL,
    NULL,
    '2026-08-15',
    '2027-08-14',
    NULL,
    GETDATE(),
    GETDATE()
FROM dbo.STUDENT s
WHERE s.student_code = 'SV002';

INSERT INTO dbo.REGISTRATION
(
    student_id,
    registration_code,
    status,
    submitted_at,
    approved_at,
    rejected_at,
    rejection_reason,
    start_date,
    expiry_date,
    terminated_at,
    created_at,
    updated_at
)
SELECT
    s.student_id,
    'REG003',
    'SUBMITTED',
    GETDATE(),
    NULL,
    NULL,
    NULL,
    '2026-09-01',
    '2027-08-31',
    NULL,
    GETDATE(),
    GETDATE()
FROM dbo.STUDENT s
WHERE s.student_code = 'SV003';

INSERT INTO dbo.REGISTRATION
(
    student_id,
    registration_code,
    status,
    submitted_at,
    approved_at,
    rejected_at,
    rejection_reason,
    start_date,
    expiry_date,
    terminated_at,
    created_at,
    updated_at
)
SELECT
    s.student_id,
    'REG004',
    'APPROVED',
    DATEADD(DAY, -30, GETDATE()),
    DATEADD(DAY, -28, GETDATE()),
    NULL,
    NULL,
    '2026-07-01',
    '2027-06-30',
    NULL,
    GETDATE(),
    GETDATE()
FROM dbo.STUDENT s
WHERE s.student_code = 'SV004';


-- =========================================================
-- 9. ADDRESS
-- =========================================================

INSERT INTO dbo.ADDRESS
(
    registration_id,
    landlord_id,
    address_line,
    ward,
    district,
    province,
    address_type,
    start_date,
    end_date,
    status,
    created_at,
    updated_at
)
SELECT
    r.registration_id,
    l.landlord_id,
    N'123 Đường 3/2',
    N'Phường 10',
    N'Quận 10',
    N'TP. Hồ Chí Minh',
    'RENTED',
    '2026-08-01',
    '2027-07-31',
    'CURRENT',
    GETDATE(),
    GETDATE()
FROM dbo.REGISTRATION r
JOIN dbo.LANDLORD l
    ON l.identity_number = '001100000001'
WHERE r.registration_code = 'REG001';


INSERT INTO dbo.ADDRESS
(
    registration_id,
    landlord_id,
    address_line,
    ward,
    district,
    province,
    address_type,
    start_date,
    end_date,
    status,
    created_at,
    updated_at
)
SELECT
    r.registration_id,
    l.landlord_id,
    N'45 Đường Nguyễn Tri Phương',
    N'Phường 5',
    N'Quận 10',
    N'TP. Hồ Chí Minh',
    'RENTED',
    '2026-08-15',
    '2027-08-14',
    'CURRENT',
    GETDATE(),
    GETDATE()
FROM dbo.REGISTRATION r
JOIN dbo.LANDLORD l
    ON l.identity_number = '001100000002'
WHERE r.registration_code = 'REG002';


INSERT INTO dbo.ADDRESS
(
    registration_id,
    landlord_id,
    address_line,
    ward,
    district,
    province,
    address_type,
    start_date,
    end_date,
    status,
    created_at,
    updated_at
)
SELECT
    r.registration_id,
    l.landlord_id,
    N'78 Đường Lý Thường Kiệt',
    N'Phường 14',
    N'Quận 10',
    N'TP. Hồ Chí Minh',
    'RENTED',
    '2026-09-01',
    '2027-08-31',
    'CURRENT',
    GETDATE(),
    GETDATE()
FROM dbo.REGISTRATION r
JOIN dbo.LANDLORD l
    ON l.identity_number = '001100000003'
WHERE r.registration_code = 'REG003';


-- =========================================================
-- 10. REQUEST
-- =========================================================

INSERT INTO dbo.REQUEST
(
    registration_id,
    created_by,
    processed_by,
    request_code,
    request_type,
    status,
    reason,
    submitted_at,
    processed_at,
    approved_at,
    rejected_at,
    rejection_reason,
    created_at,
    updated_at
)
SELECT
    r.registration_id,
    u1.user_id,
    u2.user_id,
    'REQ001',
    'RENEW',
    'APPROVED',
    N'Gia hạn đăng ký ngoại trú',
    DATEADD(DAY, -10, GETDATE()),
    DATEADD(DAY, -8, GETDATE()),
    DATEADD(DAY, -7, GETDATE()),
    NULL,
    NULL,
    GETDATE(),
    GETDATE()
FROM dbo.REGISTRATION r
JOIN dbo.[USER] u1
    ON u1.username = 'student01'
JOIN dbo.[USER] u2
    ON u2.username = 'officer01'
WHERE r.registration_code = 'REG001';


INSERT INTO dbo.REQUEST
(
    registration_id,
    created_by,
    processed_by,
    request_code,
    request_type,
    status,
    reason,
    submitted_at,
    processed_at,
    approved_at,
    rejected_at,
    rejection_reason,
    created_at,
    updated_at
)
SELECT
    r.registration_id,
    u.user_id,
    NULL,
    'REQ002',
    'CHANGE_ADDRESS',
    'SUBMITTED',
    N'Yêu cầu thay đổi địa chỉ ngoại trú',
    GETDATE(),
    NULL,
    NULL,
    NULL,
    NULL,
    GETDATE(),
    GETDATE()
FROM dbo.REGISTRATION r
JOIN dbo.[USER] u
    ON u.username = 'student02'
WHERE r.registration_code = 'REG002';


-- =========================================================
-- 11. APPROVAL
-- =========================================================

INSERT INTO dbo.APPROVAL
(
    registration_id,
    request_id,
    approver_id,
    approval_type,
    decision,
    reason,
    decided_at
)
SELECT
    NULL,
    req.request_id,
    u.user_id,
    'REQUEST',
    'APPROVED',
    N'Yêu cầu hợp lệ',
    DATEADD(DAY, -7, GETDATE())
FROM dbo.REQUEST req
JOIN dbo.[USER] u
    ON u.username = 'reviewer01'
WHERE req.request_code = 'REQ001';


INSERT INTO dbo.APPROVAL
(
    registration_id,
    request_id,
    approver_id,
    approval_type,
    decision,
    reason,
    decided_at
)
SELECT
    r.registration_id,
    NULL,
    u.user_id,
    'REGISTRATION',
    'APPROVED',
    N'Hồ sơ đầy đủ và hợp lệ',
    DATEADD(DAY, -18, GETDATE())
FROM dbo.REGISTRATION r
JOIN dbo.[USER] u
    ON u.username = 'reviewer01'
WHERE r.registration_code = 'REG001';


-- =========================================================
-- 12. DOCUMENT
-- =========================================================

INSERT INTO dbo.DOCUMENT
(
    registration_id,
    document_type,
    document_status,
    current_version,
    required_flag,
    created_at,
    updated_at
)
SELECT
    r.registration_id,
    'RESIDENCE_CONFIRMATION',
    'VALID',
    1,
    1,
    GETDATE(),
    GETDATE()
FROM dbo.REGISTRATION r
WHERE r.registration_code = 'REG001';


INSERT INTO dbo.DOCUMENT
(
    registration_id,
    document_type,
    document_status,
    current_version,
    required_flag,
    created_at,
    updated_at
)
SELECT
    r.registration_id,
    'RENTAL_CONTRACT',
    'UPLOADED',
    1,
    1,
    GETDATE(),
    GETDATE()
FROM dbo.REGISTRATION r
WHERE r.registration_code = 'REG001';


-- =========================================================
-- 13. DOCUMENT_VERSION
-- =========================================================

INSERT INTO dbo.DOCUMENT_VERSION
(
    document_id,
    uploaded_by,
    version_no,
    file_name,
    file_path,
    file_hash,
    uploaded_at,
    replacement_reason,
    is_current
)
SELECT
    d.document_id,
    u.user_id,
    1,
    'xac_nhan_cu_tru.pdf',
    '/uploads/documents/xac_nhan_cu_tru.pdf',
    'HASH_DOCUMENT_001',
    GETDATE(),
    NULL,
    1
FROM dbo.DOCUMENT d
JOIN dbo.[USER] u
    ON u.username = 'student01'
WHERE d.document_type = 'RESIDENCE_CONFIRMATION';


INSERT INTO dbo.DOCUMENT_VERSION
(
    document_id,
    uploaded_by,
    version_no,
    file_name,
    file_path,
    file_hash,
    uploaded_at,
    replacement_reason,
    is_current
)
SELECT
    d.document_id,
    u.user_id,
    1,
    'hop_dong_thue_tro.pdf',
    '/uploads/documents/hop_dong_thue_tro.pdf',
    'HASH_DOCUMENT_002',
    GETDATE(),
    NULL,
    1
FROM dbo.DOCUMENT d
JOIN dbo.[USER] u
    ON u.username = 'student01'
WHERE d.document_type = 'RENTAL_CONTRACT';


-- =========================================================
-- 14. REQUEST_HISTORY
-- =========================================================

INSERT INTO dbo.REQUEST_HISTORY
(
    request_id,
    changed_by,
    old_status,
    new_status,
    changed_at,
    reason,
    note
)
SELECT
    req.request_id,
    u.user_id,
    'DRAFT',
    'SUBMITTED',
    DATEADD(DAY, -10, GETDATE()),
    N'Sinh viên gửi yêu cầu',
    N'Yêu cầu được gửi lên hệ thống'
FROM dbo.REQUEST req
JOIN dbo.[USER] u
    ON u.username = 'student01'
WHERE req.request_code = 'REQ001';


INSERT INTO dbo.REQUEST_HISTORY
(
    request_id,
    changed_by,
    old_status,
    new_status,
    changed_at,
    reason,
    note
)
SELECT
    req.request_id,
    u.user_id,
    'SUBMITTED',
    'APPROVED',
    DATEADD(DAY, -7, GETDATE()),
    N'Hồ sơ hợp lệ',
    N'Đã được phê duyệt'
FROM dbo.REQUEST req
JOIN dbo.[USER] u
    ON u.username = 'reviewer01'
WHERE req.request_code = 'REQ001';


-- =========================================================
-- 15. SLA_TRACKING
-- =========================================================

INSERT INTO dbo.SLA_TRACKING
(
    registration_id,
    request_id,
    sla_type,
    started_at,
    due_at,
    completed_at,
    status,
    overdue_at,
    created_at
)
SELECT
    NULL,
    req.request_id,
    'REQUEST_PROCESSING',
    DATEADD(DAY, -10, GETDATE()),
    DATEADD(DAY, -5, GETDATE()),
    DATEADD(DAY, -7, GETDATE()),
    'COMPLETED',
    NULL,
    GETDATE()
FROM dbo.REQUEST req
WHERE req.request_code = 'REQ001';


INSERT INTO dbo.SLA_TRACKING
(
    registration_id,
    request_id,
    sla_type,
    started_at,
    due_at,
    completed_at,
    status,
    overdue_at,
    created_at
)
SELECT
    r.registration_id,
    NULL,
    'REGISTRATION_REVIEW',
    DATEADD(DAY, -5, GETDATE()),
    DATEADD(DAY, 2, GETDATE()),
    NULL,
    'IN_PROGRESS',
    NULL,
    GETDATE()
FROM dbo.REGISTRATION r
WHERE r.registration_code = 'REG002';


-- =========================================================
-- 16. ESCALATION
-- =========================================================

INSERT INTO dbo.ESCALATION
(
    sla_tracking_id,
    assigned_to,
    escalation_level,
    reason,
    escalated_at,
    resolved_at,
    status
)
SELECT
    sla.sla_tracking_id,
    u.user_id,
    1,
    N'Hồ sơ cần được xử lý trong thời hạn SLA',
    GETDATE(),
    NULL,
    'OPEN'
FROM dbo.SLA_TRACKING sla
JOIN dbo.[USER] u
    ON u.username = 'officer01'
WHERE sla.sla_type = 'REGISTRATION_REVIEW';


-- =========================================================
-- 17. NOTIFICATION
-- =========================================================

INSERT INTO dbo.NOTIFICATION
(
    user_id,
    registration_id,
    request_id,
    notification_type,
    title,
    message,
    is_read,
    created_at,
    read_at
)
SELECT
    u.user_id,
    r.registration_id,
    NULL,
    'REGISTRATION',
    N'Đăng ký ngoại trú được phê duyệt',
    N'Hồ sơ đăng ký ngoại trú của bạn đã được phê duyệt.',
    0,
    GETDATE(),
    NULL
FROM dbo.[USER] u
JOIN dbo.REGISTRATION r
    ON r.registration_code = 'REG001'
WHERE u.username = 'student01';


INSERT INTO dbo.NOTIFICATION
(
    user_id,
    registration_id,
    request_id,
    notification_type,
    title,
    message,
    is_read,
    created_at,
    read_at
)
SELECT
    u.user_id,
    r.registration_id,
    req.request_id,
    'REQUEST',
    N'Yêu cầu đang được xử lý',
    N'Yêu cầu thay đổi địa chỉ của bạn đang được xử lý.',
    0,
    GETDATE(),
    NULL
FROM dbo.[USER] u
JOIN dbo.REGISTRATION r
    ON r.registration_code = 'REG002'
JOIN dbo.REQUEST req
    ON req.request_code = 'REQ002'
WHERE u.username = 'student02';


-- =========================================================
-- 18. AUDIT_LOG
-- =========================================================

INSERT INTO dbo.AUDIT_LOG
(
    user_id,
    action,
    entity_type,
    entity_id,
    old_value,
    new_value,
    reason,
    source,
    created_at
)
SELECT
    u.user_id,
    'APPROVE',
    'REGISTRATION',
    r.registration_id,
    N'UNDER_REVIEW',
    N'APPROVED',
    N'Hồ sơ đầy đủ và hợp lệ',
    'WEB',
    GETDATE()
FROM dbo.[USER] u
JOIN dbo.REGISTRATION r
    ON r.registration_code = 'REG001'
WHERE u.username = 'reviewer01';


-- =========================================================
-- 19. CONFIGURATION
-- =========================================================

INSERT INTO dbo.CONFIGURATION
(
    config_key,
    config_value,
    data_type,
    description,
    updated_by,
    updated_at
)
VALUES
(
    'REGISTRATION_SLA_HOURS',
    '48',
    'INTEGER',
    N'Số giờ xử lý hồ sơ đăng ký ngoại trú',
    NULL,
    GETDATE()
),
(
    'REQUEST_SLA_HOURS',
    '24',
    'INTEGER',
    N'Số giờ xử lý yêu cầu của sinh viên',
    NULL,
    GETDATE()
),
(
    'MAX_DOCUMENT_SIZE_MB',
    '10',
    'INTEGER',
    N'Dung lượng tối đa của tài liệu',
    NULL,
    GETDATE()
);


-- =========================================================
-- 20. STUDENT_CACHE
-- =========================================================

INSERT INTO dbo.STUDENT_CACHE
(
    student_code,
    full_name,
    date_of_birth,
    gender,
    email,
    phone,
    faculty,
    class_name,
    academic_status,
    sis_updated_at,
    last_sync_at
)
SELECT
    student_code,
    full_name,
    date_of_birth,
    gender,
    email,
    phone,
    faculty,
    class_name,
    academic_status,
    sis_updated_at,
    GETDATE()
FROM dbo.STUDENT;


-- =========================================================
-- COMMIT
-- =========================================================

COMMIT TRANSACTION;
GO

PRINT N'==============================================';
PRINT N'SEED DATA COMPLETED SUCCESSFULLY';
PRINT N'Database: QLNT_TKYC';
PRINT N'==============================================';
GO