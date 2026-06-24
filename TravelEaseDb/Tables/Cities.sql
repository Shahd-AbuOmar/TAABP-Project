CREATE TABLE [dbo].[Cities] (
    [Id]          UNIQUEIDENTIFIER NOT NULL,
    [Name]        NVARCHAR (50)    NOT NULL,
    [CountryName] NVARCHAR (50)    NOT NULL,
    [CountryCode] NVARCHAR (3)     NOT NULL,
    [PostOffice]  NVARCHAR (10)    NOT NULL,
    [ImageUrl]    NVARCHAR (MAX)   DEFAULT (N'') NOT NULL,
    CONSTRAINT [PK_Cities] PRIMARY KEY CLUSTERED ([Id] ASC)
);

