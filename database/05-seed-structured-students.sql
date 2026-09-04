-- =================================================================================================
-- FILE: 05-seed-structured-students.sql
-- DỰ ÁN: HỆ THỐNG QUẢN LÝ NGOẠI TRÚ SINH VIÊN (QLNT · TKYC)
-- MỤC ĐÍCH: Nạp danh sách 48 sinh viên chuẩn quy tắc MSSV và tài khoản đăng nhập vào SSMS
-- 
-- CẤU TRÚC MSSV (6 chữ số): [Khóa (2 số)] + [Mã Ngành (2 số)] + [STT (2 số)]
--   - 4 Khóa: 67 (Năm 1, 2008), 66 (Năm 2, 2007), 65 (Năm 3, 2006), 64 (Năm 4, 2005)
--   - 4 Ngành: 01 (CNTT), 02 (KTMT), 03 (Logistics), 04 (Tự động hóa)
--   - STT: 01, 02, 03...
--   - Mật khẩu mặc định: 123456 (Đã hash BCrypt chuẩn ASP.NET Core)
-- =================================================================================================

USE QLNT_TKYC;
GO

SET NOCOUNT ON;
PRINT N'==> BẮT ĐẦU NẠP DỮ LIỆU SINH VIÊN THEO QUY TẮC MSSV...';

-- Hash BCrypt chuẩn cho mật khẩu: 123456
DECLARE @DefaultPasswordHash VARCHAR(255) = '$2a$11$y0iGmPpLFe68YnMkQ86T/OLqWRt8/J14w5DyU6.sRiPw8lIiCzAFC';

-- -------------------------------------------------------------------------------------------------
-- 1. ĐẢM BẢO CÁC ROLE HỆ THỐNG ĐÃ TỒN TẠI
-- -------------------------------------------------------------------------------------------------
IF NOT EXISTS (SELECT 1 FROM dbo.[ROLE] WHERE role_code = 'STUDENT')
    INSERT INTO dbo.[ROLE] (role_code, role_name, description, [status])
    VALUES ('STUDENT', N'Sinh viên', N'Sinh viên đại học', 'ACTIVE');

IF NOT EXISTS (SELECT 1 FROM dbo.[ROLE] WHERE role_code = 'OFFICER')
    INSERT INTO dbo.[ROLE] (role_code, role_name, description, [status])
    VALUES ('OFFICER', N'Cán bộ', N'Cán bộ tiếp nhận ngoại trú', 'ACTIVE');

IF NOT EXISTS (SELECT 1 FROM dbo.[ROLE] WHERE role_code = 'REVIEWER')
    INSERT INTO dbo.[ROLE] (role_code, role_name, description, [status])
    VALUES ('REVIEWER', N'Thẩm định viên', N'Chuyên viên xét duyệt hồ sơ', 'ACTIVE');

IF NOT EXISTS (SELECT 1 FROM dbo.[ROLE] WHERE role_code = 'ADMIN')
    INSERT INTO dbo.[ROLE] (role_code, role_name, description, [status])
    VALUES ('ADMIN', N'Quản trị viên', N'Quản trị toàn hệ thống', 'ACTIVE');

DECLARE @StudentRoleId BIGINT = (SELECT role_id FROM dbo.[ROLE] WHERE role_code = 'STUDENT');

-- -------------------------------------------------------------------------------------------------
-- 2. ĐẢM BẢO TÀI KHOẢN CÁN BỘ / QUẢN TRỊ CÓ PASS: 123456 VÀ STATUS: ACTIVE
-- -------------------------------------------------------------------------------------------------
UPDATE dbo.[USER]
SET password_hash = @DefaultPasswordHash,
    [status] = 'ACTIVE',
    updated_at = GETDATE()
WHERE username IN ('admin', 'officer01', 'reviewer01');

-- -------------------------------------------------------------------------------------------------
-- 3. BẢNG TẠM CHỨA DANH SÁCH 48 SINH VIÊN THEO ĐÚNG CÔNG THỨC MSSV
-- -------------------------------------------------------------------------------------------------
IF OBJECT_ID('tempdb..#SeedStudents') IS NOT NULL DROP TABLE #SeedStudents;

