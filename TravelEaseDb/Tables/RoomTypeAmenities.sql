CREATE TABLE [dbo].[RoomTypeAmenities] (
    [AmenitiesId] UNIQUEIDENTIFIER NOT NULL,
    [RoomTypesId] UNIQUEIDENTIFIER NOT NULL,
    CONSTRAINT [PK_RoomTypeAmenities] PRIMARY KEY CLUSTERED ([AmenitiesId] ASC, [RoomTypesId] ASC),
    CONSTRAINT [FK_RoomTypeAmenities_RoomAmenities_AmenitiesId] FOREIGN KEY ([AmenitiesId]) REFERENCES [dbo].[RoomAmenities] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_RoomTypeAmenities_RoomTypes_RoomTypesId] FOREIGN KEY ([RoomTypesId]) REFERENCES [dbo].[RoomTypes] ([Id]) ON DELETE CASCADE
);


GO
CREATE NONCLUSTERED INDEX [IX_RoomTypeAmenities_RoomTypesId]
    ON [dbo].[RoomTypeAmenities]([RoomTypesId] ASC);

