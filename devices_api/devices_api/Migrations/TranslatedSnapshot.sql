CREATE TABLE [Users] (
    [Id] int NOT NULL IDENTITY(1, 1),
    [Name] nvarchar(max) NOT NULL,
    [Password] nvarchar(max) NOT NULL,
    [Location] nvarchar(max) NOT NULL,
    [Role] nvarchar(max) NOT NULL,
    CONSTRAINT [PK_Users] PRIMARY KEY ([Id])


CREATE TABLE [Devices] (
    [Id] int NOT NULL IDENTITY(1, 1),
    [Name] nvarchar(max) NOT NULL,
    [Type] nvarchar(max) NOT NULL,
    [Manufacturer] nvarchar(max) NOT NULL,
    [OperatingSystem] nvarchar(max) NOT NULL,
    [OperatingSystemVersion] nvarchar(max) NULL,
    [Processor] nvarchar(max) NULL,
    [RAM] nvarchar(max) NULL,
    [Description] nvarchar(max) NULL,
    [UsedById] int NULL,
    CONSTRAINT [PK_Devices] PRIMARY KEY ([Id]),
    -- Foreign Key Relationship
    CONSTRAINT [FK_Devices_Users_UsedById] FOREIGN KEY ([UsedById]) REFERENCES [Users] ([Id])

CREATE INDEX [IX_Devices_UsedById] ON [Devices] ([UsedById]);
