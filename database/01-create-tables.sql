/* ============================================================
   PROJECT: QUẢN LÝ SINH VIÊN NGOẠI TRÚ
   DATABASE: QLNT_TKYC
   FILE: 01-create-tables.sql

   Mục đích:
   - Tạo Database
   - Tạo 20 bảng theo ERD
   - Tạo Primary Key
   - Tạo Foreign Key
   - Tạo UNIQUE
   - Tạo CHECK
   - Tạo DEFAULT
   ============================================================ */


/* ============================================================
   1. CREATE DATABASE
   ============================================================ */

IF DB_ID('QLNT_TKYC') IS NULL
BEGIN
    CREATE DATABASE QLNT_TKYC;
END
GO

USE QLNT_TKYC;
GO


/* ============================================================
   2. USER
   Quản lý tài khoản người dùng trong hệ thống
   ============================================================ */

CREATE TABLE [USER]
(
    user_id BIGINT IDENTITY(1,1) NOT NULL,

    username VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,

    full_name NVARCHAR(150) NOT NULL,
    email VARCHAR(150) NULL,
    phone VARCHAR(20) NULL,

    status VARCHAR(30) NOT NULL
        CONSTRAINT DF_USER_STATUS DEFAULT 'ACTIVE',

    last_login_at DATETIME NULL,

    created_at DATETIME NOT NULL
        CONSTRAINT DF_USER_CREATED_AT DEFAULT GETDATE(),

    updated_at DATETIME NOT NULL
        CONSTRAINT DF_USER_UPDATED_AT DEFAULT GETDATE(),

    CONSTRAINT PK_USER
        PRIMARY KEY (user_id),

    CONSTRAINT UQ_USER_USERNAME
        UNIQUE (username),

    CONSTRAINT UQ_USER_EMAIL
        UNIQUE (email),

    CONSTRAINT CK_USER_STATUS
        CHECK
        (
            status IN
            (
                'ACTIVE',
                'INACTIVE',
                'LOCKED'
            )
        )
);
GO


/* ============================================================
   3. ROLE
   Vai trò người dùng
   ============================================================ */

CREATE TABLE ROLE
(
    role_id BIGINT IDENTITY(1,1) NOT NULL,

    role_code VARCHAR(50) NOT NULL,
    role_name VARCHAR(100) NOT NULL,

    description TEXT NULL,

    status VARCHAR(30) NOT NULL
        CONSTRAINT DF_ROLE_STATUS DEFAULT 'ACTIVE',

    CONSTRAINT PK_ROLE
        PRIMARY KEY (role_id),

    CONSTRAINT UQ_ROLE_CODE
        UNIQUE (role_code),

    CONSTRAINT CK_ROLE_STATUS
        CHECK
        (
            status IN
            (
                'ACTIVE',
                'INACTIVE'
            )
        )
);
GO


/* ============================================================
   4. PERMISSION
   Quyền thao tác trong hệ thống
   ============================================================ */

CREATE TABLE PERMISSION
(
    permission_id BIGINT IDENTITY(1,1) NOT NULL,

    permission_code VARCHAR(100) NOT NULL,
    permission_name VARCHAR(150) NOT NULL,

    description TEXT NULL,

    CONSTRAINT PK_PERMISSION
        PRIMARY KEY (permission_id),

    CONSTRAINT UQ_PERMISSION_CODE
        UNIQUE (permission_code)
);
GO


/* ============================================================
   5. STUDENT
   Thông tin sinh viên chính thức
   ============================================================ */

