CREATE TABLE [dbo].[Rooms] (
    [Id]               UNIQUEIDENTIFIER NOT NULL,
    [RoomTypeId]       UNIQUEIDENTIFIER NOT NULL,
    [AdultsCapacity]   INT              DEFAULT ((2)) NOT NULL,
    [ChildrenCapacity] INT              DEFAULT ((0)) NOT NULL,
    [View]             NVARCHAR (100)   NOT NULL,
    [Rating]           REAL             NOT NULL,
    CONSTRAINT [PK_Rooms] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [CK_Room_RatingRange] CHECK ([Rating]>=(0) AND [Rating]<=(5)),
    CONSTRAINT [FK_Rooms_RoomTypes_RoomTypeId] FOREIGN KEY ([RoomTypeId]) REFERENCES [dbo].[RoomTypes] ([Id])
);


GO
CREATE NONCLUSTERED INDEX [IX_Rooms_RoomTypeId]
    ON [dbo].[Rooms]([RoomTypeId] ASC);

