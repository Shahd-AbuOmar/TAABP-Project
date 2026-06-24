CREATE TABLE [dbo].[Users] (
    [Id]           UNIQUEIDENTIFIER NOT NULL,
    [FirstName]    NVARCHAR (50)    NOT NULL,
    [LastName]     NVARCHAR (50)    NOT NULL,
    [Email]        NVARCHAR (100)   NOT NULL,
    [PhoneNumber]  NVARCHAR (20)    NOT NULL,
    [PasswordHash] NVARCHAR (MAX)   NOT NULL,
    [Salt]         NVARCHAR (MAX)   NOT NULL,
    [Role]         NVARCHAR (MAX)   NOT NULL,
    CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
CREATE UNIQUE NONCLUSTERED INDEX [IX_Users_Email]
    ON [dbo].[Users]([Email] ASC);