CREATE TABLE STUDENT
(
    student_id BIGINT IDENTITY(1,1) NOT NULL,

    student_code VARCHAR(30) NOT NULL,
    full_name NVARCHAR(150) NOT NULL,

    date_of_birth DATE NULL,
    gender VARCHAR(20) NULL,

    email VARCHAR(150) NULL,
    phone VARCHAR(20) NULL,

    faculty VARCHAR(150) NULL,
    class_name VARCHAR(100) NULL,

    academic_status VARCHAR(50) NULL,

    sis_updated_at DATETIME NULL,

    created_at DATETIME NOT NULL
        CONSTRAINT DF_STUDENT_CREATED_AT DEFAULT GETDATE(),

    updated_at DATETIME NOT NULL
        CONSTRAINT DF_STUDENT_UPDATED_AT DEFAULT GETDATE(),

    CONSTRAINT PK_STUDENT
        PRIMARY KEY (student_id),

    CONSTRAINT UQ_STUDENT_CODE
        UNIQUE (student_code),

    CONSTRAINT CK_STUDENT_GENDER
        CHECK
        (
            gender IS NULL
            OR gender IN
            (
                'MALE',
                'FEMALE',
                'OTHER'
            )
        )
);
GO


/* ============================================================
   6. STUDENT_CACHE
   Cache dữ liệu đồng bộ từ SIS
   ============================================================ */

CREATE TABLE STUDENT_CACHE
(
    student_cache_id BIGINT IDENTITY(1,1) NOT NULL,

    student_code VARCHAR(30) NOT NULL,
    full_name NVARCHAR(150) NULL,

    date_of_birth DATE NULL,
    gender VARCHAR(20) NULL,

    email VARCHAR(150) NULL,
    phone VARCHAR(20) NULL,

    faculty VARCHAR(150) NULL,
    class_name VARCHAR(100) NULL,

    academic_status VARCHAR(50) NULL,

    sis_updated_at DATETIME NULL,

    last_sync_at DATETIME NOT NULL
        CONSTRAINT DF_STUDENT_CACHE_LAST_SYNC
        DEFAULT GETDATE(),

    CONSTRAINT PK_STUDENT_CACHE
        PRIMARY KEY (student_cache_id),

    CONSTRAINT UQ_STUDENT_CACHE_CODE
        UNIQUE (student_code)
);
GO


/* ============================================================
   7. LANDLORD
   Thông tin chủ nhà
   ============================================================ */

CREATE TABLE LANDLORD
(
    landlord_id BIGINT IDENTITY(1,1) NOT NULL,

    full_name NVARCHAR(150) NOT NULL,
    phone VARCHAR(20) NULL,

    identity_number VARCHAR(30) NULL,

    email VARCHAR(150) NULL,

    note TEXT NULL,

    created_at DATETIME NOT NULL
        CONSTRAINT DF_LANDLORD_CREATED_AT DEFAULT GETDATE(),

    updated_at DATETIME NOT NULL
        CONSTRAINT DF_LANDLORD_UPDATED_AT DEFAULT GETDATE(),

    CONSTRAINT PK_LANDLORD
        PRIMARY KEY (landlord_id),

    CONSTRAINT UQ_LANDLORD_IDENTITY
        UNIQUE (identity_number)
);
GO


/* ============================================================
   8. REGISTRATION
   Hồ sơ đăng ký ngoại trú
   ============================================================ */

CREATE TABLE REGISTRATION
(
    registration_id BIGINT IDENTITY(1,1) NOT NULL,

    student_id BIGINT NOT NULL,

    registration_code VARCHAR(50) NOT NULL,

    status VARCHAR(30) NOT NULL
        CONSTRAINT DF_REGISTRATION_STATUS
        DEFAULT 'DRAFT',

    submitted_at DATETIME NULL,
    approved_at DATETIME NULL,
    rejected_at DATETIME NULL,

    rejection_reason TEXT NULL,

    start_date DATE NULL,
    expiry_date DATE NULL,

    terminated_at DATETIME NULL,

    created_at DATETIME NOT NULL
        CONSTRAINT DF_REGISTRATION_CREATED_AT
        DEFAULT GETDATE(),

    updated_at DATETIME NOT NULL
        CONSTRAINT DF_REGISTRATION_UPDATED_AT
        DEFAULT GETDATE(),

    CONSTRAINT PK_REGISTRATION
        PRIMARY KEY (registration_id),

    CONSTRAINT UQ_REGISTRATION_CODE
        UNIQUE (registration_code),

    CONSTRAINT FK_REGISTRATION_STUDENT
        FOREIGN KEY (student_id)
        REFERENCES STUDENT(student_id),

    CONSTRAINT CK_REGISTRATION_STATUS
        CHECK
        (
            status IN
            (
                'DRAFT',
                'SUBMITTED',
                'UNDER_REVIEW',
                'NEED_MORE_INFO',
                'APPROVED',
                'REJECTED',
                'EXPIRED',
                'TERMINATED'
            )
        ),

    CONSTRAINT CK_REGISTRATION_DATE
        CHECK
        (
            expiry_date IS NULL
            OR start_date IS NULL
            OR expiry_date >= start_date
        )
);
GO