CREATE TABLE #SeedStudents
(
    student_code VARCHAR(30) NOT NULL PRIMARY KEY,
    full_name NVARCHAR(150) NOT NULL,
    gender VARCHAR(20) NOT NULL,
    date_of_birth DATE NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    faculty NVARCHAR(150) NOT NULL,
    class_name VARCHAR(100) NOT NULL
);

-- ==============================================================================================
-- KHÓA 67 (NĂM 1)
-- ==============================================================================================
-- Ngành 01: Công nghệ Thông tin (Lớp 67-CNTT)
INSERT INTO #SeedStudents VALUES ('670101', N'Nguyễn Văn An', 'MALE', '2008-04-11', '670101@student.edu.vn', '090670101', N'Công nghệ Thông tin', '67-CNTT');
INSERT INTO #SeedStudents VALUES ('670102', N'Trần Thị Bình', 'FEMALE', '2008-05-12', '670102@student.edu.vn', '090670102', N'Công nghệ Thông tin', '67-CNTT');
INSERT INTO #SeedStudents VALUES ('670103', N'Lê Quốc Dũng', 'MALE', '2008-06-13', '670103@student.edu.vn', '090670103', N'Công nghệ Thông tin', '67-CNTT');

-- Ngành 02: Kỹ thuật Máy tính (Lớp 67-KTMT)
INSERT INTO #SeedStudents VALUES ('670201', N'Nguyễn Văn An', 'MALE', '2008-04-11', '670201@student.edu.vn', '090670201', N'Kỹ thuật Máy tính', '67-KTMT');
INSERT INTO #SeedStudents VALUES ('670202', N'Trần Thị Bình', 'FEMALE', '2008-05-12', '670202@student.edu.vn', '090670202', N'Kỹ thuật Máy tính', '67-KTMT');
INSERT INTO #SeedStudents VALUES ('670203', N'Lê Quốc Dũng', 'MALE', '2008-06-13', '670203@student.edu.vn', '090670203', N'Kỹ thuật Máy tính', '67-KTMT');

-- Ngành 03: Logistics (Lớp 67-LOG)
INSERT INTO #SeedStudents VALUES ('670301', N'Nguyễn Văn An', 'MALE', '2008-04-11', '670301@student.edu.vn', '090670301', N'Kinh tế & Vận tải', '67-LOG');
INSERT INTO #SeedStudents VALUES ('670302', N'Trần Thị Bình', 'FEMALE', '2008-05-12', '670302@student.edu.vn', '090670302', N'Kinh tế & Vận tải', '67-LOG');
INSERT INTO #SeedStudents VALUES ('670303', N'Lê Quốc Dũng', 'MALE', '2008-06-13', '670303@student.edu.vn', '090670303', N'Kinh tế & Vận tải', '67-LOG');

-- Ngành 04: Tự động hóa (Lớp 67-TDH)
INSERT INTO #SeedStudents VALUES ('670401', N'Nguyễn Văn An', 'MALE', '2008-04-11', '670401@student.edu.vn', '090670401', N'Điện - Điện tử', '67-TDH');
INSERT INTO #SeedStudents VALUES ('670402', N'Trần Thị Bình', 'FEMALE', '2008-05-12', '670402@student.edu.vn', '090670402', N'Điện - Điện tử', '67-TDH');
INSERT INTO #SeedStudents VALUES ('670403', N'Lê Quốc Dũng', 'MALE', '2008-06-13', '670403@student.edu.vn', '090670403', N'Điện - Điện tử', '67-TDH');

-- ==============================================================================================
-- KHÓA 66 (NĂM 2)
-- ==============================================================================================
-- Ngành 01: Công nghệ Thông tin (Lớp 66-CNTT)
INSERT INTO #SeedStudents VALUES ('660101', N'Nguyễn Văn An', 'MALE', '2007-04-11', '660101@student.edu.vn', '090660101', N'Công nghệ Thông tin', '66-CNTT');
INSERT INTO #SeedStudents VALUES ('660102', N'Trần Thị Bình', 'FEMALE', '2007-05-12', '660102@student.edu.vn', '090660102', N'Công nghệ Thông tin', '66-CNTT');
INSERT INTO #SeedStudents VALUES ('660103', N'Lê Quốc Dũng', 'MALE', '2007-06-13', '660103@student.edu.vn', '090660103', N'Công nghệ Thông tin', '66-CNTT');

