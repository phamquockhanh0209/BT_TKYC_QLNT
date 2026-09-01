-- TEST 01 — Kiểm tra database + 20 bảng --
USE QLNT_TKYC;
GO

SELECT 
    DB_NAME() AS DatabaseName,
    COUNT(*) AS TotalTables
FROM sys.tables;
GO

SELECT 
    ROW_NUMBER() OVER (ORDER BY name) AS STT,
    name AS TableName
FROM sys.tables
ORDER BY name;
GO

-- TEST 02 — Kiểm tra số lượng dữ liệu --
USE QLNT_TKYC;
GO

SELECT 'STUDENT' AS TableName, COUNT(*) AS TotalRows FROM dbo.STUDENT
UNION ALL
SELECT 'USER', COUNT(*) FROM dbo.[USER]
UNION ALL
SELECT 'ROLE', COUNT(*) FROM dbo.ROLE
UNION ALL
SELECT 'PERMISSION', COUNT(*) FROM dbo.PERMISSION
UNION ALL
SELECT 'USER_ROLE', COUNT(*) FROM dbo.USER_ROLE
UNION ALL
SELECT 'ROLE_PERMISSION', COUNT(*) FROM dbo.ROLE_PERMISSION
UNION ALL
SELECT 'LANDLORD', COUNT(*) FROM dbo.LANDLORD
UNION ALL
SELECT 'REGISTRATION', COUNT(*) FROM dbo.REGISTRATION
UNION ALL
SELECT 'ADDRESS', COUNT(*) FROM dbo.ADDRESS
UNION ALL
SELECT 'REQUEST', COUNT(*) FROM dbo.REQUEST
UNION ALL
SELECT 'APPROVAL', COUNT(*) FROM dbo.APPROVAL
UNION ALL
SELECT 'DOCUMENT', COUNT(*) FROM dbo.DOCUMENT
UNION ALL
SELECT 'DOCUMENT_VERSION', COUNT(*) FROM dbo.DOCUMENT_VERSION
UNION ALL
SELECT 'REQUEST_HISTORY', COUNT(*) FROM dbo.REQUEST_HISTORY
UNION ALL
SELECT 'SLA_TRACKING', COUNT(*) FROM dbo.SLA_TRACKING
UNION ALL
SELECT 'ESCALATION', COUNT(*) FROM dbo.ESCALATION
UNION ALL
SELECT 'NOTIFICATION', COUNT(*) FROM dbo.NOTIFICATION
UNION ALL
SELECT 'AUDIT_LOG', COUNT(*) FROM dbo.AUDIT_LOG
UNION ALL
SELECT 'CONFIGURATION', COUNT(*) FROM dbo.CONFIGURATION
UNION ALL
SELECT 'STUDENT_CACHE', COUNT(*) FROM dbo.STUDENT_CACHE
ORDER BY TableName;
GO

-- TEST 03 — Kiểm tra Primary Key --
USE QLNT_TKYC;
GO

SELECT
    tc.TABLE_NAME AS TableName,
    tc.CONSTRAINT_NAME AS PrimaryKeyName,
    kcu.COLUMN_NAME AS ColumnName,
    kcu.ORDINAL_POSITION AS KeyOrder
FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu
    ON tc.CONSTRAINT_NAME = kcu.CONSTRAINT_NAME
    AND tc.TABLE_SCHEMA = kcu.TABLE_SCHEMA
WHERE tc.CONSTRAINT_TYPE = 'PRIMARY KEY'
ORDER BY tc.TABLE_NAME, kcu.ORDINAL_POSITION;
GO

-- TEST 04 — Kiểm tra toàn bộ Foreign Key --
USE QLNT_TKYC;
GO

SELECT
    fk.name AS ForeignKeyName,
    OBJECT_NAME(fk.parent_object_id) AS ChildTable,
    COL_NAME(fkc.parent_object_id, fkc.parent_column_id) AS ChildColumn,
    OBJECT_NAME(fk.referenced_object_id) AS ParentTable,
    COL_NAME(fkc.referenced_object_id, fkc.referenced_column_id) AS ParentColumn
FROM sys.foreign_keys fk
JOIN sys.foreign_key_columns fkc
    ON fk.object_id = fkc.constraint_object_id
ORDER BY ChildTable, ForeignKeyName;
GO

SELECT COUNT(*) AS TotalForeignKeys
FROM sys.foreign_keys;
GO

-- TEST 05 — Kiểm tra UNIQUE --
USE QLNT_TKYC;
GO

SELECT
    tc.TABLE_NAME AS TableName,
    tc.CONSTRAINT_NAME AS UniqueConstraint,
    kcu.COLUMN_NAME AS ColumnName
FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu
    ON tc.CONSTRAINT_NAME = kcu.CONSTRAINT_NAME
    AND tc.TABLE_SCHEMA = kcu.TABLE_SCHEMA
WHERE tc.CONSTRAINT_TYPE = 'UNIQUE'
ORDER BY tc.TABLE_NAME;
GO

SELECT COUNT(*) AS TotalUniqueConstraints
FROM sys.key_constraints
WHERE type = 'UQ';
GO

-- TEST 06 — Kiểm tra CHECK Constraint --
USE QLNT_TKYC;
GO

SELECT
    SCHEMA_NAME(t.schema_id) AS SchemaName,
    t.name AS TableName,
    cc.name AS CheckConstraint,
    cc.definition AS CheckDefinition
FROM sys.check_constraints cc
JOIN sys.tables t
    ON cc.parent_object_id = t.object_id
ORDER BY t.name, cc.name;
GO

SELECT COUNT(*) AS TotalCheckConstraints
FROM sys.check_constraints
WHERE parent_object_id IN
(
    SELECT object_id
    FROM sys.tables
);
GO

-- TEST 07 — Kiểm tra INDEX --
USE QLNT_TKYC;
GO

SELECT
    t.name AS TableName,
    i.name AS IndexName,
    i.type_desc AS IndexType,
    i.is_unique AS IsUnique,
    c.name AS ColumnName,
    ic.key_ordinal AS KeyOrder
FROM sys.indexes i
JOIN sys.tables t
    ON i.object_id = t.object_id
JOIN sys.index_columns ic
    ON i.object_id = ic.object_id
    AND i.index_id = ic.index_id
JOIN sys.columns c
    ON ic.object_id = c.object_id
    AND ic.column_id = c.column_id
WHERE i.is_hypothetical = 0
  AND i.name IS NOT NULL
ORDER BY t.name, i.name, ic.key_ordinal;
GO

SELECT COUNT(*) AS TotalIndexes
FROM sys.indexes i
JOIN sys.tables t
    ON i.object_id = t.object_id
WHERE i.is_hypothetical = 0
  AND i.name IS NOT NULL;
GO

-- TEST 08 — Kiểm tra quan hệ STUDENT → REGISTRATION --
USE QLNT_TKYC;
GO

SELECT
    r.registration_id,
    r.registration_code,
    r.student_id,
    s.student_code,
    s.full_name
FROM dbo.REGISTRATION r
INNER JOIN dbo.STUDENT s
    ON r.student_id = s.student_id
ORDER BY r.registration_id;
GO

SELECT
    COUNT(*) AS InvalidRegistration
FROM dbo.REGISTRATION r
LEFT JOIN dbo.STUDENT s
    ON r.student_id = s.student_id
WHERE s.student_id IS NULL;
GO

-- TEST 09 — Kiểm tra quan hệ REGISTRATION → REQUEST --
USE QLNT_TKYC;
GO

SELECT
    r.request_id,
    r.request_code,
    r.registration_id,
    rg.registration_code,
    rg.student_id,
    s.student_code,
    s.full_name AS student_name,
    r.request_type,
    r.status
FROM dbo.REQUEST r
INNER JOIN dbo.REGISTRATION rg
    ON r.registration_id = rg.registration_id
INNER JOIN dbo.STUDENT s
    ON rg.student_id = s.student_id
ORDER BY r.request_id;
GO

-- Kiểm tra REQUEST có registration_id không hợp lệ
SELECT
    COUNT(*) AS InvalidRequest
FROM dbo.REQUEST r
LEFT JOIN dbo.REGISTRATION rg
    ON r.registration_id = rg.registration_id
WHERE rg.registration_id IS NULL;
GO

-- TEST 10 — Kiểm tra quan hệ REQUEST → REQUEST_HISTORY
USE QLNT_TKYC;
GO

SELECT
    h.request_history_id,
    h.request_id,
    r.request_code,
    r.request_type,
    h.changed_by,
    u.username AS changed_by_username,
    h.old_status,
    h.new_status,
    h.changed_at
FROM dbo.REQUEST_HISTORY h
INNER JOIN dbo.REQUEST r
    ON h.request_id = r.request_id
LEFT JOIN dbo.[USER] u
    ON h.changed_by = u.user_id
ORDER BY h.request_history_id;
GO

-- Kiểm tra REQUEST_HISTORY có request_id không hợp lệ
SELECT
    COUNT(*) AS InvalidRequestHistory
FROM dbo.REQUEST_HISTORY h
LEFT JOIN dbo.REQUEST r
    ON h.request_id = r.request_id
WHERE r.request_id IS NULL;
GO

