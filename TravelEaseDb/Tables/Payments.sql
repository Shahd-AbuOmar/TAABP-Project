CREATE TABLE [dbo].[Payments] (
    [Id]              UNIQUEIDENTIFIER NOT NULL,
    [BookingId]       UNIQUEIDENTIFIER NOT NULL,
    [Method]          NVARCHAR (50)    NOT NULL,
    [Status]          NVARCHAR (50)    NOT NULL,
    [Amount]          DECIMAL (18, 2)  NOT NULL,
    [PaymentIntentId] NVARCHAR (MAX)   DEFAULT (N'') NOT NULL,
    CONSTRAINT [PK_Payments] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Payments_Bookings_BookingId] FOREIGN KEY ([BookingId]) REFERENCES [dbo].[Bookings] ([Id]) ON DELETE CASCADE
);


GO
CREATE UNIQUE NONCLUSTERED INDEX [IX_Payments_BookingId]
    ON [dbo].[Payments]([BookingId] ASC);