-- Ngành 02: Kỹ thuật Máy tính (Lớp 66-KTMT)
INSERT INTO #SeedStudents VALUES ('660201', N'Nguyễn Văn An', 'MALE', '2007-04-11', '660201@student.edu.vn', '090660201', N'Kỹ thuật Máy tính', '66-KTMT');
INSERT INTO #SeedStudents VALUES ('660202', N'Trần Thị Bình', 'FEMALE', '2007-05-12', '660202@student.edu.vn', '090660202', N'Kỹ thuật Máy tính', '66-KTMT');
INSERT INTO #SeedStudents VALUES ('660203', N'Lê Quốc Dũng', 'MALE', '2007-06-13', '660203@student.edu.vn', '090660203', N'Kỹ thuật Máy tính', '66-KTMT');

-- Ngành 03: Logistics (Lớp 66-LOG)
INSERT INTO #SeedStudents VALUES ('660301', N'Nguyễn Văn An', 'MALE', '2007-04-11', '660301@student.edu.vn', '090660301', N'Kinh tế & Vận tải', '66-LOG');
INSERT INTO #SeedStudents VALUES ('660302', N'Trần Thị Bình', 'FEMALE', '2007-05-12', '660302@student.edu.vn', '090660302', N'Kinh tế & Vận tải', '66-LOG');
INSERT INTO #SeedStudents VALUES ('660303', N'Lê Quốc Dũng', 'MALE', '2007-06-13', '660303@student.edu.vn', '090660303', N'Kinh tế & Vận tải', '66-LOG');

-- Ngành 04: Tự động hóa (Lớp 66-TDH)
INSERT INTO #SeedStudents VALUES ('660401', N'Nguyễn Văn An', 'MALE', '2007-04-11', '660401@student.edu.vn', '090660401', N'Điện - Điện tử', '66-TDH');
INSERT INTO #SeedStudents VALUES ('660402', N'Trần Thị Bình', 'FEMALE', '2007-05-12', '660402@student.edu.vn', '090660402', N'Điện - Điện tử', '66-TDH');
INSERT INTO #SeedStudents VALUES ('660403', N'Lê Quốc Dũng', 'MALE', '2007-06-13', '660403@student.edu.vn', '090660403', N'Điện - Điện tử', '66-TDH');

-- ==============================================================================================
-- KHÓA 65 (NĂM 3) — KHÓA TRỌNG TÂM
-- ==============================================================================================
-- Ngành 01: Công nghệ Thông tin (Lớp 65-CNTT)
INSERT INTO #SeedStudents VALUES ('650101', N'Nguyễn Văn An', 'MALE', '2006-04-11', '650101@student.edu.vn', '090650101', N'Công nghệ Thông tin', '65-CNTT');
INSERT INTO #SeedStudents VALUES ('650102', N'Trần Thị Bình', 'FEMALE', '2006-05-12', '650102@student.edu.vn', '090650102', N'Công nghệ Thông tin', '65-CNTT');
INSERT INTO #SeedStudents VALUES ('650103', N'Lê Quốc Dũng', 'MALE', '2006-06-13', '650103@student.edu.vn', '090650103', N'Công nghệ Thông tin', '65-CNTT');

-- Ngành 02: Kỹ thuật Máy tính (Lớp 65-KTMT)
INSERT INTO #SeedStudents VALUES ('650201', N'Nguyễn Văn An', 'MALE', '2006-04-11', '650201@student.edu.vn', '090650201', N'Kỹ thuật Máy tính', '65-KTMT');
INSERT INTO #SeedStudents VALUES ('650202', N'Trần Thị Bình', 'FEMALE', '2006-05-12', '650202@student.edu.vn', '090650202', N'Kỹ thuật Máy tính', '65-KTMT');
INSERT INTO #SeedStudents VALUES ('650203', N'Lê Quốc Dũng', 'MALE', '2006-06-13', '650203@student.edu.vn', '090650203', N'Kỹ thuật Máy tính', '65-KTMT');