/* ============================================================
   9. ADDRESS
   Địa chỉ ngoại trú
   ============================================================ */

CREATE TABLE ADDRESS
(
    address_id BIGINT IDENTITY(1,1) NOT NULL,

    registration_id BIGINT NOT NULL,
    landlord_id BIGINT NULL,

    address_line VARCHAR(255) NOT NULL,

    ward VARCHAR(100) NULL,
    district VARCHAR(100) NULL,
    province VARCHAR(100) NULL,

    address_type VARCHAR(30) NULL,

    start_date DATE NULL,
    end_date DATE NULL,

    status VARCHAR(30) NOT NULL
        CONSTRAINT DF_ADDRESS_STATUS
        DEFAULT 'CURRENT',

    created_at DATETIME NOT NULL
        CONSTRAINT DF_ADDRESS_CREATED_AT
        DEFAULT GETDATE(),

    updated_at DATETIME NOT NULL
        CONSTRAINT DF_ADDRESS_UPDATED_AT
        DEFAULT GETDATE(),

    CONSTRAINT PK_ADDRESS
        PRIMARY KEY (address_id),

    CONSTRAINT FK_ADDRESS_REGISTRATION
        FOREIGN KEY (registration_id)
        REFERENCES REGISTRATION(registration_id),

    CONSTRAINT FK_ADDRESS_LANDLORD
        FOREIGN KEY (landlord_id)
        REFERENCES LANDLORD(landlord_id),

    CONSTRAINT CK_ADDRESS_STATUS
        CHECK
        (
            status IN
            (
                'CURRENT',
                'OLD',
                'INACTIVE'
            )
        ),

    CONSTRAINT CK_ADDRESS_DATE
        CHECK
        (
            end_date IS NULL
            OR start_date IS NULL
            OR end_date >= start_date
        )
);
GO


/* ============================================================
   10. DOCUMENT
   Tài liệu trong hồ sơ
   ============================================================ */

CREATE TABLE DOCUMENT
(
    document_id BIGINT IDENTITY(1,1) NOT NULL,

    registration_id BIGINT NOT NULL,

    document_type VARCHAR(50) NOT NULL,

    document_status VARCHAR(30) NOT NULL
        CONSTRAINT DF_DOCUMENT_STATUS
        DEFAULT 'PENDING',

    current_version INT NOT NULL
        CONSTRAINT DF_DOCUMENT_CURRENT_VERSION
        DEFAULT 1,

    required_flag BIT NOT NULL
        CONSTRAINT DF_DOCUMENT_REQUIRED_FLAG
        DEFAULT 1,

    created_at DATETIME NOT NULL
        CONSTRAINT DF_DOCUMENT_CREATED_AT
        DEFAULT GETDATE(),

    updated_at DATETIME NOT NULL
        CONSTRAINT DF_DOCUMENT_UPDATED_AT
        DEFAULT GETDATE(),

    CONSTRAINT PK_DOCUMENT
        PRIMARY KEY (document_id),

    CONSTRAINT FK_DOCUMENT_REGISTRATION
        FOREIGN KEY (registration_id)
        REFERENCES REGISTRATION(registration_id),

    CONSTRAINT CK_DOCUMENT_STATUS
        CHECK
        (
            document_status IN
            (
                'PENDING',
                'UPLOADED',
                'VALID',
                'INVALID',
                'NEED_REPLACEMENT'
            )
        ),

    CONSTRAINT CK_DOCUMENT_VERSION
        CHECK
        (
            current_version >= 1
        )
);
GO


