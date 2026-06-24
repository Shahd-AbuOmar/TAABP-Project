CREATE TABLE [dbo].[Bookings] (
    [Id]           UNIQUEIDENTIFIER NOT NULL,
    [RoomId]       UNIQUEIDENTIFIER NOT NULL,
    [UserId]       UNIQUEIDENTIFIER NOT NULL,
    [CheckInDate]  DATETIME2 (7)    NOT NULL,
    [CheckOutDate] DATETIME2 (7)    NOT NULL,
    [BookingDate]  DATETIME2 (7)    NOT NULL,
    [Price]        DECIMAL (18, 2)  NOT NULL,
    CONSTRAINT [PK_Bookings] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Bookings_Rooms_RoomId] FOREIGN KEY ([RoomId]) REFERENCES [dbo].[Rooms] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Bookings_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users] ([Id]) ON DELETE CASCADE
);


GO
CREATE NONCLUSTERED INDEX [IX_Bookings_RoomId]
    ON [dbo].[Bookings]([RoomId] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_Bookings_UserId]
    ON [dbo].[Bookings]([UserId] ASC);

