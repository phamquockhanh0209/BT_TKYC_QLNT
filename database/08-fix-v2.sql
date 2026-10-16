/* ============================================================
   08-fix-v2.sql
   Sửa các lỗi còn lại sau khi chạy 07-fix-constraints.sql
   
   Chạy file này SAU khi đã chạy 07-fix-constraints.sql
   ============================================================ */

USE QLNT_TKYC;
GO

/* ============================================================
   BƯỚC 1: Xem tên thực tế của constraint CK_REQUEST_TYPE trong DB
   (Chạy riêng bước này để kiểm tra trước)
   ============================================================ */

SELECT 
    cc.name        AS constraint_name,
    cc.definition  AS constraint_definition
FROM sys.check_constraints cc
JOIN sys.tables t ON cc.parent_object_id = t.object_id
WHERE t.name = 'REQUEST'
ORDER BY cc.name;
GO

/* ============================================================
   BƯỚC 2: Xóa dữ liệu RENEW/TERMINATE (nếu có) hoặc cập nhật
   trước khi đổi constraint
   ============================================================ */

-- Xem dữ liệu request_type hiện có trong DB
SELECT DISTINCT request_type, COUNT(*) as so_luong
FROM REQUEST
GROUP BY request_type;
GO

-- Cập nhật dữ liệu cũ trước (nếu đã có rows dùng 'RENEW' hoặc 'TERMINATE')
UPDATE REQUEST SET request_type = 'RENEWAL'     WHERE request_type = 'RENEW';
UPDATE REQUEST SET request_type = 'TERMINATION' WHERE request_type = 'TERMINATE';
GO

PRINT 'Đã cập nhật dữ liệu cũ: RENEW→RENEWAL, TERMINATE→TERMINATION';
GO

/* ============================================================
   BƯỚC 3: Drop constraint CK_REQUEST_TYPE theo tên thực tế
   ============================================================ */

-- Xóa constraint theo tên đúng (dùng dynamic SQL để an toàn)
DECLARE @constraintName NVARCHAR(256);
SELECT @constraintName = cc.name
FROM sys.check_constraints cc
JOIN sys.tables t ON cc.parent_object_id = t.object_id
WHERE t.name = 'REQUEST'
  AND cc.definition LIKE '%RENEW%';  -- Tìm constraint cũ có chứa 'RENEW'

IF @constraintName IS NOT NULL
BEGIN
    DECLARE @sql NVARCHAR(500) = 'ALTER TABLE REQUEST DROP CONSTRAINT [' + @constraintName + ']';
    EXEC sp_executesql @sql;
    PRINT 'Đã xóa constraint: ' + @constraintName;
END
ELSE
BEGIN
    PRINT 'Không tìm thấy constraint cũ có RENEW — có thể đã xóa hoặc chưa tồn tại.';
END
GO

/* ============================================================
   BƯỚC 4: Tạo lại constraint với giá trị đúng
   ============================================================ */

-- Xóa thêm nếu vẫn còn CK_REQUEST_TYPE (tên chuẩn)
IF EXISTS (
    SELECT 1 FROM sys.check_constraints cc
    JOIN sys.tables t ON cc.parent_object_id = t.object_id
    WHERE t.name = 'REQUEST' AND cc.name = 'CK_REQUEST_TYPE'
)
BEGIN
    ALTER TABLE REQUEST DROP CONSTRAINT CK_REQUEST_TYPE;
    PRINT 'Đã xóa CK_REQUEST_TYPE';
END
GO

-- Tạo lại đúng
ALTER TABLE REQUEST
    ADD CONSTRAINT CK_REQUEST_TYPE
    CHECK
    (
        request_type IN
        (
            'RENEWAL',        -- Gia hạn hồ sơ
            'CHANGE_ADDRESS', -- Báo chuyển trọ
            'TERMINATION'     -- Chấm dứt ngoại trú
        )
    );
GO

PRINT 'FIX 2 THÀNH CÔNG: CK_REQUEST_TYPE đã cập nhật (RENEWAL, CHANGE_ADDRESS, TERMINATION)';
GO

/* ============================================================
   BƯỚC 5: Sửa kiểu dữ liệu new_landlord_id từ INT sang BIGINT
   (Cột đã được thêm bởi 07-fix-constraints.sql với type INT sai)
   ============================================================ */

-- Xóa FK nếu đã được tạo một phần
IF EXISTS (
    SELECT 1 FROM sys.foreign_keys 
    WHERE name = 'FK_REQUEST_NEW_LANDLORD'
)
BEGIN
    ALTER TABLE REQUEST DROP CONSTRAINT FK_REQUEST_NEW_LANDLORD;
    PRINT 'Đã xóa FK_REQUEST_NEW_LANDLORD cũ';
END
GO

-- Kiểm tra xem cột new_landlord_id đã tồn tại chưa
IF EXISTS (
    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = 'REQUEST' AND COLUMN_NAME = 'new_landlord_id'
)
BEGIN
    -- Xóa cột cũ (type INT sai)
    ALTER TABLE REQUEST DROP COLUMN new_landlord_id;
    PRINT 'Đã xóa cột new_landlord_id (INT) để tạo lại với BIGINT';
END
GO

-- Tạo lại cột đúng kiểu BIGINT (khớp với LANDLORD.landlord_id BIGINT)
ALTER TABLE REQUEST ADD new_landlord_id BIGINT NULL;
GO

-- Thêm FK với type đúng
ALTER TABLE REQUEST
    ADD CONSTRAINT FK_REQUEST_NEW_LANDLORD
    FOREIGN KEY (new_landlord_id)
    REFERENCES LANDLORD(landlord_id);
GO

PRINT 'FIX 3 THÀNH CÔNG: new_landlord_id đã đổi sang BIGINT và FK đã tạo';
GO

/* ============================================================
   KIỂM TRA CUỐI CÙNG
   ============================================================ */

-- Kiểm tra tất cả constraints trên REQUEST và REGISTRATION
SELECT 
    t.name  AS table_name,
    cc.name AS constraint_name,
    cc.definition
FROM sys.check_constraints cc
JOIN sys.tables t ON cc.parent_object_id = t.object_id
WHERE t.name IN ('REGISTRATION', 'REQUEST')
ORDER BY t.name, cc.name;
GO

-- Kiểm tra cột REQUEST
SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'REQUEST'
ORDER BY ORDINAL_POSITION;
GO

PRINT '=== 08-fix-v2.sql hoàn tất ===';
GO
