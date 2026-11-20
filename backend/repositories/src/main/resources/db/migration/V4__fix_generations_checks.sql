alter table generations drop constraint generations_status_check;
alter table generations add constraint generations_status_check
    check (status in ('PENDING', 'SUCCESS', 'FAILED'));

alter table generations drop constraint generations_processing_ms_check;
alter table generations add constraint generations_processing_ms_check
    check (processing_ms >= 0);