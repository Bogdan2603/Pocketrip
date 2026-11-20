create table users(
    id serial primary key ,
    email varchar(255) not null unique ,
    password_hash varchar(255) not null,
    role varchar(50) not null default 'USER',
    email_verified_at timestamp ,
    created_at timestamp not null default now(),
    display_name varchar(100) ,
    preferred_language char(2) not null default 'ro',

    check ( preferred_language IN ('ro','en') ),
    check ( role in ('USER','ADMIN') )
 );

create table subscriptions(
  id serial primary key ,
  user_id integer not null ,
  plan_id integer not null ,
  start_date date not null default current_date,
  end_date date ,
  status varchar(20) not null default 'ACTIVE',

  FOREIGN KEY (plan_id) references plans(id) on delete restrict,
  foreign key (user_id) references users(id) on delete cascade,

  check ( end_date > start_date ),
  check ( status in ('ACTIVE','EXPIRED','CANCELLED') )
);

create index ix_subscription_plan on subscriptions(plan_id);
create index ix_subscription_ser on subscriptions(user_id);
create unique index ux_subscriptions_one_active
    on subscriptions(user_id) where status = 'ACTIVE';