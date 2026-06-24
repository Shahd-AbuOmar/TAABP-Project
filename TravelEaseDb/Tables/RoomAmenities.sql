CREATE TABLE [dbo].[RoomAmenities] (
    [Id]          UNIQUEIDENTIFIER NOT NULL,
    [Name]        NVARCHAR (100)   NOT NULL,
    [Description] NVARCHAR (500)   NOT NULL,
    CONSTRAINT [PK_RoomAmenities] PRIMARY KEY CLUSTERED ([Id] ASC)
);