-- Ngành 03: Logistics (Lớp 65-LOG)
INSERT INTO #SeedStudents VALUES ('650301', N'Nguyễn Văn An', 'MALE', '2006-04-11', '650301@student.edu.vn', '090650301', N'Kinh tế & Vận tải', '65-LOG');
INSERT INTO #SeedStudents VALUES ('650302', N'Trần Thị Bình', 'FEMALE', '2006-05-12', '650302@student.edu.vn', '090650302', N'Kinh tế & Vận tải', '65-LOG');
INSERT INTO #SeedStudents VALUES ('650303', N'Lê Quốc Dũng', 'MALE', '2006-06-13', '650303@student.edu.vn', '090650303', N'Kinh tế & Vận tải', '65-LOG');

-- Ngành 04: Tự động hóa (Lớp 65-TDH)
INSERT INTO #SeedStudents VALUES ('650401', N'Nguyễn Văn An', 'MALE', '2006-04-11', '650401@student.edu.vn', '090650401', N'Điện - Điện tử', '65-TDH');
INSERT INTO #SeedStudents VALUES ('650402', N'Trần Thị Bình', 'FEMALE', '2006-05-12', '650402@student.edu.vn', '090650402', N'Điện - Điện tử', '65-TDH');
INSERT INTO #SeedStudents VALUES ('650403', N'Lê Quốc Dũng', 'MALE', '2006-06-13', '650403@student.edu.vn', '090650403', N'Điện - Điện tử', '65-TDH');

-- ==============================================================================================
-- KHÓA 64 (NĂM 4)
-- ==============================================================================================
-- Ngành 01: Công nghệ Thông tin (Lớp 64-CNTT)
INSERT INTO #SeedStudents VALUES ('640101', N'Nguyễn Văn An', 'MALE', '2005-04-11', '640101@student.edu.vn', '090640101', N'Công nghệ Thông tin', '64-CNTT');
INSERT INTO #SeedStudents VALUES ('640102', N'Trần Thị Bình', 'FEMALE', '2005-05-12', '640102@student.edu.vn', '090640102', N'Công nghệ Thông tin', '64-CNTT');
INSERT INTO #SeedStudents VALUES ('640103', N'Lê Quốc Dũng', 'MALE', '2005-06-13', '640103@student.edu.vn', '090640103', N'Công nghệ Thông tin', '64-CNTT');

-- Ngành 02: Kỹ thuật Máy tính (Lớp 64-KTMT)
INSERT INTO #SeedStudents VALUES ('640201', N'Nguyễn Văn An', 'MALE', '2005-04-11', '640201@student.edu.vn', '090640201', N'Kỹ thuật Máy tính', '64-KTMT');
INSERT INTO #SeedStudents VALUES ('640202', N'Trần Thị Bình', 'FEMALE', '2005-05-12', '640202@student.edu.vn', '090640202', N'Kỹ thuật Máy tính', '64-KTMT');
INSERT INTO #SeedStudents VALUES ('640203', N'Lê Quốc Dũng', 'MALE', '2005-06-13', '640203@student.edu.vn', '090640203', N'Kỹ thuật Máy tính', '64-KTMT');

-- Ngành 03: Logistics (Lớp 64-LOG)
INSERT INTO #SeedStudents VALUES ('640301', N'Nguyễn Văn An', 'MALE', '2005-04-11', '640301@student.edu.vn', '090640301', N'Kinh tế & Vận tải', '64-LOG');
INSERT INTO #SeedStudents VALUES ('640302', N'Trần Thị Bình', 'FEMALE', '2005-05-12', '640302@student.edu.vn', '090640302', N'Kinh tế & Vận tải', '64-LOG');
INSERT INTO #SeedStudents VALUES ('640303', N'Lê Quốc Dũng', 'MALE', '2005-06-13', '640303@student.edu.vn', '090640303', N'Kinh tế & Vận tải', '64-LOG');

-- Ngành 04: Tự động hóa (Lớp 64-TDH)
INSERT INTO #SeedStudents VALUES ('640401', N'Nguyễn Văn An', 'MALE', '2005-04-11', '640401@student.edu.vn', '090640401', N'Điện - Điện tử', '64-TDH');
INSERT INTO #SeedStudents VALUES ('640402', N'Trần Thị Bình', 'FEMALE', '2005-05-12', '640402@student.edu.vn', '090640402', N'Điện - Điện tử', '64-TDH');
INSERT INTO #SeedStudents VALUES ('640403', N'Lê Quốc Dũng', 'MALE', '2005-06-13', '640403@student.edu.vn', '090640403', N'Điện - Điện tử', '64-TDH');

