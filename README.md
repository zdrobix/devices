# Device manager

Alexandru Zdroba

## Install

1. clone the repository 

```git
git clone https://github.com/zdrobix/devices
```

2. create database 
```sql
CREATE DATABASE devices
GO;

USE devices
```
3. run sql code (TranslatedSnapshot.sql)
optional: run sql code from DummyData.sql
4. download the 'appsettings.json' file and place it in devices_api/devices_api dir
5. in 'appsettings.json' replace 'YOUR-CONNECTION-STRING' with your connection string (not literally)

6. install angular 16
```shell
cd devices/devices_ui
npm install @angular/cli@16.0.0
```

## Run

```shell
cd devices/devices_api/devices_api
dotnet restore
dotnet run
```

```shell
cd devices/devices_ui
ng serve --open
```

