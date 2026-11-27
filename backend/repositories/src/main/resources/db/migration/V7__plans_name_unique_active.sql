alter table plans drop constraint plans_name_key;
create unique index ux_plans_name_active on plans(name) where deleted_at is null;