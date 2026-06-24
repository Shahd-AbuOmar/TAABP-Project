CREATE TABLE [dbo].[Discounts] (
    [Id]                 UNIQUEIDENTIFIER NOT NULL,
    [RoomTypeId]         UNIQUEIDENTIFIER NOT NULL,
    [DiscountPercentage] REAL             NOT NULL,
    [FromDate]           DATETIME2 (7)    NOT NULL,
    [ToDate]             DATETIME2 (7)    NOT NULL,
    CONSTRAINT [PK_Discounts] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [CK_Discount_PercentageRange] CHECK ([DiscountPercentage]>=(0) AND [DiscountPercentage]<=(100)),
    CONSTRAINT [FK_Discounts_RoomTypes_RoomTypeId] FOREIGN KEY ([RoomTypeId]) REFERENCES [dbo].[RoomTypes] ([Id]) ON DELETE CASCADE
);


GO
CREATE NONCLUSTERED INDEX [IX_Discounts_RoomTypeId]
    ON [dbo].[Discounts]([RoomTypeId] ASC);