/* ============================================================
   11. USER_ROLE
   Gán người dùng vào vai trò
   ============================================================ */

CREATE TABLE USER_ROLE
(
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,

    assigned_at DATETIME NOT NULL
        CONSTRAINT DF_USER_ROLE_ASSIGNED_AT
        DEFAULT GETDATE(),

    assigned_by BIGINT NULL,

    CONSTRAINT PK_USER_ROLE
        PRIMARY KEY (user_id, role_id),

    CONSTRAINT FK_USER_ROLE_USER
        FOREIGN KEY (user_id)
        REFERENCES [USER](user_id),

    CONSTRAINT FK_USER_ROLE_ROLE
        FOREIGN KEY (role_id)
        REFERENCES ROLE(role_id),

    CONSTRAINT FK_USER_ROLE_ASSIGNED_BY
        FOREIGN KEY (assigned_by)
        REFERENCES [USER](user_id)
);
GO


/* ============================================================
   12. ROLE_PERMISSION
   Gán quyền cho vai trò
   ============================================================ */

CREATE TABLE ROLE_PERMISSION
(
    role_id BIGINT NOT NULL,
    permission_id BIGINT NOT NULL,

    granted_at DATETIME NOT NULL
        CONSTRAINT DF_ROLE_PERMISSION_GRANTED_AT
        DEFAULT GETDATE(),

    granted_by BIGINT NULL,

    CONSTRAINT PK_ROLE_PERMISSION
        PRIMARY KEY (role_id, permission_id),

    CONSTRAINT FK_ROLE_PERMISSION_ROLE
        FOREIGN KEY (role_id)
        REFERENCES ROLE(role_id),

    CONSTRAINT FK_ROLE_PERMISSION_PERMISSION
        FOREIGN KEY (permission_id)
        REFERENCES PERMISSION(permission_id),

    CONSTRAINT FK_ROLE_PERMISSION_GRANTED_BY
        FOREIGN KEY (granted_by)
        REFERENCES [USER](user_id)
);
GO


/* ============================================================
   13. DOCUMENT_VERSION
   Các phiên bản của tài liệu
   ============================================================ */

CREATE TABLE DOCUMENT_VERSION
(
    document_version_id BIGINT IDENTITY(1,1) NOT NULL,

    document_id BIGINT NOT NULL,

    uploaded_by BIGINT NULL,

    version_no INT NOT NULL,

    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,

    file_hash VARCHAR(255) NULL,

    uploaded_at DATETIME NOT NULL
        CONSTRAINT DF_DOCUMENT_VERSION_UPLOADED_AT
        DEFAULT GETDATE(),

    replacement_reason TEXT NULL,

    is_current BIT NOT NULL
        CONSTRAINT DF_DOCUMENT_VERSION_IS_CURRENT
        DEFAULT 1,

    CONSTRAINT PK_DOCUMENT_VERSION
        PRIMARY KEY (document_version_id),

    CONSTRAINT FK_DOCUMENT_VERSION_DOCUMENT
        FOREIGN KEY (document_id)
        REFERENCES DOCUMENT(document_id),

    CONSTRAINT FK_DOCUMENT_VERSION_USER
        FOREIGN KEY (uploaded_by)
        REFERENCES [USER](user_id),

    CONSTRAINT CK_DOCUMENT_VERSION_NO
        CHECK
        (
            version_no >= 1
        )
);
GO


/* ============================================================
   14. REQUEST
   Request phát sinh:
   - Gia hạn
   - Chuyển nơi ở
   - Kết thúc ngoại trú
   ============================================================ */

