/* ============================================================
   09-fix-v3.sql
   Mô tả: Sửa ràng buộc UNIQUE trên cột identity_number của bảng LANDLORD.
   
   Vấn đề:
   Trong SQL Server, ràng buộc UNIQUE dạng CONSTRAINT trên cột nullable
   chỉ cho phép tối đa 1 bản ghi có giá trị NULL. Khi sinh viên nộp hồ sơ
   mà không nhập số CCCD chủ trọ (hoặc nhiều chủ trọ chưa có CCCD),
   thao tác INSERT thứ 2 sẽ gây lỗi 2627:
   "Violation of UNIQUE KEY constraint 'UQ_LANDLORD_IDENTITY'. Cannot insert duplicate key in object 'dbo.LANDLORD'. The duplicate key value is (<NULL>)."

   Giải pháp:
   Chuyển sang Filtered Unique Index: chỉ bắt buộc Unique khi identity_number IS NOT NULL.
   ============================================================ */

USE QLNT_TKYC;
GO

IF EXISTS (SELECT 1 FROM sys.key_constraints WHERE name = 'UQ_LANDLORD_IDENTITY')
BEGIN
    ALTER TABLE dbo.LANDLORD DROP CONSTRAINT UQ_LANDLORD_IDENTITY;
    PRINT 'Đã xóa constraint UQ_LANDLORD_IDENTITY';
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'UQ_LANDLORD_IDENTITY_FILTERED' AND object_id = OBJECT_ID('dbo.LANDLORD'))
BEGIN
    CREATE UNIQUE NONCLUSTERED INDEX UQ_LANDLORD_IDENTITY_FILTERED 
    ON dbo.LANDLORD(identity_number) 
    WHERE identity_number IS NOT NULL;
    PRINT 'Đã tạo Filtered Unique Index UQ_LANDLORD_IDENTITY_FILTERED';
END
GO
