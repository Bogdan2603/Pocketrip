create table generations(
  id serial primary key ,
  user_id integer not null ,
  documents_count integer not null ,
  status varchar(20) not null default 'PENDING' ,
  is_extra boolean not null default false ,
  error_reason varchar(40) ,
  processing_ms integer ,
  created_at timestamp not null default now(),

  foreign key (user_id) references users(id) on delete cascade ,

    check( (status='FAILED') = (error_reason is not null)),
    check ( documents_count > 0 ) ,
    check ( error_reason in ( 'UNREADABLE_DOCUMENT', 'UNSUPPORTED_FORMAT',
                            'NO_DATA_FOUND', 'TIMEOUT' , 'INTERNAL_ERROR') ),
    check ( processing_ms > 0 ) ,
    check ( status in ('PENDING', ' SUCCESS', 'FAILED') )
);