CREATE TABLE REQUEST
(
    request_id BIGINT IDENTITY(1,1) NOT NULL,

    registration_id BIGINT NOT NULL,

    created_by BIGINT NULL,
    processed_by BIGINT NULL,

    request_code VARCHAR(50) NOT NULL,

    request_type VARCHAR(50) NOT NULL,

    status VARCHAR(30) NOT NULL
        CONSTRAINT DF_REQUEST_STATUS
        DEFAULT 'DRAFT',

    reason TEXT NULL,

    submitted_at DATETIME NULL,
    processed_at DATETIME NULL,

    approved_at DATETIME NULL,
    rejected_at DATETIME NULL,

    rejection_reason TEXT NULL,

    created_at DATETIME NOT NULL
        CONSTRAINT DF_REQUEST_CREATED_AT
        DEFAULT GETDATE(),

    updated_at DATETIME NOT NULL
        CONSTRAINT DF_REQUEST_UPDATED_AT
        DEFAULT GETDATE(),

    CONSTRAINT PK_REQUEST
        PRIMARY KEY (request_id),

    CONSTRAINT UQ_REQUEST_CODE
        UNIQUE (request_code),

    CONSTRAINT FK_REQUEST_REGISTRATION
        FOREIGN KEY (registration_id)
        REFERENCES REGISTRATION(registration_id),

    CONSTRAINT FK_REQUEST_CREATED_BY
        FOREIGN KEY (created_by)
        REFERENCES [USER](user_id),

    CONSTRAINT FK_REQUEST_PROCESSED_BY
        FOREIGN KEY (processed_by)
        REFERENCES [USER](user_id),

    CONSTRAINT CK_REQUEST_TYPE
        CHECK
        (
            request_type IN
            (
                'RENEW',
                'CHANGE_ADDRESS',
                'TERMINATE'
            )
        ),

    CONSTRAINT CK_REQUEST_STATUS
        CHECK
        (
            status IN
            (
                'DRAFT',
                'SUBMITTED',
                'UNDER_REVIEW',
                'NEED_MORE_INFO',
                'APPROVED',
                'REJECTED',
                'CANCELLED'
            )
        )
);
GO


/* ============================================================
   15. REQUEST_HISTORY
   Lịch sử thay đổi trạng thái Request
   ============================================================ */

CREATE TABLE REQUEST_HISTORY
(
    request_history_id BIGINT IDENTITY(1,1) NOT NULL,

    request_id BIGINT NOT NULL,

    changed_by BIGINT NULL,

    old_status VARCHAR(30) NULL,
    new_status VARCHAR(30) NOT NULL,

    changed_at DATETIME NOT NULL
        CONSTRAINT DF_REQUEST_HISTORY_CHANGED_AT
        DEFAULT GETDATE(),

    reason TEXT NULL,
    note TEXT NULL,

    CONSTRAINT PK_REQUEST_HISTORY
        PRIMARY KEY (request_history_id),

    CONSTRAINT FK_REQUEST_HISTORY_REQUEST
        FOREIGN KEY (request_id)
        REFERENCES REQUEST(request_id),

    CONSTRAINT FK_REQUEST_HISTORY_USER
        FOREIGN KEY (changed_by)
        REFERENCES [USER](user_id)
);
GO


/* ============================================================
   16. APPROVAL
   Phê duyệt Registration hoặc Request

   Quy tắc:
   - Một Approval thuộc Registration
     HOẶC Request
   - Không được đồng thời cả hai
   ============================================================ */

