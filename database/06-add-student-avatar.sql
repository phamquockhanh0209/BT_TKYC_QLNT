USE QLNT_TKYC;
GO

IF COL_LENGTH('dbo.STUDENT', 'avatar_path') IS NULL
BEGIN
    ALTER TABLE dbo.STUDENT
    ADD avatar_path VARCHAR(500) NULL;
END;
GO

IF COL_LENGTH('dbo.STUDENT', 'pending_avatar_path') IS NULL
BEGIN
    ALTER TABLE dbo.STUDENT
    ADD pending_avatar_path VARCHAR(500) NULL;
END;
GO