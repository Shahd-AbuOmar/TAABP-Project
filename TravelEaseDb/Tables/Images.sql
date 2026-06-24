CREATE TABLE [dbo].[Images] (
    [Id]       UNIQUEIDENTIFIER DEFAULT (newid()) NOT NULL,
    [EntityId] UNIQUEIDENTIFIER NOT NULL,
    [Url]      NVARCHAR (500)   NOT NULL,
    [Type]     NVARCHAR (50)    NOT NULL,
    [Format]   NVARCHAR (50)    NOT NULL,
    CONSTRAINT [PK_Images] PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
CREATE NONCLUSTERED INDEX [IX_Images_EntityId]
    ON [dbo].[Images]([EntityId] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_Images_Type]
    ON [dbo].[Images]([Type] ASC);

