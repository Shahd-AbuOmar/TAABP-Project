CREATE TABLE [dbo].[Reviews] (
    [Id]         UNIQUEIDENTIFIER NOT NULL,
    [BookingId]  UNIQUEIDENTIFIER NOT NULL,
    [Comment]    NVARCHAR (500)   NOT NULL,
    [ReviewDate] DATETIME2 (7)    NOT NULL,
    [Rating]     REAL             NOT NULL,
    CONSTRAINT [PK_Reviews] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [CK_Review_RatingRange] CHECK ([Rating]>=(0) AND [Rating]<=(5)),
    CONSTRAINT [FK_Reviews_Bookings_BookingId] FOREIGN KEY ([BookingId]) REFERENCES [dbo].[Bookings] ([Id]) ON DELETE CASCADE
);


GO
CREATE UNIQUE NONCLUSTERED INDEX [IX_Reviews_BookingId]
    ON [dbo].[Reviews]([BookingId] ASC);