CREATE TABLE APPROVAL
(
    approval_id BIGINT IDENTITY(1,1) NOT NULL,

    registration_id BIGINT NULL,
    request_id BIGINT NULL,

    approver_id BIGINT NOT NULL,

    approval_type VARCHAR(50) NOT NULL,

    decision VARCHAR(30) NOT NULL,

    reason TEXT NULL,

    decided_at DATETIME NOT NULL
        CONSTRAINT DF_APPROVAL_DECIDED_AT
        DEFAULT GETDATE(),

    CONSTRAINT PK_APPROVAL
        PRIMARY KEY (approval_id),

    CONSTRAINT FK_APPROVAL_REGISTRATION
        FOREIGN KEY (registration_id)
        REFERENCES REGISTRATION(registration_id),

    CONSTRAINT FK_APPROVAL_REQUEST
        FOREIGN KEY (request_id)
        REFERENCES REQUEST(request_id),

    CONSTRAINT FK_APPROVAL_APPROVER
        FOREIGN KEY (approver_id)
        REFERENCES [USER](user_id),

    CONSTRAINT CK_APPROVAL_TARGET
        CHECK
        (
            (
                registration_id IS NOT NULL
                AND request_id IS NULL
            )
            OR
            (
                registration_id IS NULL
                AND request_id IS NOT NULL
            )
        ),

    CONSTRAINT CK_APPROVAL_TYPE
        CHECK
        (
            approval_type IN
            (
                'REGISTRATION',
                'REQUEST'
            )
        ),

    CONSTRAINT CK_APPROVAL_DECISION
        CHECK
        (
            decision IN
            (
                'APPROVED',
                'REJECTED'
            )
        )
);
GO


/* ============================================================
   17. NOTIFICATION
   Thông báo cho người dùng
   ============================================================ */

CREATE TABLE NOTIFICATION
(
    notification_id BIGINT IDENTITY(1,1) NOT NULL,

    user_id BIGINT NOT NULL,

    registration_id BIGINT NULL,
    request_id BIGINT NULL,

    notification_type VARCHAR(50) NOT NULL,

    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,

    is_read BIT NOT NULL
        CONSTRAINT DF_NOTIFICATION_IS_READ
        DEFAULT 0,

    created_at DATETIME NOT NULL
        CONSTRAINT DF_NOTIFICATION_CREATED_AT
        DEFAULT GETDATE(),

    read_at DATETIME NULL,

    CONSTRAINT PK_NOTIFICATION
        PRIMARY KEY (notification_id),

    CONSTRAINT FK_NOTIFICATION_USER
        FOREIGN KEY (user_id)
        REFERENCES [USER](user_id),

    CONSTRAINT FK_NOTIFICATION_REGISTRATION
        FOREIGN KEY (registration_id)
        REFERENCES REGISTRATION(registration_id),

    CONSTRAINT FK_NOTIFICATION_REQUEST
        FOREIGN KEY (request_id)
        REFERENCES REQUEST(request_id)
);
GO


/* ============================================================
   18. AUDIT_LOG
   Nhật ký hoạt động hệ thống
   ============================================================ */

CREATE TABLE AUDIT_LOG
(
    audit_log_id BIGINT IDENTITY(1,1) NOT NULL,

    user_id BIGINT NULL,

    action VARCHAR(50) NOT NULL,

    entity_type VARCHAR(50) NOT NULL,
    entity_id BIGINT NULL,

    old_value TEXT NULL,
    new_value TEXT NULL,

    reason TEXT NULL,

    source VARCHAR(50) NULL,

    created_at DATETIME NOT NULL
        CONSTRAINT DF_AUDIT_LOG_CREATED_AT
        DEFAULT GETDATE(),

    CONSTRAINT PK_AUDIT_LOG
        PRIMARY KEY (audit_log_id),

    CONSTRAINT FK_AUDIT_LOG_USER
        FOREIGN KEY (user_id)
        REFERENCES [USER](user_id)
);
GO


/* ============================================================
   19. SLA_TRACKING
   Theo dõi SLA của Registration hoặc Request
   ============================================================ */