-- TEST 11 — Kiểm tra quan hệ REGISTRATION → DOCUMENT
USE QLNT_TKYC;
GO

SELECT
    d.document_id,
    d.document_type,
    d.document_status,
    d.registration_id,
    r.registration_code,
    r.student_id,
    s.student_code,
    s.full_name AS student_name
FROM dbo.DOCUMENT d
INNER JOIN dbo.REGISTRATION r
    ON d.registration_id = r.registration_id
INNER JOIN dbo.STUDENT s
    ON r.student_id = s.student_id
ORDER BY d.document_id;
GO

-- Kiểm tra DOCUMENT có registration_id không hợp lệ
SELECT
    COUNT(*) AS InvalidDocument
FROM dbo.DOCUMENT d
LEFT JOIN dbo.REGISTRATION r
    ON d.registration_id = r.registration_id
WHERE r.registration_id IS NULL;
GO

-- TEST 12 — Kiểm tra quan hệ DOCUMENT → DOCUMENT_VERSION
USE QLNT_TKYC;
GO

SELECT
    dv.document_version_id,
    dv.document_id,
    d.document_type,
    d.document_status,
    dv.version_no,
    dv.file_name,
    dv.file_path,
    dv.uploaded_by,
    u.username AS uploaded_by_username,
    dv.is_current,
    dv.uploaded_at
FROM dbo.DOCUMENT_VERSION dv
INNER JOIN dbo.DOCUMENT d
    ON dv.document_id = d.document_id
LEFT JOIN dbo.[USER] u
    ON dv.uploaded_by = u.user_id
ORDER BY dv.document_id, dv.version_no;
GO

-- Kiểm tra DOCUMENT_VERSION có document_id không hợp lệ
SELECT
    COUNT(*) AS InvalidDocumentVersion
FROM dbo.DOCUMENT_VERSION dv
LEFT JOIN dbo.DOCUMENT d
    ON dv.document_id = d.document_id
WHERE d.document_id IS NULL;
GO

-- TEST 13 — Kiểm tra quan hệ USER → ROLE
USE QLNT_TKYC;
GO

SELECT
    ur.user_id,
    u.username,
    u.full_name AS user_name,
    ur.role_id,
    r.role_code,
    r.role_name,
    ur.assigned_at,
    ur.assigned_by
FROM dbo.USER_ROLE ur
INNER JOIN dbo.[USER] u
    ON ur.user_id = u.user_id
INNER JOIN dbo.ROLE r
    ON ur.role_id = r.role_id
ORDER BY ur.user_id, ur.role_id;
GO

-- Kiểm tra USER_ROLE có user_id không hợp lệ
SELECT
    COUNT(*) AS InvalidUser
FROM dbo.USER_ROLE ur
LEFT JOIN dbo.[USER] u
    ON ur.user_id = u.user_id
WHERE u.user_id IS NULL;
GO

-- Kiểm tra USER_ROLE có role_id không hợp lệ
SELECT
    COUNT(*) AS InvalidRole
FROM dbo.USER_ROLE ur
LEFT JOIN dbo.ROLE r
    ON ur.role_id = r.role_id
WHERE r.role_id IS NULL;
GO

-- EST 14 — ROLE → ROLE_PERMISSION → PERMISSION -- 
USE QLNT_TKYC;
GO

/* ============================================================
   TEST 14 — KIỂM TRA QUAN HỆ ROLE → ROLE_PERMISSION → PERMISSION
   ============================================================ */

-- 14.1 — Xem toàn bộ quyền của từng Role
SELECT
    rp.role_id,
    r.role_code,
    r.role_name,
    rp.permission_id,
    p.permission_code,
    p.permission_name,
    rp.granted_at,
    rp.granted_by
FROM dbo.ROLE_PERMISSION rp
INNER JOIN dbo.ROLE r
    ON rp.role_id = r.role_id
INNER JOIN dbo.PERMISSION p
    ON rp.permission_id = p.permission_id
ORDER BY rp.role_id, rp.permission_id;
GO


-- 14.2 — Kiểm tra ROLE_PERMISSION có role_id không hợp lệ
SELECT
    COUNT(*) AS InvalidRole
FROM dbo.ROLE_PERMISSION rp
LEFT JOIN dbo.ROLE r
    ON rp.role_id = r.role_id
WHERE r.role_id IS NULL;
GO


-- 14.3 — Kiểm tra ROLE_PERMISSION có permission_id không hợp lệ
SELECT
    COUNT(*) AS InvalidPermission
FROM dbo.ROLE_PERMISSION rp
LEFT JOIN dbo.PERMISSION p
    ON rp.permission_id = p.permission_id
WHERE p.permission_id IS NULL;
GO