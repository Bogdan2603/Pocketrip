create table plans(
  id SERIAL PRIMARY KEY ,
  name VARCHAR(50) not null unique ,
  price numeric(6,2)  not null ,
  max_uses_per_day integer ,
  max_uses_per_month integer,
  map_enabled boolean not null default false,
  pdf_export_enabled boolean not null default false,
  extra_price numeric(4,2) not null,

  check ( max_uses_per_day is null or max_uses_per_month is null or max_uses_per_month >= max_uses_per_day),
  check ( extra_price >= 0 ),
  check ( max_uses_per_day > 0 ),
  check ( max_uses_per_month > 0 ),
  check ( price >= 0 )
);