CREATE TABLE SLA_TRACKING
(
    sla_tracking_id BIGINT IDENTITY(1,1) NOT NULL,

    registration_id BIGINT NULL,
    request_id BIGINT NULL,

    sla_type VARCHAR(50) NOT NULL,

    started_at DATETIME NOT NULL,
    due_at DATETIME NOT NULL,

    completed_at DATETIME NULL,

    status VARCHAR(30) NOT NULL
        CONSTRAINT DF_SLA_STATUS
        DEFAULT 'IN_PROGRESS',

    overdue_at DATETIME NULL,

    created_at DATETIME NOT NULL
        CONSTRAINT DF_SLA_CREATED_AT
        DEFAULT GETDATE(),

    CONSTRAINT PK_SLA_TRACKING
        PRIMARY KEY (sla_tracking_id),

    CONSTRAINT FK_SLA_REGISTRATION
        FOREIGN KEY (registration_id)
        REFERENCES REGISTRATION(registration_id),

    CONSTRAINT FK_SLA_REQUEST
        FOREIGN KEY (request_id)
        REFERENCES REQUEST(request_id),

    CONSTRAINT CK_SLA_TARGET
        CHECK
        (
            (
                registration_id IS NOT NULL
                AND request_id IS NULL
            )
            OR
            (
                registration_id IS NULL
                AND request_id IS NOT NULL
            )
        ),

    CONSTRAINT CK_SLA_STATUS
        CHECK
        (
            status IN
            (
                'IN_PROGRESS',
                'COMPLETED',
                'OVERDUE',
                'CANCELLED'
            )
        ),

    CONSTRAINT CK_SLA_DATE
        CHECK
        (
            due_at >= started_at
        )
);
GO


/* ============================================================
   20. ESCALATION
   Xử lý escalation khi SLA quá hạn
   ============================================================ */

CREATE TABLE ESCALATION
(
    escalation_id BIGINT IDENTITY(1,1) NOT NULL,

    sla_tracking_id BIGINT NOT NULL,

    assigned_to BIGINT NULL,

    escalation_level INT NOT NULL,

    reason TEXT NULL,

    escalated_at DATETIME NOT NULL
        CONSTRAINT DF_ESCALATION_ESCALATED_AT
        DEFAULT GETDATE(),

    resolved_at DATETIME NULL,

    status VARCHAR(30) NOT NULL
        CONSTRAINT DF_ESCALATION_STATUS
        DEFAULT 'OPEN',

    CONSTRAINT PK_ESCALATION
        PRIMARY KEY (escalation_id),

    CONSTRAINT FK_ESCALATION_SLA
        FOREIGN KEY (sla_tracking_id)
        REFERENCES SLA_TRACKING(sla_tracking_id),

    CONSTRAINT FK_ESCALATION_USER
        FOREIGN KEY (assigned_to)
        REFERENCES [USER](user_id),

    CONSTRAINT CK_ESCALATION_LEVEL
        CHECK
        (
            escalation_level >= 1
        ),

    CONSTRAINT CK_ESCALATION_STATUS
        CHECK
        (
            status IN
            (
                'OPEN',
                'RESOLVED',
                'CANCELLED'
            )
        )
);
GO


/* ============================================================
   21. CONFIGURATION
   Cấu hình hệ thống
   ============================================================ */

CREATE TABLE CONFIGURATION
(
    configuration_id BIGINT IDENTITY(1,1) NOT NULL,

    config_key VARCHAR(100) NOT NULL,
    config_value TEXT NOT NULL,

    data_type VARCHAR(30) NULL,

    description TEXT NULL,

    updated_by BIGINT NULL,

    updated_at DATETIME NOT NULL
        CONSTRAINT DF_CONFIGURATION_UPDATED_AT
        DEFAULT GETDATE(),

    CONSTRAINT PK_CONFIGURATION
        PRIMARY KEY (configuration_id),

    CONSTRAINT UQ_CONFIGURATION_KEY
        UNIQUE (config_key),

    CONSTRAINT FK_CONFIGURATION_USER
        FOREIGN KEY (updated_by)
        REFERENCES [USER](user_id)
);
GO


/* ============================================================
   HOÀN TẤT CREATE TABLE
   ============================================================ */

PRINT '==============================================';
PRINT 'QLNT_TKYC - CREATE TABLE HOÀN TẤT';
PRINT '==============================================';
GO