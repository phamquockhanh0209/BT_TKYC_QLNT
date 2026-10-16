/* ============================================================
   07-fix-constraints.sql
   Mô tả: Sửa các CHECK Constraint bị thiếu/sai trong database.
   
   Vấn đề cần fix:
   1. CK_REGISTRATION_STATUS thiếu 'ACTIVE' và 'WITHDRAWN'
      → INSERT status='ACTIVE' hoặc 'WITHDRAWN' bị lỗi constraint violation
   2. CK_REQUEST_TYPE dùng 'RENEW'/'TERMINATE' nhưng backend Constants
      dùng 'RENEWAL'/'TERMINATION' → INSERT request sẽ fail
   
   Chạy file này SAU khi đã chạy 01-create-tables.sql
   ============================================================ */


/* ============================================================
   FIX 1: REGISTRATION — thêm trạng thái ACTIVE và WITHDRAWN
   ============================================================ */

-- Xóa constraint cũ (chỉ có 8 trạng thái, thiếu ACTIVE và WITHDRAWN)
ALTER TABLE REGISTRATION
    DROP CONSTRAINT CK_REGISTRATION_STATUS;
GO

-- Tạo lại constraint với đủ 10 trạng thái theo RegistrationConstants.cs
ALTER TABLE REGISTRATION
    ADD CONSTRAINT CK_REGISTRATION_STATUS
    CHECK
    (
        status IN
        (
            'DRAFT',           -- Sinh viên tạo nháp chưa gửi
            'SUBMITTED',       -- Đã nộp, chờ tiếp nhận
            'UNDER_REVIEW',    -- Đang thẩm định
            'NEED_MORE_INFO',  -- Cần bổ sung giấy tờ
            'APPROVED',        -- Đã phê duyệt (chờ kích hoạt - trạng thái trung gian)
            'ACTIVE',          -- Đang hoạt động (FIX: đã thêm)
            'REJECTED',        -- Bị từ chối
            'WITHDRAWN',       -- Sinh viên rút hồ sơ (FIX: đã thêm)
            'EXPIRED',         -- Hết hạn (tự động bởi Scheduler)
            'TERMINATED'       -- Chấm dứt theo yêu cầu TERMINATION
        )
    );
GO

PRINT 'FIX 1: CK_REGISTRATION_STATUS đã được cập nhật (thêm ACTIVE, WITHDRAWN)';
GO


/* ============================================================
   FIX 2: REQUEST — đồng bộ request_type với backend Constants
   ============================================================ */

-- Xóa constraint cũ (dùng 'RENEW' và 'TERMINATE' — không khớp với backend)
ALTER TABLE REQUEST
    DROP CONSTRAINT CK_REQUEST_TYPE;
GO

-- Tạo lại constraint khớp với RegistrationConstants.cs:
-- RequestType enum: RENEWAL, CHANGE_ADDRESS, TERMINATION
ALTER TABLE REQUEST
    ADD CONSTRAINT CK_REQUEST_TYPE
    CHECK
    (
        request_type IN
        (
            'RENEWAL',        -- Gia hạn hồ sơ (FIX: đổi từ 'RENEW')
            'CHANGE_ADDRESS', -- Báo chuyển trọ (giữ nguyên)
            'TERMINATION'     -- Chấm dứt ngoại trú (FIX: đổi từ 'TERMINATE')
        )
    );
GO

PRINT 'FIX 2: CK_REQUEST_TYPE đã được cập nhật (RENEW→RENEWAL, TERMINATE→TERMINATION)';
GO


/* ============================================================
   FIX 3: REQUEST — thêm cột địa chỉ mới cho CHANGE_ADDRESS
   Bảng REQUEST chỉ có cột reason, không lưu được địa chỉ mới
   khi sinh viên báo chuyển trọ.
   ============================================================ */

ALTER TABLE REQUEST
    ADD new_address_line  NVARCHAR(500) NULL,
        new_ward          NVARCHAR(100) NULL,
        new_district      NVARCHAR(100) NULL,
        new_city          NVARCHAR(100) NULL,
        new_landlord_id   INT          NULL;
GO

-- Thêm FK cho new_landlord_id nếu bảng LANDLORD tồn tại
IF EXISTS (SELECT 1 FROM sys.tables WHERE name = 'LANDLORD')
BEGIN
    ALTER TABLE REQUEST
        ADD CONSTRAINT FK_REQUEST_NEW_LANDLORD
        FOREIGN KEY (new_landlord_id)
        REFERENCES LANDLORD(landlord_id);
    PRINT 'FIX 3b: FK_REQUEST_NEW_LANDLORD đã được tạo';
END
GO

PRINT 'FIX 3: Bảng REQUEST đã có thêm cột địa chỉ mới cho CHANGE_ADDRESS request';
GO


/* ============================================================
   KIỂM TRA SAU KHI FIX
   ============================================================ */

-- Kiểm tra constraint REGISTRATION
SELECT 
    cc.name        AS constraint_name,
    cc.definition  AS constraint_definition
FROM sys.check_constraints cc
JOIN sys.tables t ON cc.parent_object_id = t.object_id
WHERE t.name IN ('REGISTRATION', 'REQUEST')
ORDER BY t.name, cc.name;
GO

-- Kiểm tra cột mới trong REQUEST
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH,
    IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'REQUEST'
ORDER BY ORDINAL_POSITION;
GO

PRINT '=== Hoàn tất Fix Constraints ===';
GO
