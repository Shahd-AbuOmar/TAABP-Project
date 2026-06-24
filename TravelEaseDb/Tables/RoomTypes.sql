CREATE TABLE [dbo].[RoomTypes] (
    [Id]            UNIQUEIDENTIFIER NOT NULL,
    [HotelId]       UNIQUEIDENTIFIER NOT NULL,
    [Category]      NVARCHAR (MAX)   NOT NULL,
    [PricePerNight] DECIMAL (18, 2)  NOT NULL,
    CONSTRAINT [PK_RoomTypes] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [CK_RoomType_PriceRange] CHECK ([PricePerNight]>=(0)),
    CONSTRAINT [FK_RoomTypes_Hotels_HotelId] FOREIGN KEY ([HotelId]) REFERENCES [dbo].[Hotels] ([Id]) ON DELETE CASCADE
);


GO
CREATE NONCLUSTERED INDEX [IX_RoomTypes_HotelId]
    ON [dbo].[RoomTypes]([HotelId] ASC);

