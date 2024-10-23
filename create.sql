drop schema ccca16 cascade;

create schema ccca16;

create table ccca16.account (
  account_id uuid primary key,
  name text not null,
  email text not null,
  cpf text not null,
  car_plate text null,
  is_passenger boolean not null default false,
  is_driver boolean not null default false
);

create table ccca16.ride (
  ride_id uuid primary key,
  passenger_id uuid,
  driver_id uuid,
  status text,
  fare numeric,
  distance numeric,
  from_lat numeric,
  from_long numeric,
  to_lat numeric,
  to_long numeric,
  date timestamp
);

create table ccca16.position (
  position_id uuid,
  ride_id uuid,
  lat numeric,
  long numeric,
  date timestamp
);