-- -------------------------------------------------------------------------------------------------
-- 4. MERGE VÀO BẢNG STUDENT (THÊM MỚI NẾU CHƯA CÓ, CẬP NHẬT NẾU ĐÃ CÓ)
-- -------------------------------------------------------------------------------------------------
MERGE INTO dbo.STUDENT AS target
USING #SeedStudents AS source
ON target.student_code = source.student_code
WHEN MATCHED THEN
    UPDATE SET
        target.full_name = source.full_name,
        target.gender = source.gender,
        target.date_of_birth = source.date_of_birth,
        target.email = source.email,
        target.phone = source.phone,
        target.faculty = source.faculty,
        target.class_name = source.class_name,
        target.academic_status = 'ENROLLED',
        target.updated_at = GETDATE()
WHEN NOT MATCHED THEN
    INSERT (student_code, full_name, date_of_birth, gender, email, phone, faculty, class_name, academic_status, created_at, updated_at)
    VALUES (source.student_code, source.full_name, source.date_of_birth, source.gender, source.email, source.phone, source.faculty, source.class_name, 'ENROLLED', GETDATE(), GETDATE());

PRINT N'==> Đã cập nhật xong dữ liệu bảng STUDENT.';

-- -------------------------------------------------------------------------------------------------
-- 5. MERGE VÀO BẢNG USER (TÊN ĐĂNG NHẬP LÀ CHÍNH MSSV, MẬT KHẨU: 123456)
-- -------------------------------------------------------------------------------------------------
MERGE INTO dbo.[USER] AS target
USING #SeedStudents AS source
ON target.username = source.student_code
WHEN MATCHED THEN
    UPDATE SET
        target.full_name = source.full_name,
        target.email = source.email,
        target.phone = source.phone,
        target.password_hash = @DefaultPasswordHash,
        target.[status] = 'ACTIVE',
        target.updated_at = GETDATE()
WHEN NOT MATCHED THEN
    INSERT (username, password_hash, full_name, email, phone, [status], created_at, updated_at)
    VALUES (source.student_code, @DefaultPasswordHash, source.full_name, source.email, source.phone, 'ACTIVE', GETDATE(), GETDATE());

PRINT N'==> Đã cập nhật xong tài khoản USER (Username = MSSV, Mật khẩu = 123456).';

-- -------------------------------------------------------------------------------------------------
-- 6. GÁN ROLE STUDENT CHO CÁC TÀI KHOẢN SINH VIÊN TRONG BẢNG USER_ROLE
-- -------------------------------------------------------------------------------------------------
INSERT INTO dbo.USER_ROLE (user_id, role_id, assigned_at)
SELECT u.user_id, @StudentRoleId, GETDATE()
FROM dbo.[USER] u
WHERE u.username IN (SELECT student_code FROM #SeedStudents)
  AND NOT EXISTS (
      SELECT 1 FROM dbo.USER_ROLE ur
      WHERE ur.user_id = u.user_id AND ur.role_id = @StudentRoleId
  );

PRINT N'==> Đã gán vai trò STUDENT cho toàn bộ 48 sinh viên.';

-- -------------------------------------------------------------------------------------------------
-- 7. TẠO HỒ SƠ NGOẠI TRÚ MẪU CHO MỘT SỐ SINH VIÊN TIÊU BIỂU ĐỂ CÓ DỮ LIỆU HIỂN THỊ NGAY
-- -------------------------------------------------------------------------------------------------
-- Đảm bảo có ít nhất 1 chủ trọ mẫu
IF NOT EXISTS (SELECT 1 FROM dbo.LANDLORD WHERE phone = '0918889901')
    INSERT INTO dbo.LANDLORD (full_name, phone, identity_number, email, note, created_at, updated_at)
    VALUES (N'Nguyễn Văn Hùng', '0918889901', '079085001234', 'hung.nhatro@gmail.com', N'Dãy trọ 12 phòng, camera an ninh', GETDATE(), GETDATE());

DECLARE @LandlordId BIGINT = (SELECT TOP 1 landlord_id FROM dbo.LANDLORD);

-- Tạo hồ sơ ngoại trú ACTIVE cho sinh viên 650101 (Nguyễn Văn An, K65 CNTT)
DECLARE @Student650101Id BIGINT = (SELECT student_id FROM dbo.STUDENT WHERE student_code = '650101');
IF @Student650101Id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM dbo.REGISTRATION WHERE student_id = @Student650101Id)
BEGIN
    INSERT INTO dbo.REGISTRATION (student_id, registration_code, [status], submitted_at, approved_at, start_date, expiry_date, created_at, updated_at)
    VALUES (@Student650101Id, 'HS-650101', 'APPROVED', DATEADD(month, -2, GETDATE()), DATEADD(month, -2, GETDATE()), '2026-09-01', '2027-06-30', GETDATE(), GETDATE());

    DECLARE @RegId BIGINT = SCOPE_IDENTITY();

    INSERT INTO dbo.[ADDRESS] (registration_id, landlord_id, address_line, ward, district, province, address_type, start_date, end_date, [status], created_at, updated_at)
    VALUES (@RegId, @LandlordId, N'128/4 Võ Văn Ngân', N'Linh Chiểu', N'TP. Thủ Đức', N'TP. Hồ Chí Minh', 'TEMPORARY', '2026-09-01', '2027-06-30', 'CURRENT', GETDATE(), GETDATE());

    INSERT INTO dbo.DOCUMENT (registration_id, document_type, document_status, current_version, required_flag, created_at, updated_at)
    VALUES (@RegId, 'RENTAL_CONTRACT', 'VALID', 1, 1, GETDATE(), GETDATE());
