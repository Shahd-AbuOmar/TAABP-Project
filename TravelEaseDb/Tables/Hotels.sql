CREATE TABLE [dbo].[Hotels] (
    [Id]            UNIQUEIDENTIFIER NOT NULL,
    [CityId]        UNIQUEIDENTIFIER NOT NULL,
    [Name]          NVARCHAR (100)   NOT NULL,
    [Rating]        REAL             NOT NULL,
    [StreetAddress] NVARCHAR (100)   NOT NULL,
    [Description]   NVARCHAR (500)   NOT NULL,
    [PhoneNumber]   NVARCHAR (20)    NOT NULL,
    [FloorsNumber]  INT              NOT NULL,
    [OwnerName]     NVARCHAR (100)   NOT NULL,
    CONSTRAINT [PK_Hotels] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [CK_Hotel_RatingRange] CHECK ([Rating]>=(0) AND [Rating]<=(5)),
    CONSTRAINT [FK_Hotels_Cities_CityId] FOREIGN KEY ([CityId]) REFERENCES [dbo].[Cities] ([Id]) ON DELETE CASCADE
);


GO
CREATE NONCLUSTERED INDEX [IX_Hotels_CityId]
    ON [dbo].[Hotels]([CityId] ASC);