END;

-- Tạo hồ sơ ngoại trú CHỜ DUYỆT cho sinh viên 660202 (Trần Thị Bình, K66 KTMT)
DECLARE @Student660202Id BIGINT = (SELECT student_id FROM dbo.STUDENT WHERE student_code = '660202');
IF @Student660202Id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM dbo.REGISTRATION WHERE student_id = @Student660202Id)
BEGIN
    INSERT INTO dbo.REGISTRATION (student_id, registration_code, [status], submitted_at, start_date, expiry_date, created_at, updated_at)
    VALUES (@Student660202Id, 'HS-660202', 'SUBMITTED', DATEADD(day, -1, GETDATE()), '2026-09-01', '2027-06-30', GETDATE(), GETDATE());

    DECLARE @Reg2Id BIGINT = SCOPE_IDENTITY();

    INSERT INTO dbo.[ADDRESS] (registration_id, landlord_id, address_line, ward, district, province, address_type, start_date, end_date, [status], created_at, updated_at)
    VALUES (@Reg2Id, @LandlordId, N'45 Lê Văn Việt', N'Tăng Nhơn Phú A', N'TP. Thủ Đức', N'TP. Hồ Chí Minh', 'TEMPORARY', '2026-09-01', '2027-06-30', 'CURRENT', GETDATE(), GETDATE());
END;

-- -------------------------------------------------------------------------------------------------
-- 8. BÁO CÁO TỔNG KẾT KẾT QUẢ TRONG SSMS
-- -------------------------------------------------------------------------------------------------
PRINT N'====================================================================================';
PRINT N'✅ ĐÃ NẠP THÀNH CÔNG DỮ LIỆU SINH VIÊN VÀO CƠ SỞ DỮ LIỆU QLNT_TKYC!';
PRINT N'   - Tổng sinh viên chuẩn MSSV: 48 sinh viên';
PRINT N'   - Mật khẩu đăng nhập: 123456';
PRINT N'====================================================================================';

-- Thống kê hiển thị ra bảng kết quả (Result Grid trong SSMS)
SELECT 
    s.student_code AS [MSSV (Username)],
    s.full_name AS [Họ và tên],
    s.class_name AS [Lớp],
    s.faculty AS [Khoa / Ngành],
    s.email AS [Email],
    s.phone AS [Số điện thoại],
    u.[status] AS [Trạng thái tài khoản]
FROM dbo.STUDENT s
INNER JOIN dbo.[USER] u ON s.student_code = u.username
WHERE LEN(s.student_code) = 6
ORDER BY s.student_code;

DROP TABLE #SeedStudents;
GO
